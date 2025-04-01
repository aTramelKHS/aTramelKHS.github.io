//not my code!!!
//visit the site https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1

let clearSound = new Audio("source/sounds/line-clear.mp3");
let bgm = new Audio("source/sounds/testsong.wav")
function playSong1(){
  bgm.src = "source/sounds/typeb.mp3"
}



function game() {
  bgm.play();
  let lineClears = 0;
  var level = 0;
  var tickSpeed = 72;
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //queue();
  function levelUp() {
    if (lineClears === 10) {
      level = 1;
      tickSpeed -= 6;
    } else if (lineClears === 20) {
      level = 2;
      tickSpeed -= 6;
    } else if (lineClears === 30) {
      level = 3;
      tickSpeed -= 6;
    } else if (lineClears === 40) {
      level = 4;
      tickSpeed -= 6;
    } else if (lineClears === 50) {
      level = 5;
      tickSpeed -= 6;
    } else if (lineClears === 60) {
      level = 6;
      tickSpeed -= 6;
    } else if (lineClears === 70) {
      level = 7;
      tickSpeed -= 6;
    } else if (lineClears === 80) {
      level = 8;
      tickSpeed -= 6;
    } else if (lineClears === 90) {
      level = 9;
      tickSpeed -= 6;
    } else if (lineClears === 100) {
      level = 10;
      tickSpeed -= 6;
    } else if (lineClears === 110) {
      level = 11;
      tickSpeed -= 6;
    } else if (lineClears === 120) {
      level = 12;
      tickSpeed -= 6;
    }
    document.getElementById('levelhtml').textContent = "Level: " + level;
    document.getElementById('lineshtml').textContent = "Line Clears: " + lineClears;
  }
  
  let score = 0;
  function updateScore() {
    document.getElementById('scorehtml').textContent = "Score: " + score;
  }
  function increaseScore(points) {
    score += points;
    updateScore();
  }
  var showNext;
  // generate a new tetromino sequence
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
      showNext === tetrominoSequence;
    }
  }

  // get the next tetromino in the sequence
  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
      name: name,      // name of the piece (L, O, etc.)
      matrix: matrix,  // the current rotation matrix
      row: row,        // current row (starts offscreen)
      col: col         // current col
    };
  }

  // rotate an NxN matrix 90 degrees
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );

    return result;
  }

  // check to see if the new matrix/row/col is valid
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            // collides with another piece
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }

    return true;
  }

  // place the tetromino on the playfield
  function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            return showGameOver();
          }
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name
        }
      }
    }

    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0; ) {
      if (playfield[row].every(cell => !!cell)) {
        clearSound.play();
        lineClears += 1;
        levelUp();
        increaseScore(100);
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }
    increaseScore(10);
    tetromino = getNextTetromino();
  }

  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '30px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER! ' + score, canvas.width / 2, canvas.height / 2);
  }




  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];

  // keep track of what is in every cell of the game using a 2d array
  // tetris playfield is 10x20, with a few rows offscreen
  const playfield = [];

  // populate the empty state
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }

  // how to draw each tetromino
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };

  // color of each tetromino
  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };

  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;  // keep track of the animation frame so we can cancel it
  let gameOver = false;

  // game loop
  function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
    // draw the playfield
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];

          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        }
      }
    }

    // draw the active tetromino
    if (tetromino) {

      // tetromino falls every 35 frames
      if (++count > tickSpeed) {
        tetromino.row++;
        count = 0;
        

        // place piece if it runs into anything
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }

      context.fillStyle = colors[tetromino.name];

      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {

            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }

  // listen to keyboard events to move the active tetromino
  document.addEventListener('keydown', function(e) {
    if (gameOver) return;

    // left and right arrow keys (move)
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      
      const col = e.code === "ArrowLeft"
        ? tetromino.col - 1
        : tetromino.col + 1;
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }

    // up arrow key (rotate)
    if (e.code === "ArrowUp") {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }

    // down arrow key (drop)
    if(e.code === "ArrowDown") {
      const row = tetromino.row + 1;

      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;

        placeTetromino();
        return;
      }

      tetromino.row = row;
    }
  });

  // start the game
  rAF = requestAnimationFrame(loop);
}

/* function queue() {
  console.log(showNext);
} */