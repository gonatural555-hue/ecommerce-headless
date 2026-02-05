"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserProfile = {
  name: string;
  email: string;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  address: Address;
  date: string;
  status: string;
  paymentMethod?: "manual" | "whatsapp" | "paypal" | "paypal_pending";
  paypalOrderId?: string;
};

type UserState = {
  isLoggedIn: boolean;
  user: UserProfile | null;
  addresses: Address[];
  orders: Order[];
  lastOrderId?: string | null;
};

type UserContextValue = UserState & {
  login: (payload: { email: string; password: string }) => void;
  register: (payload: { name: string; email: string; password: string }) => void;
  logout: () => void;
  setAddresses: (next: Address[]) => void;
  upsertAddress: (next: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Order) => void;
};

const STORAGE_KEY = "gn-user-state";

const UserContext = createContext<UserContextValue | undefined>(undefined);

const normalizeDefault = (list: Address[], selectedId?: string | null) => {
  if (!selectedId) return list;
  return list.map((addr) => ({ ...addr, isDefault: addr.id === selectedId }));
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>({
    isLoggedIn: false,
    user: null,
    addresses: [],
    orders: [],
    lastOrderId: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserState;
        if (parsed) {
          setState({
            isLoggedIn: Boolean(parsed.isLoggedIn),
            user: parsed.user || null,
            addresses: Array.isArray(parsed.addresses)
              ? parsed.addresses
              : [],
            orders: Array.isArray(parsed.orders) ? parsed.orders : [],
            lastOrderId: parsed.lastOrderId ?? null,
          });
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const legacyAuth = localStorage.getItem("gn-auth");
    const legacyAddresses = localStorage.getItem("user_addresses");
    const legacyOrders = localStorage.getItem("orders");
    const legacyMockOrders = localStorage.getItem("gn-orders");
    const legacyLastOrder = localStorage.getItem("last_order_id");

    let isLoggedIn = false;
    let user: UserProfile | null = null;

    if (legacyAuth) {
      try {
        const parsed = JSON.parse(legacyAuth) as {
          isLoggedIn?: boolean;
          user?: UserProfile;
        };
        if (parsed?.isLoggedIn && parsed.user) {
          isLoggedIn = true;
          user = parsed.user;
        }
      } catch {
        // ignore
      }
    }

    const addresses = legacyAddresses
      ? (JSON.parse(legacyAddresses) as Address[])
      : [];
    const orders = legacyOrders
      ? (JSON.parse(legacyOrders) as Order[])
      : legacyMockOrders
        ? (JSON.parse(legacyMockOrders) as Order[])
        : [];

    setState({
      isLoggedIn,
      user,
      addresses: Array.isArray(addresses) ? addresses : [],
      orders: Array.isArray(orders) ? orders : [],
      lastOrderId: legacyLastOrder,
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = ({ email }: { email: string; password: string }) => {
    const name = email.split("@")[0] || "Usuario";
    setState((prev) => ({ ...prev, isLoggedIn: true, user: { name, email } }));
  };

  const register = ({
    name,
    email,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setState((prev) => ({ ...prev, isLoggedIn: true, user: { name, email } }));
  };

  const logout = () => {
    setState((prev) => ({ ...prev, isLoggedIn: false, user: null }));
  };

  const setAddresses = (next: Address[]) => {
    setState((prev) => ({ ...prev, addresses: next }));
  };

  const upsertAddress = (next: Address) => {
    setState((prev) => {
      const updated = prev.addresses.some((addr) => addr.id === next.id)
        ? prev.addresses.map((addr) => (addr.id === next.id ? next : addr))
        : [...prev.addresses, next];
      const normalized = normalizeDefault(updated, next.isDefault ? next.id : null);
      return { ...prev, addresses: normalized };
    });
  };

  const removeAddress = (id: string) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
  };

  const setDefaultAddress = (id: string) => {
    setState((prev) => ({
      ...prev,
      addresses: normalizeDefault(prev.addresses, id),
    }));
  };

  const addOrder = (order: Order) => {
    setState((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
      lastOrderId: order.id,
    }));
  };

  const value = useMemo<UserContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      setAddresses,
      upsertAddress,
      removeAddress,
      setDefaultAddress,
      addOrder,
    }),
    [state]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

