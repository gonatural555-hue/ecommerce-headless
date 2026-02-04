"use client";

// DEBUG MODE: Simplified component with NO dependencies and NO conditions
export default function RegistrationCTA() {
  // DEBUG: Force render with visible debug styles
  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        zIndex: 9999,
        backgroundColor: "#ff0000",
        color: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        fontSize: "24px",
        fontWeight: "bold",
        border: "3px solid #ffff00",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      CTA REGISTER DEBUG
    </div>
  );
}

