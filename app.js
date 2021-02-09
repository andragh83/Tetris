const grid = document.getElementById('grid');
const extendedGrid = document.getElementById('extendedGrid');
const upNextGrid = document.getElementById('upNext');
const score = document.getElementById('score');
const gameOverH3 = document.getElementById('gameOver');
const outcome = document.getElementById('outcome');
const mQuery = window.matchMedia('(max-width: 768px)');
let youWin = false;
let speed = 1000;
let currentScore = 0
let gameOver = false;

// creating grid

const buildGrid = (parent, x, y, cellClassName) => {
    for (let i=0; i<x; i++) {
        let row = document.createElement('div');
            parent.appendChild(row).className = 'row';
        for (let j=0; j<y; j++) {
            let cell = document.createElement('div');
            row.appendChild(cell).className = cellClassName;
        }
        
    }
} 

buildGrid(grid, 20,10, 'cell'); // main grid
buildGrid(upNextGrid, 4, 4, 'upNextCell'); //small grid for up next

if (mQuery.matches) { 
    console.log('media query active')
    let mobileCell = document.querySelectorAll('.cell');
    mobileCell.forEach(cell => cell.classList.add('mobileCell'));
}

// adding a row at the bottom to check if tetrominos reached bottom

const addRowAtEnd = (parent, x,y) => {
    for (let i=0; i<x; i++) {
        let row = document.createElement('div');
            parent.appendChild(row).className = 'row';
        for (let j=0; j<y; j++) {
            let cell = document.createElement('div');
            row.appendChild(cell).className = 'cell taken notVisible';
        }
        
    }
}

addRowAtEnd(extendedGrid, 1,10);

// creating squares array storing each cell of the grid
let squares = Array.from(document.querySelectorAll(".cell"));
//creating the array for the upNext tetroimino
const upNextSquares = Array.from(document.querySelectorAll(".upNextCell"));


//creating tetromino paterns
const tetromino1 = (nbOfCells) => [
    [nbOfCells*2, nbOfCells,0,1], 
    [0,1,2,nbOfCells+2],
    [1,nbOfCells+1,nbOfCells*2+1,nbOfCells*2], 
    [0, nbOfCells, nbOfCells+1, nbOfCells+2]
];

const tetromino2 = (nbOfCells) => [
    [1, nbOfCells, nbOfCells+1, nbOfCells+2],
    [0, nbOfCells, nbOfCells+1, nbOfCells*2],
    [0,1,2, nbOfCells+1],
    [1, nbOfCells, nbOfCells+1, nbOfCells*2+1]
];

const tetromino3 = (nbOfCells) => [
    [0,1,nbOfCells+1, nbOfCells+2],
    [1, nbOfCells, nbOfCells+1, nbOfCells*2]
]
const tetromino4 = (nbOfCells) => [[0, 1, nbOfCells, nbOfCells+1]];
const tetromino5 = (nbOfCells) => [[0, nbOfCells, nbOfCells*2, nbOfCells*3], [0,1,2,3]];

const tetromino6 = (nbOfCells) => [
    [0, 1, nbOfCells+1, nbOfCells*2+1],
    [0,1,2,nbOfCells],
    [0,nbOfCells,nbOfCells*2,nbOfCells*2+1], 
    [2, nbOfCells, nbOfCells+1, nbOfCells+2], 
];

const tetromino7 = (nbOfCells) => [
    [0, nbOfCells, nbOfCells+1, nbOfCells*2+1],
    [1, 2, nbOfCells, nbOfCells+1]
]

// grid width
const width = 10;
// starting points pn the grid and first display of the first tetromino
const initialPosition = 4;
let currentPosition = 4;
let currentRotation = 0;

// generating tetrominoes

const allTetrominos = [
    tetromino1(width),
    tetromino2(width),
    tetromino3(width),
    tetromino4(width),
    tetromino5(width),
    tetromino6(width),
    tetromino7(width)
]

const allUpNextTetrominos = [
    tetromino1(4),
    tetromino2(4),
    tetromino3(4),
    tetromino4(4),
    tetromino5(4),
    tetromino6(4),
    tetromino7(4),
]

//generating current tetromino and nextUp tetromino

let randomIndex1 = Math.floor(Math.random() * allTetrominos.length);
let randomIndex2 = Math.floor(Math.random() * allTetrominos.length);
let current = allTetrominos[randomIndex1][currentRotation];
let currentUpNext = allUpNextTetrominos[randomIndex2][0];
let runGame = true;

const colorTetromino = (tetrominoIndex) => {
     current.forEach(square => {
        switch (tetrominoIndex) {
            case 0 : squares[square+currentPosition].classList.add('green');
            break;
            case 1 : squares[square+currentPosition].classList.add('darkGreen');
            break;
            case 2 : squares[square+currentPosition].classList.add('teal');
            break;
            case 3 : squares[square+currentPosition].classList.add('lightTeal');
            break;
            case 4 : squares[square+currentPosition].classList.add('red');
            break;
            case 5 : squares[square+currentPosition].classList.add('coral');
            break;
            case 6 : squares[square+currentPosition].classList.add('orange');
            break;
            default: squares[square+currentPosition].classList.add('teal');
        }
    })
}

const eraseTetromino = (tetrominoIndex) => {
    current.forEach(square => {
        switch (tetrominoIndex) {
            case 0 : squares[square+currentPosition].classList.remove('green');
            break;
            case 1 : squares[square+currentPosition].classList.remove('darkGreen');
            break;
            case 2 : squares[square+currentPosition].classList.remove('teal');
            break;
            case 3 : squares[square+currentPosition].classList.remove('lightTeal');
            break;
            case 4 : squares[square+currentPosition].classList.remove('red');
            break;
            case 5 : squares[square+currentPosition].classList.remove('coral');
            break;
            case 6 : squares[square+currentPosition].classList.remove('orange');
            break;
            default: squares[square+currentPosition].classList.remove('teal');
        }
    })
}

const colorUpNextTetromino = (tetrominoIndex) => {
    currentUpNext.forEach(square => {
        switch (tetrominoIndex) {
            case 0 : upNextSquares[square+1].classList.add('green');
            break;
            case 1 : upNextSquares[square+1].classList.add('darkGreen');
            break;
            case 2 : upNextSquares[square+1].classList.add('teal');
            break;
            case 3 : upNextSquares[square+1].classList.add('lightTeal');
            break;
            case 4 : upNextSquares[square+1].classList.add('red');
            break;
            case 5 : upNextSquares[square+1].classList.add('coral');
            break;
            case 6 : upNextSquares[square+1].classList.add('orange');
            break;
            default: upNextSquares[square+1].classList.add('teal');
        }
   })
}

const eraseUpNextTetromino = (tetrominoIndex) => {
    currentUpNext.forEach(square => {
        switch (tetrominoIndex) {
            case 0 : upNextSquares[square+1].classList.remove('green');
            break;
            case 1 : upNextSquares[square+1].classList.remove('darkGreen');
            break;
            case 2 : upNextSquares[square+1].classList.remove('teal');
            break;
            case 3 : upNextSquares[square+1].classList.remove('lightTeal');
            break;
            case 4 : upNextSquares[square+1].classList.remove('red');
            break;
            case 5 : upNextSquares[square+1].classList.remove('coral');
            break;
            case 6 : upNextSquares[square+1].classList.remove('orange');
            break;
            default: upNextSquares[square+1].classList.remove('teal');
        }
   })
}


const moveDown = () => {
        eraseTetromino(randomIndex1);
        currentPosition = currentPosition + width;
        colorTetromino(randomIndex1);
        freeze();
        checkGameOver();
}

const freeze = () => {
            if (current.some(square => squares[currentPosition+square+width].classList.contains("taken"))) {
                current.forEach(square => {squares[currentPosition+square].classList.add("taken")});
                eraseLines();
                eraseUpNextTetromino(randomIndex2);
                randomIndex1 = randomIndex2;
                randomIndex2 = Math.floor(Math.random() * allTetrominos.length);
                currentRotation=0;
                current = allTetrominos[randomIndex1][currentRotation];
                currentUpNext = allUpNextTetrominos[randomIndex2][0];
                currentPosition = 4;
                colorUpNextTetromino(randomIndex2);
                colorTetromino(randomIndex1);
           } 
             
    }

// keyboard control function
const control = (event) => {
    switch (event.keyCode) {
        case 37 : moveLeft();
        break;
        case 38 : rotate();
        break;
        case 39 : moveRight();
        break;
        case 40 : moveDown();
        break;
    }
};

// mobile screen control functions

let x = null;
let y = null;

const getTouchCoordinates = (event) => {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
}

const mobileControl = (event) => {
    let difX = event.changedTouches[0].clientX - x;
    let difY = event.changedTouches[0].clientY - y;
    if ( Math.abs( difX ) > Math.abs( difY ) ) {
        if (difX > 0) {
            moveRight();
        } else {
            moveLeft();
        } 
    } else {
        if (difY > 0) {
            moveDown();
        } else {
            rotate();
        }
    }
    x = null;
    y = null;
}

const rotate = () => {
            eraseTetromino(randomIndex1);
            currentRotation++;
            if (currentRotation === allTetrominos[randomIndex1].length) {currentRotation = 0};
            current = allTetrominos[randomIndex1][currentRotation];
            if (currentPosition%10 + getTetrominoWidth(current) > width) {
                currentPosition = currentPosition - (currentPosition%10 + getTetrominoWidth(current));
            }
            colorTetromino(randomIndex1); 
}

const moveLeft = () => {
    eraseTetromino(randomIndex1)
    const isLeftEdge = current.some(square => (square + currentPosition) % width === 0 )
    if (!isLeftEdge) currentPosition -=1;
    if (current.some(square => squares[square + currentPosition].classList.contains('taken'))) {
        currentPosition++;}
    colorTetromino(randomIndex1)
}
    
const moveRight = () => {
    eraseTetromino(randomIndex1)
    const isRightEdge = current.some(square => (square + currentPosition) % width === width-1 )
    if (!isRightEdge) currentPosition +=1;
    if (current.some(square => squares[square + currentPosition].classList.contains('taken'))) {
        currentPosition--;}
    colorTetromino(randomIndex1)
}

const getTetrominoWidth = (tetromino) => {
    let tetrominoWidth = 0;
    tetromino.forEach(square => {
        if (square % width > tetrominoWidth) {
            tetrominoWidth = square%width;
        }
    })
    return tetrominoWidth+1;
}

// erasing filled lines

const removingClass = (line, className) => {
    line.forEach((index) => {
        squares[index].classList.remove(className);
    })
}

const removingClassAndHtmlElements = (line) => {
    removingClass(line, 'taken')

    let rowToDelete = squares[line[0]].parentNode;
            while (rowToDelete.firstChild) {
                rowToDelete.removeChild(rowToDelete.firstChild);
            }
}

const newLineInsertedAtStart = () => {
    //creating new html row and adding it at the start
    let row = document.createElement('div');
    row.classList.add('row');
    grid.insertBefore(row, grid.childNodes[0]);

    //inserting html cells to newly created row
    for (let i=0; i<width; i++) {
        let cell = document.createElement('div');
        row.appendChild(cell).className = "cell";
    }
    
    if (mQuery.matches) { 
        let addedMobileCell = document.querySelectorAll('.cell');
        addedMobileCell.forEach(cell => cell.classList.add('mobileCell'));
    }
}

const addingClass = (line, className) => {
    line.forEach((index) => {
        squares[index].classList.add(className);
    })
}


const eraseLines = () => {
    for (let i=0; i<width*2; i++) {
        let countColor = 0;
        let checkedLineIndex = [];
        for (let j=0; j<width; j++) {
            if (squares[i*width+j].classList.contains('taken')) {
                countColor++;
                checkedLineIndex.push(i*width+j);
            }
        }

        if (countColor === 10) {
            currentScore++;
            score.innerText = currentScore.toString();

            // //removing classes from identified line and storring the line in a new array
            // const newLine = []
            // checkedLineIndex.forEach((index) => {
            //     squares[index].classList.remove('taken');
            //     // squares[index].classList.remove('teal');
            //     newLine.push(squares[index]);
            // })

            // //removing html elements
            // let rowToDelete = squares[checkedLineIndex[0]].parentNode;
            // while (rowToDelete.firstChild) {
            //     rowToDelete.removeChild(rowToDelete.firstChild);
            // }


            // //creating new html row and adding it at the start
            // let row = document.createElement('div');
            // row.classList.add('row');
            // grid.insertBefore(row, grid.childNodes[0]);

            // //inserting html cells to newly created row
            // for (let i=0; i<width; i++) {
            //     let cell = document.createElement('div');
            //     row.appendChild(cell).className = "cell";
            // }
            
            // if (mQuery.matches) { 
            //     let addedMobileCell = document.querySelectorAll('.cell');
            //     addedMobileCell.forEach(cell => cell.classList.add('mobileCell'));
            // }

            removingClassAndHtmlElements(checkedLineIndex, 'taken');
            addingClass(checkedLineIndex, 'teal');
            setTimeout(removingClass(checkedLineIndex, 'teal'), 500);
            setTimeout(addingClass(checkedLineIndex, 'teal'), 500);
            setTimeout(removingClass(checkedLineIndex, 'teal'), 500);
            newLineInsertedAtStart();

            //recreating squares array
            squares = Array.from(document.querySelectorAll(".cell"));
        }
    }
}

const checkGameOver = () => {
    if ((currentPosition < width*2 && 
        current.some(square => squares[currentPosition+square].classList.contains('taken'))) ||
        currentScore > 100){
            document.removeEventListener('keydown', control);
            console.log('GameOVER!!!');
            clearInterval(timerId); 
            button.innerText='Play again';
            gameOverH3.innerText = 'GAME OVER';
            gameOver = true;
            if (currentScore > 100) {
                youWin = true;
                outcome.innerText = 'YOU WIN!';
            } else {
                outcome.innerText = 'You lose...';
            }
    }
}

const buttonPlay = () => {
    document.addEventListener('keydown', control);
    document.addEventListener('touchstart', getTouchCoordinates, false);
    document.addEventListener('touchend', mobileControl, false);
    if (runGame && !gameOver) {
        colorTetromino(randomIndex1);
        colorUpNextTetromino(randomIndex2);
        timerId = setInterval(moveDown, speed);
        button.innerText='Pause'
        runGame = false;
    } else if (!runGame && !gameOver) {
        clearInterval(timerId);
        button.innerText='Start';
        runGame = true;

    } else if (gameOver) {
        if (youWin) {
            youWin = false;
        }

        //cleaning up the grid
        squares.forEach((square, i) => {
            if (i<squares.length-width) {
                squares[i].classList.remove('taken');
                squares[i].classList.remove('green');
                squares[i].classList.remove('darkGreen');
                squares[i].classList.remove('teal');
                squares[i].classList.remove('lightTeal');
                squares[i].classList.remove('red');
                squares[i].classList.remove('coral');
                squares[i].classList.remove('orange');
                squares[i].classList.remove('teal');
            
                // squares[i].classList.remove('teal');
            }
        });
        button.innerText='Pause'
        gameOverH3.innerText='';
        outcome.innerText = '';
        colorTetromino(randomIndex1);
        colorUpNextTetromino(randomIndex2);
        timerId = setInterval(moveDown, speed);
        gameOver = false;
        currentScore=0;
        score.innerText = currentScore.toString();
    }
}

const button = document.getElementById('start');
button.addEventListener('click', buttonPlay);