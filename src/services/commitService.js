import { getJson, putJson } from "./githubApi.js";
import { encodeBase64Utf8 } from "../utils/base64.js";

export async function getFileState(token, owner, repo, branch, filePath) {
  const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}?ref=${encodeURIComponent(branch)}`;
  try {
    const data = await getJson(path, { token });
    if (Array.isArray(data)) {
      const error = new Error("The selected path points to a folder, not a file.");
      error.status = 409;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function commitFile({ token, owner, repo, branch, filePath, commitMessage, content }) {
  const currentFile = await getFileState(token, owner, repo, branch, filePath);
  const payload = {
    message: commitMessage,
    content: encodeBase64Utf8(content),
    branch,
    ...(currentFile?.sha ? { sha: currentFile.sha } : {})
  };
  return putJson(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    payload,
    { token }
  );
}
