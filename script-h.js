let yes = new Audio("wavs/yes.wav");
let fa = new Audio("wavs/fail.wav");
let win = new Audio("wavs/win.wav");
let ring = new Audio("wavs/ring.wav");
let dragon = new Audio("wavs/dragon.wav");
let dragbg = new Audio("wavs/dragbg.wav");

//timer dla danego lvl
let timeleft = 30;
let dragonTimer = setInterval(function () {
    timeleft--;
    document.getElementById("timer").textContent = "Pozostało czasu : " + timeleft;
    if (timeleft == 5) {
        ring.play();
    }
    if (timeleft <= 0) {
        clearInterval(dragonTimer);
        ring.pause();

        let fail = document.querySelector('.game-board');
        fail.innerHTML = '<img src="images/death.png" class="fail-red">';
        fail.innerHTML += '<h3><a href="level.html" class="again"> Sprobuj jeszcze raz jako inny smialek</a></h3>';
        fa.play();
    }
}, 1000);

const memoryGame = {
    tileCount: 20, //liczba klocków
    tileOnRow: 5, //liczba klocków na rząd
    divBoard: null, //div z planszą gry
    divScore: null, //div z wynikiem gry
    tiles: [], //tutaj trafi wymieszana tablica klocków
    tilesChecked: [], //zaznaczone klocki
    moveCount: 0, //liczba ruchów
    tilesImg: [ //grafiki dla klocków
        'images/title_1.png',
        'images/title_2.png',
        'images/title_3.png',
        'images/title_4.png',
        'images/title_5.png',
        'images/title_6.png',
        'images/title_7.png',
        'images/title_8.png',
        'images/title_9.png',
        'images/title_10.png'
    ],
    canGet: true, //aktywne kafelki
    tilePairs: 0, //liczba dopasowanych kafelkow

    tileClick: function (e) {
        if (this.canGet) {
            //jeżeli jeszcze nie pobraliśmy 1 elementu
            //lub jeżeli index tego elementu nie istnieje w pobranych
            if (!this.tilesChecked[0] || (this.tilesChecked[0].dataset.index !== e.target.dataset.index)) {
                this.tilesChecked.push(e.target);
                e.target.style.backgroundImage = 'url(' + this.tilesImg[e.target.dataset.cardType] + ')';
            }

            if (this.tilesChecked.length === 2) {
                this.canGet = false;

                if (this.tilesChecked[0].dataset.cardType === this.tilesChecked[1].dataset.cardType) {
                    yes.play();
                    setTimeout(this.deleteTiles.bind(this), 600);
                } else {
                    setTimeout(this.resetTiles.bind(this), 600);
                }

                this.moveCount++;
                this.divScore.innerHTML = this.moveCount;

                if (this.moveCount === 25) {
                    this.divBoard = document.querySelector('.game-board');
                    this.divBoard.innerHTML = '<img src="images/death.png" class="fail-red">';
                    this.divBoard.innerHTML += '<h3><a href="level.html" class="again"> Sprobuj jeszcze raz jako inny smialek</a></h3>';
                    ring.pause();
                    clearInterval(dragonTimer);
                    fa.play();
                }
            }
        }
    },

    deleteTiles: function () {
        this.tilesChecked[0].remove();
        this.tilesChecked[1].remove();

        this.canGet = true;
        this.tilesChecked = [];

        this.tilePairs++;
        if (this.tilePairs >= this.tileCount / 2) {
            this.divBoard = document.querySelector('.game-board');
            win.play();
            ring.pause();
            this.divBoard.innerHTML = '<img src="images/win-h.png" class="win-green">';
            this.divBoard.innerHTML += '<h3><a href="level.html" class="again-win"> Sprobuj jeszcze raz jako inny smialek</a></h3>';
            clearInterval(dragonTimer);
        }
    },

    resetTiles: function () {
        this.tilesChecked[0].style.backgroundImage = 'url(images/title.png)';
        this.tilesChecked[1].style.backgroundImage = 'url(images/title.png)';

        this.tilesChecked = [];
        this.canGet = true;
    },

    startGame: function () {
        //reset planszy
        dragon.play();
        dragbg.play();
        this.divBoard = document.querySelector('.game-board');
        this.divBoard.innerHTML = '';

        //reset tur
        this.divScore = document.querySelector('.game-score');
        this.divScore.innerHTML = '';

        //reset zmiennych
        this.tiles = [];
        this.tilesChecked = [];
        this.moveCount = 0;
        this.canGet = true;
        this.tilePairs = 0;

        //tablica klockow
        for (let i = 0; i < this.tileCount; i++) {
            this.tiles.push(Math.floor(i / 2));
        }

        //mieszanie tablicy klockow
        for (let i = this.tileCount - 1; i > 0; i--) {
            const swap = Math.floor(Math.random() * i);
            const tmp = this.tiles[i];
            this.tiles[i] = this.tiles[swap];
            this.tiles[swap] = tmp;
        }

        for (let i = 0; i < this.tileCount; i++) {
            const tile = document.createElement('div');
            tile.classList.add("game-tile");
            this.divBoard.appendChild(tile);

            tile.dataset.cardType = this.tiles[i];
            tile.dataset.index = i;
            console.log(5 + (tile.offsetWidth + 5) * (i % this.tileOnRow))
            tile.style.left = 5 + (tile.offsetWidth + 10) * (i % this.tileOnRow) + 'px'
            tile.style.top = 5 + (tile.offsetHeight + 10) * (Math.floor(i / this.tileOnRow)) + 'px';

            tile.addEventListener('click', this.tileClick.bind(this));
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    memoryGame.startGame();
});
