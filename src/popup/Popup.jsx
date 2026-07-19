import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Popup.module.css";
import { APP_NAME, APP_VERSION } from "../utils/constants.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import LoginCard from "./components/LoginCard.jsx";
import RepoSelector from "./components/RepoSelector.jsx";
import BranchSelector from "./components/BranchSelector.jsx";
import FilePathInput from "./components/FilePathInput.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import CommitMessage from "./components/CommitMessage.jsx";
import CommitButton from "./components/CommitButton.jsx";
import StatusToast from "./components/StatusToast.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

export default function Popup({ auth, repo, commit, ready }) {
  const [code, setCode] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const codeRef = useRef(null);
  const messageRef = useRef(null);
  const tokenRef = useRef(null);

  useEffect(() => {
    if (!auth.token && tokenRef.current) {
      tokenRef.current.focus();
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.token && !repo.repositories.length && !repo.loadingRepos) {
      auth.loadRepos().catch(() => {});
    }
  }, [auth.token]);

  useEffect(() => {
    if (repo.selectedRepo && auth.token) {
      auth.loadRepoBranches(repo.selectedRepo).catch(() => {});
    }
  }, [repo.selectedRepo?.full_name, auth.token]);

  useEffect(() => {
    if (auth.authStatus === "connected" && !commitMessage && repo.recentCommitMessages.length > 0) {
      setCommitMessage(repo.recentCommitMessages[0]);
    }
  }, [auth.authStatus, commitMessage, repo.recentCommitMessages]);

  const repositoryOptions = useMemo(
    () => repo.repositories.filter((item) => {
      const query = repo.searchQuery?.trim().toLowerCase() || "";
      if (!query) return true;
      return item.full_name.toLowerCase().includes(query);
    }),
    [repo.repositories, repo.searchQuery]
  );

  return (
    <div className={styles.shell}>
      <Header
        title={APP_NAME}
        version={APP_VERSION}
        user={auth.user}
        onRefresh={() => auth.loadRepos().catch(() => {})}
        onClearToken={() => auth.logout()}
      />

      <main className={styles.content}>
        <LoginCard
          tokenRef={tokenRef}
          auth={auth}
          error={commit.fieldErrors.token}
          onSaveToken={(token) => auth.saveToken(token)}
          onConnected={() => auth.loadRepos().catch(() => {})}
        />

        <RepoSelector
          repositories={repositoryOptions}
          searchValue={repo.searchQuery || ""}
          onSearchChange={repo.setSearchQuery}
          selectedRepo={repo.selectedRepo}
          onSelectRepo={async (nextRepo) => {
            await repo.setSelectedRepo(nextRepo);
            await repo.loadRepoBranches(nextRepo).catch(() => {});
          }}
          loading={repo.loadingRepos}
          error={commit.fieldErrors.repository || repo.error}
        />

        <BranchSelector
          branches={repo.branches}
          selectedBranch={repo.selectedBranch}
          loading={repo.loadingBranches}
          onSelectBranch={repo.setSelectedBranch}
          onReload={() => repo.loadRepoBranches().catch(() => {})}
          error={commit.fieldErrors.branch || repo.error}
        />

        <FilePathInput
          value={repo.filePath}
          onChange={repo.setFilePath}
          error={commit.fieldErrors.filePath}
        />

        <CodeEditor
          ref={codeRef}
          value={code}
          onChange={setCode}
          error={commit.fieldErrors.code}
        />

        <CommitMessage
          ref={messageRef}
          value={commitMessage}
          onChange={setCommitMessage}
          suggestions={repo.recentCommitMessages}
          error={commit.fieldErrors.commitMessage}
        />

        <CommitButton
          committing={commit.committing}
          onCommit={() => commit.submitCommit({ code, commitMessage })}
          disabled={!ready}
        />

        <StatusToast toast={commit.toast} />
      </main>

      <Footer version={APP_VERSION} />

      {repo.loadingRepos || repo.loadingBranches || commit.committing ? (
        <div className={styles.loadingOverlay} aria-live="polite">
          <LoadingSpinner />
        </div>
      ) : null}
    </div>
  );
}
