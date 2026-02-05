"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoGiftOutline, IoTrophyOutline } from 'react-icons/io5';


interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REWARDS = [
  { value: 75, color: "#FED7AA", textColor: "#9A3412", label: "75 MP" },
  { value: 0, color: "#E5E7EB", textColor: "#6B7280", label: "0 MP" },
  { value: 50, color: "#BFDBFE", textColor: "#1E3A8A", label: "50 MP" },
  { value: 1, color: "#FEF3C7", textColor: "#92400E", label: "1 MP" },
  { value: 1000, color: "#FECACA", textColor: "#991B1B", label: "1000 MP" },
  { value: 25, color: "#FCE7F3", textColor: "#9F1239", label: "25 MP" },
  { value: 500, color: "#DBEAFE", textColor: "#1E40AF", label: "500 MP" },
];

export function SpinWheelModal({ isOpen, onClose }: SpinWheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const handleSpin = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setWonAmount(null);

    // Pick a random reward
    const randomIndex = Math.floor(Math.random() * REWARDS.length);
    const reward = REWARDS[randomIndex];

    // Calculate rotation
    const segmentDegrees = 360 / REWARDS.length;
    const baseRotation = 360 * 5; // Spin 5 full times

    // We need to land on the segment at the TOP (where the pointer is)
    // The pointer is at 0 degrees (top), so we need to rotate until the selected segment is at 0
    // Each segment starts at: index * segmentDegrees
    // To get segment to top, we need to rotate: 360 - (index * segmentDegrees) - (segmentDegrees / 2)
    const targetSegmentRotation =
      360 - randomIndex * segmentDegrees - segmentDegrees / 2;
    const targetRotation = baseRotation + targetSegmentRotation;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpunToday(true);
      setWonAmount(reward.value);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-2xl p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <IoCloseOutline className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-amber-600 mb-2 shadow-lg">
              <IoGiftOutline className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-1">
              Wheel of Fortune
            </h2>
            <p className="text-sm text-neutral-600">
              Spin daily to win MP rewards!
            </p>
          </div>

          {/* Wheel Container */}
          <div className="relative mb-6">
            {/* Pointer Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20">
              <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-18 border-t-amber-500 drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Outer Border */}
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 p-1.5 shadow-xl">
                {/* Inner Border */}
                <div className="w-full h-full rounded-full bg-white p-1">
                  {/* Spinning Wheel Container */}
                  <div
                    className="relative w-full h-full rounded-full overflow-hidden shadow-inner transition-transform duration-4000 ease-out"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    {/* Segments */}
                    {REWARDS.map((reward, index) => {
                      const segmentDegrees = 360 / REWARDS.length;
                      const rotation = index * segmentDegrees;

                      return (
                        <div
                          key={index}
                          className="absolute inset-0"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            clipPath: `polygon(50% 50%, 
                              ${50 + 50 * Math.cos((-90 * Math.PI) / 180)}% ${50 + 50 * Math.sin((-90 * Math.PI) / 180)}%, 
                              ${50 + 50 * Math.cos(((segmentDegrees - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((segmentDegrees - 90) * Math.PI) / 180)}%)`,
                          }}
                        >
                          <div
                            className="w-full h-full flex items-start justify-center pt-8 border-r border-white/20"
                            style={{
                              backgroundColor: reward.color,
                              transform: `rotate(${segmentDegrees / 2}deg)`,
                            }}
                          >
                            <span
                              className="font-medium text-sm drop-shadow-sm tracking-wide"
                              style={{ color: reward.textColor }}
                            >
                              {reward.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <IoGiftOutline className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {wonAmount !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 rounded-xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <IoTrophyOutline className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">
                    Congratulations!
                  </p>
                </div>
                <p className="text-2xl font-medium font-mono text-green-800">
                  {wonAmount} MP
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpunToday}
            className={`
              w-full py-3 rounded-xl font-medium text-sm shadow-sm transition-all
              ${
                isSpinning || hasSpunToday
                  ? "bg-neutral-100 text-neutral-500 cursor-not-allowed border border-neutral-200"
                  : "bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-md cursor-pointer"
              }
            `}
          >
            {hasSpunToday
              ? "✓ Spun Today - Come Back Tomorrow"
              : isSpinning
                ? "Spinning..."
                : "Spin the Wheel"}
          </button>

          {!hasSpunToday && !isSpinning && (
            <p className="text-center text-xs text-neutral-600 mt-3">
              One free spin per day • Rewards from 0 to 1000 MP
            </p>
          )}

          {hasSpunToday && (
            <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
              <p className="text-xs text-neutral-600 text-center">
                Come back tomorrow for another chance to win!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
