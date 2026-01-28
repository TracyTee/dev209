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

//shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//test game
function testGame(array) {
    //set color array to one color
    for (let i = 0; i < array.length; i++) {
        array[i] = 'red';
    }
    return array;
}


//start game
function startGame(gridSize) {

    cardOne = null;
    cardTwo = null;
    lockCard = false;
    moves = 0;
    matchedPairs = 0;

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

}
//card click event
function handleCardClick() {
    //if lockCard or card is already flipped
    if (lockCard || this.classList.contains('flipped')) {
        return;
    }

    this.textContent = this.dataset.color;
    this.style.backgroundColor = this.dataset.color;
    this.classList.add('flipped');

    //cardone
    if (!cardOne) {
        cardOne = this;
    }
    //cardtwo
    else {
        cardTwo = this;
        lockCard = true;
        moves++;

        checkMatch();
    }
}


//check for match
function checkMatch() {
    if (cardOne.dataset.color === cardTwo.dataset.color) {
        matchedPairs++;
        resetTurn();

        //check win
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                alert(`Game Over! You won in ${moves} moves!`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            cardOne.style.backgroundColor = '#2b177d';
            cardOne.classList.remove('flipped');

            cardTwo.style.backgroundColor = '#2b177d';
            cardTwo.classList.remove('flipped');

            resetTurn();
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

//default
startGame(4);