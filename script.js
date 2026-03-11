document.addEventListener('DOMContentLoaded', () => {
    const gridSizeInput = document.getElementById('grid-size');
    const generateBtn = document.getElementById('generate-btn');
    const planBtn = document.getElementById('plan-btn');
    const gridTitle = document.getElementById('grid-title');
    const gridContainer = document.getElementById('grid-container');
    const resultsSection = document.getElementById('results-section');
    const valueMatrixContainer = document.getElementById('value-matrix-container');
    const policyMatrixContainer = document.getElementById('policy-matrix-container');
    // Reward inputs
    const goalRewardInput = document.getElementById('goal-reward');
    const stepPenaltyInput = document.getElementById('step-penalty');
    const obstaclePenaltyInput = document.getElementById('obstacle-penalty');
    const discountFactorInput = document.getElementById('discount-factor');

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
        // Count only obstacles in the main grid, not the result matrices
        const currentObstacles = document.querySelectorAll('#grid-container .grid-cell.obstacle').length;

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

    function planGrid() {
        if (!startCell || !endCell) {
            alert("Please set both a start and an end cell before planning!");
            return;
        }

        const n = parseInt(gridSizeInput.value);
        const { goalReward, stepPenalty, obstaclePenalty, discountFactor } = window.getRewardSettings();

        // Reveal results section
        resultsSection.classList.remove('hidden');

        // Setup the matrices containers CSS grid
        valueMatrixContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        valueMatrixContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;
        policyMatrixContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        policyMatrixContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;

        // Clear existing results
        valueMatrixContainer.innerHTML = '';
        policyMatrixContainer.innerHTML = '';

        // Internal representation
        // Grid is n x n. (0,0) is top-left in display, but let's just use 1D array index (0 to n*n-1)
        const states = Array.from(gridContainer.children); // Have type 'empty', 'start', 'end', 'obstacle'
        let V = new Array(n * n).fill(0);

        // Map UI index to 0-based coordinate system (row, col)
        const getRowCol = (index) => ({ r: Math.floor(index / n), c: index % n });
        const getIndex = (r, c) => r * n + c;

        const endStateIndex = states.findIndex(s => s.dataset.type === 'end');

        const actions = [
            { id: 'up', dr: -1, dc: 0 },
            { id: 'down', dr: 1, dc: 0 },
            { id: 'left', dr: 0, dc: -1 },
            { id: 'right', dr: 0, dc: 1 }
        ];

        // Transition function
        // Returns { nextState: index, reward: value }
        const getTransition = (stateIndex, action) => {
            const { r, c } = getRowCol(stateIndex);

            // If already at end state, it sits there absorbing (0 reward) 
            // - but actually standard value iteration often just fixes V(end)=0 and doesn't update it

            const nr = r + action.dr;
            const nc = c + action.dc;

            // Check boundaries
            if (nr < 0 || nr >= n || nc < 0 || nc >= n) {
                return { nextState: stateIndex, reward: stepPenalty }; // Bounce back
            }

            const nIndex = getIndex(nr, nc);
            const nType = states[nIndex].dataset.type;

            if (nType === 'obstacle') {
                return { nextState: stateIndex, reward: obstaclePenalty }; // Bounce back
            }

            if (nType === 'end') {
                return { nextState: nIndex, reward: goalReward }; // Reach goal
            }

            // Normal move
            return { nextState: nIndex, reward: stepPenalty };
        };

        // Value Iteration
        const theta = 1e-4; // Convergence threshold
        let maxChange = Infinity;
        let iter = 0;
        const maxIter = 1000;

        while (maxChange > theta && iter < maxIter) {
            maxChange = 0;
            const nextV = [...V];

            for (let i = 0; i < n * n; i++) {
                // Skip if it's the end state or obstacle
                if (states[i].dataset.type === 'end') {
                    nextV[i] = 0; // Value of absorbing state is 0
                    continue;
                }
                if (states[i].dataset.type === 'obstacle') {
                    nextV[i] = 0;
                    continue;
                }

                let maxQ = -Infinity;
                for (const a of actions) {
                    const { nextState, reward } = getTransition(i, a);
                    const q = reward + discountFactor * V[nextState];
                    if (q > maxQ) {
                        maxQ = q;
                    }
                }

                maxChange = Math.max(maxChange, Math.abs(maxQ - V[i]));
                nextV[i] = maxQ;
            }
            V = nextV;
            iter++;
        }

        // Policy Extraction and Rendering
        for (let i = 0; i < n * n; i++) {
            const type = states[i].dataset.type;

            // Create Value matrix cell
            const vCell = document.createElement('div');
            vCell.className = `grid-cell ${type}`;
            if (type === 'obstacle') {
                vCell.textContent = ''; // Blank or maybe 'X'
            } else if (type === 'end') {
                vCell.textContent = '0'; // Terminal state 
            } else {
                vCell.textContent = V[i].toFixed(2);
            }
            valueMatrixContainer.appendChild(vCell);

            // Create Policy matrix cell
            const pCell = document.createElement('div');
            pCell.className = `grid-cell ${type}`;
            if (type !== 'end' && type !== 'obstacle') {
                // Find best actions
                let maxQ = -Infinity;
                let bestActions = [];

                for (const a of actions) {
                    const { nextState, reward } = getTransition(i, a);
                    const q = reward + discountFactor * V[nextState];

                    // Allow for a tiny bit of floating point inaccuracy
                    if (q > maxQ + 1e-6) {
                        maxQ = q;
                        bestActions = [a.id];
                    } else if (Math.abs(q - maxQ) <= 1e-6) {
                        bestActions.push(a.id);
                    }
                }

                // Append arrows for best actions
                bestActions.forEach(actionId => {
                    const arrow = document.createElement('div');
                    arrow.className = `policy-arrow arrow-${actionId}`;
                    pCell.appendChild(arrow);
                });
            }
            policyMatrixContainer.appendChild(pCell);
        }
    }

    // Event listeners
    generateBtn.addEventListener('click', generateGrid);
    planBtn.addEventListener('click', planGrid);

    // Also generate on Enter key in the input
    gridSizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateGrid();
        }
    });

    // Function to get current rewards
    window.getRewardSettings = () => ({
        goalReward: parseFloat(goalRewardInput.value) || 0,
        stepPenalty: parseFloat(stepPenaltyInput.value) || 0,
        obstaclePenalty: parseFloat(obstaclePenaltyInput.value) || 0,
        discountFactor: parseFloat(discountFactorInput.value) || 0
    });

    // Initial generation on load
    generateGrid();
});
