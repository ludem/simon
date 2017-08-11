const buttons = document.querySelectorAll('.button');
buttons.forEach(x => x.addEventListener('click', pushButton));

const buttonsSequence = ['red','green','yellow','blue'];

function pushButton() {
    const color = this.dataset.color;
    playSound(color)();
}

function playSequence(sequence) {
    sequence.forEach(
        function (color, index) {
            let play = playSound(color);
            setTimeout(play, 1000 * index);
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

playSequence(buttonsSequence);
/*
const audio = document.querySelector('audio');

audio.currentTime = 0;
audio.play();*/