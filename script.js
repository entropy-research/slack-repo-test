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
    
    // Set up mobile control buttons
    document.getElementById('upBtn').addEventListener('click', function() {
        handleDirectionButtonClick(38); // Up arrow key code
    });
    document.getElementById('downBtn').addEventListener('click', function() {
        handleDirectionButtonClick(40); // Down arrow key code
    });
    document.getElementById('leftBtn').addEventListener('click', function() {
        handleDirectionButtonClick(37); // Left arrow key code
    });
    document.getElementById('rightBtn').addEventListener('click', function() {
        handleDirectionButtonClick(39); // Right arrow key code
    });
    
    // Add touch events for mobile
    setupTouchEvents();
    
    // Display high score from local storage
    document.getElementById('highScore').textContent = highScore;
    
    // Draw initial game state
    drawGame();
};

// Handle direction button clicks by simulating keyboard events
function handleDirectionButtonClick(keyCode) {
    // Create a synthetic keyboard event
    const event = {
        keyCode: keyCode
    };
    
    // Call the existing changeDirection function
    changeDirection(event);
}

// Setup touch events for mobile buttons to prevent scrolling and improve responsiveness
function setupTouchEvents() {
    const directionButtons = document.querySelectorAll('.direction-btn');
    
    directionButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior
            this.click(); // Trigger the click event
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault(); // Prevent default touch behavior
        });
    });
}

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
    
    // Draw snake as penguins
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const isHead = i === 0;
        
        // Draw penguin for each segment
        drawPenguin(segment.x, segment.y, gridSize, isHead);
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

// Draw a penguin at the specified coordinates
function drawPenguin(x, y, size, isHead) {
    // Center point of the cell
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    
    // Scale factor (slightly smaller than the grid to have some padding)
    const scale = size * 0.9;
    
    // Body (oval)
    ctx.fillStyle = '#000000'; // Black for penguin body
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, scale/2, scale/2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // White belly
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + scale/10, scale/3, scale/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    if (isHead) {
        // Eyes (only on head)
        const eyeSize = scale/8;
        
        // Left eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - scale/4, centerY - scale/8, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Left pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - scale/4, centerY - scale/8, eyeSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX + scale/4, centerY - scale/8, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Right pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX + scale/4, centerY - scale/8, eyeSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Orange beak
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.moveTo(centerX - scale/6, centerY + scale/8);
        ctx.lineTo(centerX + scale/6, centerY + scale/8);
        ctx.lineTo(centerX, centerY + scale/4);
        ctx.closePath();
        ctx.fill();
    }
    
    // Flippers (small triangles on the sides)
    ctx.fillStyle = '#000000';
    
    // Left flipper
    ctx.beginPath();
    ctx.moveTo(centerX - scale/2, centerY);
    ctx.lineTo(centerX - scale/1.5, centerY);
    ctx.lineTo(centerX - scale/2, centerY + scale/4);
    ctx.closePath();
    ctx.fill();
    
    // Right flipper
    ctx.beginPath();
    ctx.moveTo(centerX + scale/2, centerY);
    ctx.lineTo(centerX + scale/1.5, centerY);
    ctx.lineTo(centerX + scale/2, centerY + scale/4);
    ctx.closePath();
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