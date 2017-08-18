const buttons = document.querySelectorAll(".button");
const display = document.querySelector("#display");
const strictButton = document.querySelector("#strict");
const startButton = document.querySelector("#start");

startButton.addEventListener("click", handlePowerButton);

let strictMode = false;
let power = false;

let colorsSequence = [];
let playerSequence = [];

let timeouts = [];

//let state = "listening";
let errorTimeout;

//after 3 seconds without pressing any button, error occurs
const startErrorTimeout = () => (errorTimeout = setTimeout(error, 3000));

const setPlayState = () => {
  enableColorsButton();
  startErrorTimeout();
};
/*const setListeningState = () => (state = "listening");

const isInListeningState = () => state === "listening";*/

const checkLength = () => colorsSequence.length == playerSequence.length;

function pushButton() {
  //clear the error timeout
  clearInterval(errorTimeout);

  const color = this.dataset.color;
  //add the pushed color in the player sequence
  playerSequence.push(color);
  playSound(color)();

  //check if the player sequence is right
  if (!checkSequence()) {
    error();
    return;
  }

  //if the sequence is complete start the automatic sequence
  if (checkLength()) {
    //setListeningState();
    disableColorsButtons();
    timeouts.push(setTimeout(simonTime, 1500));
    return;
  }

  startErrorTimeout();
}

/* if the function is called without parameter,
the current color sequence is played */
function playSequence(sequence = colorsSequence) {
  display.textContent = sequence.length;
  timeouts.push(setTimeout(setPlayState, 1000 * (sequence.length + 1)));
  sequence.forEach((color, index) =>
    timeouts.push(setTimeout(playSound(color), 1000 * (index + 1)))
  );
}

function playSound(color) {
  const button = document.querySelector(`.button[data-color="${color}"]`);
  const audio = document.querySelector(`audio[data-color="${color}"]`);
  audio.currentTime = 0;
  return function() {
    audio.play();
    buttons.forEach(x => x.classList.remove("active"));
    button.classList.add("active");
  };
}

function pickARandomColor() {
  const randomNumber = Math.floor(Math.random() * 4);
  switch (randomNumber) {
    case 0:
      return "red";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "yellow";
  }
}

function simonTime() {
  playerSequence = [];
  const newColor = pickARandomColor();
  colorsSequence.push(newColor);
  playSequence();
}

function checkSequence() {
  return playerSequence.every((x, idx) => x === colorsSequence[idx]);
}

function error() {
  disableColorsButtons();
  playerSequence = [];
  display.textContent = "!!";
  if (strictMode) {
    resetGame();
    timeouts.push(setTimeout(simonTime, 2000));
    return;
  } else timeouts.push(setTimeout(playSequence, 2000));
}

function toggleStrictMode() {
  strictMode = !strictMode;
}

function resetGame() {
  colorsSequence = [];
}

function powerOff() {
  //clear all timeouts to stop any ongoing sequence
  timeouts.forEach(x => clearTimeout(x));
  clearTimeout(errorTimeout);

  //disable any button
  disableColorsButtons();
  turnOutColorsButtons();

  //lid off the display
  display.textContent = "";
}

function powerOn() {
  enableColorsButton
  buttons.forEach(x => x.addEventListener("transitionend", turnOut));
  strictButton.addEventListener("click", toggleStrictMode);

  strictMode = false;
  resetGame();
  simonTime();
}

function handlePowerButton() {
  power = !power;
  power ? powerOn() : powerOff();
}

function enableColorsButton() {
  buttons.forEach(x => {
    x.addEventListener("click", pushButton);
  });
}

function disableColorsButtons() {
  //disable any button
  buttons.forEach(x => x.removeEventListener("click", pushButton));
}

function turnOut(button = this) {
  this.classList.remove("active");
}

function turnOutColorsButtons() {
  buttons.forEach(x => clearTimeout(x));
}
