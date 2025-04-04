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

// Food types with different values and colors
const foodTypes = [
    { type: 'apple', value: 10, color: '#F44336', radius: 0.5, stem: true },
    { type: 'banana', value: 15, color: '#FFEB3B', radius: 0.4, stem: false },
    { type: 'cherry', value: 20, color: '#E91E63', radius: 0.4, stem: true },
    { type: 'orange', value: 25, color: '#FF9800', radius: 0.5, stem: false },
    { type: 'strawberry', value: 30, color: '#E91E63', radius: 0.45, stem: true }
];

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
    
    // Add swipe gestures for the canvas
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const minSwipeDistance = 30; // Minimum distance to consider as swipe
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine if the swipe was horizontal or vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0 && direction !== 'left') {
                    // Right swipe
                    newDirection = 'right';
                } else if (deltaX < 0 && direction !== 'right') {
                    // Left swipe
                    newDirection = 'left';
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0 && direction !== 'up') {
                    // Down swipe
                    newDirection = 'down';
                } else if (deltaY < 0 && direction !== 'down') {
                    // Up swipe
                    newDirection = 'up';
                }
            }
        }
    }
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
        // Increase score based on food value
        score += food.value;
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
    
    // Randomly select a food type
    const randomFoodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    
    // Store both position and food type information
    food = {
        ...foodPosition,
        ...randomFoodType
    };
}

// Draw everything
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const isHead = i === 0;
        
        // Draw snake segment
        if (isHead) {
            // Head - slightly different color
            ctx.fillStyle = '#4CAF50'; // Brighter green for head
            ctx.strokeStyle = '#388E3C'; // Darker green border
        } else {
            // Body segments
            ctx.fillStyle = '#66BB6A'; // Green for body
            ctx.strokeStyle = '#388E3C'; // Darker green border
        }
        
        // Draw segment with slight padding for visual separation
        const padding = 1;
        ctx.fillRect(segment.x + padding, segment.y + padding, gridSize - padding * 2, gridSize - padding * 2);
        ctx.strokeRect(segment.x + padding, segment.y + padding, gridSize - padding * 2, gridSize - padding * 2);
    
        // Add eyes to the head
        if (isHead) {
            const eyeSize = 3;
            const eyeOffset = gridSize / 4;
            
            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            
            switch(direction) {
                case 'up':
                    leftEyeX = segment.x + eyeOffset;
                    leftEyeY = segment.y + eyeOffset;
                    rightEyeX = segment.x + gridSize - eyeOffset;
                    rightEyeY = segment.y + eyeOffset;
                    break;
                case 'down':
                    leftEyeX = segment.x + eyeOffset;
                    leftEyeY = segment.y + gridSize - eyeOffset;
                    rightEyeX = segment.x + gridSize - eyeOffset;
                    rightEyeY = segment.y + gridSize - eyeOffset;
                    break;
                case 'left':
                    leftEyeX = segment.x + eyeOffset;
                    leftEyeY = segment.y + eyeOffset;
                    rightEyeX = segment.x + eyeOffset;
                    rightEyeY = segment.y + gridSize - eyeOffset;
                    break;
                case 'right':
                    leftEyeX = segment.x + gridSize - eyeOffset;
                    leftEyeY = segment.y + eyeOffset;
                    rightEyeX = segment.x + gridSize - eyeOffset;
                    rightEyeY = segment.y + gridSize - eyeOffset;
                    break;
            }
            
            // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

            // Draw pupils
            ctx.fillStyle = 'black';
    ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI * 2);
    ctx.fill();
        }
    }
    
    // Draw food based on its type
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize * food.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw stem if the food type has one
    if (food.stem) {
    ctx.fillStyle = '#795548'; // Brown for stem
    ctx.fillRect(food.x + gridSize/2 - 1, food.y + 2, 2, 4);
        
        // Draw leaf
    ctx.fillStyle = '#8BC34A'; // Green for leaf
    ctx.beginPath();
    ctx.ellipse(food.x + gridSize/2 + 3, food.y + 4, 3, 2, Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    }
    
    // Special drawing for banana
    if (food.type === 'banana') {
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize * 0.3, Math.PI * 0.25, Math.PI * 1.25);
        ctx.stroke();
    }
    
    // Special drawing for strawberry
    if (food.type === 'strawberry') {
        // Add seeds
        ctx.fillStyle = '#FFF9C4';
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * gridSize * 0.3;
            const seedX = food.x + gridSize/2 + Math.cos(angle) * distance;
            const seedY = food.y + gridSize/2 + Math.sin(angle) * distance;
            ctx.beginPath();
            ctx.arc(seedX, seedY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Draw grid (optional, for debugging)
    // drawGrid();
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