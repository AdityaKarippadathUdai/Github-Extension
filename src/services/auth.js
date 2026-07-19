import { getJson } from "./githubApi.js";
import { normalizeRepo } from "../utils/githubHelpers.js";

export async function validateToken(token) {
  const user = await getJson("/user", { token });
  return {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    html_url: user.html_url
  };
}

export async function loadUserRepositories(token) {
  const repos = [];
  let page = 1;
  while (page <= 10) {
    const batch = await getJson(
      `/user/repos?per_page=100&page=${page}&sort=updated&visibility=all&affiliation=owner,collaborator,organization_member`,
      { token }
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch.map(normalizeRepo));
    if (batch.length < 100) break;
    page += 1;
  }
  return repos;
}
