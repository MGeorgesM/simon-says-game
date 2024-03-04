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
    }, 750);

    setTimeout(() => {
        gameOverAudio.play();
    }, 2000);
}

function playWinAudio() {
    const gameWonAudio = new Audio('/sounds/game-win.wav');
    gameWonAudio.play();
}

function adjustScores() {
    level += 1;
    levelDislay.innerHTML = level;
    if (level > highScore) {
        highScore = level;
        highScoreDisplay.innerHTML = highScore;
        localStorage.setItem('highScore', JSON.stringify(highScore));
    }
}

function loadHighScore() {
    const savedHighScore = JSON.parse(localStorage.getItem('highScore'));
    if (savedHighScore) {
        highScoreDisplay.innerHTML = savedHighScore;
        highScore = savedHighScore;
    }
}

function activateTile(color, delay) {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].getAttribute('data-tile') === color) {
            setTimeout(() => {
                tiles[i].classList.remove('inactive');
                playColorAudio(color);
                setTimeout(() => {
                    tiles[i].classList.add('inactive');
                }, 500);
            }, delay);
        }
    }
}

function playColorPattern(colorsPattern) {
    let delay = 0;
    board.classList.add('unclickable');
    for (let i = 0; i < colorsPattern.length; i++) {
        activateTile(colorsPattern[i], delay);
        delay += 1000;

    }
    setTimeout(() => {
        board.classList.remove('unclickable');
    }, colorsPattern.length * 750);
}

function addRandomColor() {
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];
    colorsPattern.push(randomColor);
}

function newGame() {
    level = 0;
    clickCount = 0;
    colorsPattern = [];
    playBtn.classList.remove('unclickable');
}

function newLevel() {
    if (level === 12) {
        gameWon();
        newGame();
        return;
    }
    clickCount = 0;
    addRandomColor();
    playColorPattern(colorsPattern);
}

function gameWon() {
    board.classList.add('unclickable');
    playWinAudio();
}

function gameOver() {
    board.classList.add('unclickable');
    playWrongAudio();
}

getColors();

document.addEventListener('DOMContentLoaded', loadHighScore)

playBtn.addEventListener('click', function () {
    playBtn.classList.add('unclickable');
    adjustScores();
    newLevel();
})

board.addEventListener('click', function (event) {

    const clickedTile = event.target.closest('[data-tile]');

    if (clickedTile) {
        const selectedColor = clickedTile.getAttribute('data-tile');
        playColorAudio(selectedColor);

        if (selectedColor != colorsPattern[clickCount]) {
            gameOver();
            newGame();
            return;
        }
    }

    clickCount++;

    if (clickCount === colorsPattern.length) {
        setTimeout(() => {
            adjustScores();
            newLevel();
        }, 1000);
    }
})
