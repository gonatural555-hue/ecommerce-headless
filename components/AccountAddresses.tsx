"use client";

import { useMemo, useState } from "react";
import { useUser, type Address } from "@/context/UserContext";

type FormState = Omit<Address, "id" | "isDefault"> & { isDefault: boolean };

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

function normalizeDefault(list: Address[], selectedId: string | null) {
  if (!selectedId) return list;
  return list.map((addr) => ({ ...addr, isDefault: addr.id === selectedId }));
}

export default function AccountAddresses() {
  const { addresses, setAddresses, setDefaultAddress, removeAddress } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const hasAddresses = addresses.length > 0;
  const sortedAddresses = useMemo(() => {
    const copy = [...addresses];
    copy.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    return copy;
  }, [addresses]);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsEditing(true);
  };

  const startEdit = (address: Address) => {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    removeAddress(id);
  };

  const handleDefault = (id: string) => {
    setDefaultAddress(id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2?.trim() || "",
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
    };

    if (
      !trimmed.fullName ||
      !trimmed.phone ||
      !trimmed.addressLine1 ||
      !trimmed.city ||
      !trimmed.postalCode ||
      !trimmed.country
    ) {
      return;
    }

    const nextId = editingId ?? `addr_${Date.now()}`;
    const nextAddress: Address = {
      id: nextId,
      ...trimmed,
      isDefault: form.isDefault,
    };

    const updated = editingId
      ? addresses.map((item) => (item.id === editingId ? nextAddress : item))
      : [...addresses, nextAddress];
    const defaultId = nextAddress.isDefault ? nextAddress.id : null;
    setAddresses(normalizeDefault(updated, defaultId));

    setIsEditing(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Direcciones</h2>
        <button
          type="button"
          onClick={startNew}
          className="rounded-xl border border-white/10 bg-dark-surface/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary transition-colors duration-200 ease-out hover:border-accent-gold/60 hover:text-accent-gold/90"
        >
          Agregar nueva
        </button>
      </div>

      {!hasAddresses && !isEditing && (
        <div className="rounded-2xl border border-white/10 bg-dark-surface/30 p-6">
          <p className="text-sm text-text-muted">
            Todavía no agregaste ninguna dirección
          </p>
        </div>
      )}

      {hasAddresses && (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedAddresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-white/10 bg-dark-surface/30 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {address.fullName}
                  </p>
                  <p className="text-xs text-text-muted">{address.phone}</p>
                </div>
                {address.isDefault && (
                  <span className="rounded-full border border-accent-gold/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-gold">
                    Dirección principal
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm text-text-muted space-y-1">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city} · {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-text-primary hover:text-accent-gold/90 transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  Eliminar
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleDefault(address.id)}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted hover:text-accent-gold/90 transition-colors duration-200"
                  >
                    Usar como principal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <form
          className="rounded-2xl border border-white/10 bg-dark-surface/30 p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Nombre completo
              </label>
              <input
                value={form.fullName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder="Nombre y apellido"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Teléfono
              </label>
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                type="tel"
                required
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Dirección
            </label>
            <input
              value={form.addressLine1}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, addressLine1: event.target.value }))
              }
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
              placeholder="Calle y número"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Complemento
            </label>
            <input
              value={form.addressLine2}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, addressLine2: event.target.value }))
              }
              type="text"
              className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
              placeholder="Departamento, piso, etc. (opcional)"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Ciudad
              </label>
              <input
                value={form.city}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, city: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder="Ciudad"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Código postal
              </label>
              <input
                value={form.postalCode}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, postalCode: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder="CP"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                País
              </label>
              <input
                value={form.country}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, country: event.target.value }))
                }
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-dark-surface/70 px-4 py-3 text-sm text-text-primary focus:border-accent-gold/60 focus:outline-none"
                placeholder="España"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isDefault: event.target.checked }))
              }
              className="h-4 w-4 rounded border border-white/20 bg-dark-surface/70 text-accent-gold focus:ring-accent-gold/60"
            />
            Usar como dirección principal
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-text-primary px-5 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white"
            >
              Guardar dirección
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-text-muted transition-colors duration-200 ease-out hover:text-text-primary"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

