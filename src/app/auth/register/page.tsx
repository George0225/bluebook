"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { useI18n } from "@/i18n/provider";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const handleRegister = async () => {
    const success = await register(name, phone);
    if (success) {
      router.push("/");
    }
  };

  return (
    <ResponsiveShell showBack>
      <div className="max-w-md mx-auto px-6 py-12 min-h-[60vh] flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-bb-text-1">{t("auth.register")}</h1>
          <p className="text-sm text-bb-text-3 mt-1">{t("common.slogan")}</p>
        </div>

        <div className="space-y-4 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入昵称"
            className="w-full rounded-lg bg-bb-surface-2 px-4 py-3 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("auth.phonePlaceholder")}
            type="tel"
            maxLength={11}
            className="w-full rounded-lg bg-bb-surface-2 px-4 py-3 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber"
          />
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("auth.codePlaceholder")}
              type="text"
              maxLength={4}
              className="flex-1 rounded-lg bg-bb-surface-2 px-4 py-3 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber"
            />
            <button className="rounded-lg bg-bb-surface-3 px-4 py-3 text-xs text-bb-text-2 hover:bg-bb-surface-2 transition-colors whitespace-nowrap">
              {t("auth.sendCode")}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={!name || !phone}
            className="w-full rounded-button bg-bb-amber py-3 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:bg-bb-amber/90 transition-colors disabled:opacity-50"
          >
            {t("auth.register")}
          </button>

          <p className="text-center text-xs text-bb-text-3">
            {t("auth.hasAccount")}{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-bb-amber hover:underline"
            >
              {t("auth.login")}
            </button>
          </p>
        </div>
      </div>
    </ResponsiveShell>
  );
}
