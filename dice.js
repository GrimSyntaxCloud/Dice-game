import { createGame, rollGame, holdGame, randomFace } from "./game.mjs";
const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let state = createGame();
let rolling = false;
let animationTimer;
let paused = reduceMotion.matches;
const name = (index) =>
  $("player" + (index + 1)).value.trim() || "Player " + (index + 1);
function motion() {
  document.body.classList.toggle("motion-paused", paused);
  $("motion").setAttribute("aria-pressed", String(paused));
  $("motion").textContent = paused ? "Resume motion ▷" : "Pause motion Ⅱ";
}
function render(message) {
  for (let i = 0; i < 2; i++) {
    const number = i + 1;
    $("score" + number).textContent = state.scores[i];
    $("card" + number).classList.toggle("active", state.active === i);
    $("card" + number).classList.toggle("winner", state.winner === i);
    $("tag" + number).textContent =
      state.winner === i
        ? "WINNER!"
        : state.active === i
          ? "YOUR TURN"
          : "ON DECK";
    $("progress" + number).style.width = Math.min(state.scores[i], 100) + "%";
  }
  $("total").textContent = state.turn;
  $("current").textContent =
    state.winner !== null
      ? name(state.winner) + " TAKES IT ALL!"
      : name(state.active) + ", YOU’RE UP.";
  $("die").dataset.face = state.die ?? 1;
  $("die-result").textContent =
    state.die === null ? "DIE: READY" : "LAST ROLL: " + state.die;
  $("roll").disabled = rolling || state.winner !== null;
  $("hold").disabled = rolling || state.winner !== null;
  $("new_game").textContent =
    state.winner !== null ? "↻ Play again" : "↻ New game";
  if (message) $("status").textContent = message;
}
function pulse(kind) {
  $("table").classList.remove("banked", "busted");
  // A new animation instance avoids layout-forcing reads and never changes game state.
  if (!paused && !reduceMotion.matches)
    $("total").animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.15)" },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  $("table").classList.add(kind);
}
$("roll").addEventListener("click", () => {
  if (rolling || state.winner !== null) return;
  rolling = true;
  const value = randomFace();
  const player = name(state.active);
  const lost = state.turn;
  render("Rolling…");
  $("die").classList.add("rolling");
  animationTimer = setTimeout(
    () => {
      state = rollGame(state, value);
      rolling = false;
      $("die").classList.remove("rolling");
      pulse(value === 1 ? "busted" : "rolled");
      render(
        value === 1
          ? `${player} rolled 1. ${lost} unbanked points gone. ${name(state.active)}’s turn.`
          : `Rolled ${value}. ${state.turn} points at risk. Roll again or bank them.`,
      );
    },
    paused || reduceMotion.matches ? 0 : 460,
  );
});
$("hold").addEventListener("click", () => {
  if (rolling || state.winner !== null) return;
  const player = name(state.active);
  const banked = state.turn;
  state = holdGame(state);
  pulse("banked");
  render(
    state.winner !== null
      ? `${player} wins with ${state.scores[state.winner]} points! Select Play again for a rematch.`
      : `${player} banked ${banked}. ${name(state.active)}, your move.`,
  );
  if (state.winner !== null) $("new_game").focus();
});
$("new_game").addEventListener("click", () => {
  clearTimeout(animationTimer);
  rolling = false;
  state = createGame();
  $("die").classList.remove("rolling");
  $("table").classList.remove("busted", "banked", "rolled");
  render("Fresh game. " + name(0) + ", roll to get things going.");
  $("roll").focus();
});
for (const id of ["player1", "player2"])
  $(id).addEventListener("input", () => render());
$("motion").addEventListener("click", () => {
  paused = !paused;
  motion();
});
reduceMotion.addEventListener("change", () => {
  paused = reduceMotion.matches;
  motion();
});
motion();
render();
