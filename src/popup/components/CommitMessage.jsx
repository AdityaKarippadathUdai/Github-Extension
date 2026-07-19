import React, { forwardRef } from "react";
import styles from "../Popup.module.css";

const CommitMessage = forwardRef(function CommitMessage({ value, onChange, suggestions, error }, ref) {
  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="commit-message">
        Commit Message
      </label>
      <textarea
        ref={ref}
        id="commit-message"
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write a descriptive commit message"
        rows={3}
      />
      {suggestions?.length ? (
        <div className={styles.helper}>Recent: {suggestions.slice(0, 3).join(" · ")}</div>
      ) : (
        <div className={styles.helper}>Short, descriptive commit messages work best.</div>
      )}
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
});

export default CommitMessage;
