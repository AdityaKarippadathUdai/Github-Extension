import { getJson } from "./githubApi.js";

export async function loadBranches(token, owner, repo) {
  return getJson(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?per_page=100`, { token });
}
