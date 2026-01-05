// GLOBAL SCOPED
$(document).ready(() => {
  // wait for the HTML / CSS elements of the page to fully load, then execute unhideMenu()
  setTimeout(() => {
    $("#loadingText").text("click anywhere on the page to proceed");
    $(".loadingScreen").css("cursor", "pointer");
    $(document).one("click", () => {
      $("#menu").show();
      menuMusic.play();
      $(".loadingScreen").fadeOut(1500);
    });
  }, 3000);
});

function playGame() {
  $("#menu").hide();
  $("#board").show();
  $("#readyMsg").show().text("GET READY...");
  menuMusic.pause();
  gameMusic.currentTime = 0.26;
  fadeIn(gameMusic, 1, 0.05, 200);
  setTimeout(() => {
    $("#readyMsg").text("GO!!!!!");
    runProgram();
    startBall();
    setTimeout(() => {
      $("#readyMsg").hide();
    }, 2000);
  }, 3000);
}

function showSettings() {
  $("#menu").hide();
  $("#settings").show();
}

function goBack() {
  $("#settings").hide();
  $("#how2play").hide();
  $("#modes").hide();
  $("#menu").show();
  window.scrollTo(0, 0);
  $("body").css("overflow", "hidden");
}

function showTutorial() {
  $("#menu").hide();
  $("#how2play").show();
}

function showModes() {
  window.scrollTo(0, 0);
  $("#menu").hide();
  $("#modes").show();
  $("body").css("overflow", "scroll");
}

let red = 127;
let green = 127;
let blue = 127;

function showChange() {
  $("#showColor").css(
    "background-color",
    "rgb(" + red + ", " + green + ", " + blue + ")"
  );
}

function apply(element) {
  if (element === "font") {
    $("h1, h2, p, output, button, #scoreL, #scoreR").css(
      "color",
      "rgb(" + red + ", " + green + ", " + blue + ")"
    );
    return;
  }
  $(element).css(
    "background-color",
    "rgb(" + red + ", " + green + ", " + blue + ")"
  );
}

function applyCustomBG() {
  let input = prompt("provide an image url");
  if (input === "") {
    alert("try again");
    return;
  }
  $("#board").css("background-image", "url(" + input + ")");
}

// global vars
let interval;

// pause feature
let isPaused = false;
$(document).ready(() => {
  $("#pauseBtn").on("click", () => {
    isPaused = !isPaused;
    isPaused
      ? $("#pausedMsg, #goHome, #restart").show()
      : $("#pausedMsg, #goHome, #restart").hide();
    isPaused ? gameMusic.pause() : gameMusic.play();
  });
  $("#goHome").on("click", () => {
    isPaused = false;
    $("#pausedMsg, #goHome, #restart").hide();
    restartGame();
    $("#board").hide();
    $("#menu").show();
    menuMusic.currentTime = 0;
    menuMusic.play();
  });
  $("#restart").on("click", () => {
    isPaused = false;
    $("#pausedMsg, #goHome, #restart").hide();
    if (typeof restartGame === "function") {
      // makes sure it only restarts if the restartGame function is declared
      restartGame();
      playGame();
    }
  });
});

// single player difficulties
let difficulties = ["OFF", "EASY", "NORMAL", "HARD"];
let spIndex = 0;

// button states
const mBtns = {
  singlePlayer: false,
  isFast: false,
  isUltraFast: false,
  isBouncy: false,
  isGhost: false,
  customRounds: false,
  isWumbo: false,
  isConcrete: false,
  hasFlightControls: false,
  hasMultiBall: false,
};

// button functions
$(document).ready(() => {
  $("#ai").on("click", () => {
    spIndex += 1;
    if (spIndex > 3) {
      spIndex = 0;
    }
    mBtns.singlePlayer = spIndex !== 0 ? true : false;
    $("#ai").text(difficulties[spIndex]);
  });
  $("#fast").on("click", () => {
    mBtns.isFast = !mBtns.isFast;
    $("#fast").text(mBtns.isFast ? "ON" : "FAST");
  });
  $("#ufast").on("click", () => {
    mBtns.isUltraFast = !mBtns.isUltraFast;
    $("#ufast").text(mBtns.isUltraFast ? "ON" : "ULTRA FAST");
  });
  $("#bouncy").on("click", () => {
    mBtns.isBouncy = !mBtns.isBouncy;
    $("#bouncy").text(mBtns.isBouncy ? "ON" : "BOUNCY");
  });
  $("#ghost").on("click", () => {
    mBtns.isGhost = !mBtns.isGhost;
    $("#ghost").text(mBtns.isGhost ? "ON" : "GHOST");
  });
  $("#custrounds").on("click", () => {
    mBtns.customRounds = !mBtns.customRounds;
    $("#custrounds").text(mBtns.customRounds ? "ON" : "CUSTOM ROUNDS");
  });
  $("#wumbo").on("click", () => {
    mBtns.isWumbo = !mBtns.isWumbo;
    $("#wumbo").text(mBtns.isWumbo ? "ON" : "WUMBO");
  });
  $("#conc").on("click", () => {
    mBtns.isConcrete = !mBtns.isConcrete;
    $("#conc").text(mBtns.isConcrete ? "ON" : "CONCRETE");
  });
  $("#fcontrols").on("click", () => {
    mBtns.hasFlightControls = !mBtns.hasFlightControls;
    $("#fcontrols").text(mBtns.hasFlightControls ? "ON" : "FLIGHT CONTROLS");
  });
  $("#multball").on("click", () => {
    mBtns.hasMultiBall = !mBtns.hasMultiBall;
    $("#multball").text(mBtns.hasMultiBall ? "ON" : "MULTI BALL");
  });
});

// keys (with true false values)
const KEYSTATES = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

// turns the keystate to the corresponding key pressed true only when pressed
// if ur wondering why im using vanilla javascript for this instead of jquery its because im more used to it
$(document).on("keydown", (e) => {
  if (KEYSTATES.hasOwnProperty(e.key)) {
    KEYSTATES[e.key] = true;
  }
});
// promptly reverts the keystate back to false when the corresponding key is released
$(document).on("keyup", (e) => {
  if (KEYSTATES.hasOwnProperty(e.key)) {
    KEYSTATES[e.key] = false;
  }
});

// buttons should change things inside of the runProgram() function
// to do: turn the ball object into a factory function to allow multiple balls

let paddleL = { posX: 0, posY: 0, speedY: 0, width: 0, height: 0 };
let paddleR = { posX: 0, posY: 0, speedY: 0, width: 0, height: 0 };
let ball = { posX: 0, posY: 0, speedX: 0, speedY: 0, width: 0, height: 0 };
let BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT;

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // board initialization
  BOARD_WIDTH = $("#board").width();
  BOARD_HEIGHT = $("#board").height();
  BOARD_X = parseFloat($("#board").css("left"));
  BOARD_Y = parseFloat($("#board").css("top"));
  const BOARD_RIGHT = BOARD_X + BOARD_WIDTH;
  const BOARD_BOTTOM = BOARD_Y + BOARD_HEIGHT;

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  // interchangable variables
  let winCondition = 5;
  let startingSpeed = 3;
  let maxSpeed = 20;
  let paddleMovementRate = 13;

  // ai values
  let difficulty = difficulties[spIndex];
  /* difficulty values used to make things harder
  imperfectionRate: the rate of which the ai screws up
  deadZone: 
  hesitates: the chance for the ai to hesitate
  reactRange: the frame chosen randomly where the ai reacts
  */
  const difficVals = {
    EASY: {
      imperfectionRate: 70,
      deadZone: 20,
      hesitates: 0.52, // (52%)
      reactRange: [14, 21], // by 7
    },
    NORMAL: {
      imperfectionRate: 30,
      deadZone: 15,
      hesitates: 0.34, // (34%)
      reactRange: [13, 19], // by 6
    },
    HARD: {
      imperfectionRate: 10,
      deadZone: 10,
      hesitates: 0.12, // (12%)
      reactRange: [7, 11], // by 4
    },
  };

  // variables that cant change (like counting variables)
  let aiReactFrames = 0;

  // Game Item Objects
  // red paddle (left)
  paddleL.posX = parseInt($("#paddleL").css("left"));
  paddleL.posY = parseInt($("#paddleL").css("top"));
  paddleL.speedY = 0; // up and down only
  paddleL.width = $("#paddleL").width();
  paddleL.height = $("#paddleL").height();

  // blue paddle (right)
  paddleR.posX = parseInt($("#paddleR").css("left"));
  paddleR.posY = parseInt($("#paddleR").css("top"));
  paddleR.speedY = 0; // up and down only
  paddleR.width = $("#paddleR").width();
  paddleR.height = $("#paddleR").height();

  // ball
  ball.width = $("#ball").width();
  ball.height = $("#ball").height();
  ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
  ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
  ball.speedX = 0; // left and right
  ball.speedY = 0; // up and down

  let scoreL = 0;
  let scoreR = 0;

  // mode functionality
  if (mBtns.isFast) {
    startingSpeed = 9;
    maxSpeed = 40;
  }
  if (mBtns.isUltraFast) {
    startingSpeed = 17;
    maxSpeed = 60;
  }
  if (mBtns.isGhost) {
    $("#ball").addClass("ghost");
  }
  if (mBtns.isConcrete) {
    paddleMovementRate = 2.5;
  }
  if (mBtns.customRounds) {
    let input = prompt("how many rounds", 10);
    if (input === "endless" || input === "Endless") {
      // secret keyword
      winCondition = Infinity;
    } else {
      input = parseInt(input, 10);
      while (!Number.isFinite(input) || input <= 0 || input > 15) {
        input = parseInt(
          prompt(
            "please input a proper number greater than 0 and less than or equal to 15",
            10
          )
        );
      }
    }
    winCondition = input;
  }

  window.restartGame = restartGame; // exposes the restartGame function globally
  window.startBall = startBall;

  // one-time setup
  clearInterval(interval); // removes previous loops before starting a new one
  interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL); // execute newFrame every 0.0166 seconds (60 Frames per second)
  

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    if (!isPaused) {
      handleEvent(); // handle key presses
      repositionGameItems(); // move both paddles and the ball
      checkInBounds(paddleL); // prevents paddles from going out of bounds
      checkInBounds(paddleR);
      wallCollision(); // ball collisions
      if (doCollide(ball, paddleL)) {
        handleBallPaddleCollision(paddleL);
      }
      if (doCollide(ball, paddleR)) {
        handleBallPaddleCollision(paddleR);
      }
      redrawItems();
      if (scoreL === winCondition || scoreR === winCondition) {
        endGame();
        if (scoreL === winCondition) {
          $("#scoreL").text("WINNER");
          $("#scoreR").text("LOSER");
        } else {
          $("#scoreL").text("LOSER");
          $("#scoreR").text("WINNER");
        }
      }
    }
  }

  // handles movement whenever a key in keystates is true
  function handleEvent() {
    // left paddle
    if (KEYSTATES.w) {
      paddleL.speedY = -paddleMovementRate;
    }
    if (KEYSTATES.s) {
      paddleL.speedY = paddleMovementRate;
    }
    if ((!KEYSTATES.w && !KEYSTATES.s) || (KEYSTATES.w && KEYSTATES.s)) {
      paddleL.speedY = 0;
    }
    // right paddle
    if (mBtns.singlePlayer) {
      aiMoves(paddleR);
    } else {
      if (KEYSTATES.ArrowUp) {
        paddleR.speedY = -paddleMovementRate;
      }
      if (KEYSTATES.ArrowDown) {
        paddleR.speedY = paddleMovementRate;
      }
      if (
        (!KEYSTATES.ArrowUp && !KEYSTATES.ArrowDown) ||
        (KEYSTATES.ArrowUp && KEYSTATES.ArrowDown)
      ) {
        paddleR.speedY = 0;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // redraws all items every frame
  function redrawItems() {
    $("#paddleL").css("top", paddleL.posY);
    $("#paddleR").css("top", paddleR.posY);
    $("#ball").css("left", ball.posX);
    $("#ball").css("top", ball.posY);
  }

  // checks if a paddle is in the board's boundaries so that it doesnt go out of bounds
  function checkInBounds(paddle) {
    if (paddle.posY < BOARD_Y) {
      paddle.posY = BOARD_Y;
    }
    if (paddle.posY + paddle.height > BOARD_BOTTOM) {
      paddle.posY = BOARD_BOTTOM - paddle.height;
    }
  }

  // checks what side the ball collides with
  function wallCollision() {
    if (ball.posX < BOARD_X / 2) {
      // left side
      // give right a point and reset the ball's position after 1 second
      scoreR += 1;
      $("#scoreR").text(scoreR);
      stopBall();
    }
    if (ball.posX + ball.width > BOARD_WIDTH) {
      // right side
      // give left a point and reset the ball's position after 1 second
      scoreL += 1;
      $("#scoreL").text(scoreL);
      stopBall();
    }
    // if the ball collides with the top or bottom it should bounce in the opposite direction
    if (ball.posY < BOARD_Y) {
      ball.posY = BOARD_Y;
      ball.speedY *= -1;
    }
    if (ball.posY + ball.height > BOARD_HEIGHT) {
      ball.posY = BOARD_BOTTOM - ball.height;
      ball.speedY *= -1;
    }
  }

  // detects if 2 game items collide
  function doCollide(obj1, obj2) {
    return obj1.posX < obj2.posX + obj2.width &&
      obj1.posX + obj1.width > obj2.posX &&
      obj1.posY < obj2.posY + obj2.height &&
      obj1.posY + obj1.height > obj2.posY
      ? true
      : false;
  }

  // ai reads every certain amount of frame and reacts accordingly
  function aiMoves(paddle) {
    aiReactFrames++;
    mode = difficVals[difficulty];
    if (
      aiReactFrames %
        (mode.reactRange[0] +
          Math.floor(Math.random() * mode.reactRange[1])) !==
      0
    )
      return; // reacts every 8-12 frames

    if (ball.speedX > 0) {
      // reacts when the ball is heading towards it
      const paddleCenter = paddle.posY + paddle.height / 2;
      let target;
      let error = (Math.random() - 0.5) * mode.imperfectionRate;

      if (difficulty === "EASY" || difficulty === "NORMAL") {
        // follow logic
        const ballCenter = ball.posY + ball.height / 2;
        target = ballCenter + error;
      } else if (difficulty === "HARD") {
        // prediction logic
        if (Math.abs(ball.speedX) > 0.01) {
          const framesToReach = (paddle.posX - ball.posX) / ball.speedX;
          if (framesToReach >= 0) {
            let predictY = ball.posY + ball.speedY * framesToReach;
            predictY = Math.max(
              Math.min(predictY, BOARD_HEIGHT - ball.height),
              0
            );
            target = predictY + error;
          } else {
            target = ball.posY + error; // fallback if the ball is moving away
          }
        } else {
          target = ball.posY + error; // fallback if the ball is not moving
        }
      }

      let diff = target - paddleCenter;
      if (diff < -mode.deadZone) {
        paddle.speedY = Math.max(diff * 0.1, -paddleMovementRate);
      } else if (diff > mode.deadZone) {
        paddle.speedY = Math.min(diff * 0.1, paddleMovementRate);
      } else {
        paddle.speedY *= 0.9;
      }

      if (Math.random() < mode.hesitates) {
        paddle.speedY = 0;
      }
    } else {
      paddle.speedY = 0;
    }
  }

  /* 
    makes bounces the ball in the other direction and calculates speedY based on how far the ball's
    center is away from the paddle's center
  */
  function handleBallPaddleCollision(paddle) {
    ball.speedX *= -1.05;
    let paddleCenter = paddle.posY + paddle.height / 2;
    let ballCenter = ball.posY + ball.height / 2;
    let offset = ballCenter - paddleCenter;
    ball.speedY += (offset / (paddle.height / 2)) * 5;
    ball.speedX = Math.max(Math.min(ball.speedX, maxSpeed), -maxSpeed);
    ball.speedY = Math.max(Math.min(ball.speedY, maxSpeed), -maxSpeed);

    // Prevent sticking
    if (paddle === paddleL) {
      ball.posX = paddle.posX + paddle.width + 1;
    } else {
      ball.posX = paddle.posX - ball.width - 1;
    }
  }

  // repositions all items
  function repositionGameItems() {
    paddleL.posY += paddleL.speedY;
    paddleR.posY += paddleR.speedY;
    ball.posX += ball.speedX;
    ball.posY += ball.speedY;
  }

  // starts the ball at startup
  function startBall() {
    ball.speedX =
      (Math.random() * 3 + startingSpeed) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY =
      (Math.random() * 3 + startingSpeed) * (Math.random() > 0.5 ? -1 : 1);
  }

  //stops ball and resets position after a point is gained
  function stopBall() {
    ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
    ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
    ball.speedX = 0;
    ball.speedY = 0;
  }

  // end the game at a certain limit
  function endGame() {
    // stop the interval timer
    clearInterval(interval);
    $("#restart").show();
  }

  function restartGame() {
    clearInterval(interval);
    scoreL = 0;
    scoreR = 0;
    $("#scoreL").text("0");
    $("#scoreR").text("0");

    $("#paddleL").css("top", "250px");
    $("#paddleR").css("top", "250px");
    paddleL.posY = 250;
    paddleR.posY = 250;

    ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
    ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
    ball.speedX = 0;
    ball.speedY = 0;

    $("#ball").css("left", ball.posX);
    $("#ball").css("top", ball.posY);

    playGame();
  }
}
