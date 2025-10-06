//background music and other sounds
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
var soundVolume = 0.5


bgm.volume = 0.3;
toastySound.volume = soundVolume;
bgm.loop = true;


function playClear() {
  clearSound.volume = soundVolume;
  clearSound.play();
  setTimeout(function() {}, 1000);
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
function playSong(songId){
  if (songId === 1) {
    bgm.src = "source/sounds/typeb.mp3";
  } else if (songId === 2) {
    bgm.src = "source/sounds/testsong.wav";
  }
}
let daSong = false;
function songListen() {
  daSong = !daSong;
  listen.textContent = daSong ? "Mute" : "Listen";
  daSong ? bgm.play() : bgm.pause();
}