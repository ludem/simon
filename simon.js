const buttons = document.querySelectorAll('.button');
const display = document.querySelector('#display');
const strictButton = document.querySelector('#strict');

let strictMode = false;

buttons.forEach(x => x.addEventListener('click', pushButton));
buttons.forEach(x => x.addEventListener('transitionend', putOff));
strictButton.addEventListener('click', toggleStrictMode);

let colorsSequence = [];
let playerSequence = [];
let state ="listening";
let buttonsPressedCounter = 0;
let errorTimeout;

//after 3 seconds without pressing any button, error occurs
const startErrorTimeout = () => errorTimeout = setTimeout(error, 3000);

const setPlayState = () => {
    state = 'play';
    startErrorTimeout();
}
const setListeningState = () => state = 'listening';

const isInListeningState = () => state === 'listening';

const checkLength = () => colorsSequence.length == playerSequence.length;

function putOff () {
    this.classList.remove('active');
}

function pushButton() {
    //clear the error timeout
    clearInterval(errorTimeout);

    //if a button is pressed during the automatic playing do nothing
    if (isInListeningState()) return;

    const color = this.dataset.color;
    playerSequence.push(color);
    playSound(color)();

    //check if the player sequence is right
    if (!checkSequence()) {
        error();
        return;
    }

    //if the sequence is complete start the automatic sequence
    if (checkLength()) {
        setListeningState();
        setTimeout(simonTime, 1500);
        return;
    }

    startErrorTimeout();
}

function playSequence() {
    display.textContent = colorsSequence.length;
    setTimeout(setPlayState, 1000 * (colorsSequence.length + 1));
    colorsSequence.forEach((color, index) => setTimeout(playSound(color), 1000 * (index + 1)));
}
     
function playSound(color) {  
    const button = document.querySelector(`.button[data-color="${color}"]`)
    const audio = document.querySelector(`audio[data-color="${color}"]`);
    audio.currentTime = 0;
    return function () {
        audio.play();
        buttons.forEach(x => x.classList.remove('active'));
        button.classList.add('active');
    };
}

function pickARandomColor() {
    const randomNumber = Math.floor(Math.random() * 4);
    switch (randomNumber) {
        case 0 : return 'red';
        case 1 : return 'blue';
        case 2 : return 'green';
        case 3 : return 'yellow';
    }
}

function simonTime() {
    playerSequence = [];
    const newColor = pickARandomColor();
    colorsSequence.push(newColor);
    playSequence();
}

function checkSequence(){
    return playerSequence.every((x, idx) => x === colorsSequence[idx]);
}

function error() {
    setListeningState();
    console.error('error');
    playerSequence = [];
    display.textContent = '!!';
    if (strictMode) {
        resetGame();
        setTimeout(simonTime, 2000);
        return;
    } else setTimeout(playSequence, 2000);
}

function toggleStrictMode() {
    strictMode = !strictMode;
}

function resetGame() {
    colorsSequence = [];
}

simonTime();