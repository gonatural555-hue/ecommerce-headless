"use client";

import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
};

export default function AuthModal({ open, onClose, initialTab = "login" }: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Lock body scroll when modal is open (desktop only)
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Only show modal on desktop (md and up)
  if (!open) return null;

  return (
    <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-md bg-dark-base border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] rounded-3xl px-8 py-8">
        <AuthForm initialTab={initialTab} onSuccess={onClose} isPage={false} />
      </div>
    </div>
  );
}

