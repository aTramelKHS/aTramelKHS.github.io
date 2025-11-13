/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var BOARD_STARTING_X_VALUE = 0;
  var BOARD_STARTING_Y_VALUE = 0;

  ////////////////////////////////////////
  ////////////////CONTROLS////////////////
  ////////////////////////////////////////

  // defines key numbers 
  /* old version
  const KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    W: 87,
    S: 83,
    D: 68,
  }*/

  // all keys are in a FALSE state unless pressed
  let KEYSTATES = {
    ArrowLeft: false,
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false,
    a: false,
    w: false,
    s: false,
    d: false,
  }
  ////////////////////////////////////////
  ///////////////CHARACTERS///////////////
  ////////////////////////////////////////

  // Game Item Objects
  // player 1
  var walker = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: $('#walker').width(),
    height: $('#walker').height(),
    isIt: false,
    speedIncrement: 5,
    totalTags: 0,
  }
  var WALKER_RIGHT = walker.x + walker.width;
  var WALKER_BOTTOM = walker.y + walker.height;

  // player 2
  var walker2 = {
    x: 580,
    y: 580,
    speedX: 0,
    speedY: 0,
    width: $('#walker2').width(),
    height: $('#walker2').height(),
    isIt: false,
    speedIncrement: 5,
    totalTags: 0,
  }
  var WALKER2_RIGHT = walker2.x + walker2.width;
  var WALKER2_BOTTOM = walker2.y + walker2.height;

  // tag variables
  var tagged = false;
  // pick a number between 0 and 10 (both players have a 50/50 chance of becoming it first)
  var whoStartsIt = Math.round(Math.random() * 10);
  console.log(whoStartsIt);
  if (whoStartsIt >= 0 && whoStartsIt <= 5) {
    walker.isIt = true;
    console.log('p1 is it');
  } else {
    walker2.isIt = true;
    console.log('p2 is it');
  }

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)

  /* 
  This section is where you set up event listeners for user input.
  For example, if you wanted to handle a click event on the document, you would replace 'eventType' with 'click', and if you wanted to execute a function named 'handleClick', you would replace 'handleEvent' with 'handleClick'.

  Note: You can have multiple event listeners for different types of events.
  */
  // old version
  /*$(document).on('keydown', handleKeyDown);                          
  $(document).on('keyup', handleKeyUp);*/

  // enhanced version
  document.addEventListener('keydown', (e) => {
    if (KEYSTATES.hasOwnProperty(e.key)) {
      KEYSTATES[e.key] = true;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (KEYSTATES.hasOwnProperty(e.key)) {
      KEYSTATES[e.key] = false;
    }
  });

  // count the seconds (for display only)
  var seconds = 0;
  var countTheSeconds = setInterval(function() {
    seconds += 1;
    $('#seconds').text(seconds);
    // end the game after 60 seconds (1 minute)
    if (seconds >= 60) {
      endGame();
      if (walker.isIt) {
        $('#p2win').show();
      } else if (walker2.isIt) {
        $('#p1win').show();
      }
      $('#text').text('refresh the page to play again');
    }
  }, 1000);

  // color change data (probably wont add due to the tagger color overriding this color)
  /*$('#change').on('click', function() {
    var randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
    $('#walker').css('background-color', randomColor);
    randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
    $('#walker2').css('background-color', randomColor);
  });*/
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    handleMovement();
    repositionGameItem();
    wallCollision();
    redrawGameItem();
    tag();
  }
  /* 
  This section is where you set up the event handlers for user input.
  For example, if you wanted to make an event handler for a click event, you should rename this function to 'handleClick', then write the code that should execute when the click event occurs.
  
  Note: You can have multiple event handlers for different types of events.
  */
  /* old version
  function handleKeyDown(event) {
    //player 1 controls
    if (event.which === KEY.LEFT) {
      walker.speedX = -walker.speedIncrement;
    } else if (event.which === KEY.UP) {
      walker.speedY = -walker.speedIncrement;
    } else if (event.which === KEY.RIGHT) {
      walker.speedX = walker.speedIncrement;
    } else if (event.which === KEY.DOWN) {
      walker.speedY = walker.speedIncrement;
    }
    //player 2 controls
    if (event.which === KEY.A) {
      walker2.speedX = -walker2.speedIncrement;
    } else if (event.which === KEY.W) {
      walker2.speedY = -walker2.speedIncrement;
    } else if (event.which === KEY.D) {
      walker2.speedX = walker2.speedIncrement;
    } else if (event.which === KEY.S) {
      walker2.speedY = walker2.speedIncrement;
    }
  }*/

  function handleMovement() {
    // player 1 controls
    // divide by the square root of 2 if players go diagonally (maths)
    if (KEYSTATES.ArrowLeft && KEYSTATES.ArrowUp || KEYSTATES.ArrowRight && KEYSTATES.ArrowUp || KEYSTATES.ArrowLeft && KEYSTATES.ArrowDown || KEYSTATES.ArrowRight && KEYSTATES.ArrowDown) {
      walker.speedIncrement /= Math.sqrt(2);
    }
    // if pressed
    if (KEYSTATES.ArrowLeft) {
      walker.speedX = -walker.speedIncrement;
    } 
    if (KEYSTATES.ArrowUp) {
      walker.speedY = -walker.speedIncrement;
    } 
    if (KEYSTATES.ArrowRight) {
      walker.speedX = walker.speedIncrement;
    } 
    if (KEYSTATES.ArrowDown) {
      walker.speedY = walker.speedIncrement;
    }
    // if released
    if (!KEYSTATES.ArrowRight && !KEYSTATES.ArrowLeft) {
      walker.speedX = 0;
    }
    if (!KEYSTATES.ArrowUp && !KEYSTATES.ArrowDown) {
      walker.speedY = 0;
    }

    //player 2 controls
    // divide by the square root of 2 if players go diagonally (maths)
    if (KEYSTATES.a && KEYSTATES.w || KEYSTATES.d && KEYSTATES.w || KEYSTATES.a && KEYSTATES.s || KEYSTATES.d && KEYSTATES.s) {
      walker2.speedIncrement /= Math.sqrt(2);
    }
    // if pressed
    if (KEYSTATES.a) {
      walker2.speedX = -walker2.speedIncrement;
    } 
    if (KEYSTATES.w) {
      walker2.speedY = -walker2.speedIncrement;
    } 
    if (KEYSTATES.d) {
      walker2.speedX = walker2.speedIncrement;
    } 
    if (KEYSTATES.s) {
      walker2.speedY = walker2.speedIncrement;
    }
    // if released
    if (!KEYSTATES.a && !KEYSTATES.d) {
      walker2.speedX = 0;
    }
    if (!KEYSTATES.w && !KEYSTATES.s) {
      walker2.speedY = 0;
    }
  }

  // stops players from moving if a key stops being pressed
  // old version
  /*function handleKeyUp(event){
    // player 1
    if (event.which === KEY.LEFT || event.which === KEY.RIGHT) {
      walker.speedX = 0;
    } 
    if (event.which === KEY.UP || event.which === KEY.DOWN) {
      walker.speedY = 0;
    }
    // player 2
    if (event.which === KEY.A || event.which === KEY.D) {
      walker2.speedX = 0;
    } 
    if (event.which === KEY.W || event.which === KEY.S) {
      walker2.speedY = 0;
    }
  }*/

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // redraws the position of both player
  function redrawGameItem() {
    $('#walker').css('left', walker.x);
    $('#walker').css('top', walker.y);
    $('#walker2').css('left', walker2.x);
    $('#walker2').css('top', walker2.y);
  }

  // ends the game
  function endGame() {
    // stop the interval timer
    clearInterval(interval);
    clearInterval(countTheSeconds);
    // turn off event handlers
    $(document).off();
  }

  //defines where the boxes are
  function repositionGameItem() {
    //player 1
    walker.x += walker.speedX;
    walker.y += walker.speedY;
    WALKER_RIGHT = walker.x + walker.width;
    WALKER_BOTTOM = walker.y + walker.height;
    //player 2
    walker2.x += walker2.speedX;
    walker2.y += walker2.speedY;
    WALKER2_RIGHT = walker2.x + walker2.width;
    WALKER2_BOTTOM = walker2.y + walker2.height;
  }

  // detects if a player touches a wall then prevents them from going any further 
  function wallCollision() {
    //player 1
    if (walker.x < BOARD_STARTING_X_VALUE || WALKER_RIGHT > $('#board').width()) {
      walker.x -= walker.speedX; 
    }
    if (walker.y < BOARD_STARTING_Y_VALUE || WALKER_BOTTOM > $('#board').height()) {
      walker.y -= walker.speedY;
    }
    //player 2
    if (walker2.x < BOARD_STARTING_X_VALUE || WALKER2_RIGHT > $('#board').width()) {
      walker2.x -= walker2.speedX; 
    }
    if (walker2.y < BOARD_STARTING_Y_VALUE || WALKER2_BOTTOM > $('#board').height()) {
      walker2.y -= walker2.speedY;
    }
  }
  
  // detects when players overlap then changes their isIt value
  function tag() {
    // if player 1's boundary overlaps with player 2's boundary
    if (walker.x < WALKER2_RIGHT && WALKER_RIGHT > walker2.x && walker.y < WALKER2_BOTTOM && WALKER_BOTTOM > walker2.y) {
      if (tagged === false) {
        tagged = true;
        walker.isIt = !walker.isIt;
        walker2.isIt = !walker2.isIt;
        if (walker.isIt) {
          walker2.totalTags++;
        } else if (walker2.isIt) {
          walker.totalTags++;
        }
      }
    } else {
      tagged = false;
    }
    // changes the taggers color and also makes the tagger slightly slower
    if (walker.isIt === true) {
      $('#walker').css('background-color', 'purple');
      $('#walker2').css('background-color', 'blue');
      walker.speedIncrement = 4;
      walker2.speedIncrement = 5;
    } else if (walker2.isIt === true) {
      $('#walker2').css('background-color', 'purple');
      $('#walker').css('background-color', 'blue')
      walker2.speedIncrement = 4;
      walker.speedIncrement = 5;
    }
  }
}
