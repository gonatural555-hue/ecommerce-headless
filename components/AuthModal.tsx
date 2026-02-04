"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
};

type Tab = "login" | "register";

export default function AuthModal({ open, onClose, initialTab = "login" }: Props) {
  const { login, register } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Lock body scroll when modal is open (mobile-safe)
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    // Only apply position fixed on mobile to prevent iOS bounce
    if (window.innerWidth < 768) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (window.innerWidth < 768) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setPassword("");
    setActiveTab(initialTab);
  }, [open, initialTab]);

  const subtitle = useMemo(() => {
    if (activeTab === "login") {
      return "Accedé a tu cuenta para ver pedidos y guardar datos";
    }
    return "Creá tu cuenta para acelerar futuras compras";
  }, [activeTab]);

  const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current) {
      // Small delay to ensure keyboard is opening
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center overflow-y-auto md:overflow-y-visible" 
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full md:max-w-md bg-dark-base border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] rounded-t-3xl md:rounded-3xl px-6 py-7 md:px-8 md:py-8 max-h-[100dvh] md:max-h-none my-auto md:my-0 pb-[max(2rem,env(safe-area-inset-bottom))] md:pb-8">
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

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (activeTab === "login") {
              login({ email, password });
            } else {
              register({ name, email, password });
            }
            onClose();
          }}
        >
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
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
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
              className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
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
              className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent-gold/60 focus:outline-none"
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
    </div>
  );
}

