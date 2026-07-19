import React, { useState } from "react";
import styles from "../Popup.module.css";

export default function LoginCard({ tokenRef, auth, onSaveToken }) {
  const [value, setValue] = useState(auth.token || "");

  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="github-token">
        GitHub Token
      </label>
      <div className={styles.row}>
        <input
          ref={tokenRef}
          id="github-token"
          className={styles.input}
          type="password"
          value={value}
          autoComplete="off"
          spellCheck="false"
          placeholder="Paste your Personal Access Token"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSaveToken(value);
          }}
          aria-invalid={Boolean(auth.error)}
        />
        <button className={styles.button} type="button" onClick={() => onSaveToken(value)}>
          Save
        </button>
      </div>

      <div className={styles.helper}>
        {auth.authStatus === "connected" ? (
          <span className={styles.success}>Connected</span>
        ) : auth.authStatus === "unauthorized" ? (
          <span className={styles.error}>Unauthorized</span>
        ) : auth.authStatus === "invalid" ? (
          <span className={styles.error}>Invalid Token</span>
        ) : (
          <span>Token is stored locally in extension storage.</span>
        )}
      </div>

      {auth.error ? <div className={styles.error}>{auth.error}</div> : null}
    </section>
  );
}
