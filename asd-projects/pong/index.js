// keys (with true false values)
const KEYSTATES = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

// turns the keystate to the corresponding key pressed true only when pressed
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

let paddleL = { posX: 0, posY: 0, speedY: 0, width: 0, height: 0 };
let paddleR = { posX: 0, posY: 0, speedY: 0, width: 0, height: 0 };
// let ball = { posX: 0, posY: 0, speedX: 0, speedY: 0, width: 0, height: 0 };
let balls = [];
let ballSize = 40;
let BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT;
// ball constructor class
class Ball {
  constructor(id) {
    let center = (mBtns.hasMultiBall) ? 60 : 0;
    this.element = $('<div>').attr('id', id).appendTo('#board').css({
      'background-color': ballColor,
      'width': ballSize + 'px',
      'height': ballSize + 'px',
      'position': 'absolute',
      'left': '0px',
      'top': '0px',
      'border-radius': '50%',
      'box-shadow': '-2px -4px 10px rgb(18, 18, 18) inset',
      'z-index': 1,
      'opacity': 0,
      'transform': 'scale(2.8)',
      'transition': 'opacity 1.5s ease-in-out, transform 2s ease-in-out'
    });
    this.width = this.element.width();
    this.height = this.element.height();
    this.posX = BOARD_X + BOARD_WIDTH / 2 - this.width / 2 + (balls.length * 60) - center;
    this.posY = BOARD_Y + BOARD_HEIGHT / 2 - this.height / 2;
    this.ogPositionX = this.posX; // the original position of the ball's X when created (THIS DOES NOT CHANGE AT ALL)
    this.speedX = 0;
    this.speedY = 0;
    this.radius = this.width / 2;
  }
}

function clearBalls() {
  for (var ball of balls) {
    ball.element.remove();
  }
  balls.length = 0;
}

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  // board initialization
  BOARD_WIDTH = $("#board").width();
  BOARD_HEIGHT = $("#board").height();
  BOARD_X = parseFloat($("#board").css("left"));
  BOARD_Y = parseFloat($("#board").css("top"));
  // const BOARD_RIGHT = BOARD_X + BOARD_WIDTH; unused parameter
  const BOARD_BOTTOM = BOARD_Y + BOARD_HEIGHT;

  // fps var
  const FPS = 60;

  // interchangable variables
  let winCondition = 5;
  let startingSpeed = 4 * FPS;
  let maxSpeed = 35 * FPS;
  let paddleMovementRate = 13 * FPS;

  // ai values
  let difficulty = difficulties[spIndex];
  let aiBaseSpeed = 0.1 * FPS;
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

  // variables that you shouldnt change (like counting variables)
  let aiReactFrames = 0;
  let gameOver = false;

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

  // ball (legacy)
  /*ball.width = $("#ball").width();
  ball.height = $("#ball").height();
  ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
  ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
  ball.speedX = 0; // left and right
  ball.speedY = 0; // up and down*/

  // ensures every ball is deleted before making new balls
  clearBalls();

  let scoreL = 0;
  let scoreR = 0;

  // mode functionality
  if (mBtns.isFast) {
    startingSpeed = 9 * FPS;
    maxSpeed = 55 * FPS;
  }
  if (mBtns.isUltraFast) {
    startingSpeed = 17 * FPS;
    maxSpeed = 70 * FPS;
  }
  if (mBtns.isGhost) {
    for (var ball of balls) {
      ball.element.addClass("ghost");
    }
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
  /* old iterator
  clearInterval(interval); // removes previous loops before starting a new one
  interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL); // execute newFrame every 0.0166 seconds (60 Frames per second)
  */
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  let lastTimeStamp = 0;
  let rafID;
  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame(timestamp) {
    if (!isPaused && !gameOver) {
      // frame rate (deltaTime, timestamps, fps and all that biz)
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      const deltaTime = (timestamp - lastTimeStamp) / 1000;
      lastTimeStamp = timestamp;
      const fps = Math.round(1 / deltaTime);
      $("#fpsdisplay").text("FPS: " + fps);
      handleEvent(); // handle key presses
      repositionGameItems(deltaTime); // move both paddles and the ball
      checkInBounds(paddleL); // prevents paddles from going out of bounds
      checkInBounds(paddleR);
      wallCollision(); // ball collisions
      for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
          doBallCollide(balls[i], balls[j]);
        }
      }
      for (var ball of balls) {
        if (doCollide(ball, paddleL)) {
          playPaddleHit(1);
          handleBallPaddleCollision(paddleL, ball);
        }
        if (doCollide(ball, paddleR)) {
          playPaddleHit(2);
          handleBallPaddleCollision(paddleR, ball);
        }
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
    } else {
      lastTimeStamp = 0;
      $("#fpsdisplay").text("FPS: 0");
    }
    if (!gameOver) {
      rafID = requestAnimationFrame(newFrame);
    }
  }

  requestAnimationFrame(newFrame);

  // handles movement whenever a key in keystates is true
  function handleEvent() {
    // left paddle
    if (KEYSTATES.w) {
      if (!mBtns.hasFlightControls) {
        paddleL.speedY = -paddleMovementRate;
      } else {
        paddleL.speedY = paddleMovementRate;
      }
    }
    if (KEYSTATES.s) {
      if (!mBtns.hasFlightControls) {
        paddleL.speedY = paddleMovementRate;
      } else {
        paddleL.speedY = -paddleMovementRate;
      }
    }
    if ((!KEYSTATES.w && !KEYSTATES.s) || (KEYSTATES.w && KEYSTATES.s)) {
      paddleL.speedY = 0;
    }
    // right paddle
    if (mBtns.singlePlayer) {
      aiMoves(paddleR);
    } else {
      if (KEYSTATES.ArrowUp) {
        if (!mBtns.hasFlightControls) {
          paddleR.speedY = -paddleMovementRate;
        } else {
          paddleR.speedY = paddleMovementRate;
        }
      }
      if (KEYSTATES.ArrowDown) {
        if (!mBtns.hasFlightControls) {
          paddleR.speedY = paddleMovementRate;
        } else {
          paddleR.speedY = -paddleMovementRate;
        }
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
    /* legacy
    $("#ball").css("left", ball.posX);
    $("#ball").css("top", ball.posY);*/
    for (var ball of balls) {
      ball.element.css("left", ball.posX);
      ball.element.css("top", ball.posY);
    }
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
    for (var ball of balls) {
      if (ball.posX < BOARD_X) {
        // left side
        // give right a point and reset the ball's position after 1 second
        scoreR += 1;
        $("#scoreR").text(scoreR);
        stopBall();
        return;
      }
      if (ball.posX + ball.width > BOARD_WIDTH) {
        // right side
        // give left a point and reset the ball's position after 1 second
        scoreL += 1;
        $("#scoreL").text(scoreL);
        stopBall();
        return;
      }
      if (scoreR === winCondition - 1 || scoreL === winCondition - 1) {
        panicMode();
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

  function doBallCollide(ball1, ball2) {
    // calculate total distance from eachother
    const dx = ball2.posX - ball1.posX;
    const dy = ball2.posY - ball1.posY
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = ball1.radius + ball2.radius;
    if (distance < minDist) {
      if (distance === 0) return;
      // detect the overlap distance
      const overlap =  minDist - distance;
      // normalize the X and Y;
      const normalizeX = dx / distance;
      const normalizeY = dy / distance;
      // prevent sticking 
      ball1.posX -= overlap / 2 * normalizeX;
      ball1.posY -= overlap / 2 * normalizeY;
      ball2.posX += overlap / 2 * normalizeX;
      ball2.posY += overlap / 2 * normalizeY;
      // swap velocities
      [ball1.speedX, ball2.speedX] = [ball2.speedX, ball1.speedX];
      [ball1.speedY, ball2.speedY] = [ball2.speedY, ball1.speedY];
    }
  }


  // ai reads every certain amount of frame and reacts accordingly
  function aiMoves(paddle) {
    if (difficulty === "LOCAL MULTIPLAYER") return;
    aiReactFrames++;
    mode = difficVals[difficulty];
    const min = mode.reactRange[0];
    const max = mode.reactRange[1];
    const reactInterval = min + Math.floor(Math.random() * (max - min + 1));
    if (aiReactFrames % reactInterval !== 0) return;
    let targetB = null;
    let closestB = Infinity
    
    // filter da balls
    for (let ball of balls) {
      // ignore if the ball isnt coming towards the paddle
      if (ball.speedX <= 0) { continue }
      // only ignore balls that arent left of the paddle
      if (ball.posX >= paddle.posX) { continue }
      // calculate the horizontal distance
      const distance = paddle.posX - ball.posX;
      // only keep the closest ball
      if (distance < closestB) {
        closestB = distance;
        targetB = ball;
      }
    }
    
    // target da ball (and move accordingly)
    if (targetB) { // only react if the target ball exists
      // reacts when the ball is heading towards it
      const paddleCenter = paddle.posY + paddle.height / 2;
      let target;
      // error chance
      let error = (Math.random() - 0.5) * mode.imperfectionRate;
      if (difficulty === "EASY" || difficulty === "NORMAL") {
        // follow logic
        const ballCenter = targetB.posY + targetB.height / 2;
        target = ballCenter + error;
      } else if (difficulty === "HARD") {
        // prediction logic
        if (Math.abs(targetB.speedX) > 0.01) {
          const framesToReach = (paddle.posX - targetB.posX) / targetB.speedX;
          if (framesToReach >= 0) {
            let predictY = targetB.posY + targetB.speedY * framesToReach;
            predictY = Math.max(
              Math.min(predictY, BOARD_HEIGHT - targetB.height),
              0
            );
            target = predictY + error;
          } else {
            target = targetB.posY + error; // fallback if the ball is moving away
          }
        } else {
          target = targetB.posY + error; // fallback if the ball is not moving
        }
      }

      let diff = target - paddleCenter;
      if (diff < -mode.deadZone) {
        paddle.speedY = Math.max(diff * aiBaseSpeed, -paddleMovementRate);
      } else if (diff > mode.deadZone) {
        paddle.speedY = Math.min(diff * aiBaseSpeed, paddleMovementRate);
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
  function handleBallPaddleCollision(paddle, ball) {
    ball.speedX *= -1.07;
    let paddleCenter = paddle.posY + paddle.height / 2;
    let ballCenter = ball.posY + ball.height / 2;
    let offset = ballCenter - paddleCenter;

    /* legacy
    if (offset < 0) {
      ball.speedY = -Math.abs(ball.speedY);
    } else {
      ball.speedY = Math.abs(ball.speedY);
    } */

    ball.speedY += (offset / (paddle.height / 2)) * 10;
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
  function repositionGameItems(deltaTime) {
    paddleL.posY += paddleL.speedY * deltaTime;
    paddleR.posY += paddleR.speedY * deltaTime;
    for (var ball of balls) {
      ball.posX += ball.speedX * deltaTime;
      ball.posY += ball.speedY * deltaTime;
    }
  }

  // starts the ball at startup
  function startBall() {
    for (var ball of balls) {
      ball.speedX =
        (Math.random() * 3 + startingSpeed) * (Math.random() > 0.5 ? -1 : 1);
      ball.speedY =
        (Math.random() * 3 + startingSpeed) * (Math.random() > 0.5 ? -1 : 1);
    }
  }

  //stops ball and resets position after a point is gained
  function stopBall() {
    for (var ball of balls) {
      ball.posX = ball.ogPositionX;
      ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
      ball.speedX = 0;
      ball.speedY = 0;
    }
    setTimeout(startBall, 1000);
  }

  // end the game at a certain limit
  function endGame() {
    // stop the interval timer
    gameOver = true;
    stopPanic();
    gameMusic.fade(gameMusic.volume(), 0, 1000);
    setTimeout(() => gameMusic.stop(), 1000);
    cancelAnimationFrame(rafID);
    $("#restart").show();
  }

  function restartGame() {
    gameMusic.stop();
    cancelAnimationFrame(rafID);
    scoreL = 0;
    scoreR = 0;
    $("#scoreL").text("0");
    $("#scoreR").text("0");

    $("#paddleL").css("top", "250px");
    $("#paddleR").css("top", "250px");
    paddleL.posY = 250;
    paddleR.posY = 250;

    /* legacy
    ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
    ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
    ball.speedX = 0;
    ball.speedY = 0;

    ball.element.css({
      left: ball.posX,
      top: ball.posY,
      opacity: "0",
      transform: "scale(2.7)",
    }); */
    clearBalls();
  }
}
