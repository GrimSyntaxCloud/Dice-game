import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
const elements = Object.fromEntries(
  [
    "player1",
    "player2",
    "current",
    "score1",
    "score2",
    "die",
    "total",
    "roll",
    "turn",
  ].map((id) => [
    id,
    {
      value: "0",
      firstChild: { nodeValue: "" },
      focus() {},
      setAttribute() {},
      removeAttribute() {},
    },
  ]),
);
const context = vm.createContext({
  window: {},
  document: { getElementById: (id) => elements[id] },
  alert() {},
});
vm.runInContext(
  fs.readFileSync(new URL("../dice.js", import.meta.url), "utf8"),
  context,
);
test("players with identical names still receive separate turns and scores", () => {
  elements.player1.value = "Alex";
  elements.player2.value = "Alex";
  context.newGame();
  elements.total.value = "7";
  context.holdTurn();
  assert.equal(Number(elements.score1.value), 7);
  elements.total.value = "9";
  context.holdTurn();
  assert.equal(Number(elements.score2.value), 9);
  context.newGame();
  assert.equal(context.activePlayer, 1);
  assert.equal(Number(elements.score1.value), 0);
  assert.equal(Number(elements.total.value), 0);
});
