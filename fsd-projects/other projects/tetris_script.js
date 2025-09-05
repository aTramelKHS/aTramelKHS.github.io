//not my code!!! slight additions were made by me
//visit the site https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1

//plays game whenever a button is pressed
var colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

document.body.style.overflow = "hidden";
function game() {
  bgm.play();
  //reverts the scores and levels back to its original value whenever you reset the game
  let lineClears = 0;
  let level = 0;
  let tickSpeed = 84;
  let score = 0;
  levelUp();
  updateScore();
  let countInd = 0;
  let limit = false;
  let hold = "";
  let getNext;
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //decreases tick speed every 10 levels
  function levelUp() {
    if (lineClears % 10 - fast === 0) {
      level = lineClears / 10;
      tickSpeed -= 6;
    }
    document.getElementById("levelhtml").textContent = "Level: " + level;
    document.getElementById("lineshtml").textContent =
      "Line Clears: " + lineClears;
  }

  //updates the score display
  function updateScore() {
    document.getElementById("scorehtml").textContent = "Score: " + score;
  }
  //calculates whatever score is in the placeholder then updates it
  function increaseScore(points) {
    score += points;
    updateScore();
  }
  //DISPLAY THE NEXT TETROMINO
  //ctx for view next box and ct for hold box
  function display(box, container) {
    if (box === ctx) {
      getNext = tetrominoSequence[tetrominoSequence.length - 1];
      if (getNext === undefined) {
        getNextTetromino();
      }
    }
    if (container === "I") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.I;
      box.fillRect(50, 20, 20, 80);
    } else if (container === "J") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.J;
      box.fillRect(50, 20, 20, 80);
      box.fillRect(70, 20, 20, 20);
    } else if (container === "L") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.L;
      box.fillRect(50, 20, 20, 80);
      box.fillRect(30, 20, 20, 20);
    } else if (container === "O") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.O;
      box.fillRect(36, 36, 60, 60);
    } else if (container === "S") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.S;
      box.fillRect(60, 40, 40, 20);
      box.fillRect(40, 60, 40, 20);
    } else if (container === "Z") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.Z;
      box.fillRect(80, 40, -40, 20);
      box.fillRect(100, 60, -40, 20);
    } else if (container === "T") {
      box.clearRect(0, 0, 180, 180);
      box.fillStyle = colors.T;
      box.fillRect(40, 60, 60, 20);
      box.fillRect(60, 40, 20, 20);
    }
  }
  // generate a new tetromino sequence
  function generateSequence() {
    const sequence = ["I", "J", "L", "O", "S", "T", "Z"];

    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }

  // get the next tetromino in the sequence
  function getNextTetromino() {
    limit = false;
    if (tetrominoSequence.length === 0) {
      generateSequence();
      display(ctx, getNext);
    }
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === "I" ? -1 : -2;
    display(ctx, getNext);
    return {
      name: name, // name of the piece (L, O, etc.)
      matrix: matrix, // the current rotation matrix
      row: row, // current row (starts offscreen)
      col: col, // current col
    };
  }

  const viewBox = document.getElementById("viewnext");
  const ctx = viewBox.getContext("2d");
  const holdBox = document.getElementById('queue');
  const cx = holdBox.getContext('2d');


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
        if (
          matrix[row][col] &&
          // outside the game bounds
          (cellCol + col < 0 ||
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

  function displayTetris() {
    const tetrisIndicator = document.getElementById("indicator");
    if (tetrisIndicator) {
      tetrisIndicator.style.display = "inline";
      setTimeout(function () {
        tetrisIndicator.style.display = "none";
      }, 8000);
    }
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
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }
    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0; ) {
      if (playfield[row].every((cell) => !!cell)) {
        clearSound.play();
        lineClears += 1;
        levelUp();
        increaseScore(100);
        countInd += 1;
        if (countInd === 4) {
          displayTetris();
          //play sound ere
          countInd === 0;
        }
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r - 1][c];
          }
        }
      } else {
        row--;
      }
    }
    increaseScore(10);
    tetromino = getNextTetromino();
    countInd = 0;
  }

  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = "white";
    context.font = "30px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      "GAME OVER! " + score,
      canvas.width / 2,
      canvas.height / 2
    );
    bgm.pause();
  }

  const canvas = document.getElementById("game");
  const context = canvas.getContext("2d");
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
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };

  

  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null; // keep track of the animation frame so we can cancel it
  let gameOver = false;

  // game loop
  function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw the playfield
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];

          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
        }
      }
    }

    // draw the active tetromino
    if (tetromino) {
      // tetromino falls every few frames depending on the value of the tickSpeed variable
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
            context.fillRect(
              (tetromino.col + col) * grid,
              (tetromino.row + row) * grid,
              grid - 1,
              grid - 1
            );
          }
        }
      }
    }
  }


  // listen to keyboard events to move the active tetromino
  //held keys
  document.addEventListener("keydown", function (e) {
    if (gameOver) return;

    // left and right arrow keys (move)
    if (e.key === leftKey || e.key === rightKey) {
      const col = e.key === leftKey ? tetromino.col - 1 : tetromino.col + 1;
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
        playMove();
      }
      // if move is invalid play a different sound
    }

    // up arrow key (rotate)
    if (e.key === rotateKey) {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }

    // down arrow key (drop)
    if (e.key === fallKey) {
      const row = tetromino.row + 1;
      playDrop();
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
        placeTetromino();
        return;
      }

      tetromino.row = row;
    }

    // space key (hard drop)
    // thx stemisruler
    if (e.key === hardDropKey) {
      let row = tetromino.row;
      while (isValidMove(tetromino.matrix, row + 1, tetromino.col)) {
        row++;
      }
      tetromino.row = row;
      placeTetromino();
      return;
    }
  });
  //pressed keys
  document.addEventListener("keyup", function (e) {
    // hold block key
    if (e.key === holdBlockKey) {
      if (limit === false) {
        if (hold !== "") {
          tetromino.row = -1;
          tetromino.col = 3;
          [hold, tetromino] = [tetromino, hold];
          tetrominoSequence.push(tetromino.name);
        } 
        else {
          hold = tetromino;
        }
        tetromino = getNextTetromino();
        limit = true;
        display(cx, hold.name);
      }
      else {
        console.log('limit reached');
      }
    }
  });

  // start the game
  rAF = requestAnimationFrame(loop);
}
