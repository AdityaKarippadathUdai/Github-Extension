export function validateToken(token) {
  return Boolean(token && token.trim().length >= 20);
}

export function validateRepository(repo) {
  return Boolean(repo && repo.owner?.login && repo.name);
}

export function validateBranch(branch) {
  return typeof branch === "string" && branch.trim().length > 0;
}

export function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== "string") return false;
  const value = filePath.trim();
  if (!value || value.startsWith("/") || value.includes("\\") || value.includes("..")) return false;
  return value.split("/").every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

export function validateCommitMessage(message) {
  return Boolean(message && message.trim().length > 0);
}

export function validateCode(code) {
  return typeof code === "string" && code.trim().length > 0;
}
