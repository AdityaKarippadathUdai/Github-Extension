import React from "react";
import styles from "../Popup.module.css";

export default function RepoSelector({ repositories, searchValue, onSearchChange, selectedRepo, onSelectRepo, loading, error }) {
  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="repo-search">
        Repository Search
      </label>
      <input
        id="repo-search"
        className={styles.input}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Filter repositories"
        disabled={loading}
      />

      <div style={{ marginTop: 10 }}>
        <label className={styles.label} htmlFor="repo-select">
          Repository
        </label>
        <select
          id="repo-select"
          className={styles.select}
          value={selectedRepo?.full_name || ""}
          onChange={(event) => {
            const repo = repositories.find((item) => item.full_name === event.target.value);
            if (repo) onSelectRepo(repo);
          }}
          disabled={loading || repositories.length === 0}
        >
          <option value="">Select repository</option>
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.full_name}
            </option>
          ))}
        </select>
      </div>

      {selectedRepo ? <div className={styles.helper}>Selected: {selectedRepo.full_name}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
}
