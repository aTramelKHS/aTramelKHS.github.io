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
  const KEY = {
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    W: 87,
    S: 83,
    D: 68,
  }
  // Game Item Objects
  var walker = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: $('#walker').width(),
    height: $('#walker').height(),
    it: true,
  }
  var WALKER_RIGHT = walker.x + walker.width;
  var WALKER_BOTTOM = walker.y + walker.height;
  var walker2 = {
    x: 0,
    y: 560,
    speedX: 0,
    speedY: 0,
    width: $('#walker2').width(),
    height: $('#walker2').height(),
    it: false,
  }
  var WALKER2_RIGHT = walker2.x + walker2.width;
  var WALKER2_BOTTOM = walker2.y + walker2.height;

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)

  /* 
  This section is where you set up event listeners for user input.
  For example, if you wanted to handle a click event on the document, you would replace 'eventType' with 'click', and if you wanted to execute a function named 'handleClick', you would replace 'handleEvent' with 'handleClick'.

  Note: You can have multiple event listeners for different types of events.
  */
  $(document).on('keydown', handleKeyDown);                          
  $(document).on('keyup', handleKeyUp);
  $('#change').on('click', function() {
    var randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
    $('#walker').css('background-color', randomColor);
    randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
    $('#walker2').css('background-color', randomColor);
  });
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
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
  
  function handleKeyDown(event) {
    //player 1 controls
    if (event.which === KEY.LEFT) {
      walker.speedX = -5;
    } else if (event.which === KEY.UP) {
      walker.speedY = -5;
    } else if (event.which === KEY.RIGHT) {
      walker.speedX = 5;
    } else if (event.which === KEY.DOWN) {
      walker.speedY = 5;
    }
    //player 2 controls
    if (event.which === KEY.A) {
      walker2.speedX = -5;
    } else if (event.which === KEY.W) {
      walker2.speedY = -5;
    } else if (event.which === KEY.D) {
      walker2.speedX = 5;
    } else if (event.which === KEY.S) {
      walker2.speedY = 5;
    }
  }
  function handleKeyUp(event){
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
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function redrawGameItem() {
    $('#walker').css('left', walker.x);
    $('#walker').css('top', walker.y);
    $('#walker2').css('left', walker2.x);
    $('#walker2').css('top', walker2.y);
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

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

  function tag() {
    if (walker.x === walker2.x || walker.y === walker2.y || WALKER_RIGHT === WALKER2_RIGHT || WALKER_BOTTOM === WALKER2_BOTTOM) {
      walker.it = !walker.it;
      walker2.it = !walker.it;
      console.log('tagged');
    }
    if (walker.it === true) {
      $('#walker').css('background-image', 'url(https://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg)')
    } else if (walker2.it === true) {
      $('#walker2').css('background-image', 'url(https://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg)')
    }
  }
}
