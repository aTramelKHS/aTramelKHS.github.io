//not my code!!! slight additions were made by me
//visit the site https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1

//store scores
const scoresKey = 'myScores';
let storedScores = JSON.parse(localStorage.getItem(scoresKey)) || [];
let scoreConvert = storedScores.map(item => parseInt(item, 10));

let highScore = scoreConvert.sort((a, b) => b - a);
highScore = highScore.slice(0, 10);

//base colors
var colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

var neonColors = {
  I: ["rgba(80, 254, 254, 1)", 'rgba(80, 254, 254, 0.7)', 'rgba(80, 254, 254, 0.5)'],
  O: ["rgba(252, 255, 0, 1)", "rgba(252, 255, 0, 0.7)", "rgba(252, 255, 0, 0.5)"],
  T: ["rgba(188, 19, 254, 1)", "rgba(188, 19, 254, 0.7)", "rgba(188, 19, 254, 0.5)"],
  S: ["rgba(57, 255, 20, 1)", "rgba(57, 255, 20, 0.7)", "rgba(57, 255, 20, 0.5)"],
  Z: ["rgba(255, 49, 49, 1)", "rgba(255, 49, 49, 0.7)" , "rgba(255, 49, 49, 0.5)"],
  J: ["rgba(35, 35, 255, 1)", "rgba(35, 35, 255, 0.7)", "rgba(35, 35, 255, 0.5)"],
  L: ["rgba(255, 95, 31, 1)", "rgba(255, 95, 31, 0.7)", "rgba(255, 95, 31, 0.5)"]
};

//plays game whenever a button is pressed
document.body.style.overflow = "hidden";
function game() {
  bgm.play();
  bgm.currentTime = 0;
  //reverts the scores and levels back to its original value whenever you reset the game
  let lineClears = 0;
  let score = 0;
  let level = 0;
  let tickSpeed = 84;
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
    if (lineClears % 10 === 0) {
      level = lineClears / 10;
      tickSpeed -= 6 + fast;
    }
    document.getElementById("levelhtml").textContent = "Level: " + level;
    document.getElementById("lineshtml").textContent = "Line Clears: " + lineClears;
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
  function display() {
    getNext = tetrominoSequence[tetrominoSequence.length - 1];
    if (getNext === undefined) {
      getNextTetromino();
    }
    if (getNext === "I") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.I;
      if (!neon) {
        ctx.fillRect(50, 20, 20, 80);
      } else if (neon) {
        ctx.beginPath()
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.I[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.I[1];
        ctx.lineWidth = 3;
        ctx.fillRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
        ctx.strokeRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.I[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.I[1];
        ctx.lineWidth = 3;
        ctx.fillRect(50 + 2, 20 + 2, 20, 80);
        ctx.strokeRect(50 + 2, 20 + 2, 20, 80);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.I[0];
        ctx.fillStyle = neonColors.I[2];
        ctx.fillRect(50 + 2, 20 + 2, 20, 80);
        ctx.closePath();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else if (getNext === "J") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.J;
      if (!neon) {
        ctx.fillRect(50, 20, 20, 70);
        ctx.fillRect(70, 20, 20, 20);
      } else if (neon) {
        ctx.shadowBlur = 46;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)'; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        ctx.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        ctx.shadowBlur = 125;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)'; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(50 + 2, 20 + 2, 20, 70);
        ctx.strokeRect(50 + 2, 20 + 2, 20, 70);
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)';
        ctx.fillStyle = 'rgba(35, 35, 255, 0.5)';
        ctx.fillRect(50 + 2, 20 + 2, 20, 70);
        ctx.shadowBlur = 46;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)'; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
        ctx.strokeRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
        ctx.shadowBlur = 125;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)'; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(80 + 2, 20 + 2, 20, 20);
        ctx.strokeRect(80 + 2, 20 + 2, 20, 20);
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(35, 35, 255, 1)';
        ctx.fillStyle = 'rgba(35, 35, 255, 0.7)';
        ctx.fillRect(80 + 2, 20 + 2, 20, 20);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
    } else if (getNext === "L") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.L;
      if (!neon) {
        ctx.fillRect(50, 20, 20, 70);
        ctx.fillRect(30, 20, 20, 20);
      } else if (neon) {
        ctx.shadowBlur = 46;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)'; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        ctx.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        ctx.shadowBlur = 125;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)'; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(50 + 2, 20 + 2, 20, 70);
        ctx.strokeRect(50 + 2, 20 + 2, 20, 70);
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)';
        ctx.fillStyle = 'rgba(255, 95, 31, 0.5)';
        ctx.fillRect(50 + 2, 20 + 2, 20, 70);
        ctx.shadowBlur = 46;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)'; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
        ctx.strokeRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
        ctx.shadowBlur = 125;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)'; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(18 + 2, 20 + 2, 20, 20);
        ctx.strokeRect(18 + 2, 20 + 2, 20, 20);
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(255, 95, 31, 1)';
        ctx.fillStyle = 'rgba(255, 95, 31, 0.7)';
        ctx.fillRect(18 + 2, 20 + 2, 20, 20);


        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else if (getNext === "O") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.O
      if (!neon) {
        ctx.fillRect(36, 36, 60, 60);
      } else if (neon) {
        ctx.shadowBlur = 33;
        ctx.shadowColor = 'rgba(252, 255, 0, 1)'; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(252, 255, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
        ctx.strokeRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = 'rgba(252, 255, 0, 1)'; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgba(252, 255, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.fillRect(40 + 2, 40 + 2, 60, 60);
        ctx.strokeRect(40 + 2, 40 + 2, 60, 60);
        ctx.shadowBlur = 223;
        ctx.shadowColor = 'rgba(252, 255, 0, 1)';
        ctx.fillStyle = 'rgba(252, 255, 0,0.5)';
        ctx.fillRect(40 + 2, 40 + 2, 60, 60);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else if (getNext === "S") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.S;
      if (!neon) {
        ctx.fillRect(60, 40, 40, 20);
        ctx.fillRect(40, 60, 40, 20);
      } else if (neon) {
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.S[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.S[1];
        ctx.lineWidth = 3;
        ctx.fillRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
        ctx.strokeRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.S[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.S[1];
        ctx.lineWidth = 3;
        ctx.fillRect(60 + 2, 40 + 2, 45, 20);
        ctx.strokeRect(60 + 2, 40 + 2, 45, 20);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.S[1];
        ctx.fillStyle = neonColors.S[2];
        ctx.fillRect(60 + 2, 40 + 2, 45, 20);
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.S[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.S[1];
        ctx.lineWidth = 3;
        ctx.fillRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
        ctx.strokeRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.S[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.S[1];
        ctx.lineWidth = 3;
        ctx.fillRect(35 + 2, 70 + 2, 45, 20);
        ctx.strokeRect(35 + 2, 70 + 2, 45, 20);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.S[1];
        ctx.fillStyle = neonColors.S[2];
        ctx.fillRect(35 + 2, 70 + 2, 45, 20);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else if (getNext === "Z") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.Z
      if (!neon) {
        ctx.fillRect(80, 40, -40, 20);
        ctx.fillRect(100, 60, -40, 20);
      } else if (neon) {
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.Z[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.Z[1];
        ctx.lineWidth = 3;
        ctx.fillRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
        ctx.strokeRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.Z[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.Z[1];
        ctx.lineWidth = 3;
        ctx.fillRect(20 + 2, 40 + 2, 45, 20);
        ctx.strokeRect(20 + 2, 40 + 2, 45, 20);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.Z[1];
        ctx.fillStyle = neonColors.Z[2];
        ctx.fillRect(20 + 2, 40 + 2, 45, 20);
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.Z[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.Z[1];
        ctx.lineWidth = 3;
        ctx.fillRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
        ctx.strokeRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.Z[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.Z[1];
        ctx.lineWidth = 3;
        ctx.fillRect(45 + 2, 70 + 2, 45, 20);
        ctx.strokeRect(45 + 2, 70 + 2, 45, 20);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.Z[1];
        ctx.fillStyle = neonColors.Z[2];
        ctx.fillRect(45 + 2, 70 + 2, 45, 20);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else if (getNext === "T") {
      ctx.clearRect(0, 0, 180, 180);
      ctx.fillStyle = colors.T;
      if (!neon) {
        ctx.fillRect(40, 60, 60, 20);
        ctx.fillRect(60, 40, 20, 20);
      } else if (neon) {
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.T[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.T[1];
        ctx.lineWidth = 3;
        ctx.fillRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
        ctx.strokeRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.T[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.T[1];
        ctx.lineWidth = 3;
        ctx.fillRect(40 + 2, 60 + 2, 70, 20);
        ctx.strokeRect(40 + 2, 60 + 2, 70, 20);
        ctx.shadowBlur = 223;
        ctx.shadowColor = neonColors.T[1];
        ctx.fillStyle = neonColors.T[2];
        ctx.fillRect(40 + 2, 60 + 2, 70, 20);
        ctx.shadowBlur = 33;
        ctx.shadowColor = neonColors.T[0]; 
        ctx.fillStyle = 'white';
        ctx.strokeStyle = neonColors.T[1];
        ctx.lineWidth = 3;
        ctx.fillRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
        ctx.strokeRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
        ctx.shadowBlur = 63;
        ctx.shadowColor = neonColors.T[0]; 
        ctx.fillStyle = 'black';
        ctx.strokeStyle = neonColors.T[1];
        ctx.lineWidth = 3;
        ctx.fillRect(65 + 2, 30 + 2, 20, 20);
        ctx.strokeRect(65 + 2, 30 + 2, 20, 20);
        ctx.shadowBlur = 9;
        ctx.shadowColor = neonColors.T[1];
        ctx.fillStyle = neonColors.T[2];
        ctx.fillRect(65 + 2, 30 + 2, 20, 20);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
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
      display();
    }
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === "I" ? -1 : -2;
    display();
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
      }, 6000);
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
  let test = 0;
  let anim;
  function animateClear() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, 30 * test);
    if (test != 22) {
      test += 1;
    }
    anim = requestAnimationFrame(animateClear);
  }

  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    bgm.pause();
    setTimeout(() => {
      animateClear()
    }, 1000);
    setTimeout(() => {
      cancelAnimationFrame(anim);
      context.fillStyle = "gray";
      context.globalAlpha = 0.75;
      context.fillRect(0, canvas.height / 2 - 60, canvas.width, 140);
      context.globalAlpha = 1;
      context.fillStyle = "white";
      context.font = "30px monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        "GAME OVER!",
        canvas.width / 2,
        canvas.height / 2.2
      );
      context.fillText(
        "Score: " + score,
        canvas.width / 2,
        canvas.height / 1.9
      );
      context.fillText(
        "HS: " + highScore[0],
        canvas.width / 2,
        canvas.height / 1.7
      );
      
    }, 2000);
    storedScores.push(score);
    localStorage.setItem(scoresKey, JSON.stringify(storedScores));
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
  let paused = false;

  // game loop
  function loop() {
    if (gameOver || paused) return;
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
          //make the neon things happen
          if (neon) {
            context.shadowBlur = 23;
            context.shadowColor = neonColors[name][0]; 
            context.fillStyle = 'white';
            context.strokeStyle = neonColors[name][1];
            context.lineWidth = 1;
            context.fillRect(col * grid, row * grid, grid - 2, grid - 2);
            context.strokeRect(col * grid, row * grid, grid - 2, grid - 2);
            context.shadowBlur = 33;
            context.shadowColor = neonColors[name][0]; 
            context.fillStyle = 'black';
            context.strokeStyle = neonColors[name][1]; 
            context.lineWidth = 2;
            context.fillRect(col * grid + 4, row * grid + 4, grid - 10, grid - 10);
            context.strokeRect(col * grid + 4, row * grid + 4, grid - 10, grid - 10);
            context.shadowBlur = 23;
            context.shadowColor = neonColors[name][0]; 
            context.fillStyle = neonColors[name][2]; 
            context.fillRect(col * grid + 4, row * grid + 4, grid - 10, grid - 10);
            context.shadowColor = "transparent";
            context.shadowBlur = 0;
          }
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
    if (gameOver || paused) return;
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
    if (gameOver || paused) return;
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
        if (hold.name === "I") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.I;
          if (!neon) {
            cx.fillRect(50, 20, 20, 80);
          } else if (neon) {
            cx.beginPath()
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.I[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.I[1];
            cx.lineWidth = 3;
            cx.fillRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
            cx.strokeRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.I[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.I[1];
            cx.lineWidth = 3;
            cx.fillRect(50 + 2, 20 + 2, 20, 80);
            cx.strokeRect(50 + 2, 20 + 2, 20, 80);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.I[0];
            cx.fillStyle = neonColors.I[2];
            cx.fillRect(50 + 2, 20 + 2, 20, 80);
            cx.closePath();

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        } else if (hold.name === "J") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.J;
          if (!neon) {
            cx.fillRect(50, 20, 20, 70);
            cx.fillRect(70, 20, 20, 20);
          } else if (neon) {
            cx.shadowBlur = 46;
            cx.shadowColor = 'rgba(35, 35, 255, 1)'; 
            cx.fillStyle = 'white';
            cx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
            cx.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
            cx.shadowBlur = 125;
            cx.shadowColor = 'rgba(35, 35, 255, 1)'; 
            cx.fillStyle = 'black';
            cx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(50 + 2, 20 + 2, 20, 70);
            cx.strokeRect(50 + 2, 20 + 2, 20, 70);
            cx.shadowBlur = 24;
            cx.shadowColor = 'rgba(35, 35, 255, 1)';
            cx.fillStyle = 'rgba(35, 35, 255, 0.5)';
            cx.fillRect(50 + 2, 20 + 2, 20, 70);
            cx.shadowBlur = 46;
            cx.shadowColor = 'rgba(35, 35, 255, 1)'; 
            cx.fillStyle = 'white';
            cx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
            cx.strokeRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
            cx.shadowBlur = 125;
            cx.shadowColor = 'rgba(35, 35, 255, 1)'; 
            cx.fillStyle = 'black';
            cx.strokeStyle = 'rgba(35, 35, 255, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(80 + 2, 20 + 2, 20, 20);
            cx.strokeRect(80 + 2, 20 + 2, 20, 20);
            cx.shadowBlur = 24;
            cx.shadowColor = 'rgba(35, 35, 255, 1)';
            cx.fillStyle = 'rgba(35, 35, 255, 0.7)';
            cx.fillRect(80 + 2, 20 + 2, 20, 20);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
          }
        } else if (hold.name === "L") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.L;
          if (!neon) {
            cx.fillRect(50, 20, 20, 70);
            cx.fillRect(30, 20, 20, 20);
          } else if (neon) {
            cx.shadowBlur = 46;
            cx.shadowColor = 'rgba(255, 95, 31, 1)'; 
            cx.fillStyle = 'white';
            cx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
            cx.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
            cx.shadowBlur = 125;
            cx.shadowColor = 'rgba(255, 95, 31, 1)'; 
            cx.fillStyle = 'black';
            cx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(50 + 2, 20 + 2, 20, 70);
            cx.strokeRect(50 + 2, 20 + 2, 20, 70);
            cx.shadowBlur = 24;
            cx.shadowColor = 'rgba(255, 95, 31, 1)';
            cx.fillStyle = 'rgba(255, 95, 31, 0.5)';
            cx.fillRect(50 + 2, 20 + 2, 20, 70);
            cx.shadowBlur = 46;
            cx.shadowColor = 'rgba(255, 95, 31, 1)'; 
            cx.fillStyle = 'white';
            cx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
            cx.strokeRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
            cx.shadowBlur = 125;
            cx.shadowColor = 'rgba(255, 95, 31, 1)'; 
            cx.fillStyle = 'black';
            cx.strokeStyle = 'rgba(255, 95, 31, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(18 + 2, 20 + 2, 20, 20);
            cx.strokeRect(18 + 2, 20 + 2, 20, 20);
            cx.shadowBlur = 24;
            cx.shadowColor = 'rgba(255, 95, 31, 1)';
            cx.fillStyle = 'rgba(255, 95, 31, 0.7)';
            cx.fillRect(18 + 2, 20 + 2, 20, 20);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        } else if (hold.name === "O") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.O
          if (!neon) {
            cx.fillRect(36, 36, 60, 60);
          } else if (neon) {
            cx.shadowBlur = 33;
            cx.shadowColor = 'rgba(252, 255, 0, 1)'; 
            cx.fillStyle = 'white';
            cx.strokeStyle = 'rgba(252, 255, 0, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
            cx.strokeRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = 'rgba(252, 255, 0, 1)'; 
            cx.fillStyle = 'black';
            cx.strokeStyle = 'rgba(252, 255, 0, 0.6)';
            cx.lineWidth = 3;
            cx.fillRect(40 + 2, 40 + 2, 60, 60);
            cx.strokeRect(40 + 2, 40 + 2, 60, 60);
            cx.shadowBlur = 223;
            cx.shadowColor = 'rgba(252, 255, 0, 1)';
            cx.fillStyle = 'rgba(252, 255, 0,0.5)';
            cx.fillRect(40 + 2, 40 + 2, 60, 60);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        } else if (hold.name === "S") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.S;
          if (!neon) {
            cx.fillRect(60, 40, 40, 20);
            cx.fillRect(40, 60, 40, 20);
          } else if (neon) {
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.S[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.S[1];
            cx.lineWidth = 3;
            cx.fillRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
            cx.strokeRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.S[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.S[1];
            cx.lineWidth = 3;
            cx.fillRect(60 + 2, 40 + 2, 45, 20);
            cx.strokeRect(60 + 2, 40 + 2, 45, 20);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.S[1];
            cx.fillStyle = neonColors.S[2];
            cx.fillRect(60 + 2, 40 + 2, 45, 20);
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.S[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.S[1];
            cx.lineWidth = 3;
            cx.fillRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
            cx.strokeRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.S[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.S[1];
            cx.lineWidth = 3;
            cx.fillRect(35 + 2, 70 + 2, 45, 20);
            cx.strokeRect(35 + 2, 70 + 2, 45, 20);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.S[1];
            cx.fillStyle = neonColors.S[2];
            cx.fillRect(35 + 2, 70 + 2, 45, 20);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        } else if (hold.name === "Z") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.Z
          if (!neon) {
            cx.fillRect(80, 40, -40, 20);
            cx.fillRect(100, 60, -40, 20);
          } else if (neon) {
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.Z[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.Z[1];
            cx.lineWidth = 3;
            cx.fillRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
            cx.strokeRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.Z[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.Z[1];
            cx.lineWidth = 3;
            cx.fillRect(20 + 2, 40 + 2, 45, 20);
            cx.strokeRect(20 + 2, 40 + 2, 45, 20);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.Z[1];
            cx.fillStyle = neonColors.Z[2];
            cx.fillRect(20 + 2, 40 + 2, 45, 20);
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.Z[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.Z[1];
            cx.lineWidth = 3;
            cx.fillRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
            cx.strokeRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.Z[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.Z[1];
            cx.lineWidth = 3;
            cx.fillRect(45 + 2, 70 + 2, 45, 20);
            cx.strokeRect(45 + 2, 70 + 2, 45, 20);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.Z[1];
            cx.fillStyle = neonColors.Z[2];
            cx.fillRect(45 + 2, 70 + 2, 45, 20);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        } else if (hold.name === "T") {
          cx.clearRect(0, 0, 180, 180);
          cx.fillStyle = colors.T;
          if (!neon) {
            cx.fillRect(40, 60, 60, 20);
            cx.fillRect(60, 40, 20, 20);
          } else if (neon) {
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.T[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.T[1];
            cx.lineWidth = 3;
            cx.fillRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
            cx.strokeRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.T[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.T[1];
            cx.lineWidth = 3;
            cx.fillRect(40 + 2, 60 + 2, 70, 20);
            cx.strokeRect(40 + 2, 60 + 2, 70, 20);
            cx.shadowBlur = 223;
            cx.shadowColor = neonColors.T[1];
            cx.fillStyle = neonColors.T[2];
            cx.fillRect(40 + 2, 60 + 2, 70, 20);
            cx.shadowBlur = 33;
            cx.shadowColor = neonColors.T[0]; 
            cx.fillStyle = 'white';
            cx.strokeStyle = neonColors.T[1];
            ctx.lineWidth = 3;
            cx.fillRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
            cx.strokeRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
            cx.shadowBlur = 63;
            cx.shadowColor = neonColors.T[0]; 
            cx.fillStyle = 'black';
            cx.strokeStyle = neonColors.T[1];
            cx.lineWidth = 3;
            cx.fillRect(65 + 2, 30 + 2, 20, 20);
            cx.strokeRect(65 + 2, 30 + 2, 20, 20);
            cx.shadowBlur = 9;
            cx.shadowColor = neonColors.T[1];
            cx.fillStyle = neonColors.T[2];
            cx.fillRect(65 + 2, 30 + 2, 20, 20);

            cx.shadowColor = "transparent";
            cx.shadowBlur = 0;
            cx.shadowOffsetX = 0;
            cx.shadowOffsetY = 0;
          }
        }
      }
      else {
        console.log('limit reached');
        //put a sound indicator here
      }
    }
  });
  // thx S0-C4lled-RYO
  function pauseGame() {
    paused = !paused;
    document.getElementById('pause').textContent = paused ? 'Resume' : 'Pause';
    paused ? bgm.pause() : bgm.play();
    if (!paused) loop();
  }
  pause.addEventListener('click', () => {
    pauseGame();
    pause.blur();
  });
  // start the game
  rAF = requestAnimationFrame(loop);
}
