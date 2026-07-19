import React from "react";
import styles from "../Popup.module.css";

export default function BranchSelector({ branches, selectedBranch, loading, onSelectBranch, onReload, error }) {
  return (
    <section className={styles.card}>
      <div className={styles.rowBetween}>
        <label className={styles.label} htmlFor="branch-select" style={{ marginBottom: 0 }}>
          Branch
        </label>
        <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={onReload} disabled={loading}>
          Reload
        </button>
      </div>
      <select
        id="branch-select"
        className={styles.select}
        value={selectedBranch}
        onChange={(event) => onSelectBranch(event.target.value)}
        disabled={loading || branches.length === 0}
      >
        <option value="">Select branch</option>
        {branches.map((branch) => (
          <option key={branch.name} value={branch.name}>
            {branch.name}
          </option>
        ))}
      </select>
      {loading ? <div className={styles.helper}>Loading branches...</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
}
