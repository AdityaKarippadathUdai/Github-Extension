import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
import { generateManifest } from "./generateManifest.js";

const target = process.argv[2];

function rm(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function writeManifest(outDir, browserTarget) {
  const manifest = generateManifest(browserTarget);
  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
}

async function buildOnce(outDir) {
  await build({
    configFile: path.resolve("vite.config.js"),
    build: {
      outDir
    }
  });
}

async function main() {
  const chromeDir = path.resolve("dist-chrome");
  const firefoxDir = path.resolve("dist-firefox");

  rm(chromeDir);
  rm(firefoxDir);

  if (target === "chrome") {
    await buildOnce(chromeDir);
    copyDir(path.resolve("public/icons"), path.join(chromeDir, "icons"));
    writeManifest(chromeDir, "chrome");
    return;
  }

  if (target === "firefox") {
    await buildOnce(firefoxDir);
    copyDir(path.resolve("public/icons"), path.join(firefoxDir, "icons"));
    writeManifest(firefoxDir, "firefox");
    return;
  }

  await buildOnce(chromeDir);
  copyDir(path.resolve("public/icons"), path.join(chromeDir, "icons"));
  writeManifest(chromeDir, "chrome");

  copyDir(chromeDir, firefoxDir);
  writeManifest(firefoxDir, "firefox");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
