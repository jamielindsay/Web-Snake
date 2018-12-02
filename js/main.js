const MAX_FPS = 60;

var last_frame_time_ms;

var game_size;
var score;

var snake_positions;
var current_direction;
var keypressed;
var speed = 2;
var apple_position;

var itime;

var initialized = false;

/** Initializes game state */
function init() {
    last_frame_time_ms = 0;

    game_size = 10;
    score = 1;

    snake_positions = [{'y': 0, 'x':0}];
    current_direction = 'R';
    keypressed = false;
    seedApple();

    itime = Date.now();

    initialized = true;
}

/** Draws current game state to canvas */
function draw() {
    var canvas = document.getElementById('multiplier');
    var ctx = canvas.getContext('2d');

    var cell_width = canvas.scrollWidth / game_size;
    var cell_height = canvas.scrollHeight / game_size;

    // Draw current state
    for (var y = 0; y < canvas.scrollHeight; y += cell_height) {
        for (var x = 0; x < canvas.scrollWidth; x += cell_width) {
            ctx.beginPath();
            ctx.rect(x, y, cell_width, cell_height);
            if (snake_positions.find(snake => JSON.stringify(snake) === JSON.stringify({'y': y / cell_height, 'x': x / cell_width})) || JSON.stringify(apple_position) === JSON.stringify({'y': y / cell_height, 'x': x / cell_width})) {
                ctx.fillStyle = "#ffffff";
            } 
            else {
                ctx.fillStyle = "#424242";
            }
            ctx.fill();
        }
    }

    document.getElementById("scorelabel").innerHTML = score;
}

/** Game logic */
function update() {
    /* Handle snake movement and game logic */
    var new_position = {'y': snake_positions[0]['y'], 'x': snake_positions[0]['x']};
    if ((Date.now() - itime) / 1000 >= 1/speed) {
        switch (current_direction) {
            case 'L': 
                new_position['x'] -= 1;
                break;
            case 'R': 
                new_position['x'] += 1;
                break;
            case 'U': 
                new_position['y'] -= 1;
                break;
            case 'D': 
                new_position['y'] += 1;
                break;
        }
        
        if (JSON.stringify(new_position) === JSON.stringify(apple_position)) {
            score += 1;
            seedApple();
        } else {
            snake_positions.pop();
        }
    
        snake_positions.unshift(new_position);
        checkGameOver();

        itime = Date.now();
    }
    
    /* Handle user input */ 
    document.addEventListener('keydown', function() {
        if (!keypressed) {
            if (event.keyCode == 65 && current_direction != 'R') // LEFT
                current_direction = 'L';
            if (event.keyCode == 68 && current_direction != 'L') // RIGHT
                current_direction = 'R';
            if (event.keyCode == 87 && current_direction != 'D') // UP
                current_direction = 'U';
            if (event.keyCode == 83 && current_direction != 'U') // DOWN
                current_direction = 'D';
            
            keypressed = true;
        }
    });

    document.addEventListener('keyup', function() {
        keypressed = false;
    });
}

/** Checks if the current position of snake will cause game over */
function checkGameOver() {
    currentY = snake_positions[0]['y'];
    currentX = snake_positions[0]['x'];
    if (currentY > game_size-1 || currentY < 0 || currentX > game_size-1 || currentX < 0)
        init();
    var duplicates = snake_positions.filter(i => JSON.stringify(i) === JSON.stringify(snake_positions[0]));
    if (duplicates.length > 1)
        init();
}

/** Seeds apple in random position in game */
function seedApple() {
    var random_x = Math.floor(Math.random() * game_size);
    var random_y = Math.floor(Math.random() * game_size);
    if (!snake_positions.find(snake => JSON.stringify(snake) === JSON.stringify({'y': random_y, 'x': random_x})))
        apple_position = {'y': random_y, 'x': random_x};
    else
        seedApple();
}

function mainLoop(timestamp) {
    // Initialize game state
    if (!initialized)
        init();

    // Caps the main loop at max fps
    if (timestamp < last_frame_time_ms + (1000 / MAX_FPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }
    last_frame_time_ms = timestamp; 

    // Perform game logic and render frame
    update();
    draw();
    requestAnimationFrame(mainLoop);
}
