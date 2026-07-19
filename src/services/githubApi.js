import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../utils/constants.js";

function normalizeError(status, data, fallbackMessage) {
  const message = data?.message || fallbackMessage;
  const error = new Error(message);
  error.status = status;
  error.code = data?.code || (status >= 500 ? "server_error" : "github_error");
  return error;
}

export async function request(path, { method = "GET", token, body, headers = {}, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
      if (response.status === 401) throw normalizeError(401, data, "Invalid or expired GitHub token.");
      if (response.status === 403) {
        if (response.headers.get("x-ratelimit-remaining") === "0") {
          throw normalizeError(403, data, "GitHub rate limit reached. Please try again later.");
        }
        throw normalizeError(403, data, "GitHub rejected the request. Check token scopes and repository access.");
      }
      if (response.status === 404) throw normalizeError(404, data, "The requested repository, branch, or file could not be found.");
      if (response.status === 409) throw normalizeError(409, data, "GitHub reported a conflict. Refresh the file state and try again.");
      if (response.status === 422) throw normalizeError(422, data, "GitHub could not process the commit. Check the file path and content.");
      throw normalizeError(response.status, data, "GitHub API request failed.");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("The GitHub request timed out. Please try again.");
      timeoutError.code = "timeout";
      throw timeoutError;
    }
    if (!navigator.onLine || error instanceof TypeError) {
      const offlineError = new Error("Connection lost. Check your network and try again.");
      offlineError.code = "offline";
      throw offlineError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getJson(path, options = {}) {
  return request(path, { ...options, method: "GET" });
}

export async function postJson(path, body, options = {}) {
  return request(path, { ...options, method: "POST", body });
}

export async function putJson(path, body, options = {}) {
  return request(path, { ...options, method: "PUT", body });
}

export async function patchJson(path, body, options = {}) {
  return request(path, { ...options, method: "PATCH", body });
}

export async function deleteJson(path, options = {}) {
  return request(path, { ...options, method: "DELETE" });
}
