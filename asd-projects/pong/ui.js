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
  $("#pauseBtn").prop("disabled", true);
  $("#play").hide();
  $("#board").show();
  $("#readyMsg").show().text("GET READY...");
  menuMusic.pause();
  startGameMusic();
  $("#board").css("transform", "scale(1.7)");
  runProgram();
  balls.push(new Ball('ball' + balls.length));
  if (mBtns.hasMultiBall) {
    balls.push(new Ball('ball' + balls.length));
    balls.push(new Ball('ball' + balls.length));
  }
  setTimeout(() => {
    $("#board").css("transform", "scale(1)");
    for (var ball of balls) {
     ball.element.css({
        opacity: "1",
        transform: "scale(1)",
      });
    }
  }, 500);
  setTimeout(() => {
    $("#readyMsg").text("GO!!!!!");
    for (var ball of balls) {
      ball.element.css('transition', 'none');
    }
    startBall();
    $("#pauseBtn").prop("disabled", false);
    setTimeout(() => {
      $("#readyMsg").hide();
    }, 2000);
  }, 3000);
}

function showSettings() {
  window.scrollTo(0, 0);
  $("#menu").hide();
  $("#settings").show();
  $("body").css("overflow", "scroll");
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

function showPlay() {
  $("#menu").hide();
  $("#play").show();
}

function showModes() {
  window.scrollTo(0, 0);
  $("#menu").hide();
  $("#modes").show();
  $("body").css("overflow", "scroll");
}

// base colors
let red = 127;
let green = 127;
let blue = 127;

function showChange() {
  $("#showColor").css(
    "background-color",
    "rgb(" + red + ", " + green + ", " + blue + ")"
  );
}

let ballColor = "rgb(255, 255, 255)";

function apply(element) {
  if (element === "font") {
    $("h1, h2, p, output, button, #scoreL, #scoreR").css(
      "color",
      "rgb(" + red + ", " + green + ", " + blue + ")"
    );
    return;
  }
  if (element === "ball") {
    ballColor = "rgb(" + red + ", " + green + ", " + blue + ")";
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
    menuMusic.seek(0);
    menuMusic.play();
    stopPanic();
  });
  $("#restart").on("click", () => {
    isPaused = false;
    $("#pausedMsg, #goHome, #restart").hide();
    if (typeof restartGame === "function") {
      // makes sure it only restarts if the restartGame function is declared
      restartGame();
      setTimeout(playGame(), 2000);
    }
  });
});

// single player difficulties
let difficulties = ["LOCAL MULTIPLAYER", "EASY", "NORMAL", "HARD"];
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
  showFps: false,
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
    wumboing();
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
  $("#showfps").on("click", () => {
    mBtns.showFps = !mBtns.showFps;
    $("#showfps").text(mBtns.showFps ? "ON" : "SHOW FPS");
    $("#fpsdisplay").toggle(mBtns.showFps);
  });
});

// applies wumbo effect
function wumboing() {
  if (mBtns.isWumbo) {
    $('#paddleL, #paddleR').css({
      'width': 50,
      'height': 320,
      'top': 'calc(50% - 160px)'
    });
    ballSize = 80;
  } else {
    $('#paddleL, #paddleR').css({
      'width': 25,
      'height': 160,
      'top': 'calc(50% - 80px)'
    });
    ballSize = 40;
  }
}