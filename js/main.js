const playBtn = document.getElementById('play');
const board = document.querySelector('.board');
const tiles = document.querySelectorAll('[data-tile]');
const highScoreDisplay = document.getElementById('high-score');
const levelDislay = document.getElementById('level');

let colors = [];
let colorsPattern = [];
let clickCount = 0;
let highScore = 0;
let level = 0;

function getColors() {
    for (let i = 0; i < tiles.length; i++) {
        colors.push(tiles[i].getAttribute('data-tile'));
    }
}

function startDemonstration() {
    console.log('Starting new Demo')
    addRandomColor();
    console.log(colorsPattern);
    playCorlorPattern(colorsPattern);
}

function checkUserInput() {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', function () {
            selectedColor = tiles[i].getAttribute('data-tile');
            playColorAudio(selectedColor);
            
            if (selectedColor != colorsPattern[clickCount]) {
                wrongPlay();
                return;
            }

            clickCount++;
            console.log(clickCount)
        })
    }
}

function playColorAudio(color) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
}

function wrongPlay() {
    const wrongAudio = new Audio('/sounds/wrong.mp3');
    const gameOverAudio = new Audio('/sounds/game-over.wav');

    setTimeout(() => {
        wrongAudio.play();
    }, 1000);
    
    setTimeout(() => {
        gameOverAudio.play();
    }, 3000);

    setTimeout(() => {
        location.reload();
    }, 4000);
}

function adjustHighScore(score) {
    if (score > highScore) {
        highScoreDisplay.innerHTML = score;
        localStorage.setItem('highScore', JSON.stringify(score));
    }
}

function loadHighScore() {
    const savedHighScore = JSON.parse(localStorage.getItem('highScore'));
    if (savedHighScore) {
        adjustHighScore(savedHighScore);
    }        
}

function adjustLevel(score) {
    if (score > level) {
        levelDislay.innerHTML = score;
    }
}

function activateTile(color) {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].getAttribute('data-tile') === color) {
            tiles[i].classList.toggle('inactive');
            playColorAudio(color);
            setTimeout(() => {
                tiles[i].classList.toggle('inactive');
            }, 1000);
        }
    }
}

function playCorlorPattern(colorsPattern) {
    for (let i = 0; i < colorsPattern.length; i++) {
        activateTile(colorsPattern[i]);
    }
}

function addRandomColor() {
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];
    colorsPattern.push(randomColor);
}

getColors();

playBtn.addEventListener('click', function () {
    board.classList.remove('unclickable');
    startDemonstration();
})

checkUserInput();

console.log('initial click count',clickCount);