"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  IconCalendar,
  IconClock,
  IconInfoCircle,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useToast } from "@/components/ui/toast-notification";
import { adminApi, type RecurringMarketTemplateItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";

interface RecurringMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  initialTemplate?: RecurringMarketTemplateItem | null;
}

type Outcome = { id: number; name: string };

const defaultStartDate = new Date().toISOString().slice(0, 10);

export default function RecurringMarketModal({
  isOpen,
  onClose,
  onSaved,
  initialTemplate = null,
}: RecurringMarketModalProps) {
  const toast = useToast();
  const isEditMode = Boolean(initialTemplate?._id);

  const [templateName, setTemplateName] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [recurrence, setRecurrence] = useState("daily");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("17:00");
  const [marketType, setMarketType] = useState("consensus");
  const [buyInAmount, setBuyInAmount] = useState("10");
  const [settlementDelayHours, setSettlementDelayHours] = useState("2");
  const [autoPublish, setAutoPublish] = useState(true);
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { id: 1, name: "" },
    { id: 2, name: "" },
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialTemplate) {
      setTemplateName(initialTemplate.name || "");
      setTitleTemplate(initialTemplate.titleTemplate || "");
      setDescription(initialTemplate.description || "");
      setStartDate(
        initialTemplate.startDate
          ? new Date(initialTemplate.startDate).toISOString().slice(0, 10)
          : defaultStartDate,
      );
      setRecurrence(initialTemplate.recurrence || "daily");
      setOpenTime(initialTemplate.openTime || "09:00");
      setCloseTime(initialTemplate.closeTime || "17:00");
      setMarketType(initialTemplate.marketType || "consensus");
      setBuyInAmount(String(initialTemplate.buyInAmount || 10));
      setSettlementDelayHours(String(initialTemplate.settlementDelayHours || 2));
      setAutoPublish(initialTemplate.autoPublish !== false);
      const initialOptions = (initialTemplate.options || []).map((name, index) => ({
        id: index + 1,
        name,
      }));
      setOutcomes(initialOptions.length >= 2 ? initialOptions : [{ id: 1, name: "" }, { id: 2, name: "" }]);
      setTags(initialTemplate.tags || []);
      return;
    }

    setTemplateName("");
    setTitleTemplate("");
    setDescription("");
    setStartDate(defaultStartDate);
    setRecurrence("daily");
    setOpenTime("09:00");
    setCloseTime("17:00");
    setMarketType("consensus");
    setBuyInAmount("10");
    setSettlementDelayHours("2");
    setAutoPublish(true);
    setOutcomes([
      { id: 1, name: "" },
      { id: 2, name: "" },
    ]);
    setTags([]);
    setCurrentTag("");
  }, [initialTemplate, isOpen]);

  const normalizedOptions = useMemo(
    () => outcomes.map((outcome) => outcome.name.trim()).filter(Boolean),
    [outcomes],
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!templateName.trim()) throw new Error("Template name is required.");
      if (!titleTemplate.trim()) throw new Error("Market title is required.");
      if (normalizedOptions.length < 2) throw new Error("At least two options are required.");

      const payload = {
        name: templateName.trim(),
        titleTemplate: titleTemplate.trim(),
        description: description.trim(),
        startDate,
        recurrence,
        openTime,
        closeTime,
        marketType,
        buyInAmount: Number(buyInAmount),
        settlementDelayHours: Number(settlementDelayHours),
        autoPublish,
        options: normalizedOptions,
        tags,
      };

      if (initialTemplate?._id) {
        return adminApi.updateRecurringMarket(initialTemplate._id, payload);
      }
      return adminApi.createRecurringMarket(payload);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Recurring Market Updated" : "Recurring Market Created",
        "Recurring template saved successfully.",
      );
      onSaved?.();
      onClose();
    },
    onError: (error) => {
      toast.error("Save Failed", getApiErrorMessage(error, "Could not save recurring template."));
    },
  });

  const handleAddOutcome = () => {
    setOutcomes((prev) => [...prev, { id: Date.now(), name: "" }]);
  };

  const handleRemoveOutcome = (id: number) => {
    setOutcomes((prev) => (prev.length > 2 ? prev.filter((outcome) => outcome.id !== id) : prev));
  };

  const handleAddTag = () => {
    const value = currentTag.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setCurrentTag("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5 text-neutral-600" />
            <h2 className="text-lg font-medium text-neutral-900">
              {isEditMode ? "Edit Recurring Market" : "Set Up Recurring Market"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-neutral-100 transition-colors cursor-pointer">
            <IconX className="h-5 w-5 text-neutral-600" />
          </button>
        </div>

        <div className="space-y-8 p-6">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-neutral-600" />
              <h3 className="text-base font-medium text-neutral-900">Template Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Market Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titleTemplate}
                  onChange={(event) => setTitleTemplate(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <IconClock className="h-4 w-4 text-neutral-600" />
              <h3 className="text-base font-medium text-neutral-900">Recurrence Schedule</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Recurrence <span className="text-red-500">*</span>
                </label>
                <select
                  value={recurrence}
                  onChange={(event) => setRecurrence(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Market Open Time</label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(event) => setOpenTime(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Market Close Time</label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(event) => setCloseTime(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-medium text-neutral-900">Market Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Market Type</label>
                <select
                  value={marketType}
                  onChange={(event) => setMarketType(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="consensus">Consensus</option>
                  <option value="reflex">Reflex</option>
                  <option value="ladder">Ladder</option>
                  <option value="betrayal">Betrayal</option>
                  <option value="prisoner_dilemma">Prisoner Dilemma</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Buy-in Amount (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={buyInAmount}
                  onChange={(event) => setBuyInAmount(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">Settlement Delay (Hours)</label>
                <input
                  type="number"
                  min={0}
                  value={settlementDelayHours}
                  onChange={(event) => setSettlementDelayHours(event.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <label className="mt-7 flex items-center gap-2 text-sm font-medium text-neutral-900">
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(event) => setAutoPublish(event.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                Auto-publish generated markets
              </label>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-medium text-neutral-900">
                Outcome Options <span className="text-red-500">*</span>
              </h3>
              <button
                onClick={handleAddOutcome}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
              >
                <IconPlus className="h-4 w-4" />
                Add Option
              </button>
            </div>
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-900">Option {index + 1}</label>
                    {outcomes.length > 2 && (
                      <button
                        onClick={() => handleRemoveOutcome(outcome.id)}
                        className="rounded p-1 text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={outcome.name}
                    onChange={(event) =>
                      setOutcomes((prev) =>
                        prev.map((item) =>
                          item.id === outcome.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Option text..."
                    className="mb-3 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
                  />
                  <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-all cursor-pointer">
                    <IconUpload className="h-4 w-4" />
                    Upload Media
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">Tags (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={currentTag}
                onChange={(event) => setCurrentTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-neutral-900"
              />
              <button
                onClick={handleAddTag}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
              >
                <IconPlus className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {tag}
                    <button
                      onClick={() => setTags((prev) => prev.filter((value) => value !== tag))}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <IconInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm text-neutral-700">
              Markets are generated on schedule from this template. You can pause or update the schedule at any time.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saveMutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Update Recurring Market"
                : "Create Recurring Market"}
          </button>
        </div>
      </div>
    </div>
  );
}
