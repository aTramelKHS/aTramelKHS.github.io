const start = document.getElementById('startBtn');
const settings = document.getElementById('settings');
const back = document.getElementById('back');
const back2 = document.getElementById('back2');
const skinsBtn = document.getElementById('skins');
const keyBinds = document.getElementById('keybind');
const splash = document.getElementById('splash');
const title = document.getElementById('text');
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
const validKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
let rotateKey = "ArrowUp";
let fallKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let hardDropKey = " ";
let holdBlockKey = "c";
let splashText = ["Still learning!", "Am i right lads or am i right lads?", "Currently has no original music", "Alright", "Hello", "Boots with the fur!", "Works best in fullscreen!", "Lorem ipsum", "To be, or not to be. That is the question.", "Still in development!", "Wunderbar!", "If im a 0 then you could be the 1 for me.", "Sponsored by Vault-Tec.", "Press Alt + F4 for a secret!", "Listen to Tame Impala!", "Made with my blood, sweat, and (mostly) tears.", "Wisely done Mr. Freeman", "You underestimate my power!", "This idea wasn't stolen from Minecraft!", "War never changes", "Checkmate!", "P4$$W0RD", "Numerators and denominators", "Ad Victoriam", "FRESHAVOCADO", "Java and Javascript are NOT the same language", "Who can it be now?", "Hello, World!", "The Game", "Game over man, game over!", "Objection!", "Feo, fuerte y formal", "ROFL", "You get the gist of it", "Clever girl...", "Now with more tv and movie refrences", "You drive like you fix roads, lousy.", "You've got to ac-cent-uate the positive", "I'm not crazy... You're crazy!!!", "Still no pickles!", "Stop, drop, and roll!", "jhuioyg3osjk,wxamdnfigyuwkik3l3jswhihuoirn3c4833hd7830azijsd73qqsj82;la", "Not to be confused with: Tetroise", "That's no moon", "Syntax Error", "use PEMDAS", "Im just a bill on capital hill", "Bazinga", "Mobile phones are not and will never be supported so don't ask", "I AM CORNHOLIO!!!", "Fun Fact: \nJavascript was only made in 10 days.", "Fun Fact: \nTellurium-128 has the longest half-life out of \nany radioactive isotope, which is estimated \nto be 2.2 septillion years (2.2 × 10^24)", "Fun Fact: \nThe sounds that lightsabers make where made by combining the hum of a motor from an old movie projector and a malfunctioning CRT TV. The whooshing sounds were made using the Doppler Effect.", "Fun Fact: \nIn Minecraft, bells have the same blast \nresistance as Iron Doors, both of their values being 5.", "Fun Fact: \nmicrowaves, post-it notes, penicillin, and silly putty were created by accident.", "Fun Fact: \ncombos in Street Fighter II, creepers in \nMinecraft, and the Space Invaders adaptive \ndifficulty were all the result of a coding error.", "Fun Fact: \nthe closest linguistic cousin to the English language is Frisian, which is a West Germanic language spoken by ~500k people in the northern parts of the Netherlands and certain parts of Germany.", "Fun Fact: \nThe sunset on Mars appears blue. This is because the fine dust particles in Mars' thin atmosphere scatters blue light the most effectively"];
const randomIndex = Math.floor(Math.random() * splashText.length);
//for testing purposes
//const randomIndex = splashText.length - 1
const selectedText = splashText[randomIndex];
splash.textContent = selectedText;
let fast = 0;
let language = "eng"


// dont look at my spaghetti code!


function english() {
  start.textContent = "Start";
  settings.textContent = "Settings";
  skinsBtn.textContent = "Skins";
}

function german() {
  start.textContent = "Spielen";
  settings.textContent = "Einstellungen";
  skinsBtn.textContent = "Häute";
}

if (JSON.stringify(storedScores.length) === '0') {
  document.getElementById("latest-score").textContent = "Latest Score: " + 0;
} else {
  document.getElementById("latest-score").textContent = "Latest Score: " + JSON.stringify(storedScores[storedScores.length - 1]);
}
document.getElementById("plays").textContent = "Plays: " + JSON.stringify(storedScores.length);
document.getElementById("every-score").textContent = JSON.stringify(storedScores.join(" "));
document.getElementById('highscores').textContent = "Highest Score: " + highScore[0];



start.addEventListener('click', () => {
  game();
  start.hidden = true;
  settings.hidden = true;
  gameCanvas.hidden = false;
  pause.hidden = false;
  songs.hidden = true
  document.getElementById('queue').hidden = false;
  document.getElementById('UI').hidden = false;
  document.getElementById('viewnext').hidden = false;
  document.getElementById('skins').hidden = true;
  title.hidden = true;
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
  }
}


const pipBoy = document.querySelector('#main');
let failsafe = 0;
let position = 0;
let speed = 1
function animateScanlines() {
  position -= speed; // speed
  pipBoy.style.setProperty('--scanline-position', `${position}px`);
  requestAnimationFrame(animateScanlines);
  if (position === 10 * speed) {
    position = 0;
  }
};

function reduceMotion(val) {
  if (val === 0) {
    speed = 0.2;
  } else if (val === 1) {
    speed = 0;
  } else if (val === 2) {
    speed = 1;
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

function revert () {
  splash.hidden = false;
  gameCanvas.style.backgroundImage = 'url(source/images/matrix.png)';
  main.classList.add('main-style');
  main.removeAttribute('style');
  indicator.classList.add('indicator-style');
  indicator.removeAttribute('style');
  gameCanvas.style.backgroundImage = 'none';
  dashboard.removeAttribute('style');
  UI.removeAttribute('style');
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
    buttons[i].classList.remove('button-style-pip')
  }
  for (var i = 0; i < smallBtn.length; i++) {
    smallBtn[i].classList.add('btn-small');
    smallBtn[i].classList.remove('btn-small-style-pip');
  }
  for (var i = 0; i < slider.length; i++) {
    slider[i].classList.add('input-bars');
    slider[i].classList.remove('input-bars-pip');
  }

}

function removeStyles() {
  main.classList.remove('main-style');
  main.removeAttribute('style');
  indicator.removeAttribute('style');
  dashboard.removeAttribute('style');
  UI.removeAttribute('style');
  splash.hidden = true;
  gameCanvas.style.backgroundImage = 'none';
}

function changeSkin(skinId) {
  if (highScore[0] >= 7600) {
    //PIP
    if (skinId === "skin1") {
      var warning = prompt("Be advised: if you are prone to motion sickness its best if you don't choose this skin. But you can choose not to allow motion at any time. If you aren't prone to motion sickness type 'Y'");
      if (warning === 'y' || warning === 'Y') {
        removeStyles();
        $('#main').css({
          "justify-content": "center",
          "align-items": "center",
          "text-align": "center",
          "height": "100%",
          "margin": "10",
          "color": "rgb(0, 255, 0)",
          "content": "",
          "display": "block",
          "position": "absolute",
          "top": 0,
          "left": 0,
          "bottom": 0,
          "right": 0,
          "background": "linear-gradient( to bottom, #008e00 50%, #004f00 50%)",
          "background-position-y": "var(--scanline-position, 0)",
          "background-size": "100% 25px",
          "z-index": -10,
          "font-family": "'Fjalla One', sans-serif",
          "font-weight": 400,
          "font-style": "normal",
          "font-size": "25px"
        });
        $('#dashboard').css({
          'border-top': '6px solid rgb(0, 255, 0)',
          'background-color': 'rgba(0, 0, 0, 0.5)',
          'border-bottom': '6px solid rgb(0, 255, 0)',
          'display': 'center',
          'padding': '20px',
          'width': '740px',
          'align-items': 'center',
          'margin': 'auto'
        });
        $('#UI').css({
          "border-top": "6px solid rgb(0, 255, 0)",
          "background-color": "rgba(0, 0, 0, 0.5)",
          "border-bottom": "6px solid rgb(0, 255, 0)",
          "padding": "10px"
        })
        colors = {
          I: "rgb(0, 255, 0)",
          O: "rgb(0, 230, 0)",
          T: "rgb(0, 200, 0)",
          S: "rgb(0, 175, 0)",
          Z: "rgb(0, 160, 0)",
          J: "rgb(0, 145, 0)",
          L: "rgb(0, 120, 0)",
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
    }
  } else {
    alert("You can't do that! Required points: 7600");
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

function revertChanges() {
  let yes = prompt("Are you sure you want to revert back to default keybinds? Y or N");
  if (yes === "Y" || yes === "y") {
    alert("changes reverted");
    rotateKey = "ArrowUp";
    fallKey = "ArrowDown";
    leftKey = "ArrowLeft";
    rightKey = "ArrowRight";
    hardDropKey = " ";
  }
};



function fastMode() {
  fast = 3;
  tickSpeed = 72;
}