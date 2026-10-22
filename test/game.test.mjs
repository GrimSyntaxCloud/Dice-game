import test from "node:test";
import assert from "node:assert/strict";
import { createGame, rollGame, holdGame, randomFace } from "../game.mjs";
test("rolling adds unbanked points without changing banked scores", () => {
  let state = createGame();
  state = rollGame(rollGame(state, 4), 6);
  assert.equal(state.turn, 10);
  assert.deepEqual(state.scores, [0, 0]);
  assert.equal(state.active, 0);
});
test("a one loses only this turn and passes play", () => {
  let state = holdGame(rollGame(createGame(), 6));
  state = rollGame(rollGame(state, 5), 1);
  assert.deepEqual(state.scores, [6, 0]);
  assert.equal(state.turn, 0);
  assert.equal(state.active, 0);
  assert.equal(state.die, 1);
});
test("hold banks separately by player identity, not display name", () => {
  let state = holdGame(rollGame(createGame(), 5));
  state = holdGame(rollGame(state, 6));
  assert.deepEqual(state.scores, [5, 6]);
  assert.equal(state.active, 0);
  assert.equal(state.turn, 0);
});
test("only banked points win; reaching or exceeding 100 ends play", () => {
  let state = { ...createGame(), scores: [94, 12] };
  state = rollGame(state, 6);
  assert.equal(state.winner, null);
  state = holdGame(state);
  assert.equal(state.winner, 0);
  assert.equal(state.scores[0], 100);
  assert.equal(holdGame(state), state);
  assert.equal(rollGame(state, 1), state);
  assert.equal(
    holdGame({ ...createGame(), scores: [99, 0], turn: 6 }).scores[0],
    105,
  );
});
test("new games start with zero scores and the first player", () => {
  assert.deepEqual(createGame(), {
    scores: [0, 0],
    active: 0,
    turn: 0,
    die: null,
    winner: null,
  });
});
test("all six die faces are reachable and invalid results are rejected", () => {
  assert.deepEqual(
    Array.from({ length: 6 }, (_, i) => randomFace(() => (i + 0.5) / 6)),
    [1, 2, 3, 4, 5, 6],
  );
  for (const value of [0, 7, 1.5, NaN])
    assert.throws(() => rollGame(createGame(), value), RangeError);
});
