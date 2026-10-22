# PIG Dice Game

A two-player browser game from my JavaScript coursework. Roll to build a turn total, or hold to bank it. A roll of one loses the unbanked total and changes turns; the first player to reach 100 wins.

[Live demo](https://grimsyntaxcloud.github.io/Dice-game/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What it does

Player turns are tracked independently of display names, so two players may share a name. Starting a new game clears both scores and starts with player one.

## How it works

The interface is static HTML and CSS, with native JavaScript in `dice.js`. There are no npm dependencies, API keys, accounts, backend services or paid libraries.

No game state is saved between page visits.

## Run locally

Use Python 3 to serve this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No package installation is required to use the app.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

The regression tests cover the repaired behavior using lightweight DOM stand-ins. They do not replace a browser layout check. GitHub Actions runs them on pushes and pull requests. Dependabot checks the Actions used by CI weekly; there is no application dependency manifest to scan.

## Hosting and provenance

GitHub Pages serves the default branch for free. This remains an educational project by Andres Macias; the original exercise structure is retained. The October 2026 maintenance pass documents local setup and adds targeted correctness fixes and regression coverage without redesigning the interface.
