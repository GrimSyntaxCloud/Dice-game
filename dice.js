"use strict";
var $ = function (id) {
  return document.getElementById(id);
};

var getRandomNumber = function (max) {
  var random;
  if (!isNaN(max)) {
    random = Math.random();
    random = Math.floor(random * max);
    random = random + 1;
  }
  return random;
};
var activePlayer = 1;

var changePlayer = function () {
  activePlayer = activePlayer === 1 ? 2 : 1;
  $("current").firstChild.nodeValue = $("player" + activePlayer).value;

  $("die").value = "0";
  $("total").value = "0";
  $("roll").focus();
};

var newGame = function () {
  $("score1").value = "0";
  $("score2").value = "0";
  if ($("player1").value.trim() == "" || $("player2").value.trim() == "") {
    $("turn").removeAttribute("class");
    alert("Please enter two player names.");
  } else {
    $("turn").setAttribute("class", "open");
    activePlayer = 2;
    changePlayer();
  }
};
var rollDice = function () {
  var total = parseInt($("total").value);
  var die = getRandomNumber(6);
  if (die == 1) {
    total = 0;
    changePlayer();
  } else {
    total = total + die;
  }
  $("die").value = die;
  $("total").value = total;
};
var holdTurn = function () {
  var score;
  var total = parseInt($("total").value);
  if (activePlayer === 1) {
    score = $("score1");
  } else {
    score = $("score2");
  }
  score.value = parseInt(score.value) + total;
  if (score.value >= 100) {
    alert($("current").firstChild.nodeValue + " WINS!");
    newGame();
  } else {
    changePlayer();
  }
};
window.onload = function () {
  $("new_game").onclick = newGame;
  $("roll").onclick = rollDice;
  $("hold").onclick = holdTurn;
};
