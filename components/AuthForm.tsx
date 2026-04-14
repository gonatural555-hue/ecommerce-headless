"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

type Tab = "login" | "register";

type Props = {
  initialTab?: Tab;
  onSuccess?: () => void;
  isPage?: boolean;
  /** Ruta interna (ej. /es/checkout) tras login correcto */
  redirectTo?: string;
};

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.358 5 12 5c4.642 0 8.477 2.511 9.964 6.678.07.202.07.424 0 .639C20.577 16.49 16.642 19 12 19c-4.642 0-8.477-2.511-9.964-6.678z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.638 0 8.573 2.511 9.963 6.678.07.202.07.424 0 .639M12 12v.01M17 17l2 2M3 3l18 18"
      />
    </svg>
  );
}

export default function AuthForm({
  initialTab = "login",
  onSuccess,
  isPage = false,
  redirectTo,
}: Props) {
  const { login, register } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] =
    useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError(null);
    setAwaitingEmailConfirmation(false);
    setPendingEmail("");
    setActiveTab(initialTab);
  }, [initialTab]);

  const subtitle = useMemo(() => {
    if (activeTab === "login") {
      return "Accedé a tu cuenta para ver pedidos y guardar datos";
    }
    return "Creá tu cuenta para acelerar futuras compras";
  }, [activeTab]);

  const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current && isPage) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 300);
      });
    }
  };

  const afterAuthSuccess = () => {
    const target =
      redirectTo && redirectTo.startsWith("/") ? redirectTo : `/${locale}/account`;
    if (isPage) {
      router.push(target);
      router.refresh();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (activeTab === "login") {
        const { error: err } = await login({ email, password });
        if (err) {
          setError(err);
          return;
        }
      } else {
        if (password !== confirmPassword) {
          setError(
            t("authForm.passwordMismatch", "Passwords do not match.")
          );
          return;
        }
        const {
          error: err,
          needsEmailConfirmation,
          pendingEmail: registeredEmail,
        } = await register({ name, email, password });
        if (err) {
          setError(err);
          return;
        }
        if (needsEmailConfirmation) {
          setAwaitingEmailConfirmation(true);
          setPendingEmail(registeredEmail ?? email);
          return;
        }
      }
      afterAuthSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  const passwordFieldClass =
    "w-full rounded-xl border border-white/10 bg-dark-surface/70 py-3 pl-3 pr-11 sm:pl-4 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none";
  const toggleButtonClass =
    "absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-white/10 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50";

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-full bg-dark-surface/60 p-1">
        {(["login", "register"] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                if (tab === "login") {
                  setAwaitingEmailConfirmation(false);
                  setConfirmPassword("");
                  setShowPassword(false);
                }
              }}
              className={[
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out",
                isActive
                  ? "bg-dark-base text-text-primary shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
                  : "text-text-muted hover:text-text-primary",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          {awaitingEmailConfirmation && activeTab === "register"
            ? t("authForm.confirmEmailTitle", "Check your email")
            : activeTab === "login"
              ? "Bienvenido de nuevo"
              : "Creá tu cuenta"}
        </h2>
        {!(awaitingEmailConfirmation && activeTab === "register") ? (
          <p className="text-sm text-text-muted">{subtitle}</p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-400/95" role="alert">
          {error}
        </p>
      ) : null}

      {awaitingEmailConfirmation && activeTab === "register" ? (
        <div
          className="mt-6 rounded-2xl border border-accent-gold/25 bg-dark-surface/85 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-dark-base/80 text-accent-gold"
              aria-hidden
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm leading-relaxed text-text-primary/95">
                {t("authForm.confirmEmailDescription", "").replace(
                  "{email}",
                  pendingEmail
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setAwaitingEmailConfirmation(false);
                }}
                className="text-sm font-semibold text-accent-gold underline-offset-4 transition-colors hover:text-accent-gold/90 hover:underline"
              >
                {t("authForm.goToLogin", "Go to sign in")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          {activeTab === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Nombre
              </label>
              <input
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onFocus={() => handleInputFocus(nameInputRef)}
                type="text"
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-3 sm:px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Email
            </label>
            <input
              ref={emailInputRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => handleInputFocus(emailInputRef)}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-3 sm:px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
              placeholder="tuemail@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Contraseña
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => handleInputFocus(passwordInputRef)}
                type={showPassword ? "text" : "password"}
                autoComplete={
                  activeTab === "login" ? "current-password" : "new-password"
                }
                className={passwordFieldClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className={toggleButtonClass}
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? t("authForm.hidePassword", "Hide password")
                    : t("authForm.showPassword", "Show password")
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {activeTab === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                {t("authForm.confirmPassword", "Confirm password")}
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordInputRef}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onFocus={() => handleInputFocus(confirmPasswordInputRef)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={passwordFieldClass}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={toggleButtonClass}
                  aria-pressed={showPassword}
                  aria-label={
                    showPassword
                      ? t("authForm.hidePassword", "Hide password")
                      : t("authForm.showPassword", "Show password")
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-text-primary px-4 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white disabled:opacity-60"
          >
            {submitting
              ? "…"
              : activeTab === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>
      )}
    </div>
  );
}
