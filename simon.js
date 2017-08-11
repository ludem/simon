const buttons = document.querySelectorAll('.button');
buttons.forEach(x => x.addEventListener('click', pushButton));

let colorsSequence = [];

let playerSequence = [];

const checkLength = () => colorsSequence.length == playerSequence.length;

function pushButton() {
    const color = this.dataset.color;
    playerSequence.push(color);
    playSound(color)();
    if (!checkSequence()) error();
    if (checkLength()) simonTime();
}

function playSequence(sequence) {
    sequence.forEach(
        function (color, index) {
            let play = playSound(color);
            setTimeout(play, 1000 * (index + 1));
        });
}

function playSound(color) {  
    console.log(color);
    const audio = document.querySelector(`audio[data-color="${color}"]`);
    audio.currentTime = 0;
    return audio.play.bind(audio);
}

function pickARandomColor() {
    const randomNumber = Math.floor(Math.random() * 3);
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
    console.log('error');
    playerSequence = [];
}

simonTime();