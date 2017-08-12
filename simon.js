const buttons = document.querySelectorAll('.button');
buttons.forEach(x => x.addEventListener('click', pushButton));
buttons.forEach(x => x.addEventListener('transitionend', putOff));
let colorsSequence = [];

let playerSequence = [];

const checkLength = () => colorsSequence.length == playerSequence.length;

function putOff (e) {
    console.log(e);
    this.classList.remove('active');
}
function pushButton() {
    const color = this.dataset.color;
    playerSequence.push(color);
    playSound(color)();
    if (!checkSequence()) error();
    if (checkLength()) {
        console.log('OK');
        simonTime();
    }
}

const playSequence = sequence  => {
    sequence.forEach((color, index) => setTimeout(playSound(color), 1000 * (index + 2)));
}
     
function playSound(color) {  
    console.log(color);
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
    playSequence(colorsSequence);
}

function checkSequence(){
    return playerSequence.every((x, idx) => x === colorsSequence[idx]);
}

function error() {
    console.error('error');
    playerSequence = [];
    playSequence(colorsSequence);
}

simonTime();