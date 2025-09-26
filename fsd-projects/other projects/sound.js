//background music and other sounds
let clearSound = new Audio("source/sounds/line-clear.mp3");
let moveSound = new Audio("source/sounds/move.mp3")
let bgm = new Audio("source/sounds/typeb.mp3");
let dropSound = new Audio("source/sounds/drop.mp3");
var soundVolume = 0.5

bgm.volume = 0.3;
bgm.loop = true;

function playClear() {
  const clearClone = clearSound.cloneNode();
  clearClone.volume = soundVolume;
  clearClone.play;
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