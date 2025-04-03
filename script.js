document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [];
    let food = {};
    let dx = gridSize; // horizontal velocity
    let dy = 0; // vertical velocity
    let score = 0;
    let gameRunning = false;
    let gameSpeed = 150; // milliseconds
    let gameLoop;
    
    // DOM elements
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    
    // Initialize game
    function initGame() {
        // Reset snake
        snake = [
            {x: 5 * gridSize, y: 10 * gridSize},
            {x: 4 * gridSize, y: 10 * gridSize},
            {x: 3 * gridSize, y: 10 * gridSize}
        ];
        
        // Reset direction
        dx = gridSize;
        dy = 0;
        
        // Reset score
        score = 0;
        scoreDisplay.textContent = score;
        
        // Generate food
        generateFood();
        
        // Clear previous game loop if any
        if (gameLoop) clearInterval(gameLoop);
    }
    
    // Generate random food position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount) * gridSize,
            y: Math.floor(Math.random() * tileCount) * gridSize
        };
        
        // Make sure food doesn't spawn on snake
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                generateFood();
                break;
            }
        }
    }
    
    // Draw everything
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
            
            // Draw border around snake segments
            ctx.strokeStyle = '#45a049';
            ctx.strokeRect(snake[i].x, snake[i].y, gridSize, gridSize);
        }
        
        // Draw food
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        ctx.strokeStyle = '#E53935';
        ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    }
    
    // Update game state
    function update() {
        // Create new head
        const head = {
            x: snake[0].x + dx,
            y: snake[0].y + dy
        };
        
        // Check for wall collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
            return;
        }
        
        // Check for self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreDisplay.textContent = score;
            
            // Generate new food
            generateFood();
            
            // Increase speed slightly
            if (gameSpeed > 50) {
                clearInterval(gameLoop);
                gameSpeed -= 5;
                gameLoop = setInterval(gameStep, gameSpeed);
            }
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
    }
    
    // Game step function
    function gameStep() {
        update();
        draw();
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        startBtn.textContent = 'Restart Game';
        
        // Display game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 15);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // Start/restart game
    startBtn.addEventListener('click', () => {
        initGame();
        gameRunning = true;
        startBtn.textContent = 'Game Running';
        gameLoop = setInterval(gameStep, gameSpeed);
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        if (!gameRunning) return;
        
        // Prevent reverse direction (snake can't turn 180 degrees)
        switch (event.key) {
            case 'ArrowUp':
                if (dy === 0) {
                    dx = 0;
                    dy = -gridSize;
                }
                break;
            case 'ArrowDown':
                if (dy === 0) {
                    dx = 0;
                    dy = gridSize;
                }
                break;
            case 'ArrowLeft':
                if (dx === 0) {
                    dx = -gridSize;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx === 0) {
                    dx = gridSize;
                    dy = 0;
                }
                break;
        }
    });
    
    // Initial draw
    draw();
});
