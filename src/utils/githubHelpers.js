export function formatRepoLabel(repo) {
  return `${repo.owner?.login ?? "unknown"}/${repo.name}`;
}

export function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name ?? formatRepoLabel(repo),
    owner: repo.owner,
    default_branch: repo.default_branch ?? "main",
    private: Boolean(repo.private),
    html_url: repo.html_url
  };
}

export function sortRepositories(repos) {
  return [...repos].sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export function dedupeRecent(items, nextItem, limit = 8) {
  return [nextItem, ...items.filter((item) => item !== nextItem)].slice(0, limit);
}
