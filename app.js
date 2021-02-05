const grid = document.getElementById('grid');
const extendedGrid = document.getElementById('extendedGrid');
const upNextGrid = document.getElementById('upNext');
let speed = 1000;

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

buildGrid(grid, 20,10, 'cell');
buildGrid(upNextGrid, 4, 4, 'upNextCell');

const upNextSquares = Array.from(document.querySelectorAll(".upNextCell"));

const addTakenClass = (parent, x,y) => {
    for (let i=0; i<x; i++) {
        let row = document.createElement('div');
            parent.appendChild(row).className = 'row';
        for (let j=0; j<y; j++) {
            let cell = document.createElement('div');
            row.appendChild(cell).className = 'cell taken notVisible';
        }
        
    }
}

addTakenClass(extendedGrid, 1,10)


const squares = Array.from(document.querySelectorAll(".cell"));
const width = 10;

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

const allTetrominos = [
    tetromino1(width),
    tetromino2(width),
    tetromino3(width),
    tetromino4(width),
    tetromino5(width)
]

const allUpNextTetrominos = [
    tetromino1(4),
    tetromino2(4),
    tetromino3(4),
    tetromino4(4),
    tetromino5(4)
]

const initialPosition = 4;
let currentPosition = 4;
let currentRotation = 0;
let randomIndex1 = Math.floor(Math.random() * allTetrominos.length);
let randomIndex2 = Math.floor(Math.random() * allTetrominos.length);
let current = allTetrominos[randomIndex1][currentRotation];
let currentUpNext = allUpNextTetrominos[randomIndex2][currentRotation];
let runGame = true;


const colorTetromino = () => {
     current.forEach(square => {
        squares[square+currentPosition].classList.add('teal');
    })
}

const eraseTetromino = () => {
    current.forEach(square => {
        squares[square+currentPosition].classList.remove('teal');
    })
}

const colorUpNextTetromino = () => {
    currentUpNext.forEach(square => {
        upNextSquares[square+1].classList.add('teal');
   })
}

const eraseUpNextTetromino = () => {
    currentUpNext.forEach(square => {
        upNextSquares[square+1].classList.remove('teal');
   })
}


const moveDown = () => {
        eraseTetromino();
        currentPosition = currentPosition + width;
        colorTetromino();
        freeze();
}

const freeze = () => {
        current.some(square => {
           if(current.some(square => squares[currentPosition+square+width].classList.contains("taken"))) {
            current.forEach(square => {squares[currentPosition+square].classList.add("taken")});
            current.forEach(square => {squares[currentPosition+square].classList.add("locked")});
            // let countColored = 0;
            // for (let i=Math.floor(currentPosition/10)*10; i<=Math.floor(currentPosition/10)*10+9; i++) {
            //         if (squares[i].classList.contains('locked')) {
            //             console.log('square', i, ':', squares[i]);
            //             countColored++;
            //             console.log('countColored', countColored);
            //         }
            // }
            // if (countColored === 10) {console.log('found line')}
            eraseUpNextTetromino();
            randomIndex1 = randomIndex2;
            randomIndex2 = Math.floor(Math.random() * allTetrominos.length);
            currentRotation=0;
            current = allTetrominos[randomIndex1][currentRotation];
            currentUpNext = allUpNextTetrominos[randomIndex2][currentRotation];
            currentPosition = 4;
            colorUpNextTetromino();
            colorTetromino();
           } 
            
        })    
    }

const control = (e) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37 : moveLeft();
        break;
        case 38 : rotate();
        break;
        case 39 : moveRight();
        break;
        case 40 : moveDown();
        break;
        default:
            console.log(`Expecting action`);
    }
}

document.addEventListener('keyup', control);

const rotate = () => {
        // if (current ==== tetromino5 && !isRightEdge) {
            eraseTetromino();
            currentRotation++;
            if (currentRotation === allTetrominos[randomIndex1].length) {currentRotation = 0};
            current = allTetrominos[randomIndex1][currentRotation];
            console.log('currentPosition', currentPosition)
            const cannotRotate = current.some(square => (currentPosition + square) % width === width-1 )
            if (cannotRotate) {currentRotation--};
            colorTetromino(); 
        // }           
}

const moveLeft = () => {
    console.log('move left')
    eraseTetromino()
    const isLeftEdge = current.some(square => (square + currentPosition) % width === 0 )
    if (!isLeftEdge) currentPosition -=1;
    if (current.some(square => squares[square + currentPosition].classList.contains('taken'))) {
        currentPosition++;}
    colorTetromino()
}
    
const moveRight = () => {
    eraseTetromino()
    const isRightEdge = current.some(square => (currentPosition + square) % width === width-1 )
    if (!isRightEdge) currentPosition +=1;
    if (current.some(square => squares[square + currentPosition].classList.contains('taken'))) {
        currentPosition--;}
    colorTetromino()
}

const togglePlay = () => {
    console.log ('runGame', runGame)
    if (runGame) {
        console.log ('togglePlay when game runs')
        colorTetromino();
        colorUpNextTetromino();
        timerId = setInterval(moveDown, speed);
        button.innerText='Pause'
        runGame = false;
    } else {
        console.log ('togglePlay not')
        clearInterval(timerId);
        button.innerText='Play';
        runGame = true;
    }
}

const button = document.getElementById('start');
button.addEventListener('click', togglePlay);
