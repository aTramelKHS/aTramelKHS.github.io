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
const validKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
let rotateKey = "ArrowUp";
let fallKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let hardDropKey = " ";
let holdBlockKey = "c"
let splashText = ["Still learning!", "Am i right lads or am i right lads?", "Currently has no original music", "Alright", "Hello", "Boots with the fur!", "Works best in fullscreen!", "Lorem ipsum", "To be, or not to be. That is the question.", "Still in development!", "Wunderbar!", "If im a 0 then you could be the 1 for me.", "Sponsored by Vault-Tec.", "Press Alt + F4 for a secret!", "Listen to Tame Impala!", "Made with my blood, sweat, and (mostly) tears.", "Wisely done Mr. Freeman", "You underestimate my power!", "This idea wasn't stolen from Minecraft!", "War never changes", "Checkmate!", "P4$$W0RD", "Numerators and denominators", "Ad Victoriam", "FRESHAVOCADO", "Java and Javascript are NOT the same language", "Who can it be now?", "Hello, World!", "The Game", "Game over man, game over!", "Objection!", "Feo, fuerte y formal", "ROFL", "You get the gist of it", "Clever girl...", "Now with more tv and movie refrences", "You drive like you fix roads, lousy.", "You've got to ac-cent-uate the positive", "I'm not crazy... You're crazy!!!", "Still no pickles!", "Stop, drop, and roll!", "jhuioyg3osjk,wxamdnfigyuwkik3l3jswhihuoirn3c4833hd7830azijsd73qqsj82;la", "Not to be confused with: Tetroise", "That's no moon", "Syntax Error", "use PEMDAS", "Im just a bill on capital hill", "Bazinga", "Mobile phones are not and will never be supported so don't ask", "MATH IS MATH", "I AM CORNHOLIO!!!", "Fun Fact: \nJavascript was only made in 10 days.", "Fun Fact: \nTellurium-128 has the longest half-life out of any radioactive isotope, which is estimated \nto be 2.2 septillion years (2.2 × 10^24)", "Fun Fact: \nThe sounds that lightsabers make where made by combining the hum of a motor from an old movie projector and a malfunctioning CRT TV. The whooshing sounds were made using the Doppler Effect.", "Fun Fact: \nIn Minecraft, bells have the same blast \nresistance as Iron Doors, both of their values being 5.", "Fun Fact: \nmicrowaves, post-it notes, penicillin, and silly putty were created by accident.", "Fun Fact: \ncombos in Street Fighter II, creepers in \nMinecraft, and the Space Invaders adaptive \ndifficulty were all the result of a coding error.", "Fun Fact: \nthe closest linguistic cousin to the English language is Frisian, which is a West Germanic language spoken by ~500k people in the northern parts of the Netherlands and certain parts of Germany."];
const randomIndex = Math.floor(Math.random() * splashText.length);
//for testing purposes
//const randomIndex = splashText.length - 1
const selectedText = splashText[randomIndex];
splash.textContent = selectedText;
let fast = 0;


// dont look at my spaghetti code!

start.addEventListener('click', () => {
  game();
  start.hidden = true;
  settings.hidden = true;
  gameCanvas.hidden = false;
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
  back2.hidden = false;
  skinsBtn.hidden = true;
  document.body.style.overflow = 'auto';
});

function goBack(buttonId) {
  settings.hidden = false;
  start.hidden = false;
  skinsBtn.hidden = false;
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
    speed = 0.4;
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
  back.hidden = false;
  document.getElementById('allskins').hidden = false;
  document.body.style.overflow = 'auto';
});

function temporary() {
  var warning = prompt("Be advised: if you are prone to motion sickness its best if you don't allow this setting. If you aren't prone to motion sickness type 'Y'");
  if (warning === 'y' || warning === 'Y') {
    splash.hidden = true;
    skinsBtn.textContent = 'still indev'
    main.classList.remove('main-style');
    main.classList.add('main-style2');
    indicator.classList.remove('indicator-style');
    indicator.classList.add('indicator-style2');
    gameCanvas.style.backgroundImage = 'none';
    dashboard.classList.add('dashboard-style');
    UI.classList.add('UI-style');
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
      buttons[i].classList.add("button-style");
    }
    for (var i = 0; i < smallBtn.length; i++) {
      smallBtn[i].classList.remove('btn-small');
      smallBtn[i].classList.add('btn-small-style');
    }
    for (var i = 0; i < slider.length; i++) {
      slider[i].classList.remove('input-bars');
      slider[i].classList.add('input-bars-style');
    }
    if (failsafe === 0) {
      animateScanlines();
    }
    failsafe += 1;
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
}