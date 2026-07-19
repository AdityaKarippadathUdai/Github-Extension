export const APP_NAME = "GitHub Commit Extension";
export const APP_VERSION = "1.0.0";
export const STORAGE_KEYS = {
  token: "ghce.token",
  user: "ghce.user",
  lastRepo: "ghce.lastRepo",
  lastBranch: "ghce.lastBranch",
  lastFilePath: "ghce.lastFilePath",
  recentRepos: "ghce.recentRepos",
  recentMessages: "ghce.recentMessages"
};

export const API_BASE_URL = "https://api.github.com";
export const REQUEST_TIMEOUT_MS = 20000;
export const MAX_RECENT_ITEMS = 8;
