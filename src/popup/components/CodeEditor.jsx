import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import styles from "../Popup.module.css";

function makeLineNumbers(value) {
  const count = Math.max(1, value.split("\n").length);
  return Array.from({ length: count }, (_, index) => index + 1).join("\n");
}

const CodeEditor = forwardRef(function CodeEditor({ value, onChange, error }, ref) {
  const textAreaRef = useRef(null);
  const lineNumbers = useMemo(() => makeLineNumbers(value), [value]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.max(160, textAreaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="code-editor">
        Code Editor
      </label>
      <div className={styles.codeEditor}>
        <pre className={styles.gutter} aria-hidden="true">
          {lineNumbers}
        </pre>
        <textarea
          id="code-editor"
          ref={(node) => {
            textAreaRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste source code here"
          spellCheck="false"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            lineHeight: 1.5
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
            const start = event.currentTarget.selectionStart;
            const end = event.currentTarget.selectionEnd;
            const next = `${value.slice(0, start)}  ${value.slice(end)}`;
            onChange(next);
            requestAnimationFrame(() => {
              event.currentTarget.selectionStart = event.currentTarget.selectionEnd = start + 2;
            });
          }}
        />
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
});

export default CodeEditor;
