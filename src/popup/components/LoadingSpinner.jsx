import React from "react";

export default function LoadingSpinner() {
  return (
    <div
      aria-label="Loading"
      role="status"
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: "4px solid rgba(88, 166, 255, 0.16)",
        borderTopColor: "#58a6ff",
        animation: "spin 900ms linear infinite"
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
