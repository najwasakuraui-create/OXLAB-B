const board = document.getElementById('puzzle-board');
const overlay = document.getElementById('overlay');
const winMessage = document.getElementById('win-message');

let currentSize = 3;
let tiles = [];
// REPLACE THIS URL with your actual image path
const imageURL = "https://picsum.photos/300/300"; 

function startGame(size) {
    currentSize = size;
    tiles = [...Array(size * size).keys()]; // Create array [0, 1, 2... size^2 - 1]
    shuffle(tiles);
    renderBoard();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[array[j] ? j : i]] = [array[j], array[i]];
    }
}

function renderBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

    tiles.forEach((tileValue, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        
        if (tileValue === (currentSize * currentSize) - 1) {
            tile.classList.add('empty');
        } else {
            // Slice the image using background position
            const row = Math.floor(tileValue / currentSize);
            const col = tileValue % currentSize;
            const percentage = 100 / (currentSize - 1);
            
            tile.style.backgroundImage = `url(${imageURL})`;
            tile.style.backgroundPosition = `${col * percentage}% ${row * percentage}%`;
            tile.onclick = () => moveTile(index);
        }
        board.appendChild(tile);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf((currentSize * currentSize) - 1);
    const isAdjacent = checkAdjacent(index, emptyIndex);

    if (isAdjacent) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        renderBoard();
        checkWin();
    }
}

function checkAdjacent(i1, i2) {
    const row1 = Math.floor(i1 / currentSize), col1 = i1 % currentSize;
    const row2 = Math.floor(i2 / currentSize), col2 = i2 % currentSize;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

function checkWin() {
    const isWin = tiles.every((val, i) => val === i);
    if (isWin) {
        winMessage.innerText = currentSize === 3 ? "Level 1 Cleared! Try 4x4?" : "OXLAB MASTER! Claim your candy! 🍭";
        overlay.classList.remove('hidden');
    }
}

function closeModal() {
    overlay.classList.add('hidden');
}

// Initial Start
startGame(3);