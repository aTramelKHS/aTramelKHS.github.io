
// MAKE EVERYTHING LOAD WITH A LOADING SCREEN
window.addEventListener('load', function() {
  $('#mask').css('animation', 'load 2s');
  this.setTimeout(function() {
    $('#mask').css('display', 'none');
    $('#everything').css('display', 'block');
  }, 2000);
})

// HTML elements
const start = document.getElementById('startBtn');
const settings = document.getElementById('settings');
const back = document.getElementById('back');
const back2 = document.getElementById('back2');
const skinsBtn = document.getElementById('skins');
const keyBinds = document.getElementById('keybind');
const splash = document.getElementById('splash');
const title = document.getElementById('text');
const title2 = document.getElementById('mc-title');
const title3 = document.getElementById('pip-title');
const main = document.getElementById('main');
const gameCanvas = document.getElementById('game');
const UI = document.getElementById('UI');
const buttons = document.getElementsByClassName('buttons');
const dashboard = document.getElementById('dashboard');
const smallBtn = document.getElementsByClassName('smallbtn');
const slider = document.getElementsByClassName('slider');
const indicator = document.getElementById('indicator');
const pause = document.getElementById('pause');
const songs = document.getElementById('songs');
const listen = document.getElementById('listen');
const output = document.getElementsByClassName('output');
const vignette = document.getElementById('vignette');
// splash text
let splashText = ["Am i right lads or am i right lads?", "Lando Norris is Champion of 2025!", "Poptarts! With butter!?!", "Currently has no original music", "Alright", "Hello", "Boots with the fur!", "Works best in fullscreen!", "Lorem ipsum", "To be, or not to be. That is the question.", "Functions upon functions!", "Still in development!", "Wunderbar!", "If im a 0 then you could be the 1 for me.", "Sponsored by Vault-Tec.", "Press Alt + F4 for a secret!", "Listen to Tame Impala!", "Made with my blood, sweat, and (mostly) tears.", "Wisely done Mr. Freeman", "You underestimate my power!", "This idea wasn't stolen from Minecraft!", "War never changes", "Checkmate.", "P4$$W0RD", "Numerators and denominators", "Ad Victoriam", "FRESHAVOCADO", "Java and Javascript are NOT the same language", "Who can it be now?", "Hello, World!", "The Game", "Game over man, game over!", "Open your gaming juice and take a SWIG gamers!!!!!", "Feo, fuerte y formal", "ROFL", "You get the gist of it", "Original game by Alexey Pajitnov", "Clever girl...", "I'm not crazy... You're crazy!!!", "Still no pickles!", "Stop, drop, and roll!", "jhuioyg3osjk,wxamdnfigyuwkik3l3jswhihuoirn3c4833hd7830azijsd73qqsj82;la", "Not to be confused with: Tetroise", "That's no moon", "Syntax Error", "use PEMDAS", "I'm different.", "Bazinga", "Mobile phones are not and will never be supported so don't ask", "Fun Fact: \nJavascript was only made in 10 days.", "Fun Fact: \nTellurium-128 has the longest half-life out of \nany radioactive isotope, which is estimated \nto be 2.2 septillion years (2.2 × 10^24)", "Fun Fact: \nThe sounds that lightsabers make where made by combining the hum of a motor from an old movie projector and a malfunctioning CRT TV. The whooshing sounds were made using the Doppler Effect.", "Fun Fact: \nIn Minecraft, bells have the same blast resistance as Iron Doors, \nboth of their values being 5. Do what you want with that info.", "Fun Fact: \nmicrowaves, post-it notes, penicillin, and silly putty were created by accident.", "Fun Fact: \ncombos in Street Fighter II, creepers in \nMinecraft, and the Space Invaders adaptive \ndifficulty were all the result of a coding error.", "Fun Fact: \nthe closest linguistic cousin to the English language is Frisian, which is a West Germanic language spoken by ~500k people in the northern parts of the Netherlands and certain parts of Germany.", "Fun Fact: \nThe sunset on Mars appears blue. This is because the fine dust particles in Mars' thin atmosphere scatters blue light the most effectively", "Fun Fact: \nPurple doesn't have a wavelength meaning that our brain only enterprets it as a mixture of red and blue, \nbasically our brain makes up a color for purple. This is called a non-spectral color.", "GIVE ME FUEL, GIVE ME FIRE, GIVE ME THAT WHICH I DESIRE", "Get  gud, kid."];
const randomIndex = Math.floor(Math.random() * splashText.length);
/* for testing purposes
const randomIndex = splashText.length - 1 */
const selectedText = splashText[randomIndex];
splash.textContent = selectedText;
// Date
let date = new Date();
let day = date.getUTCDate();
let month = date.getUTCMonth() + 1;
if (day === 31 && month === 10) {
  splash.textContent = "Happy Halloween!";
}
if (day === 1 && month === 4) {
  splash.textContent = "Happy April Fools!";
}
if (day === 25 && month === 12) {
  splash.textContent = "Merry Christmas!";
}
if (day === 4 && month === 7) {
  splash.textContent = "Happy 4th of July! AMERICAAAAAAAAAAAAA";
}
if (day === 4 && month === 5) {
  splash.textContent = "May the Fourth be With You!";
}
// Keybinds
const validKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", 'Alt'];
let rotateKey = "ArrowUp";
let fallKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let hardDropKey = " ";
let holdBlockKey = "c";
// Styles
let neon = false;
let minecraft = false;
let pip = false;
// other variablse
let fast = 0;

// displays the scores in settings
if (JSON.stringify(storedScores.length) === '0') {
  document.getElementById("latest-score").textContent = "Latest Score: " + 0;
} else {
  document.getElementById("latest-score").textContent = "Latest Score: " + JSON.stringify(storedScores[storedScores.length - 1]);
}
document.getElementById("plays").textContent = "Plays: " + JSON.stringify(storedScores.length);
document.getElementById("every-score").textContent = JSON.stringify(scoreConvert.join(" "));
document.getElementById('highscores').textContent = "Highest Score: " + highScore[0];

// menu buttons
start.addEventListener('click', () => {
  game();
  start.hidden = true;
  title.hidden = true;
  title2.hidden = true;
  title3.hidden = true;
  settings.hidden = true;
  gameCanvas.hidden = false;
  pause.hidden = false;
  songs.hidden = true;
  document.getElementById('queue').hidden = false;
  document.getElementById('UI').hidden = false;
  document.getElementById('viewnext').hidden = false;
  document.getElementById('skins').hidden = true;
  splash.hidden = true;
  skinsBtn.hidden = true;
  dashboard.hidden = true;
});

settings.addEventListener('click', () => {
  document.getElementById('allsettings').hidden = false;
  start.hidden = true;
  settings.hidden = true;
  songs.hidden = true;
  back2.hidden = false;
  skinsBtn.hidden = true;
  document.body.style.overflow = 'auto';
});

songs.addEventListener('click', () => {
  document.getElementById('allsongs').hidden = false;
  settings.hidden = true;
  start.hidden = true;
  skinsBtn.hidden = true;
  songs.hidden = true;
  document.body.style.overflow = 'auto';
});
$('#soundvol').on('input', function() {

});

function goBack(buttonId) {
  settings.hidden = false;
  start.hidden = false;
  skinsBtn.hidden = false;
  songs.hidden = false;
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  if (buttonId === 1) {
    back.hidden = false;
    document.getElementById("allskins").hidden = true;
  } else if (buttonId === 2) {
    back2.hidden = false;
    document.getElementById('allsettings').hidden = true;
  } else if (buttonId === 3) {
    back3.hidden = false;
    document.getElementById('allsongs').hidden = true;
  }
}

// animate the pip skin background
const pipBoy = document.querySelector('#main');
let failsafe = 0;
let position = 0;
let speed = 0.5;
function animateScanlines() {
  position += speed;
  pipBoy.style.setProperty('--scanline-position', `${position}px`);
  requestAnimationFrame(animateScanlines);
  if (position === -10 * speed) {
    position = 0;
  }
};

function reduceMotion(val) {
  if (val === 0) {
    speed = 0.2;
  } else if (val === 1) {
    speed = 0;
  } else if (val === 2) {
    speed = 0.5;
  }
}

skinsBtn.addEventListener('click', () => {
  start.hidden = true;
  settings.hidden = true;
  skinsBtn.hidden = true;
  songs.hidden = true;
  back.hidden = false;
  document.getElementById('allskins').hidden = false;
  document.body.style.overflow = 'auto';
});

function revert() {
  removeStyles()
  title.hidden = false;
  gameCanvas.style.backgroundImage = "url('source/images/matrix.png')";
  main.classList.add('main-style');
  indicator.classList.add('indicator-style');
  splash.hidden = false;
  colors = {
    I: "cyan",
    O: "yellow",
    T: "purple",
    S: "green",
    Z: "red",
    J: "blue",
    L: "orange",
  };
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.add("normal");
  }
  for (var i = 0; i < smallBtn.length; i++) {
    smallBtn[i].classList.add('btn-small');
  }
  for (var i = 0; i < slider.length; i++) {
    slider[i].classList.add('input-bars');
  }
}

function removeStyles() {
  neon = false;
  minecraft = false;
  pip = false;
  vignette.hidden = true;
  title.hidden = true;
  title2.hidden = true;
  title3.hidden = true;
  $('body').removeClass('cursor-pip');
  main.classList.remove('main-style');
  main.removeAttribute('style');
  indicator.removeAttribute('style');
  dashboard.removeAttribute('style');
  UI.removeAttribute('style');
  gameCanvas.removeAttribute('style');
  $('canvas').removeAttr('style');
  $('p').removeAttr('style');
  $('#pause').removeAttr('style');
  $('.dood').css({
    'display': 'block'
  });
  splash.textContent = selectedText;
  splash.hidden = true;
  gameCanvas.style.backgroundImage = 'none';
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].className = 'buttons';
  }
  for (var i = 0; i < smallBtn.length; i++) {
    smallBtn[i].className = 'smallbtn';
  }
  for (var i = 0; i < slider.length; i++) {
    slider[i].className = 'slider';
  }
}

// if you're seeing this and were thinking about changing the point requirement value. you are a jerk

function changeSkin(skinId) {
  if (skinId === "skin1") {
    //PIP
    if (highScore[0] >= 7600) {
      var warning = prompt("Be advised: if you are prone to motion sickness its best if you don't choose this skin. But you can choose not to allow motion at any time. If you aren't prone to motion sickness type 'Y'");
      if (warning === 'y' || warning === 'Y') {
        removeStyles();
        pip = true;
        title3.hidden = false;
        vignette.hidden = false;
        $('body').addClass('cursor-pip');
        $('#main').css({
          "justify-content": "center",
          "align-items": "center",
          "text-align": "center",
          "height": "100%",
          "margin": "10",
          // animated bg
          "content": " ",
          "display": "block",
          "position": "absolute",
          "top": 0,
          "left": 0,
          "bottom": 0,
          "right": 0,
          "background": "linear-gradient( to bottom, #003b00ff 65%, black 60%)",
          "background-position-y": "var(--scanline-position, 0)",
          "background-size": "100% 10px",
          "z-index": -10,
          // font
          "color": "rgba(0, 255, 0, 0.7)",
          "font-family": "Monofonto",
          "font-weight": 400,
          "font-style": "normal",
          "font-size": "25px",
        });
        $('#dashboard').css({
          'border-top': '6px solid rgba(0, 255, 0, 0.6)',
          'background-color': 'rgba(0, 0, 0, 0.6)',
          'border-bottom': '6px solid rgba(0, 255, 0, 0.6)',
          'display': 'center',
          'padding': '20px',
          'width': '740px',
          'align-items': 'center',
          'margin': 'auto'
        });
        $('#UI').css({
          "border-top": "6px solid rgba(0, 255, 0, 0.6)",
          "background-color": "rgba(0, 0, 0, 0.6)",
          "border-bottom": "6px solid rgba(0, 255, 0, 0.6)",
          "padding": "10px"
        });
        $('canvas').css({
          "border": "6px solid rgba(0, 255, 0, 0.6)",
          "background-color": "rgba(0, 0, 0, 0.6)"
        });
        colors = {
          I: "rgba(0, 255, 0, 0.8)",
          O: "rgba(0, 230, 0, 0.8)",
          T: "rgba(0, 200, 0, 0.8)",
          S: "rgba(0, 175, 0, 0.8)",
          Z: "rgba(0, 160, 0, 0.8)",
          J: "rgba(0, 145, 0, 0.8)",
          L: "rgba(0, 120, 0, 0.8)",
        };
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove("normal");
          buttons[i].classList.add('button-style-pip');
        }
        for (var i = 0; i < smallBtn.length; i++) {
          smallBtn[i].classList.remove('btn-small');
          smallBtn[i].classList.add('btn-small-style-pip');
        }
        for (var i = 0; i < slider.length; i++) {
          slider[i].classList.remove('input-bars');
          slider[i].classList.add('input-bars-pip');
        }
        if (failsafe === 0) {
          animateScanlines();
        }
        failsafe += 1;
      }
    } else {
      alert("You can't do that! Required points: 7600");
    }
  } 
  if (skinId === "skin2") {
    //MINECRAFT
    if (highScore[0] >= 8000) {
      removeStyles();
      minecraft = true;
      title2.hidden = false;
      $('#main').css({
        'font-family': 'Minecraftia',
        "justify-content": "center",
        "align-items": "center",
        "text-align": "center",
        "height": "100%",
        "margin": "10",
        "background-image": 'url("source/images/dirt-bg.jpg")',
        "color": "white"
      });
      $('.dood').css({
        'display': 'none'
      });
      $('#UI').css({
        'font-size': '15px'
      })
      $('#pause').css({
        'padding': '20px',
        'margin': '10px',
        'width': '130px',
        'height': '80px',
        'font-size': '17px',
        'position': 'relative',
        'top': '10px',
        'left': '100px'
      });
      $('canvas').css({
        'border': 'none',
        'background-image': 'url(source/images/inventory.png)',
        'background-size': 'cover'
      })
      gameCanvas.style.backgroundImage = 'url(source/images/mc-bg.png)';
      //render tetrominos
      const glass = new Image();              //S
      glass.src = 'source/images/mc-glass-S.png';
      const plank = new Image();              //Z
      plank.src = 'source/images/mc-plank-Z.jpg';
      const grass = new Image();              //L
      grass.src = 'source/images/mc-grass-L.png';
      const sand = new Image();               //I
      sand.src = 'source/images/mc-sand-I.jpg';
      const stone = new Image();              //J
      stone.src = 'source/images/mc-stone-J.png';
      const tnt = new Image();                //O
      tnt.src = 'source/images/mc-tnt-O.png';
      const wood = new Image();               //T
      wood.src = 'source/images/mc-wood-T.png';
      //view next render
      const sandRender = new Image();
      sandRender.src = 'source/images/sandrend.png';
      const stoneRender = new Image();
      stoneRender.src = 'source/images/stonerend.png';
      const glassRender = new Image();
      glassRender.src = 'source/images/glassrend.png';
      const plankRender = new Image();
      plankRender.src = 'source/images/plankrend.png';
      const grassRender = new Image();
      grassRender.src = 'source/images/grassrend.png';
      const tntRender = new Image();
      tntRender.src = 'source/images/tntrend.png';
      const woodRender = new Image();
      woodRender.src = 'source/images/logrend.png';
      Promise.all([
        new Promise(resolve => glass.onload = resolve),
        new Promise(resolve => plank.onload = resolve),
        new Promise(resolve => grass.onload = resolve),
        new Promise(resolve => sand.onload = resolve),
        new Promise(resolve => stone.onload = resolve),
        new Promise(resolve => tnt.onload = resolve),
        new Promise(resolve => wood.onload = resolve),
        new Promise(resolve => glassRender.onload = resolve),
        new Promise(resolve => plankRender.onload = resolve),
        new Promise(resolve => grassRender.onload = resolve),
        new Promise(resolve => sandRender.onload = resolve),
        new Promise(resolve => stoneRender.onload = resolve),
        new Promise(resolve => tntRender.onload = resolve),
        new Promise(resolve => woodRender.onload = resolve)
      ]).then(() => {
        colors = {
          I: [sand, sandRender],
          O: [tnt, tntRender],
          T: [wood, woodRender],
          S: [glass, glassRender],
          Z: [plank, plankRender],
          J: [stone, stoneRender],
          L: [grass, grassRender],
        };
      })
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("normal");
        buttons[i].classList.add('minecraft-btn');
      }
      for (var i = 0; i < smallBtn.length; i++) {
        smallBtn[i].classList.remove('btn-small');
        smallBtn[i].classList.add('minecraft-small-btn');
      }
      for (var i = 0; i < slider.length; i++) {
        slider[i].classList.remove('input-bars');
        slider[i].classList.add('minecraft-input-bars');
      }
      for (var i = 0; i < output.length; i++) {
        output[i].classList.add('slider-output-minecraft');
      }
    } else {
      alert("You can't do that! Required points: 8000");
    }
  } 
  if (skinId === "skin3") {
    //NEON
    //Suggested by Presley. Thanks Presley, this was a pain
    if (highScore[0] >= 10000) {
      removeStyles();
      neon = true;
      title.hidden = false;
      splash.hidden = false;
      splash.textContent = "Now with more noble gasses";
      $('#main').css({
        "background-color": "black",
        "justify-content": "center",
        "align-items": "center",
        "text-align": "center",
        "height": "100%",
        "margin": "10",
        "color": "white",
        "size": "20px"
      });
      $('canvas').css({
        "border": "5px solid white",
        "box-shadow": "0 0 42px 0 white, 0 0 23px 0 white"
      });
      $('#UI').css({
        "color": "white",
        "text-shadow": "0 0 10px white, 0 0 6px white",
        "font-family": "JetBrains Mono, Fira Code, Consolas, 'Droid Sans Mono', monospace"
      });
      $('p').css({
        "font-size": "30px",
        "color": "white",
        "text-shadow": "0 0 10px white, 0 0 12px white",
      });

      colors = {
        I: "gray",
        O: "gray",
        T: "gray",
        S: "gray",
        Z: "gray",
        J: "gray",
        L: "gray"
      };
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("normal");
        buttons[i].classList.add('button-style-neon');
      }
      for (var i = 0; i < smallBtn.length; i++) {
        smallBtn[i].classList.remove('btn-small');
        smallBtn[i].classList.add('btn-small-style-neon');
      }
      for (var i = 0; i < slider.length; i++) {
        slider[i].classList.remove('input-bars');
        slider[i].classList.add('input-bars-neon');
      }
      
    } else {
      alert("You can't do that! Required points: 10000");
    }
  } 
  if (skinId === 'skin4') {
    if (highScore[0] >= 50) {
      removeStyles();
      title.hidden = false;
      $('#main').css({
        'height': '100%',
        'margin': '10',
        'position': 'relative',
        'color': 'white',
        'background': 'radial-gradient(farthest-corner at 85% 35%, rgba(189, 30, 30, 1) 35%, rgba(50, 50, 50, 1) 75%)',
        'background-attachment': 'fixed',
        'display': 'flex',
        'text-align': 'center',
        'justify-content': 'center',
        'font-size': '25px',
        'font-family': "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
      });
      $('#pause').css({
        'font-size': '20px',
        'position': 'relative',
        'top': '10px',
        'left': '90px',
        'width': '110px'
      });
      $('canvas').css({
        "border": "5px outset rgba(222, 6, 6, 1)"
      });
      $('#UI').css({
        'background-color': 'rgba(226, 8, 8, 1)',
        "border": "5px outset rgba(200, 14, 14, 1)"
      });
      colors = {
        I: "rgba(227, 0, 0, 1)",
        O: "rgba(255, 65, 65, 1)",
        T: "rgba(164, 9, 9, 1)",
        S: "rgba(219, 22, 22, 1)",
        Z: "rgba(108, 50, 50, 1)",
        J: "rgba(132, 12, 12, 1)",
        L: "rgba(194, 53, 53, 1)"
      };
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("normal");
        buttons[i].classList.add('button-style-crimson');
      }
      for (var i = 0; i < smallBtn.length; i++) {
        smallBtn[i].classList.remove('btn-small');
        smallBtn[i].classList.add('btn-small-style-crimson');
      }
    } else {
      alert("You can't do that! Required points: 5000");
    }
  }
}

function changeRotate() {
  let something = prompt("Change the Rotate Key (base key is ArrowUp)");
  if (validKeys.includes(something)) {
    rotateKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeFall() {
  let something = prompt("Change the Drop Key (base key is ArrowDown)");
  if (validKeys.includes(something)) {
    fallKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeLeft() {
  let something = prompt("Change the Left Key (base key is ArrowLeft)");
  if (validKeys.includes(something)) {
    leftKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeRight() {
  let something = prompt("Change the Right Key (base key is ArrowRight)");
  if (validKeys.includes(something)) {
    rightKey = something;
  } else {
    alert('stop');
  }
};
function changeHD() {
  let something = prompt("Change the Hard Drop Key (base key is Spacebar)");
  if (validKeys.includes(something)) {
    hardDropKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeHold() {
  let something = prompt("Change the Hard Drop Key (base key is Spacebar)");
  if (validKeys.includes(something)) {
    hardDropKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function revertChanges() {
  let yes = prompt("Are you sure you want to revert back to default keybinds? Y or N");
  if (yes === "Y" || yes === "y") {
    alert("changes reverted");
    rotateKey = "ArrowUp";
    fallKey = "ArrowDown";
    leftKey = "ArrowLeft";
    rightKey = "ArrowRight";
    hardDropKey = " ";
    holdBlockKey = "c";
  }
};

function clearData() {
  var result = prompt('are you sure you want to delete ALL your data? (this includes highscores and unlocked skins)');
  if (result === "Y" || result === "y") {
    localStorage.clear();
    alert('data successfully cleared');
  }
}