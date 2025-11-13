/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const MOVEMENT_RATE = 12;
  const BOARD_WIDTH = $('#board').width();
  const BOARD_HEIGHT = $('#board').height();
  const BOARD_X = parseFloat($('#board').css('left'));
  const BOARD_Y = parseFloat($('#board').css('top'));
  const BOARD_RIGHT = BOARD_X + BOARD_WIDTH;
  const BOARD_BOTTOM = BOARD_Y + BOARD_HEIGHT;
  const WIN_CONDITION = 12;
  
  // keys (with true false values)
  const KEYSTATES = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  }

  // Game Item Objects
  // red paddle (left)
  const paddleL = {
    posX: parseInt($('#paddleL').css('left')),
    posY: parseInt($('#paddleL').css('top')),
    speedY: 0, // up and down only
    width: $('#paddleL').width(),
    height: $('#paddleL').height(),
  }
  
  // blue paddle (right)
  const paddleR = {
    posX: parseInt($('#paddleR').css('left')),
    posY: parseInt($('#paddleR').css('top')),
    speedY: 0, // up and down only
    width: $('#paddleR').width(),
    height: $('#paddleR').height(),
  }

  // ball
  const ball = {
    posX: parseInt($('#ball').css('left')),
    posY: parseInt($('#ball').css('top')),
    speedX: 0, // left and right
    speedY: 0, // up and down
    width: $('#ball').width(),
    height: $('#ball').height(),
  }
  
  let scoreL = 0;
  let scoreR = 0;
  
  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  startBall();

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
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
    if (scoreL === WIN_CONDITION || scoreR === WIN_CONDITION) {
      endGame();
      if (scoreL === WIN_CONDITION) {
        $('#scoreL').text('WINNER');
        $('#scoreR').text('LOSER');
      } else {
        $('#scoreL').text('LOSER');
        $('#scoreR').text('WINNER');
      }
    }
  }

  // turns the keystate to the corresponding key pressed true only when pressed
  // if ur wondering why im using vanilla javascript for this instead of jquery its because im more used to it
 document.addEventListener('keydown', (e) => {
    if (KEYSTATES.hasOwnProperty(e.key)) {
      KEYSTATES[e.key] = true;
    }
  });
  // promptly reverts the keystate back to false when the corresponding key is released
  document.addEventListener('keyup', (e) => {
    if (KEYSTATES.hasOwnProperty(e.key)) {
      KEYSTATES[e.key] = false;
    }
  });

  // handles movement whenever a key in keystates is true
  function handleEvent() {
    // left paddle
    if (KEYSTATES.w) {
      paddleL.speedY = -MOVEMENT_RATE;
    } 
    if (KEYSTATES.s) {
      paddleL.speedY = MOVEMENT_RATE;
    }
    if (!KEYSTATES.w && !KEYSTATES.s || KEYSTATES.w && KEYSTATES.s) {
      paddleL.speedY = 0;
    }
    // right paddle
    if (KEYSTATES.ArrowUp) {
      paddleR.speedY = -MOVEMENT_RATE;
    }
    if (KEYSTATES.ArrowDown) {
      paddleR.speedY = MOVEMENT_RATE;
    }
    if (!KEYSTATES.ArrowUp && !KEYSTATES.ArrowDown || KEYSTATES.ArrowUp && KEYSTATES.ArrowDown) {
      paddleR.speedY = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  // redraws all items every frame
  function redrawItems() {
    $('#paddleL').css('top', paddleL.posY);
    $('#paddleR').css('top', paddleR.posY);
    $('#ball').css('left', ball.posX);
    $('#ball').css('top', ball.posY);
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
  
  function wallCollision() { 
    if (ball.posX < BOARD_X / 2) { // left side
      // give right a point and reset the ball's position after 1 second
      scoreR += 1;
      $('#scoreR').text(scoreR);
      stopBall();
    } 
    if (ball.posX + ball.width > BOARD_WIDTH) { // right side
      // give left a point and reset the ball's position after 1 second
      scoreL += 1;
      $('#scoreL').text(scoreL);
      stopBall();
    }
    if (ball.posY < BOARD_Y || ball.posY + ball.height > BOARD_HEIGHT) {
      return ball.speedY *= -1;
    }
  }

  // detects if 2 game items collide
  function doCollide(obj1, obj2) {
    return (obj1.posX < obj2.posX + obj2.width &&
            obj1.posX + obj1.width > obj2.posX &&
            obj1.posY < obj2.posY + obj2.height &&
            obj1.posY + obj1.height > obj2.posY) ? true : false;
  }
  
  /* 
    makes bounces the ball in the other direction and calculates speedY based on how far the ball's
    center is away from the paddle's center
  */
  function handleBallPaddleCollision(paddle) {
    ball.speedX *= -1;

    let paddleCenter = paddle.posY + paddle.height / 2;
    let ballCenter = ball.posY + ball.height / 2;
    let offset = ballCenter - paddleCenter;
    ball.speedY += offset * 0.08;
    ball.speedY = Math.max(Math.min(ball.speedY, 10), -10);
  
    // Prevent sticking
    // might change later (feels unsatisfying)
    if (paddle === paddleL) {
      ball.posX = paddle.posX + paddle.width;
    } else {
      ball.posX = paddle.posX - ball.width;
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
    ball.speedX = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
  }
  
  //stops ball and resets position after a point is gained
  function stopBall() {
    ball.posX = BOARD_X + BOARD_WIDTH / 2 - ball.width / 2;
    ball.posY = BOARD_Y + BOARD_HEIGHT / 2 - ball.height / 2;
    ball.speedX = 0;
    ball.speedY = 0;
    // short grace period before the ball moves
    setTimeout(startBall, 2000);
  }
  
  // end the game at a certain limit
  function endGame() {
    // stop the interval timer
    clearInterval(interval);
    // turn off event handlers
    $(document).off();
  }
}