const start = document.getElementById('startBtn');
const settings = document.getElementById('settings');
const back = document.getElementById('back');
const skinsBtn = document.getElementById('skins');
const keyBinds = document.getElementById('keybind');
const splash = document.getElementById('splash');
const title = document.getElementById('text');
const main = document.getElementById('main');
const gameCanvas = document.getElementById('game');
const buttons = document.getElementsByClassName('buttons');
const dashboard = document.getElementById('dashboard');
const smallBtn = document.getElementsByClassName('smallbtn');
const correctBinds = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
let rotateKey = "ArrowUp";
let fallKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let hardDropKey = " ";
let holdBlockKey = "c"
let splashText = ["Still learning!", "Am i right lads or am i right lads?", "Currently has no original music", "Alright", "Hello", "Boots with the fur!", "Works best in fullscreen!", "Lorem ipsum", "To be, or not to be. That is the question.", "Still in development!", "Wunderbar!", "If im a 0 then you could be the 1 for me.", "Sponsored by Vault-Tec.", "Press Alt + F4 for a secret!", "Listen to Tame Impala!", "Made with my blood, sweat, and (mostly) tears.", "Wisely done Mr. Freeman", "You underestimate my power!", "This idea wasn't stolen from Minecraft!", "War never changes", "Checkmate!", "P4$$W0RD", "Numerators and denominators", "Ad Victoriam", "FRESHAVOCADO", "Java and Javascript are NOT the same language", "Who can it be now?", "Hello, World!", "The Game", "Game over man, game over!", "Objection!", "Feo, fuerte y formal", "ROFL", "You get the gist of it", "Clever girl...", "Now with more tv and movie refrences", "You drive like you fix roads, lousy.", "You've got to ac-cent-uate the positive", "I'm not crazy... You're crazy!!!", "Still no pickles!", "Stop, drop, and roll!", "jhuioyg3osjk,wxamdnfigyuwkik3l3jswhihuoirn3c4833hd7830azijsd73qqsj82;la", "Not to be confused with: Tetroise", "That's no moon", "Syntax Error", "use PEMDAS", "Im just a bill on capital hill", "Bazinga"];
const randomIndex = Math.floor(Math.random() * splashText.length);
const selectedText = splashText[randomIndex];
splash.textContent = selectedText;


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
  back.hidden = false;
  skinsBtn.hidden = true;
  document.body.style.overflow = 'auto';
});

back.addEventListener('click', () => {
  back.hidden = true;
  settings.hidden = false;
  start.hidden = false;
  skinsBtn.hidden = false;
  document.getElementById('allsettings').hidden = true;
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
});

const crtContainer = document.querySelector('#main');
let failsafe = 0;
let position = 0;
function animateScanlines() {
  position -= 2; // speed
  crtContainer.style.setProperty('--scanline-position', `${position}px`);
  requestAnimationFrame(animateScanlines);
  if (position === -100) {
    position = 0;
  }
};

skinsBtn.addEventListener('click', () => {
  var warning = prompt("Be advised: if you are prone to motion sickness its best if you don't allow this setting. If you aren't prone to motion sickness type 'Y'");
  if (warning === 'y' || warning === 'Y') {
    splash.hidden = true;
    skinsBtn.textContent = 'still indev'
    main.classList.remove('main-style');
    main.classList.add('main-style2');
    gameCanvas.style.backgroundImage = 'none';
    dashboard.classList.add('dashboard-style');
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
    if (failsafe === 0) {
      animateScanlines();
    }
    failsafe += 1;
  }
});

function changeRotate() {
  let something = prompt("Change the Rotate Key (base key is ArrowUp)");
  if (correctBinds.includes(something)) {
    rotateKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeFall() {
  let something = prompt("Change the Drop Key (base key is ArrowDown)");
  if (correctBinds.includes(something)) {
    fallKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeLeft() {
  let something = prompt("Change the Left Key (base key is ArrowLeft)");
  if (correctBinds.includes(something)) {
    leftKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function changeRight() {
  let something = prompt("Change the Right Key (base key is ArrowRight)");
  if (correctBinds.includes(something)) {
    rightKey = something;
  } else {
    alert('stop');
  }
};
function changeHD() {
  let something = prompt("Change the Hard Drop Key (base key is Spacebar)");
  if (correctBinds.includes(something)) {
    hardDropKey = something;
  } else {
    alert('this key is unacceptable!');
  }
};

function revertChanges() {
  let yes = prompt("Are you sure you want to revert back to default keybinds? Y or N");
  if (yes === "Y" || yes === "y") {
    alert("changes reverted");
    let rotateKey = "ArrowUp";
    let fallKey = "ArrowDown";
    let leftKey = "ArrowLeft";
    let rightKey = "ArrowRight";
    let hardDropKey = " ";
  }
};




/*
document.getElementById('lvl1').addEventListener('click', (e) => {
  level = 1;
  console.log(level);
});

document.getElementById('lvl2').addEventListener('click', (e) => {
  level = 2;
  console.log(level);
});

document.getElementById('lvl3').addEventListener('click', (e) => {
  level = 3;
  console.log(level);
});

document.getElementById('lvl4').addEventListener('click', (e) => {
  level = 4;
  console.log(level);
}); */


