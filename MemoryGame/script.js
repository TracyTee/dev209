const colors = ['red', 'blue', 'yellow', 'purple', 'green', 'orange', 'pink', 'brown',
    'red', 'blue', 'yellow', 'purple', 'green', 'orange', 'pink', 'brown'];

//cards
const cards = document.querySelectorAll('.card');

//listener for cards
cards.forEach((card, index) => {

    // set color for each card
    card.dataset.color = colors[index];

    //click event
    card.addEventListener('click', function () {

        //flip if not flipped, change display to color and text to color
        if (!this.classList.contains('flipped')) {
            this.textContent = card.dataset.color;
            this.style.backgroundColor = card.dataset.color;
            this.classList.add('flipped');
        }

    });
});