import React from "react";
import styles from "../Popup.module.css";

export default function FilePathInput({ value, onChange, error }) {
  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="file-path">
        File Path
      </label>
      <input
        id="file-path"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="src/components/Navbar.jsx"
        spellCheck="false"
      />
      <div className={styles.helper}>Relative to the repository root. Nested folders are allowed.</div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
}
