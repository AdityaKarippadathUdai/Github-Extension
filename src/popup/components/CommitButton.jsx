import React from "react";
import styles from "../Popup.module.css";

export default function CommitButton({ committing, onCommit, disabled }) {
  return (
    <section className={styles.card}>
      <button className={styles.button} type="button" onClick={onCommit} disabled={disabled || committing}>
        {committing ? "Committing..." : "Commit to GitHub"}
      </button>
      <div className={styles.helper}>The extension will create the file or update it if it already exists.</div>
    </section>
  );
}
