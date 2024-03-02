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

function playColorAudio(color) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
}

function playWrongAudio() {
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

function playWinAudio() {
    const gameWonAudio = new Audio('/sounds/game-win.wav');
    gameWonAudio.play();
}

function adjustHighScore(score) {
    if (score > highScore) {
        highScoreDisplay.innerHTML = score;
        localStorage.setItem('highScore', JSON.stringify(score));
    }
}

function adjustLevelScore(score) {
    if (score > level) {
        levelDislay.innerHTML = score;
    }
}

function loadHighScore() {
    const savedHighScore = JSON.parse(localStorage.getItem('highScore'));
    if (savedHighScore) {
        adjustHighScore(savedHighScore);
    }
}

function newLevel() {
    clickCount = 0;
    addRandomColor();
    playColorPattern(colorsPattern);
    console.log(colorsPattern);
}

function getUserInput() {
    board.addEventListener('click', function (event) {

        const clickedTile = event.target.closest('[data-tile]');

        if (clickedTile) {
            const selectedColor = clickedTile.getAttribute('data-tile');
            playColorAudio(selectedColor);

            if (selectedColor != colorsPattern[clickCount]) {
                board.classList.add('unclickable');
                playWrongAudio();
                return;
            }
        }

        clickCount++;

        if (clickCount === colorsPattern.length) {
            setTimeout(() => {
                adjustHighScore(clickCount);
                adjustLevelScore(clickCount);
                newLevel();
            }, 1000);
        }
    })
}

function activateTile(color) {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].getAttribute('data-tile') === color) {
            tiles[i].classList.remove('inactive');
            playColorAudio(color);
            setTimeout(() => {
                tiles[i].classList.add('inactive');
            }, 750);
            return;
        }
    }
}

function playColorPattern(colorsPattern) {
    for (let i = 0; i < colorsPattern.length; i++) {
        setTimeout(() => {
            activateTile(colorsPattern[i]);
        }, i * 750);

        if (i === colorsPattern.length -1) {
            board.classList.remove('unclickable')
        }
    }
}

function addRandomColor() {
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];
    colorsPattern.push(randomColor);
}

document.addEventListener('DOMContentLoaded', loadHighScore)

playBtn.addEventListener('click', function () {
    newLevel();
    playBtn.classList.add('unclickable');
})

getColors();
getUserInput();