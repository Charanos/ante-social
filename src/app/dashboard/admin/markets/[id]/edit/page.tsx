"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconCalendar,
  IconCircleCheckFilled,
  IconDeviceFloppy,
  IconPlus,
  IconSend,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";

type MarketOutcome = {
  _id?: string;
  id?: string;
  optionText?: string;
  mediaUrl?: string;
  mediaType?: string;
};

type MarketPayload = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  mediaUrl?: string;
  mediaType?: string;
  buyInAmount?: number;
  buyInCurrency?: string;
  minParticipants?: number;
  maxParticipants?: number;
  closeTime?: string;
  settlementTime?: string;
  outcomes?: MarketOutcome[];
};

type EditableOutcome = {
  id: string;
  name: string;
  mediaUrl: string;
  mediaType: string;
};

function toDateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export default function EditMarketPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const marketId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("none");
  const [buyInAmount, setBuyInAmount] = useState("1");
  const [buyInCurrency, setBuyInCurrency] = useState("USD");
  const [minParticipants, setMinParticipants] = useState("2");
  const [maxParticipants, setMaxParticipants] = useState("1000");
  const [closeTime, setCloseTime] = useState("");
  const [settlementTime, setSettlementTime] = useState("");
  const [outcomes, setOutcomes] = useState<EditableOutcome[]>([
    { id: "1", name: "", mediaUrl: "", mediaType: "none" },
    { id: "2", name: "", mediaUrl: "", mediaType: "none" },
  ]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/markets/${marketId}`, { cache: "no-store" });
      if (!response.ok) {
        toast.error("Load failed", "Could not load market details");
        setIsLoading(false);
        return;
      }
      const payload = (await response.json().catch(() => null)) as MarketPayload | null;
      if (!payload) {
        toast.error("Load failed", "Could not load market details");
        setIsLoading(false);
        return;
      }

      setTitle(payload.title || "");
      setDescription(payload.description || "");
      setTags(Array.isArray(payload.tags) ? payload.tags : []);
      setCategory(payload.category || "");
      setIsFeatured(payload.isFeatured || false);
      setIsTrending(payload.isTrending || false);
      setMediaUrl(payload.mediaUrl || "");
      setMediaType(payload.mediaType || "none");
      setBuyInAmount(String(payload.buyInAmount ?? 1));
      setBuyInCurrency(payload.buyInCurrency || "USD");
      setMinParticipants(String(payload.minParticipants ?? 2));
      setMaxParticipants(String(payload.maxParticipants ?? 1000));
      setCloseTime(toDateInputValue(payload.closeTime));
      setSettlementTime(toDateInputValue(payload.settlementTime));

      const mappedOutcomes = (payload.outcomes || []).map((outcome, index) => ({
        id: outcome._id || outcome.id || `${index + 1}`,
        name: outcome.optionText || "",
        mediaUrl: outcome.mediaUrl || "",
        mediaType: outcome.mediaType || "none",
      }));
      setOutcomes(
        mappedOutcomes.length >= 2 
          ? mappedOutcomes 
          : [{ id: "1", name: "", mediaUrl: "", mediaType: "none" }, { id: "2", name: "", mediaUrl: "", mediaType: "none" }]
      );

      setIsLoading(false);
    };
    void load();
  }, [marketId, toast]);

  const descriptionLength = description.length;
  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      Number(buyInAmount) > 0 &&
      outcomes.filter((outcome) => outcome.name.trim().length > 0).length >= 2
    );
  }, [title, description, buyInAmount, outcomes]);

  const handleAddTag = () => {
    const normalized = currentTag.trim();
    if (!normalized || tags.includes(normalized)) return;
    setTags((prev) => [...prev, normalized]);
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleAddOutcome = () => {
    setOutcomes((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, name: "", mediaUrl: "", mediaType: "none" }]);
  };

  const handleRemoveOutcome = (id: string) => {
    if (outcomes.length <= 2) return;
    setOutcomes((prev) => prev.filter((outcome) => outcome.id !== id));
  };

  const handleSave = async () => {
    if (!isFormValid) {
      toast.error("Invalid form", "Please complete all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/markets/${marketId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          isFeatured,
          isTrending,
          mediaUrl: mediaUrl.trim(),
          mediaType,
          buyInAmount: Number(buyInAmount),
          buyInCurrency,
          minParticipants: Number(minParticipants),
          maxParticipants: Number(maxParticipants),
          closeTime: closeTime ? new Date(closeTime).toISOString() : undefined,
          settlementTime: settlementTime ? new Date(settlementTime).toISOString() : undefined,
          tags,
          outcomes: outcomes
            .filter((outcome) => outcome.name.trim().length > 0)
            .map((outcome) => ({ 
              ...(outcome.id.length === 24 ? { id: outcome.id } : {}),
              optionText: outcome.name.trim(),
              mediaUrl: outcome.mediaUrl.trim(),
              mediaType: outcome.mediaType,
            })),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || payload?.error || "Failed to save market");
      }

      toast.success("Saved", "Market updated successfully");
      router.push(`/dashboard/admin/markets/${marketId}`);
    } catch (error: any) {
      toast.error("Save failed", error?.message || "Could not update market");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this market? This action cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/markets/${marketId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || payload?.error || "Failed to delete market");
      }
      toast.success("Deleted", "Market deleted successfully");
      router.push("/dashboard/admin/markets");
    } catch (error: any) {
      toast.error("Delete failed", error?.message || "Could not delete market");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-full mx-auto px-6 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <h2 className="text-lg font-medium text-neutral-900 mb-6">Market Details</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Market Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-end mt-1.5">
              <span className="text-xs text-neutral-500">{descriptionLength} / 2000 characters</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-2">Tags (Optional)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all cursor-pointer"
              >
                <IconPlus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 my-6"></div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                placeholder="e.g. Sports, Crypto, Politics"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:items-center md:mt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-sm font-medium text-neutral-900">Featured Market</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-sm font-medium text-neutral-900">Trending Market</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Media URL</label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              >
                <option value="none">None</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="gif">GIF</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-100 my-6"></div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Buy-in Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={buyInCurrency}
                  onChange={(e) => setBuyInCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="KSH">KSH</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Min Participants</label>
              <input
                type="number"
                value={minParticipants}
                onChange={(e) => setMinParticipants(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Max Participants</label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
            <div></div>
          </div>

          <div className="border-t border-neutral-100 my-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className=" text-sm font-medium text-neutral-900 mb-2 flex items-center gap-1.5">
                <IconCalendar className="w-4 h-4" />
                Close Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-2 flex items-center gap-1.5">
                <IconCalendar className="w-4 h-4" />
                Settlement Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={settlementTime}
                onChange={(e) => setSettlementTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-900">Outcome Options</h2>
            <button
              onClick={handleAddOutcome}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-6">
            {outcomes.map((outcome, index) => (
              <div key={outcome.id} className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-neutral-900">
                    Option {index + 1} <span className="text-red-500">*</span>
                  </label>
                  {outcomes.length > 2 && (
                    <button
                      onClick={() => handleRemoveOutcome(outcome.id)}
                      className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={outcome.name}
                  onChange={(e) =>
                    setOutcomes((prev) =>
                      prev.map((item) =>
                        item.id === outcome.id ? { ...item, name: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Option text..."
                  className="w-full px-3.5 py-2.5 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Outcome Media URL</label>
                    <input
                      type="text"
                      value={outcome.mediaUrl}
                      onChange={(e) =>
                        setOutcomes((prev) =>
                          prev.map((item) =>
                            item.id === outcome.id ? { ...item, mediaUrl: e.target.value } : item,
                          ),
                        )
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Outcome Media Type</label>
                    <select
                      value={outcome.mediaType}
                      onChange={(e) =>
                        setOutcomes((prev) =>
                          prev.map((item) =>
                            item.id === outcome.id ? { ...item, mediaType: e.target.value } : item,
                          ),
                        )
                      }
                      className="w-full px-3 py-2 text-sm font-medium text-neutral-900 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                    >
                      <option value="none">None</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            onClick={() => void handleDelete()}
            className="px-5 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <IconTrash className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            disabled={isSaving || isDeleting}
            onClick={() => void handleSave()}
            className="px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <IconDeviceFloppy className="w-4 h-4" />
            Save Draft
          </button>
          <button
            disabled={isSaving || isDeleting}
            onClick={() => void handleSave()}
            className="px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <IconSend className="w-4 h-4" />
            {isSaving ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

