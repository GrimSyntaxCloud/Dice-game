# PIG Dice Game

A two-player browser game from my JavaScript coursework, redesigned as a playful physical arcade table. Roll to build your turn total, or hold to bank it. A roll of one loses the unbanked points and changes turns; the first player to bank 100 wins.

[Play PIG](https://grimsyntaxcloud.github.io/Dice-game/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## Play

- Edit either player name directly on the score cards. Empty names fall back to Player 1 and Player 2; identical names are supported because turns use player identities.
- Roll a 2–6 to add points to the current turn. Keep rolling or choose **Hold & bank** to save them and pass the turn.
- Roll a 1 to lose only the current turn’s points. Previously banked points remain safe.
- The first player to bank at least 100 wins. **Play again / New game** resets both scores, keeps your names, and starts with player one.

The winning score remains visible until a rematch starts. A roll animation locks the roll/hold controls briefly, so repeated clicks cannot take extra turns. Reset cancels an unfinished animation safely.

## Design and accessibility

Ivory and lime score cards sit on a cobalt table, with a red die drawn entirely in CSS. Native transforms and the Web Animations API give rolls, banked points and turn changes tactile feedback. There are no downloaded fonts, image assets, animation packages or runtime dependencies.

The layout adapts to small phones. Controls work with keyboard focus, results are announced through a live status region, and active players are identified in text as well as color. **Pause motion** stops decorative movement; the interface also honors the system reduced-motion preference. Motion never determines the die result.

## How it works

- `game.mjs` contains pure functions for the six-sided die, rolling, banking, switching players and winning.
- `dice.js` connects those rules to the interface and controls the brief roll-animation lock.
- `index.html`, `styles.css` and `table.css` provide the responsive board and CSS die.
- `test/game.test.mjs` verifies game rules without a browser or third-party packages.

There are no accounts, payments, network opponents, API keys or backend services. Names and scores stay in this tab’s memory and are cleared on refresh. This is a casual game, not a gambling service.

## Run locally

Serve the directory with Python 3:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. A server is needed because the JavaScript uses native ES modules. No package installation or build is needed.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

Eight tests cover unbanked points, busts, separate player scores, the win threshold and post-win lock, reset state, valid die faces, repeated-click locking, and resetting an unfinished roll. Browser checks additionally cover roll/hold/reset, names, motion controls and responsive layouts. GitHub Actions runs the rule tests on pushes and pull requests. Dependabot checks the GitHub Actions weekly; there is no application dependency manifest.

## Hosting and provenance

GitHub Pages serves this existing project for free. The original JavaScript coursework game is by Andres Macias. The October 2026 redesign was developed with AI assistance while retaining the two-player PIG rules, editable names and reset behavior. All new visual artwork is native CSS; no third-party artwork or asset license is required. The repository does not grant an additional open-source license.
