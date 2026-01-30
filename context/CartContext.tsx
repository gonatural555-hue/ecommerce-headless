"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  variantSummary?: string;
  variantSelections?: {
    type: string;
    typeLabel?: string;
    value: string;
    label?: string;
  }[];
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "INCREASE_QTY"; payload: { id: string } }
  | { type: "DECREASE_QTY"; payload: { id: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { ...action.payload, quantity: 1 },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => item.id !== action.payload.id
        ),
      };

    case "INCREASE_QTY":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREASE_QTY":
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return initialState;

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        dispatch({
          type: "SET_CART",
          payload: JSON.parse(stored),
        });
      }
    } catch {
      // silent fail
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch {
      // silent fail
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const subtotal = state.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem: (item) =>
        dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id) =>
        dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      increaseQty: (id) =>
        dispatch({ type: "INCREASE_QTY", payload: { id } }),
      decreaseQty: (id) =>
        dispatch({ type: "DECREASE_QTY", payload: { id } }),
      clearCart: () =>
        dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
