import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";

const RepoContext = createContext(null);

export function RepoProvider({ children }) {
  const auth = useAuth();

  const value = {
    repositories: auth.repositories,
    branches: auth.branches,
    selectedRepo: auth.selectedRepo,
    selectedBranch: auth.selectedBranch,
    filePath: auth.filePath,
    recentRepositories: auth.recentRepositories,
    recentCommitMessages: auth.recentCommitMessages,
    loadingRepos: auth.loadingRepos,
    loadingBranches: auth.loadingBranches,
    error: auth.error,
    setError: auth.setError,
    setSelectedRepo: auth.selectRepo,
    setSelectedBranch: auth.selectBranch,
    setFilePath: auth.saveFilePath,
    loadRepos: auth.loadRepos,
    loadRepoBranches: auth.loadRepoBranches,
    rememberCommitMessage: auth.rememberCommitMessage
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

export function useRepo() {
  const value = useContext(RepoContext);
  if (!value) throw new Error("useRepo must be used within RepoProvider");
  return value;
}
