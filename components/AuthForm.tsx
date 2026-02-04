"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Tab = "login" | "register";

type Props = {
  initialTab?: Tab;
  onSuccess?: () => void;
  isPage?: boolean; // true if used in dedicated page, false if in modal
};

export default function AuthForm({ initialTab = "login", onSuccess, isPage = false }: Props) {
  const { login, register } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
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
      // For mobile page: scroll input into view after keyboard appears
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeTab === "login") {
      login({ email, password });
    } else {
      register({ name, email, password });
    }
    
    if (isPage) {
      // Redirect to account page after successful login/register
      router.push(`/${locale}/account`);
    } else if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-full bg-dark-surface/60 p-1">
        {(["login", "register"] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
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
          {activeTab === "login" ? "Bienvenido de nuevo" : "Creá tu cuenta"}
        </h2>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
          <input
            ref={passwordInputRef}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => handleInputFocus(passwordInputRef)}
            type="password"
            className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-3 sm:px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-text-primary px-4 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white"
        >
          {activeTab === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

