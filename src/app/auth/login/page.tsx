"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { useI18n } from "@/i18n/provider";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    if (phone.length >= 11) {
      setCodeSent(true);
    }
  };

  const handleLogin = async () => {
    const success = await login(phone, code);
    if (success) {
      router.push("/");
    } else {
      setError("验证码错误，请使用 1234");
    }
  };

  return (
    <ResponsiveShell showBack>
      <div className="max-w-md mx-auto px-6 py-12 min-h-[60vh] flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bb-amber mb-4">
            <span className="text-2xl font-black text-bb-surface-0">B</span>
          </div>
          <h1 className="text-2xl font-bold text-bb-text-1">{t("common.appName")}</h1>
          <p className="text-sm text-bb-text-3 mt-1">{t("common.slogan")}</p>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("auth.phonePlaceholder")}
              type="tel"
              maxLength={11}
              className="w-full rounded-lg bg-bb-surface-2 px-4 py-3 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber"
            />
          </div>

          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("auth.codePlaceholder")}
              type="text"
              maxLength={4}
              className="flex-1 rounded-lg bg-bb-surface-2 px-4 py-3 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber"
            />
            <button
              onClick={handleSendCode}
              disabled={codeSent}
              className="rounded-lg bg-bb-surface-3 px-4 py-3 text-xs text-bb-text-2 hover:bg-bb-surface-2 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {codeSent ? t("auth.resendCode") : t("auth.sendCode")}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={!phone || !code}
            className="w-full rounded-button bg-bb-amber py-3 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:bg-bb-amber/90 transition-colors disabled:opacity-50"
          >
            {t("auth.login")}
          </button>

          <p className="text-center text-xs text-bb-text-3">
            {t("auth.noAccount")}{" "}
            <button
              onClick={() => router.push("/auth/register")}
              className="text-bb-amber hover:underline"
            >
              {t("auth.register")}
            </button>
          </p>

          <p className="text-center text-[10px] text-bb-text-3 mt-6">
            {t("auth.agreeTerms")}
          </p>

          {codeSent && (
            <p className="text-center text-[10px] text-bb-text-3">
              提示：演示验证码为 <span className="text-bb-amber font-mono">1234</span>
            </p>
          )}
        </div>
      </div>
    </ResponsiveShell>
  );
}
