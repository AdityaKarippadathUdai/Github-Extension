import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import styles from "../Popup.module.css";

function makeLineNumbers(value) {
  const count = Math.max(1, value.split("\n").length);
  return Array.from({ length: count }, (_, index) => index + 1).join("\n");
}

const MAX_EDITOR_HEIGHT = 320;

const CodeEditor = forwardRef(function CodeEditor({ value, onChange, error }, ref) {
  const textAreaRef = useRef(null);
  const gutterRef = useRef(null);
  const syncingScrollRef = useRef(false);
  const lineNumbers = useMemo(() => makeLineNumbers(value), [value]);

  useLayoutEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(168, textarea.scrollHeight), MAX_EDITOR_HEIGHT);
    textarea.style.height = `${nextHeight}px`;

    if (gutterRef.current) {
      gutterRef.current.style.height = `${nextHeight}px`;
    }
  }, [value]);

  const syncScroll = (source) => {
    const textarea = textAreaRef.current;
    const gutter = gutterRef.current;
    if (!textarea || !gutter || syncingScrollRef.current) return;

    const target = source === textarea ? gutter : textarea;
    syncingScrollRef.current = true;
    target.scrollTop = source.scrollTop;
    requestAnimationFrame(() => {
      syncingScrollRef.current = false;
    });
  };

  return (
    <section className={styles.card}>
      <label className={styles.label} htmlFor="code-editor">
        Code Editor
      </label>
      <div className={styles.codeEditor}>
        <pre ref={gutterRef} className={styles.gutter} aria-hidden="true">
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
          wrap="off"
          rows={1}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
          }}
          onScroll={(event) => syncScroll(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
            const start = event.currentTarget.selectionStart;
            const end = event.currentTarget.selectionEnd;
            const next = `${value.slice(0, start)}\t${value.slice(end)}`;
            onChange(next);
            requestAnimationFrame(() => {
              event.currentTarget.setSelectionRange(start + 1, start + 1);
            });
          }}
        />
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </section>
  );
});

export default CodeEditor;
