"use client";

import { useI18n } from "@/i18n/provider";
import { Languages } from "lucide-react";

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="flex items-center gap-1.5 rounded-button px-2.5 py-1.5 text-xs text-bb-text-2 hover:text-bb-text-1 hover:bg-bb-surface-2 transition-colors"
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="uppercase font-medium">{locale === "zh" ? "EN" : "中"}</span>
    </button>
  );
}
