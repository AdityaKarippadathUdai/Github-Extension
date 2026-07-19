import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function generateManifest(targetBrowser) {
  const basePath = path.resolve("public/manifest.base.json");
  const base = readJson(basePath);

  const manifest = { ...base };

  if (targetBrowser === "firefox") {
    manifest.browser_specific_settings = {
      gecko: {
        id: "github-commit-extension@example.com",
        strict_min_version: "128.0"
      }
    };
  }

  return manifest;
}
