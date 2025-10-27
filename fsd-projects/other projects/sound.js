// set and preload background music and other sounds
let clearSound = new Audio("source/sounds/line-clear.mp3");
clearSound.preload = 'auto';
let moveSound = new Audio("source/sounds/move.mp3");
moveSound.preload = 'auto';
let bgm = new Audio("source/sounds/typeb.mp3");
bgm.preload = 'auto';
let dropSound = new Audio("source/sounds/drop.mp3");
dropSound.preload = 'auto';
let toastySound = new Audio('source/sounds/toasty.mp3');
toastySound.preload = 'auto';
let vatsCritical = new Audio('source/sounds/vatscritical.mp3');
vatsCritical.preload = 'auto';
var soundVolume = 0.5


bgm.volume = 0.3;
toastySound.volume = soundVolume;
vatsCritical.volume = soundVolume;
bgm.loop = true;

// play clones of sounds
function playClear() {
  clearSound.volume = soundVolume;
  clearSound.play();
}

function playMove() {
  const moveClone = moveSound.cloneNode();
  moveClone.volume = soundVolume;
  moveClone.play();
}
function playDrop() {
  const dropClone = dropSound.cloneNode();
  dropClone.volume = soundVolume;
  dropClone.play();
}
// choose song based on id
function playSong(songId){
  if (songId === 1) {
    bgm.src = "source/sounds/typeb.mp3";
  } else if (songId === 2) {
    bgm.src = "source/sounds/testsong.wav";
  }
}
// listen button
let daSong = false;
function songListen() {
  daSong = !daSong;
  listen.textContent = daSong ? "Mute" : "Listen";
  daSong ? bgm.play() : bgm.pause();
}

