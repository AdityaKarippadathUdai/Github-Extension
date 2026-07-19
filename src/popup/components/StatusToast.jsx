import React from "react";
import styles from "../Popup.module.css";

export default function StatusToast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`${styles.toast} ${
        toast.type === "success" ? styles.toastSuccess : styles.toastError
      }`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
