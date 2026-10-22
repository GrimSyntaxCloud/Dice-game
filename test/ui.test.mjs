import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import { createGame, rollGame, holdGame } from "../game.mjs";

function interfaceHarness() {
  const elements = new Map();
  let rolls = 0;
  let pending;
  function element(id) {
    if (!elements.has(id))
      elements.set(id, {
        value: id === "player1" || id === "player2" ? "Alex" : "",
        textContent: "",
        dataset: {},
        style: {},
        disabled: false,
        classList: { toggle() {}, add() {}, remove() {} },
        listeners: {},
        addEventListener(event, fn) {
          this.listeners[event] = fn;
        },
        setAttribute() {},
        animate() {},
        focus() {},
      });
    return elements.get(id);
  }
  const context = vm.createContext({
    createGame,
    rollGame,
    holdGame,
    randomFace() {
      rolls++;
      return 6;
    },
    document: { getElementById: element, body: element("body") },
    matchMedia() {
      return { matches: false, addEventListener() {} };
    },
    setTimeout(fn) {
      pending = fn;
      return 1;
    },
    clearTimeout() {
      pending = undefined;
    },
  });
  const code = fs
    .readFileSync(new URL("../dice.js", import.meta.url), "utf8")
    .replace(/^import[^;]+;\s*/, "");
  vm.runInContext(code, context);
  return {
    element,
    click(id) {
      element(id).listeners.click();
    },
    finishRoll() {
      const fn = pending;
      pending = undefined;
      fn?.();
    },
    rolls: () => rolls,
  };
}

test("an animated roll locks repeated rolls and holds until its single result", () => {
  const ui = interfaceHarness();
  ui.click("roll");
  ui.click("roll");
  ui.click("hold");
  assert.equal(ui.rolls(), 1);
  assert.equal(ui.element("roll").disabled, true);
  assert.equal(ui.element("hold").disabled, true);
  ui.finishRoll();
  assert.equal(Number(ui.element("total").textContent), 6);
  assert.equal(Number(ui.element("score1").textContent), 0);
  assert.equal(ui.element("hold").disabled, false);
  ui.click("hold");
  assert.equal(Number(ui.element("score1").textContent), 6);
  assert.equal(ui.element("tag2").textContent, "YOUR TURN");
});

test("reset cancels an unfinished roll and preserves editable names", () => {
  const ui = interfaceHarness();
  ui.click("roll");
  ui.click("new_game");
  ui.finishRoll();
  assert.equal(Number(ui.element("total").textContent), 0);
  assert.equal(Number(ui.element("score1").textContent), 0);
  assert.equal(ui.element("tag1").textContent, "YOUR TURN");
  assert.equal(ui.element("roll").disabled, false);
  assert.equal(ui.element("player1").value, "Alex");
});
