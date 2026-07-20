import { useCallback, useMemo, useState } from "react";
import { loadUserRepositories, validateToken as validateGithubToken } from "../services/auth.js";
import { loadBranches } from "../services/repoService.js";
import { MAX_RECENT_ITEMS, STORAGE_KEYS } from "../utils/constants.js";
import { dedupeRecent } from "../utils/githubHelpers.js";
import { getStored, setStored } from "../services/storage.js";
import { validateToken } from "../utils/validators.js";

export function useGithubBridge() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("idle");
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [filePath, setFilePath] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentRepositories, setRecentRepositories] = useState([]);
  const [recentCommitMessages, setRecentCommitMessages] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState("");

  const hydrate = useCallback(async () => {
    const stored = await getStored([
      STORAGE_KEYS.token,
      STORAGE_KEYS.user,
      STORAGE_KEYS.lastRepo,
      STORAGE_KEYS.lastBranch,
      STORAGE_KEYS.lastFilePath,
      STORAGE_KEYS.recentRepos,
      STORAGE_KEYS.recentMessages
    ]);

    if (stored[STORAGE_KEYS.token]) setToken(stored[STORAGE_KEYS.token]);
    if (stored[STORAGE_KEYS.user]) setUser(stored[STORAGE_KEYS.user]);
    if (stored[STORAGE_KEYS.lastRepo]) setSelectedRepo(stored[STORAGE_KEYS.lastRepo]);
    if (stored[STORAGE_KEYS.lastBranch]) setSelectedBranch(stored[STORAGE_KEYS.lastBranch]);
    if (stored[STORAGE_KEYS.lastFilePath]) setFilePath(stored[STORAGE_KEYS.lastFilePath]);
    if (Array.isArray(stored[STORAGE_KEYS.recentRepos])) setRecentRepositories(stored[STORAGE_KEYS.recentRepos]);
    if (Array.isArray(stored[STORAGE_KEYS.recentMessages])) setRecentCommitMessages(stored[STORAGE_KEYS.recentMessages]);

    return stored;
  }, []);

  const bootstrap = hydrate;

  const saveToken = useCallback(async (nextToken) => {
    const value = nextToken.trim();
    setError("");
    setAuthStatus("loading");
    if (!validateToken(value)) {
      setAuthStatus("invalid");
      setError("Paste a valid GitHub Personal Access Token.");
      return { ok: false };
    }
    try {
      const profile = await validateGithubToken(value);
      setToken(value);
      setUser(profile);
      setAuthStatus("connected");
      await setStored({
        [STORAGE_KEYS.token]: value,
        [STORAGE_KEYS.user]: profile
      });
      return { ok: true, user: profile };
    } catch (cause) {
      setUser(null);
      setAuthStatus(cause?.status === 401 ? "unauthorized" : "invalid");
      setError(cause?.message || "The token could not be validated.");
      return { ok: false, error: cause };
    }
  }, []);

  const logout = useCallback(async () => {
    setToken("");
    setUser(null);
    setRepositories([]);
    setBranches([]);
    setSelectedRepo(null);
    setSelectedBranch("");
    setAuthStatus("idle");
    await setStored({
      [STORAGE_KEYS.token]: "",
      [STORAGE_KEYS.user]: null
    });
  }, []);

  const loadRepos = useCallback(async () => {
    if (!token) return [];
    setLoadingRepos(true);
    setError("");
    try {
      const repos = await loadUserRepositories(token);
      setRepositories(repos);
      if (selectedRepo?.full_name) {
        const match = repos.find((repo) => repo.full_name === selectedRepo.full_name);
        if (match) setSelectedRepo(match);
      }
      return repos;
    } catch (cause) {
      setError(cause?.message || "Unable to load repositories.");
      throw cause;
    } finally {
      setLoadingRepos(false);
    }
  }, [token, selectedRepo?.full_name]);

  const selectRepo = useCallback(
    async (repo) => {
      setSelectedRepo(repo);
      setSelectedBranch(repo?.default_branch || "");
      if (repo) {
        const currentRecent = dedupeRecent(recentRepositories, repo.full_name, MAX_RECENT_ITEMS);
        setRecentRepositories(currentRecent);
        await setStored({
          [STORAGE_KEYS.lastRepo]: repo,
          [STORAGE_KEYS.recentRepos]: currentRecent
        });
      }
      return repo;
    },
    [recentRepositories]
  );

  const loadRepoBranches = useCallback(
    async (repo = selectedRepo) => {
      if (!repo || !token) return [];
      setLoadingBranches(true);
      try {
        const data = await loadBranches(token, repo.owner.login, repo.name);
        setBranches(data);
        const defaultBranch = data.find((branch) => branch.name === repo.default_branch) || data[0];
        const selected = defaultBranch?.name || repo.default_branch || "";
        setSelectedBranch(selected);
        await setStored({
          [STORAGE_KEYS.lastBranch]: selected
        });
        return data;
      } catch (cause) {
        setError(cause?.message || "Unable to load branches.");
        throw cause;
      } finally {
        setLoadingBranches(false);
      }
    },
    [selectedRepo, token]
  );

  const selectBranch = useCallback(async (branch) => {
    setSelectedBranch(branch);
    await setStored({
      [STORAGE_KEYS.lastBranch]: branch
    });
  }, []);

  const saveFilePath = useCallback(async (nextPath) => {
    setFilePath(nextPath);
    await setStored({
      [STORAGE_KEYS.lastFilePath]: nextPath
    });
  }, []);

  const saveSearchQuery = useCallback((nextQuery) => {
    setSearchQuery(nextQuery);
  }, []);

  const rememberCommitMessage = useCallback(async (message) => {
    const current = dedupeRecent(recentCommitMessages, message, MAX_RECENT_ITEMS);
    setRecentCommitMessages(current);
    await setStored({
      [STORAGE_KEYS.recentMessages]: current
    });
  }, [recentCommitMessages]);

  return useMemo(
    () => ({
      token,
      user,
      authStatus,
      repositories,
      branches,
      selectedRepo,
      selectedBranch,
      filePath,
      searchQuery,
      recentRepositories,
      recentCommitMessages,
      loadingRepos,
      loadingBranches,
      error,
      setError,
      setToken,
      setRepositories,
      setBranches,
      setSelectedRepo,
      setSelectedBranch,
      setFilePath,
      setSearchQuery: saveSearchQuery,
      saveToken,
      logout,
      loadRepos,
      selectRepo,
      loadRepoBranches,
      selectBranch,
      saveFilePath,
      rememberCommitMessage,
      bootstrap
    }),
    [
      token,
      user,
      authStatus,
      repositories,
      branches,
      selectedRepo,
      selectedBranch,
      filePath,
      searchQuery,
      recentRepositories,
      recentCommitMessages,
      loadingRepos,
      loadingBranches,
      error,
      saveToken,
      logout,
      loadRepos,
      selectRepo,
      loadRepoBranches,
      selectBranch,
      saveFilePath,
      rememberCommitMessage,
      bootstrap
    ]
  );
}
