export function createGame() {
  return { scores: [0, 0], active: 0, turn: 0, die: null, winner: null };
}
export function rollGame(state, value) {
  if (!Number.isInteger(value) || value < 1 || value > 6)
    throw new RangeError("A die has six faces.");
  if (state.winner !== null) return state;
  if (value === 1)
    return { ...state, active: 1 - state.active, turn: 0, die: 1 };
  return { ...state, turn: state.turn + value, die: value };
}
export function holdGame(state) {
  if (state.winner !== null) return state;
  const scores = [...state.scores];
  scores[state.active] += state.turn;
  const winner = scores[state.active] >= 100 ? state.active : null;
  return {
    ...state,
    scores,
    turn: 0,
    active: winner === null ? 1 - state.active : state.active,
    winner,
  };
}
export function randomFace(random = Math.random) {
  return Math.floor(random() * 6) + 1;
}
