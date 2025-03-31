# 🧩 My Utils Monorepo

This is a scalable monorepo for reusable utilities, React hooks, components, and internal tools.

Built with:
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Changesets](https://github.com/changesets/changesets) for versioning
- [Storybook](https://storybook.js.org/) for UI previews
- [Tsup](https://tsup.egoist.dev/) for fast builds
- [ESLint v9 + Prettier](https://eslint.org/docs/latest/use/configure/) with flat config

---

## 📁 Project Structure

```
/
├── packages/         # All internal libraries
│   ├── core-utils/
│   ├── react-hooks/
│   └── react-components/
├── scripts/          # Custom CLI scripts
├── .changeset/       # Changeset release info
├── .storybook/       # Storybook config
```

---

## 🧑‍💻 Local Development

```bash
pnpm install      # install everything
pnpm dev          # start dev mode in all packages (if configured)
pnpm build        # build all packages
pnpm lint         # run ESLint
pnpm format       # check Prettier formatting
```

---

## 🧱 Creating a New Package

```bash
pnpm create       # runs scripts/create-package.ts
```

Follow the prompts to scaffold a new util/component package.

---

## 📦 Publishing / Releasing

We use [Changesets](https://github.com/changesets/changesets) for controlled releases.

### 🔁 Per PR

> Contributors must run this locally and commit the changeset markdown:

```bash
pnpm changeset
```

Then push the `.md` file with the PR. This marks the package for release.

---

### 🚀 Manual Release (maintainers only)

After PRs are merged to `main`, a maintainer triggers the release:

1. Go to **GitHub → Actions → Manual Release**
2. Click **Run workflow**
3. CI will:
    - Bump versions
    - Tag + commit
    - Publish to npm
    - Create GitHub release from changelog

---

## 🔐 Permissions & CI

- Publishing requires a `GH_PAT` with `repo + workflow` scope (set as a GitHub secret)
- NPM token must be added as `NPM_TOKEN` secret
- Only maintainers can trigger production releases

---

## 📘 Storybook

To preview shared components:

```bash
pnpm storybook
```

Visit [http://localhost:6006](http://localhost:6006)

---

## 💡 Ideas for Future

- Add Ladle for faster previews
- Add e2e tests per package
- Auto-create changelog PRs with Changesets bot

---

## 📜 License

MIT – use freely in your own apps

