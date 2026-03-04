document.addEventListener('DOMContentLoaded', () => {
    const gridSizeInput = document.getElementById('grid-size');
    const generateBtn = document.getElementById('generate-btn');
    const gridTitle = document.getElementById('grid-title');
    const gridContainer = document.getElementById('grid-container');

    let startCell = null;
    let endCell = null;

    function generateGrid() {
        let n = parseInt(gridSizeInput.value);

        // Validation
        if (isNaN(n) || n < 3 || n > 10) {
            alert('Please enter a valid number between 3 and 10.');
            return;
        }

        // Update title and obstacle limit display
        gridTitle.textContent = `${n} x ${n} Square:`;
        const obstacleLimitDisplay = document.getElementById('obstacle-limit-display');
        if (obstacleLimitDisplay) {
            obstacleLimitDisplay.textContent = n - 1;
        }

        // Clear existing grid
        gridContainer.innerHTML = '';

        // Update CSS grid layout
        gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;

        // Reset state
        startCell = null;
        endCell = null;

        // Generate cells
        for (let i = 1; i <= n * n; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.textContent = i;
            cell.dataset.index = i;
            cell.dataset.type = 'empty';

            // Add click listener
            cell.addEventListener('click', () => handleCellClick(cell));

            gridContainer.appendChild(cell);
        }
    }

    function setCellType(cell, type) {
        // Play animation by removing and quickly re-adding the class
        cell.classList.remove('start', 'end', 'obstacle');
        // Force reflow for animation to trigger
        void cell.offsetWidth;

        // Clear references if this cell is changing type
        if (cell === startCell && type !== 'start') startCell = null;
        if (cell === endCell && type !== 'end') endCell = null;

        if (type === 'start') {
            if (startCell && startCell !== cell) {
                startCell.classList.remove('start');
                startCell.dataset.type = 'empty';
            }
            startCell = cell;
        } else if (type === 'end') {
            if (endCell && endCell !== cell) {
                endCell.classList.remove('end');
                endCell.dataset.type = 'empty';
            }
            endCell = cell;
        }

        if (type !== 'empty') {
            cell.classList.add(type);
        }
        cell.dataset.type = type;
    }

    function handleCellClick(cell) {
        const currentType = cell.dataset.type;
        const n = parseInt(gridSizeInput.value);
        const maxObstacles = n - 1;
        const currentObstacles = document.querySelectorAll('.grid-cell.obstacle').length;

        // Cycling logic:
        // Empty -> Start -> End -> Obstacle -> Empty
        // Handled contextually based on what exists

        if (currentType === 'empty') {
            if (!startCell) {
                setCellType(cell, 'start');
            } else if (!endCell) {
                setCellType(cell, 'end');
            } else if (currentObstacles < maxObstacles) {
                setCellType(cell, 'obstacle');
            }
            // If limit is reached, it just stays empty
        } else if (currentType === 'start') {
            if (!endCell) {
                setCellType(cell, 'end');
            } else if (currentObstacles < maxObstacles) {
                setCellType(cell, 'obstacle');
            } else {
                setCellType(cell, 'empty');
            }
        } else if (currentType === 'end') {
            if (currentObstacles < maxObstacles) {
                setCellType(cell, 'obstacle');
            } else {
                setCellType(cell, 'empty');
            }
        } else if (currentType === 'obstacle') {
            setCellType(cell, 'empty');
        }
    }

    // Event listeners
    generateBtn.addEventListener('click', generateGrid);

    // Also generate on Enter key in the input
    gridSizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateGrid();
        }
    });

    // Initial generation on load
    generateGrid();
});
