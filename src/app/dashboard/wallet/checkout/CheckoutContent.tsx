"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TokenUSDT } from "@web3icons/react";
import {
  IconCopy,
  IconCircleCheck,
  IconAlertCircle,
  IconDownload,
  IconUpload,
  IconShield,
  IconInfoCircle,
  IconWallet,
  IconLoader3,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-notification";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockUser } from "@/lib/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IoPhonePortraitOutline } from "react-icons/io5";

type TransactionType = "deposit" | "withdrawal";
type PaymentMethod = "mpesa" | "usdt";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];
const DEPOSIT_LIMITS = {
  novice: { min: 10, max: 500 },
  high_roller: { min: 10, max: 5000 },
};
const WITHDRAWAL_LIMITS = {
  novice: { min: 10, max: 250 },
  high_roller: { min: 10, max: 1000 },
};

// Brand Icons
const MpesaIcon = ({ className }: { className?: string }) => (
  <img
    width="32"
    height="32"
    src="https://img.icons8.com/material-rounded/48/mpesa.png"
    alt="mpesa"
    className={cn("object-contain", className)}
  />
);

const UsdtIcon = ({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) => (
  <TokenUSDT
    variant="mono"
    size={size}
    color={className?.includes("text-white") ? "#FFFFFF" : "#26A17B"}
    className={cn("object-contain", className)}
  />
);

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [mode, setMode] = useState<TransactionType>("deposit");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [amount, setAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [cryptoAddress, setCryptoAddress] = useState<string>("");
  const [trxHash, setTrxHash] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const limits = useMemo(() => {
    const tier =
      mockUser.user_level === "high_roller" ? "high_roller" : "novice";
    return mode === "deposit" ? DEPOSIT_LIMITS[tier] : WITHDRAWAL_LIMITS[tier];
  }, [mode]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const amountParam = searchParams.get("amount");
    const methodParam = searchParams.get("method");

    if (typeParam === "withdrawal") setMode("withdrawal");
    if (amountParam) setAmount(amountParam);
    if (methodParam === "usdt") setMethod("usdt");
  }, [searchParams]);

  const isValidAmount = useMemo(() => {
    const num = Number(amount);
    return !isNaN(num) && num >= limits.min && num <= limits.max;
  }, [amount, limits]);

  const isValidPhone = useMemo(() => {
    const cleaned = phoneNumber.replace(/\s+/g, "");
    return /^(?:254|\+254|0)?([17]\d{8})$/.test(cleaned);
  }, [phoneNumber]);

  const isValidCryptoAddress = useMemo(() => {
    return /^T[A-Za-z1-9]{33}$/.test(cryptoAddress);
  }, [cryptoAddress]);

  const isValidTrxHash = useMemo(() => {
    return trxHash.length === 64 && /^[a-fA-F0-9]+$/.test(trxHash);
  }, [trxHash]);

  const canSubmit = useMemo(() => {
    if (!isValidAmount) return false;
    if (method === "mpesa" && !isValidPhone) return false;
    if (mode === "deposit" && method === "usdt" && !isValidTrxHash)
      return false;
    if (mode === "withdrawal" && method === "usdt" && !isValidCryptoAddress)
      return false;
    return true;
  }, [
    isValidAmount,
    method,
    mode,
    isValidPhone,
    isValidTrxHash,
    isValidCryptoAddress,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) {
        toast.error("Invalid Input", "Please check your details");
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        if (mode === "deposit") {
          toast.success(
            method === "mpesa" ? "STK Push Sent" : "Deposit Confirmed",
            method === "mpesa" ? "Check your phone" : "Processing your deposit",
          );
        } else {
          toast.success("Withdrawal Submitted", "Processing within 24 hours");
        }
        router.push("/dashboard/wallet");
      }, 2000);
    },
    [canSubmit, mode, method, router, toast],
  );

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText("TXhKz9mN2pQrB3vLx8JwYmC5nKdFsEa7Gt");
    toast.success("Copied", "Address copied to clipboard");
  }, [toast]);

  return (
    <div className="space-y-6 pb-12 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle={
          mode === "deposit"
            ? "Add funds to your wallet instantly"
            : "Cash out your winnings securely"
        }
      />

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mode Switcher */}
            <div className="relative p-2 bg-black/5 rounded-xl">
              <motion.div
                className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm z-0"
                initial={false}
                animate={{
                  left: mode === "deposit" ? "4px" : "calc(50% - 4px)",
                  width: "calc(50% - 4px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <div className="relative z-10 grid grid-cols-2">
                <button
                  onClick={() => setMode("deposit")}
                  className={cn(
                    "py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider",
                    mode === "deposit" ? "text-black" : "text-black/40",
                  )}
                >
                  <IconDownload className="w-3.5 h-3.5" />
                  Deposit
                </button>
                <button
                  onClick={() => setMode("withdrawal")}
                  className={cn(
                    "py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider",
                    mode === "withdrawal" ? "text-black" : "text-black/40",
                  )}
                >
                  <IconUpload className="w-3.5 h-3.5" />
                  Withdraw
                </button>
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-4 my-12">
              <h3 className="text-[10px] font-medium text-black/40 uppercase tracking-[0.2em] mb-4">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod("mpesa")}
                  className={cn(
                    "relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer group",
                    method === "mpesa"
                      ? "bg-linear-to-br from-green-50 via-white to-white border-green-500 shadow-[0_20px_40px_-15px_rgba(76,175,80,0.2)] scale-[1.02]"
                      : "bg-white/40 border-black/5 hover:border-black/10 hover:bg-white/60",
                  )}
                >
                  <AnimatePresence>
                    {method === "mpesa" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-20 shadow-lg"
                      >
                        <IconCircleCheck className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500",
                      method === "mpesa"
                        ? "bg-green-100 opacity-60"
                        : "bg-green-50 opacity-0 group-hover:opacity-40",
                    )}
                  />

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                        method === "mpesa"
                          ? "bg-white scale-110 shadow-md ring-4 ring-green-100"
                          : "bg-green-50/50",
                      )}
                    >
                      <MpesaIcon className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-1">
                      <p
                        className={cn(
                          "font-medium text-sm tracking-tight",
                          method === "mpesa"
                            ? "text-green-900"
                            : "text-black/80",
                        )}
                      >
                        M-Pesa
                      </p>
                      <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest">
                        Instant STK
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod("usdt")}
                  className={cn(
                    "relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer group",
                    method === "usdt"
                      ? "bg-linear-to-br from-cyan-50 via-white to-white border-cyan-500 shadow-[0_20px_40px_-15px_rgba(38,161,123,0.2)] scale-[1.02]"
                      : "bg-white/40 border-black/5 hover:border-black/10 hover:bg-white/60",
                  )}
                >
                  <AnimatePresence>
                    {method === "usdt" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center z-20 shadow-lg"
                      >
                        <IconCircleCheck className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500",
                      method === "usdt"
                        ? "bg-cyan-100 opacity-60"
                        : "bg-cyan-50 opacity-0 group-hover:opacity-40",
                    )}
                  />

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                        method === "usdt"
                          ? "bg-white scale-110 shadow-md ring-4 ring-cyan-100"
                          : "bg-cyan-50/50",
                      )}
                    >
                      <UsdtIcon />
                    </div>
                    <div className="text-center space-y-1">
                      <p
                        className={cn(
                          "font-medium text-sm tracking-tight",
                          method === "usdt" ? "text-cyan-900" : "text-black/80",
                        )}
                      >
                        USDT
                      </p>
                      <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest">
                        TRC20 Network
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <SectionHeading title="Enter Amount" className="my-16 md:my-18" />

              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      "w-full pl-8 pr-3 py-2 rounded-lg border-2 text-xl font-mono font-semibold outline-none transition-all placeholder:text-black/20 cursor-pointer",
                      isValidAmount
                        ? "bg-white border-black/10 focus:border-black text-black"
                        : amount
                          ? "bg-gray-50 border-gray-300 text-gray-600"
                          : "bg-white border-black/10 focus:border-black text-black",
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 my-6">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={cn(
                        "py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        amount === amt.toString()
                          ? "bg-black text-white"
                          : "bg-white border border-black/5 text-black/80 hover:bg-black/5",
                      )}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div>
              <SectionHeading title="Payment Details" className="my-16 md:my-18" />

              <div className="space-y-4">
                {method === "mpesa" ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-black/40 uppercase tracking-widest block ml-1">
                      M-Pesa Mobile Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <IoPhonePortraitOutline className="w-5 h-5 text-black/20 group-focus-within:text-black/50 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 text-black rounded-2xl border-2 outline-none transition-all font-mono tracking-wider",
                          isValidPhone
                            ? "bg-white border-black/5 focus:border-black/20 text-black shadow-sm"
                            : phoneNumber
                              ? "bg-gray-50/50 border-gray-500/20 text-gray-600"
                              : "bg-black/2 border-transparent focus:bg-white focus:border-black/10",
                        )}
                      />
                    </div>
                    <div className="flex items-start gap-2 px-3 mt-6">
                      <IconInfoCircle className="w-3.5 h-3.5 text-black/30 shrink-0 mt-0.5" />
                      <p className="text-[12px] text-black/40 leading-relaxed">
                        An STK push window will appear on your phone
                        automatically after confirmation.
                      </p>
                    </div>
                  </div>
                ) : mode === "deposit" ? (
                  <div className="space-y-6">
                    {/* USDT Deposit Address Display */}
                    <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-500/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-blue-900/60 uppercase tracking-widest">
                          Network: TRC20 (Tron)
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[9px] font-medium text-blue-700 uppercase">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-blue-900/80 px-1">
                          Deposit Address
                        </p>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-blue-200 group">
                          <code className="flex-1 text-[13px] font-mono text-blue-900 break-all leading-tight">
                            TXhKz9mN2pQrB3vLx8JwYmC5nKdFsEa7Gt
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyAddress}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            <IconCopy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TRX Hash Input */}
                    <div className="space-y-6">
                      <label className="text-[10px] font-medium text-black/40 uppercase tracking-widest block ml-1">
                        Transaction ID / Hash
                      </label>
                      <input
                        type="text"
                        value={trxHash}
                        onChange={(e) => setTrxHash(e.target.value)}
                        placeholder="Paste the 64-character hash here..."
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl text-gray-600 border-2 outline-none transition-all font-mono text-xs",
                          isValidTrxHash
                            ? "bg-white border-black/5 focus:border-black/20 text-black shadow-sm"
                            : trxHash
                              ? "bg-gray-50/50 border-gray-500/20 text-gray-600"
                              : "bg-black/2 border-transparent focus:bg-white focus:border-black/10",
                        )}
                      />
                      <div className="flex items-start gap-2 px-3">
                        <IconAlertCircle className="w-3.5 h-3.5 text-blue-600/50 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-black/40 leading-relaxed">
                          Please send exactly{" "}
                          <span className="font-medium text-blue-900/60">
                            ${amount || "0"}
                          </span>{" "}
                          to the address above before pasting your hash.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-black/40 uppercase tracking-widest block ml-1">
                      Your Withdrawal USDT Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <IconWallet className="w-5 h-5 text-black/20 group-focus-within:text-black/50 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={cryptoAddress}
                        onChange={(e) => setCryptoAddress(e.target.value)}
                        placeholder="T..."
                        className={cn(
                          "w-full pl-12 pr-4 py-3 text-black rounded-2xl border-2 outline-none transition-all font-mono text-sm",
                          isValidCryptoAddress
                            ? "bg-white border-black/5 focus:border-black/20 text-black shadow-sm"
                            : cryptoAddress
                              ? "bg-gray-50/50 border-gray-500/20 text-gray-600"
                              : "bg-black/2 border-transparent focus:bg-white focus:border-black/10",
                        )}
                      />
                    </div>
                    {cryptoAddress && !isValidCryptoAddress && (
                      <div className="flex items-center gap-2 px-3">
                        <IconAlertCircle className="w-3.5 h-3.5 text-gray-500/50" />
                        <p className="text-[10px] font-medium text-gray-500/70">
                          Invalid TRC20 address format
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              {/* Limits Info */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex gap-3 justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      {mockUser.user_level === "high_roller"
                        ? "High Roller"
                        : "Novice"}{" "}
                      Limits
                    </p>
                    <p className="text-xs text-amber-700">
                      Min:{" "}
                      <span className="font-mono font-semibold">
                        ${limits.min}
                      </span>{" "}
                      • Max:{" "}
                      <span className="font-mono font-semibold">
                        ${limits.max}
                      </span>
                      /day
                    </p>
                  </div>

                  <IconShield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4">
                <h3 className="text-sm font-semibold text-black/90 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-3 py-4 border-y border-black/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/80">Amount</span>
                    <span className="font-mono font-semibold text-black">
                      {amount ? `$${amount}` : "$0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/80">Method</span>
                    <span className="font-medium text-black">
                      {method === "mpesa" ? "M-Pesa" : "USDT (TRC20)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/80">Type</span>
                    <span className="font-medium text-black capitalize">
                      {mode}
                    </span>
                  </div>
                  {method === "mpesa" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black/80">Processing</span>
                      <span className="font-medium text-green-600">
                        Instant
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-sm font-semibold uppercase tracking-wider text-black/90">
                    Total
                  </span>
                  <span className="text-3xl font-semibold font-mono text-black tracking-tight">
                    {amount ? `$${amount}` : "$0.00"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!canSubmit || isProcessing}
                className={cn(
                  "w-full py-3 rounded-xl font-medium tracking-wide text-white transition-all flex items-center justify-center gap-2 cursor-pointer",
                  canSubmit && !isProcessing
                    ? "bg-black hover:bg-black/90 shadow-xl active:scale-[0.98]"
                    : "bg-black/20 cursor-not-allowed",
                )}
              >
                {isProcessing ? (
                  <>
                    <IconLoader3 className="w-5 h-5 animate-spin" />
                    Processing Request
                  </>
                ) : (
                  <>
                    {mode === "deposit"
                      ? "Complete Deposit"
                      : "Confirm Withdrawal"}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-black/30">
                <p>Secured with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
