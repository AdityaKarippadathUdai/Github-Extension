import fs from "node:fs";
import path from "node:path";
import { build as esbuildBuild } from "esbuild";
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

function normalizePopupHtml(outDir) {
  const source = path.join(outDir, "public", "popup.html");
  const target = path.join(outDir, "popup.html");
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(source, target);
  }
  fs.rmSync(path.join(outDir, "public"), { recursive: true, force: true });
}

async function buildFirefoxBackground(outDir) {
  await esbuildBuild({
    entryPoints: [path.resolve("src/background/background.js")],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    outfile: path.join(outDir, "assets", "background.js"),
    sourcemap: false,
    minify: false,
    logLevel: "silent",
    define: {
      "process.env.NODE_ENV": '"production"'
    }
  });

  fs.rmSync(path.join(outDir, "assets", "background.js.map"), { force: true });
}

async function buildOnce(outDir) {
  await build({
    configFile: path.resolve("vite.config.js"),
    mode: "production",
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
    normalizePopupHtml(chromeDir);
    writeManifest(chromeDir, "chrome");
    return;
  }

  if (target === "firefox") {
    await buildOnce(firefoxDir);
    copyDir(path.resolve("public/icons"), path.join(firefoxDir, "icons"));
    normalizePopupHtml(firefoxDir);
    await buildFirefoxBackground(firefoxDir);
    writeManifest(firefoxDir, "firefox");
    return;
  }

  await buildOnce(chromeDir);
  copyDir(path.resolve("public/icons"), path.join(chromeDir, "icons"));
  normalizePopupHtml(chromeDir);
  writeManifest(chromeDir, "chrome");

  copyDir(chromeDir, firefoxDir);
  normalizePopupHtml(firefoxDir);
  await buildFirefoxBackground(firefoxDir);
  writeManifest(firefoxDir, "firefox");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
