import React, { useState } from "react";
import styles from "../Popup.module.css";
import logo from "../../assets/icons/github-mark.svg";

export default function Header({ title, version, user, onRefresh, onClearToken }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.card}>
      <div className={styles.rowBetween}>
        <div className={styles.row}>
          <img src={logo} alt="" width="34" height="34" />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
            <div className={styles.muted} style={{ fontSize: 12 }}>
              {user ? `Connected as ${user.login}` : "Connect your GitHub token"}
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={() => setOpen((value) => !value)}>
            Settings
          </button>
        </div>
      </div>

      {open ? (
        <div style={{ marginTop: 12 }} className={styles.row}>
          <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={onRefresh}>
            Refresh
          </button>
          <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={onClearToken}>
            Clear token
          </button>
          <span className={styles.muted} style={{ marginLeft: "auto", fontSize: 12 }}>
            v{version}
          </span>
        </div>
      ) : null}
    </header>
  );
}
