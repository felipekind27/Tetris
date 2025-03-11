const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const pieces = [
    [ // Lápiz
        [1, 1, 1],
        [0, 1, 0]
    ],
    [ // Regla
        [1, 1, 1, 1]
    ],
    [ // Cuaderno
        [1, 1],
        [1, 1]
    ],
    [ // Borrador
        [1, 1, 0],
        [0, 1, 1]
    ],
    [ // Sacapuntas
        [0, 1, 1],
        [1, 1, 0]
    ]
];

let score = 0;
let piece = getRandomPiece();
let position = { x: 3, y: 0 };

function getRandomPiece() {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    return pieces[randomIndex];
}

function drawPiece() {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'blue';
                context.fillRect(position.x + x, position.y + y, 1, 1);
            }
        });
    });
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'green';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
}

function update() {
    position.y++;
    if (collide()) {
        position.y--;
        merge();
        removeLines();
        piece = getRandomPiece();
        position = { x: 3, y: 0 };
        if (collide()) {
            alert('Game Over!');
            board.forEach(row => row.fill(0));
            score = 0;
            scoreElement.innerText = score;
        }
    }
}

function collide() {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] && (board[position.y + y] && board[position.y + y][position.x + x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge() {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[position.y + y][position.x + x] = value;
            }
        });
    });
}

function removeLines() {
    let lines = 0;
    board.forEach((row, y) => {
        if (row.every(cell => cell !== 0)) {
            lines++;
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    });
    if (lines > 0) {
        score += lines * 10;
        scoreElement.innerText = score;
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        position.x--;
        if (collide()) {
            position.x++;
        }
    } else if (event.key === 'ArrowRight') {
        position.x++;
        if (collide()) {
            position.x--;
        }
    } else if (event.key === 'ArrowDown') {
        position.y++;
        if (collide()) {
            position.y--;
        }
    } else if (event.key === 'ArrowUp') {
        const rotated = piece[0].map((val, index) => piece.map(row => row[index]).reverse());
        if (!collide(rotated)) {
            piece = rotated;
        }
    }
});

setInterval(() => {
    update();
    draw();
}, 1000);
