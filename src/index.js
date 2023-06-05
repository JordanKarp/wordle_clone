const state = {
    secret: '',
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

const dictionary = []
fetch('5_letter_words.txt')
    .then(r => r.text())
    .then(t => dictionary.push(...t.split('\n')))
    .then(d => choose_wordle_word())

function choose_wordle_word() {
    state.secret = dictionary[Math.floor(Math.random() * dictionary.length)]
    console.log(state.secret)
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = "box";
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawGrid(game) {
    const grid = document.createElement('div');
    grid.className = "grid";

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    game.appendChild(grid);
}


function drawKeyboard(alphabet) {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const keyboard = document.createElement('ul');
    keyboard.className = "keyboard";

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 13; j++) {
            let alpha = document.createElement('li')
            let lett = allLetters[i * 13 + j]
            alpha.className = 'alphaletter'
            alpha.id = `alpha-${lett}`;
            alpha.textContent = lett
            keyboard.appendChild(alpha)
        }
    }
    alphabet.appendChild(keyboard)

}
function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const { key } = e;
        if (key === 'Enter' && state.currentCol == 5) {
            const word = getCurrentWord();
            if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++
                state.currentCol = 0
            } else {
                alert(`${word} is not a valid word.`)
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(word) {
    const row = state.currentRow;
    const animationDuration = 300

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const alpha = document.getElementById(`alpha-${letter}`);


        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add("right");
                alpha.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
                alpha.classList.add('right');
            } else {
                box.classList.add('empty');
                alpha.classList.add('empty')
            }
        }, ((i + 1) * animationDuration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${((i + 1) * animationDuration) / 2}ms`
    }

    const isWinner = state.secret === word;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert('You win!')
        } else if (isGameOver) {
            alert('Game over! The word was ' + state.secret)
        }
    }, 3 * animationDuration);
}


function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) {
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) {
        return;
    }
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
}

function start() {
    const game = document.getElementById('game');
    const alphabet = document.getElementById('alphabet');

    drawGrid(game);
    drawKeyboard(alphabet);
    registerKeyboardEvents();
}

start()