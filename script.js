// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let newDirection = 'right';
let gameSpeed = 100; // milliseconds
let gridSize = 20;
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

// Initialize the game
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set up event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.addEventListener('keydown', changeDirection);
    
    // Display high score from local storage
    document.getElementById('highScore').textContent = highScore;
    
    // Draw initial game state
    drawGame();
};

// Start the game
function startGame() {
    if (gameRunning) return;
    
    // Initialize snake
    snake = [
        {x: 5 * gridSize, y: 10 * gridSize},
        {x: 4 * gridSize, y: 10 * gridSize},
        {x: 3 * gridSize, y: 10 * gridSize}
    ];
    
    // Reset game state
    direction = 'right';
    newDirection = 'right';
    score = 0;
    document.getElementById('score').textContent = score;
    
    // Generate first food
    generateFood();
    
    // Start game loop
    gameRunning = true;
    gameLoop();
}

// Reset the game
function resetGame() {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGame();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(function() {
        moveSnake();
        checkCollision();
        drawGame();
        
        if (gameRunning) {
            gameLoop();
        }
    }, gameSpeed);
}

// Move the snake
function moveSnake() {
    // Update direction based on user input
    direction = newDirection;
    
    // Create new head based on current direction
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }
    
    // Add new head to the beginning of snake array
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        document.getElementById('score').textContent = score;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

// Handle keyboard input for direction changes
function changeDirection(event) {
    const key = event.keyCode;
    
    // Prevent reversing direction
    if (key === 37 && direction !== 'right') { // Left Arrow
        newDirection = 'left';
    } else if (key === 38 && direction !== 'down') { // Up Arrow
        newDirection = 'up';
    } else if (key === 39 && direction !== 'left') { // Right Arrow
        newDirection = 'right';
    } else if (key === 40 && direction !== 'up') { // Down Arrow
        newDirection = 'down';
    }
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= canvas.width || 
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }
    
    // Check self collision (skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    
    // Draw game over text
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 30);
}

// Generate food at random position
function generateFood() {
    // Calculate grid positions (avoid placing food on snake)
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let foodPosition;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        foodPosition = {
            x: Math.floor(Math.random() * gridWidth) * gridSize,
            y: Math.floor(Math.random() * gridHeight) * gridSize
        };
        
        // Check if food is on snake
        for (let segment of snake) {
            if (segment.x === foodPosition.x && segment.y === foodPosition.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = foodPosition;
}

// Draw everything
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake with arctic blue colors
    for (let i = 0; i < snake.length; i++) {
        // Gradient from light to darker blue for the snake body
        const segment = snake[i];
        if (i === 0) {
            // Head is slightly different color
            ctx.fillStyle = '#1976D2'; // Darker blue for head
        } else {
            // Body segments alternate between two blue shades
            ctx.fillStyle = i % 2 === 0 ? '#2196F3' : '#64B5F6';
        }
        
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // Add border to snake segments
        ctx.strokeStyle = '#0D47A1'; // Dark blue border
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    }
    
    // Draw food (arctic fish)
    ctx.fillStyle = '#E91E63'; // Pinkish color for arctic fish/seal
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeStyle = '#C2185B'; // Darker border
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    
    // Optional: Draw snowflakes (randomly)
    if (Math.random() < 0.05) { // 5% chance each frame
        drawSnowflake();
    }
    
    // Draw grid (optional, for debugging)
    // drawGrid();
}

// Draw a random snowflake
function drawSnowflake() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3 + 1;
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw grid lines (optional, for debugging)
function drawGrid() {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}