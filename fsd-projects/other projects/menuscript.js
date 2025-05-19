const start = document.getElementById('startBtn');
const settings = document.getElementById('settings');
const back = document.getElementById('back');
const skinsBtn = document.getElementById('skins');
const keyBinds = document.getElementById('keybind');
const correctBinds = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
let rotateKey = "ArrowUp";
let fallKey = "ArrowDown";
let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let hardDropKey = " ";

// dont look at my spaghetti code!


start.addEventListener('click', () => {
  game();
  start.hidden = true;
  settings.hidden = true;
  document.getElementById('game').hidden = false;
  document.getElementById('queue').hidden = false;
  document.getElementById('UI').hidden = false;
  document.getElementById('viewnext').hidden = false;
  document.getElementById('title').hidden = true;
  skinsBtn.hidden = true;
});

settings.addEventListener('click', () => {
  document.getElementById('allsettings').hidden = false;
  start.hidden = true;
  settings.hidden = true;
  back.hidden = false;
  skinsBtn.hidden = true;
})

back.addEventListener('click', () => {
  back.hidden = true;
  settings.hidden = false;
  start.hidden = false;
  skinsBtn.hidden = false;
  document.getElementById('allsettings').hidden = true;
})


function changeRotate() {
  let something = prompt("Change the Rotate Key (base key is ArrowUp)");
  if (correctBinds.includes(something)) {
    rotateKey = something;
  } else {
    alert('this key is unacceptable!');
  }
}

function changeFall() {
  let something = prompt("Change the Drop Key (base key is ArrowDown)");
  if (correctBinds.includes(something)) {
    fallKey = something;
  } else {
    alert('this key is unacceptable!');
  }
}

function changeLeft() {
  let something = prompt("Change the Left Key (base key is ArrowLeft)");
  if (correctBinds.includes(something)) {
    leftKey = something;
  } else {
    alert('this key is unacceptable!');
  }
}

function changeRight() {
  let something = prompt("Change the Right Key (base key is ArrowRight)");
  if (correctBinds.includes(something)) {
    rightKey = something;
  } else {
    alert('stop');
  }
}
function changeHD() {
  let something = prompt("Change the Hard Drop Key (base key is Spacebar)");
  if (correctBinds.includes(something)) {
    hardDropKey = something;
  } else {
    alert('this key is unacceptable!');
  }
}



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


