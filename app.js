const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');


let snake = [{ x: 200, y: 200 }];
let snakeDirection = { x: 20, y: 0 };
let food = { x: 100, y: 100 };
let gameOver = false;
let gameRunning = false;
const gridSize = 20;


function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = '#55efc4';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = '#fdcb6e';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + snakeDirection.x,
        y: snake[0].y + snakeDirection.y,
    };

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOver = true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    snakeDirection = { x: 20, y: 0 };
    placeFood();
    gameOver = false;
    gameRunning = true;
}

function gameLoop() {
    if (!gameRunning) return;

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '2rem Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        gameRunning = false;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
    checkCollision();
}

document.addEventListener('keydown', event => {
    const { key } = event;
    if (key === 'ArrowUp' && snakeDirection.y === 0) {
        snakeDirection = { x: 0, y: -20 };
    } else if (key === 'ArrowDown' && snakeDirection.y === 0) {
        snakeDirection = { x: 0, y: 20 };
    } else if (key === 'ArrowLeft' && snakeDirection.x === 0) {
        snakeDirection = { x: -20, y: 0 };
    } else if (key === 'ArrowRight' && snakeDirection.x === 0) {
        snakeDirection = { x: 20, y: 0 };
    }
});


startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetButton.style.display = 'block';
    resizeCanvas();
    resetGame();
    setInterval(gameLoop, 100);
});

resetButton.addEventListener('click', () => {
    resetGame();
});

window.addEventListener('resize', resizeCanvas);
