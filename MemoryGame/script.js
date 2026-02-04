const colors = ['red', 'blue', 'yellow', 'purple',
    'green', 'orange', 'pink', 'brown',
    'red', 'blue', 'yellow', 'purple',
    'green', 'orange', 'pink', 'brown',
    'cyan', 'magenta', 'lime', 'teal',
    'cyan', 'magenta', 'lime', 'teal',
    'navy', 'maroon', 'olive', 'silver',
    'navy', 'maroon', 'olive', 'silver'];


let cardOne = null;
let cardTwo = null;
let lockCard = false;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;
let timerInterval = null;
let seconds = 0;

//sessionstorage for total moves and other states across games
function saveGameState() {
    const cards = Array.from(document.querySelectorAll('.card'));
    const cardStates = cards.map(card => ({
        color: card.dataset.color,
        isFlipped: card.classList.contains('flipped'),
        backgroundColor: card.style.backgroundColor
    }));
    const gameState = {
        cardStates: cardStates,
        moves: moves,
        matchedPairs: matchedPairs,
        totalPairs: totalPairs,
        seconds: seconds,
        gridSize: parseInt(document.getElementById('Level').value),
        lockCard: lockCard
    };
    sessionStorage.setItem('memoryGameState', JSON.stringify(gameState));
}

//load game state
function loadGameState() {
    const savedState = sessionStorage.getItem('memoryGameState');
    if (!savedState) {
        return null;
    }
    try {
        return JSON.parse(savedState);
    } catch (e) {
        console.error('Failed to load saved game state:', e);
        sessionStorage.removeItem('memoryGameState');
        return null;
    }
}

//clear game state
function clearGameState() {
    sessionStorage.removeItem('memoryGameState');
}

//local storage: save across tabs
function getGlobalMoves() {
    const globalMoves = localStorage.getItem('memoryGameGlobalMoves');
    return globalMoves ? parseInt(globalMoves) : 0;
}

//add to global moves
function incrementGlobalMoves() {
    const currentGlobal = getGlobalMoves();
    localStorage.setItem('memoryGameGlobalMoves', (currentGlobal + 1).toString());
    updateGlobalMovesDisplay();
}

//update global moves display
function updateGlobalMovesDisplay() {
    const globalMoves = getGlobalMoves();
    const displayElement = document.getElementById('globalMovesDisplay');
    if (displayElement) {
        displayElement.textContent = globalMoves;
    }
}

//shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//timer
function startTimer() {
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
        saveGameState();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timerDisplay').textContent =
        `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function updateMovesDisplay() {
    document.getElementById('movesDisplay').textContent = moves;
}

//test game - basic card functionality
function testGame(array) {
    //set color array to one color
    for (let i = 0; i < array.length; i++) {
        array[i] = 'red';
    }
    return array;
}

//start game
function startGame(gridSize) {

    stopTimer();

    cardOne = null;
    cardTwo = null;
    lockCard = false;
    moves = 0;
    matchedPairs = 0;
    updateMovesDisplay();

    if (gridSize === 4) {
        totalPairs = 8;
    } else if (gridSize === 6) {
        totalPairs = 18;
    } else if (gridSize === 8) {
        totalPairs = 32;
    }

    const cardColors = [];
    for (let i = 0; i < totalPairs; i++) {
        cardColors.push(colors[i]);
        cardColors.push(colors[i]);
    }

    shuffle(cardColors);
    //testGame(cardColors);

    const cardContainer = document.querySelector('.gameContainer');

    cardContainer.innerHTML = '';

    //display cards
    cardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    cardContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = i + 1;
        card.dataset.color = cardColors[i];

        card.addEventListener('click', handleCardClick);

        cardContainer.appendChild(card);
    }

    startTimer();
    saveGameState();
}
//card click event
function handleCardClick() {
    //if lockCard or card is already flipped
    if (lockCard || this.classList.contains('flipped')) {
        return;
    }

    //this.textContent = this.dataset.color;
    this.style.backgroundColor = this.dataset.color;
    this.classList.add('flipped');

    //cardone
    if (!cardOne) {
        cardOne = this;
        saveGameState();
    }
    //cardtwo
    else {
        cardTwo = this;
        lockCard = true;
        moves++;
        updateMovesDisplay();
        incrementGlobalMoves();
        saveGameState();

        checkMatch();
    }
}


//check for match
function checkMatch() {
    if (cardOne.dataset.color === cardTwo.dataset.color) {
        matchedPairs++;
        resetTurn();
        saveGameState();

        //check win
        if (matchedPairs === totalPairs) {
            stopTimer();
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timestring = `${minutes} minutes and ${secs} seconds`;
            setTimeout(() => {
                alert(`Game Over! You won in ${moves} moves and ${timestring}!`);
                clearGameState();
            }, 500);
        }
    } else {
        setTimeout(() => {
            cardOne.style.backgroundColor = '#2b177d';
            cardOne.classList.remove('flipped');

            cardTwo.style.backgroundColor = '#2b177d';
            cardTwo.classList.remove('flipped');

            resetTurn();
            saveGameState();
        }, 1000);
    }
}

//reset turn
function resetTurn() {
    cardOne = null;
    cardTwo = null;
    lockCard = false;
}

//shuffle cards
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

//button listener
document.getElementById('newButton').addEventListener('click', function () {
    const difficulty = parseInt(document.getElementById('Level').value);
    startGame(difficulty);
});

//keep state on page reload
function restoreGameState() {
    const savedState = loadGameState();
    if (!savedState) {
        startGame(4);
        return;
    }
    //restore variables
    moves = savedState.moves;
    matchedPairs = savedState.matchedPairs;
    totalPairs = savedState.totalPairs;
    seconds = savedState.seconds;
    lockCard = savedState.lockCard;

    document.getElementById('Level').value = savedState.gridSize;
    updateMovesDisplay();
    updateTimerDisplay();

    //redraw grid
    const cardContainer = document.querySelector('.gameContainer');
    cardContainer.innerHTML = '';
    cardContainer.style.gridTemplateColumns = `repeat(${savedState.gridSize}, 1fr)`;
    cardContainer.style.gridTemplateRows = `repeat(${savedState.gridSize}, 1fr)`;

    //recreate cards and state
    savedState.cardStates.forEach((cardState, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = index + 1;
        card.dataset.color = cardState.color;

        if (cardState.isFlipped) {
            card.style.backgroundColor = card.dataset.color;
            card.classList.add('flipped');
        }
        card.addEventListener('click', handleCardClick);
        cardContainer.appendChild(card);
    });

    //restart timer
    startTimer();
}
//default
//startGame(4);

//test

//initialize global moves display
updateGlobalMovesDisplay();
restoreGameState();

//tab changes listener
window.addEventListener('storage', (e) => {
    if (e.key === 'memoryGameGlobalMoves') {
        updateGlobalMovesDisplay();
    }
});

// test cross tab synchronization
/* document.getElementById('testGlobalIncrement').addEventListener('click', () => {
    incrementGlobalMoves();
    alert('Global moves incremented by 1!');
}); */

//reset all storage
/* document.getElementById('resetAllStorage').addEventListener('click', () => {
    if (confirm('Reset all? This will clear total moves across all games.')) {
        sessionStorage.clear();
        localStorage.removeItem('memoryGameGlobalMoves');
        location.reload();
    }
}); */
