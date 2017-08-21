const buttons = document.querySelectorAll(".button");
const display = document.querySelector("#display");
const strictButton = document.querySelector("#strict");
const strictLed = document.querySelector(".led");
const powerButton = document.querySelector("#power");
const intervalTime = 1000;
const startSequence = [
  "red",
  "blue",
  "yellow",
  "green",
  "red",
  "blue",
  "yellow",
  "green"
];
powerButton.addEventListener("click", handlePowerButton);
buttons.forEach(x => x.addEventListener("transitionend", turnOut));

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
function playSequence(sequence = colorsSequence, timing = intervalTime, text = colorsSequence.length) {
  display.textContent = text;
  sequence.forEach((color, index) =>
    timeouts.push(setTimeout(playSound(color), timing * (index + 1)))
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
  display.textContent = colorsSequence.length;
  timeouts.push(setTimeout(setPlayState, 1000 * (colorsSequence.length + 1)));
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
    timeouts.push(setTimeout(simonTime, 3000));
    return;
  } else {
    timeouts.push(setTimeout(repeatSequence, 2000))
  };
}

function repeatSequence() {
  playSequence();
  timeouts.push(setTimeout(setPlayState, 1000 * (colorsSequence.length + 1)));
}

function toggleStrictMode() {
  strictMode = !strictMode;
  strictMode ? turnOnStrictLed() : turnOutStrictLed();
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
  disableStrictButton();

  turnOutColorsButtons();

  //turn out the display
  turnOutDisplay();

  //turn out the strict led
  turnOutStrictLed();
}

function powerOn() {
  //playSequence(startSequence, 200, 'GO');  
  enableStrictButton();
  enableColorsButton();
  turnOnDisplay();

  strictButton.addEventListener("click", toggleStrictMode);

  strictMode = false;
  resetGame();

  timeouts.push(setTimeout(simonTime, 1000));
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

function enableStrictButton() {
  strictButton.addEventListener('click', toggleStrictMode);
}

function disableStrictButton() {
    strictButton.removeEventListener('click', toggleStrictMode);
}

function turnOut(button = this) {
  this.classList.remove("active");
}

function turnOutColorsButtons() {
  buttons.forEach(x => clearTimeout(x));
}

function turnOnDisplay() {
  display.classList.add("on");
}

function turnOutDisplay() {
  display.classList.remove("on");
  display.textContent = "--";
}

function turnOnStrictLed() {
  strictLed.classList.add("on");
}

function turnOutStrictLed() {
  strictLed.classList.remove("on");
}
