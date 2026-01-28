const colors = ['red', 'blue', 'yellow', 'purple',
    'green', 'orange', 'pink', 'brown',
    'red', 'blue', 'yellow', 'purple',
    'green', 'orange', 'pink', 'brown'];


let cardOne = null;
let cardTwo = null;
let lockCard = false;
let moves = 0;
let matchedPairs = 0;
//cards
const cards = document.querySelectorAll('.card');


//listener for cards
cards.forEach((card, index) => {

    // set color for each card
    card.dataset.color = colors[index];

    //click event
    card.addEventListener('click', function () {

        //if lockCard or card is already flipped
        if (lockCard || this.classList.contains('flipped')) {
            return;
        }

        this.textContent = '';
        this.style.backgroundColor = card.dataset.color;
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

    });
});

//check for match
function checkMatch() {
    if (cardOne.dataset.color === cardTwo.dataset.color) {
        matchedPairs++;
        resetTurn();

        //check win
        if (matchedPairs === 8) {
            setTimeout(() => {
                alert(`You won in ${moves} moves!`);
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
