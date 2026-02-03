"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { defaultLocale } from "@/lib/i18n/config";
import AccountAddresses from "@/components/AccountAddresses";

type Order = {
  id: string;
  date: string;
  total: string;
  status: "Procesando" | "Enviado" | "Completado";
};

type SectionKey = "account" | "orders" | "addresses";

export default function AccountPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>("account");
  const [orders, setOrders] = useState<Order[]>([]);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gn-orders");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Order[];
      if (Array.isArray(parsed)) {
        setOrders(parsed);
      }
    } catch {
      localStorage.removeItem("gn-orders");
    }
  }, []);

  const content = useMemo(() => {
    if (activeSection === "orders") {
      if (orders.length === 0) {
        return (
          <div className="rounded-2xl border border-white/10 bg-dark-surface/30 p-6">
            <p className="text-sm text-text-muted">
              Todavía no realizaste pedidos
            </p>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-dark-surface/30 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Pedido #{order.id}
                </p>
                <p className="text-xs text-text-muted">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-primary">{order.total}</span>
                <span className="text-xs uppercase tracking-[0.12em] text-text-muted">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === "addresses") {
      return <AccountAddresses />;
    }

    return (
      <div className="rounded-2xl border border-white/10 bg-dark-surface/30 p-6">
        <p className="text-sm text-text-muted">
          Desde acá podés ver tus pedidos y gestionar tus datos
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-text-primary">
            {user?.name || "Usuario"}
          </p>
          <p className="text-sm text-text-muted">{user?.email}</p>
        </div>
      </div>
    );
  }, [activeSection, orders, user]);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-dark-base px-6 pb-16 pt-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-dark-surface/40 p-8 text-center">
            <h1 className="text-2xl font-semibold text-text-primary">
              Mi cuenta
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Debés iniciar sesión para acceder a tu cuenta
            </p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-6 w-full rounded-xl bg-text-primary px-4 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-base px-6 pb-16 pt-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">
            Mi cuenta
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Gestioná tu perfil y revisá tus pedidos
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            {[
              { key: "account", label: "Mi cuenta" },
              { key: "orders", label: "Mis pedidos" },
              { key: "addresses", label: "Direcciones" },
            ].map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key as SectionKey)}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 ease-out",
                    isActive
                      ? "border-accent-gold bg-dark-surface/60 text-text-primary"
                      : "border-white/10 bg-dark-surface/30 text-text-muted hover:text-text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                logout();
                router.push(`/${defaultLocale}`);
              }}
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-text-muted transition-colors duration-200 ease-out hover:text-text-primary"
            >
              Cerrar sesión
            </button>
          </aside>

          <section className="min-w-0">{content}</section>
        </div>
      </div>
    </main>
  );
}

