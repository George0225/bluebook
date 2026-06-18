"use client";

import { useState } from "react";
import { Image, FileText, BarChart3, Sparkles, X, Plus, Upload } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PostFormat = "image-text" | "long-text" | "poll";

const aiSuggestions = [
  "震惊！90%的人不知道的真相",
  "3年经验的血泪总结",
  "兄弟们必看！超详细指南",
  "我后悔没早点知道这些",
  "数据说话：到底值不值得",
];

export default function CreatePage() {
  const { t } = useI18n();
  const [format, setFormat] = useState<PostFormat>("image-text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAiSuggest, setShowAiSuggest] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const formats: { id: PostFormat; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "image-text", label: t("create.imageText"), icon: Image },
    { id: "long-text", label: t("create.longText"), icon: FileText },
    { id: "poll", label: t("create.poll"), icon: BarChart3 },
  ];

  const contentTags = [
    { id: "personal", label: t("create.personalExp") },
    { id: "professional", label: t("create.professional") },
    { id: "reference", label: t("create.forReference") },
  ];

  const handleAiSuggest = () => {
    setAiLoading(true);
    setTimeout(() => {
      setShowAiSuggest(true);
      setAiLoading(false);
    }, 1200);
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  return (
    <ResponsiveShell showBack title={t("create.title")}>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Format selector */}
        <div className="flex gap-2">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  format === f.id
                    ? "bg-bb-amber text-bb-surface-0"
                    : "bg-bb-surface-2 text-bb-text-2 hover:bg-bb-surface-3"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Drag-drop upload area */}
        {format === "image-text" && (
          <div className="rounded-card border-2 border-dashed border-bb-border p-8 flex flex-col items-center justify-center gap-3 hover:border-bb-amber transition-colors cursor-pointer min-h-[160px]">
            <Upload className="h-8 w-8 text-bb-text-3" />
            <p className="text-sm text-bb-text-3">拖拽图片到此处或点击上传</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 w-20 rounded-card border border-bb-border flex items-center justify-center hover:border-bb-amber transition-colors"
                >
                  <Plus className="h-5 w-5 text-bb-text-3" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title + AI suggest */}
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("create.addTitle")}
            className="w-full bg-transparent text-lg font-bold text-bb-text-1 placeholder:text-bb-text-3 outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiSuggest}
              disabled={aiLoading}
              className="flex items-center gap-1.5 rounded-full bg-bb-surface-2 px-2.5 py-1 text-[10px] text-bb-text-2 hover:bg-bb-surface-3 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3" />
              {aiLoading ? t("create.aiSuggesting") : t("create.aiSuggest")}
            </button>
          </div>
        </div>

        {showAiSuggest && (
          <div className="rounded-card bg-bb-surface-1 border border-bb-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-bb-text-2">AI 推荐标题</span>
              <button onClick={() => setShowAiSuggest(false)}>
                <X className="h-4 w-4 text-bb-text-3" />
              </button>
            </div>
            {aiSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setTitle(s); setShowAiSuggest(false); }}
                className="block w-full text-left text-sm text-bb-text-1 hover:text-bb-amber transition-colors py-1"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Content editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("create.addContent")}
          rows={format === "long-text" ? 12 : 6}
          className="w-full bg-transparent text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none resize-none"
        />

        {/* Poll options */}
        {format === "poll" && (
          <div className="space-y-2">
            <input
              placeholder={t("create.pollQuestion")}
              className="w-full bg-transparent text-sm font-medium text-bb-text-1 placeholder:text-bb-text-3 outline-none border-b border-bb-border pb-2"
            />
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-bb-text-3 w-6">{i + 1}.</span>
                <input
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...pollOptions];
                    newOpts[i] = e.target.value;
                    setPollOptions(newOpts);
                  }}
                  placeholder={`选项 ${i + 1}`}
                  className="flex-1 bg-bb-surface-2 rounded-button px-3 py-2 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-bb-text-3" />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 6 && (
              <button
                onClick={addPollOption}
                className="flex items-center gap-1 text-xs text-bb-amber hover:underline"
              >
                <Plus className="h-3 w-3" />
                {t("create.addOption")}
              </button>
            )}
          </div>
        )}

        {/* Section picker */}
        <div>
          <label className="text-xs font-medium text-bb-text-3 mb-2 block">{t("create.selectSection")}</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(SECTIONS).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  selectedSection === s.id
                    ? "bg-bb-amber text-bb-surface-0"
                    : "bg-bb-surface-2 text-bb-text-2 hover:bg-bb-surface-3"
                )}
                style={selectedSection === s.id ? undefined : { borderColor: s.color }}
              >
                {t(s.nameKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Content tag */}
        <div>
          <label className="text-xs font-medium text-bb-text-3 mb-2 block">{t("create.contentTag")}</label>
          <div className="flex flex-wrap gap-2">
            {contentTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-all",
                  selectedTag === tag.id
                    ? "bg-bb-surface-3 text-bb-text-1"
                    : "bg-bb-surface-2 text-bb-text-3 hover:bg-bb-surface-3"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Publish button */}
        <div className="flex justify-end pt-4">
          <button
            disabled={!title.trim()}
            className="rounded-button bg-bb-amber px-6 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button disabled:opacity-50 hover:bg-bb-amber/90 transition-colors"
          >
            {t("create.publish")}
          </button>
        </div>
      </div>
    </ResponsiveShell>
  );
}
