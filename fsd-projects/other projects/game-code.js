document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let holdQueue = 0;

  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]
  

  // Tetrominoes
  const lTetromino = [
    [1,width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const zTetromino = [
    [0,width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0,width,width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetriminoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4;
  let currentRotation = 0;


// random tetromino
  let random = Math.floor(Math.random() * theTetriminoes.length);
  let current = theTetriminoes[random][currentRotation];

  //draw 
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetrimino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

//undraw
  function undraw() {
    current.forEach(index => {
      squares[currentPosition+ index].classList.remove('tetrimino');
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  //make thy tetromino move downward every second
  //timerId = setInterval(moveDown, 1000);

  // assign functions to keys
  function control(e) {
    if(e.keyCode === 37){
      moveLeft();
    } 
    else if (e.keyCode === 38) {
      rotate();
    } 
    else if (e.keyCode === 39) {
      moveRight();
    }
    else if (e.keyCode === 40 ) {
      moveDown();
    }
  }
  //if key is held down
  document.addEventListener('keydown', control)

  //thy move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze!
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // start a new tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetriminoes.length);
      current = theTetriminoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left + rulessss
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => [currentPosition + index] % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }

    draw();
  }

 //move right + rules
 function moveRight() {
  undraw();
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
  
  if(!isAtRightEdge) currentPosition += 1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }

  draw();
 }
 function isAtRight() {
  return current.some(index=> (currentPosition + index + 1) % width === 0)  
}

function isAtLeft() {
  return current.some(index=> (currentPosition + index) % width === 0)
}

//fixesed

function checkRotatedPosition(P){
  P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
  if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
    if (isAtRight()){            //use actual position to check if it's flipped over to right side
      currentPosition += 1    //if so, add one to wrap it back around
      checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
  }
  else if (P % width > 5) {
    if (isAtLeft()){
      currentPosition -= 1
    checkRotatedPosition(P)
    }
  }
}

 //rotation
function rotate() {
  undraw();
  currentRotation ++;
  if(currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetriminoes[random][currentRotation];
  checkRotatedPosition();
  draw();
 }
 
 //show next tetrimino
 const displaySquares = document.querySelectorAll('.mini-grid div');
 const displayWidth = 4;
 const displayIndex = 0;

 //the Tertominoo without rotations
 const upNextTetrominoes = [
  [1,displayWidth+1, displayWidth*2+1, 2], //L
  [0,displayWidth, displayWidth+1, displayWidth*2+1], //Z
  [1, displayWidth, displayWidth+1, displayWidth+2], //T
  [0, 1, displayWidth, displayWidth+1], //O
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //I
 ]

//display that shape
 function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove('tetrimino')
  })
  upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add('tetrimino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
 }


 startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  else {
    let level = prompt('what level do you want to be on? (0 - 12)');
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random()*theTetriminoes.length);
    displayShape();
  }
 })

 //add score
 function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetrimino');
        squares[index].computedStyleMap.backroundColor = '';
      })
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
 }

//game over
 function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'end';
    clearInterval(timerId);
    undraw();
  }
 }

 if (score === 1000 || level === 0) {
  timerId = setInterval(moveDown, 1200);
 }
 else if (score === 2100 || level === 1) {
  timerId = setInterval(moveDown, 1800);
 }
 else if (score === 3400 || level === 2) {
  timerId = setInterval(moveDown, 2400);
 }
 else if (score === 4600 || level === 3) {
  timerId = setInterval(moveDown, 2900);
 }
 else {
  timerId = setInterval(moveDown, 20);
 }






  
})