# GitHub Commit Extension

Production-ready cross-browser browser extension for creating and updating GitHub files directly from a popup.

## Features

- Save a GitHub Personal Access Token
- Load and search repositories from `GET /user/repos`
- Load branches from `GET /repos/{owner}/{repo}/branches`
- Create or update files with `PUT /repos/{owner}/{repo}/contents/{path}`
- Persist token, last repo, last branch, last file path, recent repos, and recent commit messages
- Chrome, Edge, Brave, Opera, and Firefox support from one codebase

## Tech Stack

- React 19
- Vite
- JavaScript
- Manifest V3
- GitHub REST API
- React Context API
- CSS Modules
- Browser Storage API
- Mozilla WebExtension Polyfill

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite serves the popup entry at `public/popup.html` during development.

## Build

```bash
npm run build
```

This generates:

- `dist-chrome/`
- `dist-firefox/`

Chrome and Firefox manifests are generated automatically during the build.

## Load the extension

- Chrome / Edge / Brave / Opera: load `dist-chrome/` as an unpacked extension
- Firefox: load `dist-firefox/` from `about:debugging`

## GitHub token scopes

Use a token with repository write access. For fine-grained tokens, allow contents read/write and repository metadata access for the target repository.

## Notes

- The extension stores secrets only in `storage.local`
- No backend server is required
- The commit flow works entirely through the GitHub REST API
