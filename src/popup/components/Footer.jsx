import React from "react";
import styles from "../Popup.module.css";

export default function Footer({ version }) {
  return (
    <footer className={styles.card} style={{ marginTop: 10 }}>
      <div className={styles.rowBetween}>
        <span className={styles.muted} style={{ fontSize: 12 }}>
          Version {version}
        </span>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#58a6ff", textDecoration: "none", fontSize: 12 }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
