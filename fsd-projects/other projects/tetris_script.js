//not my code!!! slight additions were made by me
//visit the site https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1

//stores scores
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
  //reverts every value back to its original value whenever you reset the game
  let lineClears = 0;
  let score = 0;
  let level = 0;
  let tickSpeed = 84;
  levelUp();
  document.getElementById("scorehtml").textContent = "Score: 0";
  let countInd = 0;
  let limit = false;
  let hold = "";
  let getNext;
  let combo = 0;
  let comboBreak = 0;
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function increaseCombo() {
    combo += 1;
    document.getElementById("comboshtml").textContent = "Combo: X" + combo;
  } 
  let goalReached;
  function comboFunctionality() {
    if (combo > 0) {
      comboBreak += 1;
    }
    if (comboBreak === 3) {
      combo = 0;
      comboBreak = 0;
      document.getElementById("comboshtml").textContent = "Combo: X0";
    }
    if (goalReached) {
      let randomNum = Math.floor(Math.random() * 25);
      if (randomNum === 17 || randomNum === 3) {
        displayToasty();
      }
      if (combo >= 10) {
        increaseScore(100);
      } else {
        increaseScore(50);
      }
      goalReached = false;
    }
  }

  //decreases tick speed every 10 line clears
  function levelUp() {
    if (lineClears % 10 === 0) {
      level = lineClears / 10;
      tickSpeed -= 6 /*+ fast*/;
    }
    document.getElementById("levelhtml").textContent = "Level: " + level;
    document.getElementById("lineshtml").textContent = "Line Clears: " + lineClears;
  }

  //updates the score display
  //calculates whatever score is in the placeholder then updates it
  function increaseScore(points) {
    score += points;
    document.getElementById("scorehtml").textContent = "Score: " + score;
  }
  
  //DISPLAY THE TETROMINOS IN THE SIDE BOXES
  // view next tetromino = displayer(ctx, getNext);
  // view held tetromino = displayer(cx, hold.name);
  // c stands for canvas btw
  function displayer(c, get) {
    if (get === getNext) {
      get = tetrominoSequence[tetrominoSequence.length - 1];
      if (get === undefined) {
        getNextTetromino();
      }
    }
    if (get === "I") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.I;
      if (!neon && !minecraft) {
        c.fillRect(50, 20, 20, 80);
      } else if (neon) {
        c.shadowBlur = 33;
        c.shadowColor = neonColors.I[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.I[1];
        c.lineWidth = 3;
        c.fillRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
        c.strokeRect(50 - 2, 20 - 2, 20 + 8, 80 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.I[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.I[1];
        c.lineWidth = 3;
        c.fillRect(50 + 2, 20 + 2, 20, 80);
        c.strokeRect(50 + 2, 20 + 2, 20, 80);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.I[0];
        c.fillStyle = neonColors.I[2];
        c.fillRect(50 + 2, 20 + 2, 20, 80);
      //Remove styles after drawing
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.I[1], 25, 25, 80, 80);
      }
    } else if (get === "J") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.J;
      if (!neon && !minecraft) {
        c.fillRect(50, 20, 20, 70);
        c.fillRect(70, 20, 20, 20);
      } else if (neon) {
        c.shadowBlur = 46;
        c.shadowColor = neonColors.J[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.J[2];
        c.lineWidth = 3;
        c.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        c.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        c.shadowBlur = 125;
        c.shadowColor = neonColors.J[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.J[2];
        c.lineWidth = 3;
        c.fillRect(50 + 2, 20 + 2, 20, 70);
        c.strokeRect(50 + 2, 20 + 2, 20, 70);
        c.shadowBlur = 24;
        c.shadowColor = neonColors.J[0];
        c.fillStyle = neonColors.J[1];
        c.fillRect(50 + 2, 20 + 2, 20, 70);
        c.shadowBlur = 46;
        c.shadowColor = neonColors.J[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.J[2];
        c.lineWidth = 3;
        c.fillRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
        c.strokeRect(80 - 2, 20 - 2, 20 + 8, 20 + 8);
        c.shadowBlur = 125;
        c.shadowColor = neonColors.J[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.J[2];
        c.lineWidth = 3;
        c.fillRect(80 + 2, 20 + 2, 20, 20);
        c.strokeRect(80 + 2, 20 + 2, 20, 20);
        c.shadowBlur = 24;
        c.shadowColor = neonColors.J[0];
        c.fillStyle = neonColors.J[1];
        c.fillRect(80 + 2, 20 + 2, 20, 20);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.J[1], 25, 25, 80, 80);
      }
    } else if (get === "L") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.L;
      if (!neon && !minecraft) {
        c.fillRect(50, 20, 20, 70);
        c.fillRect(30, 20, 20, 20);
      } else if (neon) {
        c.shadowBlur = 46;
        c.shadowColor = neonColors.L[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.L[2];
        c.lineWidth = 3;
        c.fillRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        c.strokeRect(50 - 2, 20 - 2, 20 + 8, 70 + 8);
        c.shadowBlur = 125;
        c.shadowColor = neonColors.L[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.L[2];
        c.lineWidth = 3;
        c.fillRect(50 + 2, 20 + 2, 20, 70);
        c.strokeRect(50 + 2, 20 + 2, 20, 70);
        c.shadowBlur = 24;
        c.shadowColor = neonColors.L[0];
        c.fillStyle = neonColors.L[1];
        c.fillRect(50 + 2, 20 + 2, 20, 70);
        c.shadowBlur = 46;
        c.shadowColor = neonColors.L[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.L[2];
        c.lineWidth = 3;
        c.fillRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
        c.strokeRect(18 - 2, 20 - 2, 20 + 8, 20 + 8);
        c.shadowBlur = 125;
        c.shadowColor = neonColors.L[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.L[2];
        c.lineWidth = 3;
        c.fillRect(18 + 2, 20 + 2, 20, 20);
        c.strokeRect(18 + 2, 20 + 2, 20, 20);
        c.shadowBlur = 24;
        c.shadowColor = neonColors.L[0];
        c.fillStyle = neonColors.L[1];
        c.fillRect(18 + 2, 20 + 2, 20, 20);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      }else if (minecraft) {
        c.drawImage(colors.L[1], 25, 25, 80, 80);
      }
    } else if (get === "O") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.O
      if (!neon && !minecraft) {
        c.fillRect(36, 36, 60, 60);
      } else if (neon) {
        c.shadowBlur = 33;
        c.shadowColor = neonColors.O[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.O[1];
        c.lineWidth = 3;
        c.fillRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
        c.strokeRect(40 - 2, 40 - 2, 60 + 8, 60 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.O[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.O[1];
        c.lineWidth = 3;
        c.fillRect(40 + 2, 40 + 2, 60, 60);
        c.strokeRect(40 + 2, 40 + 2, 60, 60);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.O[0];
        c.fillStyle = neonColors.O[2];
        c.fillRect(40 + 2, 40 + 2, 60, 60);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.O[1], 25, 25, 80, 80);
      }
    } else if (get === "S") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.S;
      if (!neon && !minecraft) {
        c.fillRect(60, 40, 40, 20);
        c.fillRect(40, 60, 40, 20);
      } else if (neon) {
        c.shadowBlur = 33;
        c.shadowColor = neonColors.S[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.S[1];
        c.lineWidth = 3;
        c.fillRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
        c.strokeRect(60 - 2, 40 - 2, 45 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.S[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.S[1];
        c.lineWidth = 3;
        c.fillRect(60 + 2, 40 + 2, 45, 20);
        c.strokeRect(60 + 2, 40 + 2, 45, 20);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.S[1];
        c.fillStyle = neonColors.S[2];
        c.fillRect(60 + 2, 40 + 2, 45, 20);
        c.shadowBlur = 33;
        c.shadowColor = neonColors.S[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.S[1];
        c.lineWidth = 3;
        c.fillRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
        c.strokeRect(35 - 2, 70 - 2, 45 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.S[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.S[1];
        c.lineWidth = 3;
        c.fillRect(35 + 2, 70 + 2, 45, 20);
        c.strokeRect(35 + 2, 70 + 2, 45, 20);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.S[1];
        c.fillStyle = neonColors.S[2];
        c.fillRect(35 + 2, 70 + 2, 45, 20);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.S[1], 25, 25, 80, 80);
      }
    } else if (get === "Z") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.Z
      if (!neon && !minecraft) {
        c.fillRect(80, 40, -40, 20);
        c.fillRect(100, 60, -40, 20);
      } else if (neon) {
        c.shadowBlur = 33;
        c.shadowColor = neonColors.Z[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.Z[1];
        c.lineWidth = 3;
        c.fillRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
        c.strokeRect(20 - 2, 40 - 2, 45 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.Z[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.Z[1];
        c.lineWidth = 3;
        c.fillRect(20 + 2, 40 + 2, 45, 20);
        c.strokeRect(20 + 2, 40 + 2, 45, 20);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.Z[1];
        c.fillStyle = neonColors.Z[2];
        c.fillRect(20 + 2, 40 + 2, 45, 20);
        c.shadowBlur = 33;
        c.shadowColor = neonColors.Z[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.Z[1];
        c.lineWidth = 3;
        c.fillRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
        c.strokeRect(45 - 2, 70 - 2, 45 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.Z[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.Z[1];
        c.lineWidth = 3;
        c.fillRect(45 + 2, 70 + 2, 45, 20);
        c.strokeRect(45 + 2, 70 + 2, 45, 20);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.Z[1];
        c.fillStyle = neonColors.Z[2];
        c.fillRect(45 + 2, 70 + 2, 45, 20);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.Z[1], 25, 25, 80, 80);
      }
    } else if (get === "T") {
      c.clearRect(0, 0, 180, 180);
      c.fillStyle = colors.T;
      if (!neon && !minecraft) {
        c.fillRect(40, 60, 60, 20);
        c.fillRect(60, 40, 20, 20);
      } else if (neon) {
        c.shadowBlur = 33;
        c.shadowColor = neonColors.T[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.T[1];
        c.lineWidth = 3;
        c.fillRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
        c.strokeRect(40 - 2, 60 - 2, 70 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.T[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.T[1];
        c.lineWidth = 3;
        c.fillRect(40 + 2, 60 + 2, 70, 20);
        c.strokeRect(40 + 2, 60 + 2, 70, 20);
        c.shadowBlur = 223;
        c.shadowColor = neonColors.T[1];
        c.fillStyle = neonColors.T[2];
        c.fillRect(40 + 2, 60 + 2, 70, 20);
        c.shadowBlur = 33;
        c.shadowColor = neonColors.T[0]; 
        c.fillStyle = 'white';
        c.strokeStyle = neonColors.T[1];
        c.lineWidth = 3;
        c.fillRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
        c.strokeRect(65 - 2, 30 - 2, 20 + 8, 20 + 8);
        c.shadowBlur = 63;
        c.shadowColor = neonColors.T[0]; 
        c.fillStyle = 'black';
        c.strokeStyle = neonColors.T[1];
        c.lineWidth = 3;
        c.fillRect(65 + 2, 30 + 2, 20, 20);
        c.strokeRect(65 + 2, 30 + 2, 20, 20);
        c.shadowBlur = 9;
        c.shadowColor = neonColors.T[1];
        c.fillStyle = neonColors.T[2];
        c.fillRect(65 + 2, 30 + 2, 20, 20);
        c.shadowColor = "transparent";
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
      } else if (minecraft) {
        c.drawImage(colors.T[1], 25, 25, 80, 80);
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
      displayer(ctx, getNext);
    }
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === "I" ? -1 : -2;
    displayer(ctx, getNext);
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
    if (pip) {
      const vaultBoy = document.getElementById("indicatorPip");
      vaultBoy.style.display = "flex";
      vatsCritical.play();
      setTimeout(function () {
        vaultBoy.style.display = "none";
      }, 5000);
    } else {
      const tetrisIndicator = document.getElementById("indicator");
      if (tetrisIndicator) {
        tetrisIndicator.style.display = "inline";
        setTimeout(function () {
          tetrisIndicator.style.display = "none";
        }, 6000);
      }
    }
  }
  function displayToasty() {
    const toasty = document.getElementById("toasty");
    if (toasty) {
      toasty.hidden = false;
      toastySound.play();
      setTimeout(function () {
        toasty.hidden = true;
      }, 4000);
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
        playClear();
        lineClears += 1;
        levelUp();
        increaseScore(100);
        increaseCombo();
        comboBreak = 0;
        countInd += 1;
        if (combo % 5 === 0 && combo > 0) {
          goalReached = true;
        }
        if (countInd === 4) {
          displayTetris();
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
    comboFunctionality();
  }
  
  let clearFrame = 0;
  let anim;
  function animateClear() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, 30 * clearFrame);
    if (clearFrame != 22) {
      clearFrame += 1;
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
          if (!neon && !minecraft) {
            context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
          }
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
          if (minecraft) {
            context.drawImage(colors[name][0], col * grid, row * grid, grid, grid);
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
            if(!minecraft) {
              context.fillRect(
                (tetromino.col + col) * grid,
                (tetromino.row + row) * grid,
                grid - 1,
                grid - 1
              );
            } else {
              context.drawImage(
                colors[tetromino.name][0],
                (tetromino.col + col) * grid,
                (tetromino.row + row) * grid,
                grid,
                grid
              );
            }
          }
        }
      }
    }
  }


  // listen to keyboard events to move the active tetromino
  //held keys
  document.addEventListener("keydown", function (e) {
    // disable keys when game ends or is paused
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
        } else {
          hold = tetromino;
        }
        tetromino = getNextTetromino();
        limit = true;
        displayer(cx, hold.name);
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