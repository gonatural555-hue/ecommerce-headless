"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Tab = "login" | "register";

export default function AuthModal({ open, onClose }: Props) {
  const { login, register } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setPassword("");
    setActiveTab("login");
  }, [open]);

  const subtitle = useMemo(() => {
    if (activeTab === "login") {
      return "Accedé a tu cuenta para ver pedidos y guardar datos";
    }
    return "Creá tu cuenta para acelerar futuras compras";
  }, [activeTab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full md:max-w-md bg-dark-base border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] rounded-t-3xl md:rounded-3xl px-6 py-7 md:px-8 md:py-8">
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
                value={name}
                onChange={(event) => setName(event.target.value)}
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

