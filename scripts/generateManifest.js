import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function generateManifest(targetBrowser) {
  const basePath = path.resolve("public/manifest.base.json");
  const base = readJson(basePath);

  if (targetBrowser !== "firefox") {
    return { ...base };
  }

  const hostPermissions = Array.isArray(base.host_permissions) ? base.host_permissions : [];
  const permissions = Array.isArray(base.permissions) ? base.permissions : [];
  const action = base.action || {};

  return {
    manifest_version: 2,
    name: base.name,
    description: base.description,
    version: base.version,
    browser_action: {
      default_title: action.default_title,
      default_popup: action.default_popup
    },
    background: {
      scripts: ["assets/background.js"]
    },
    permissions: Array.from(new Set([...permissions, ...hostPermissions])),
    content_security_policy: "script-src 'self'; object-src 'self';",
    browser_specific_settings: {
      gecko: {
        id: "github-commit-extension@example.com",
        strict_min_version: "128.0",
        data_collection_permissions: {
          required: ["none"],
          optional: []
        }
      }
    }
  };
}
