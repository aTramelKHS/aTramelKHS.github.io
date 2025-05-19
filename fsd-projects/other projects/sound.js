//background music and other sounds
let clearSound = new Audio("source/sounds/line-clear.mp3");
let moveSound = new Audio("source/sounds/move.mp3")
let bgm = new Audio("source/sounds/typeb.mp3");
let dropSound = new Audio("source/sounds/drop.mp3");
var soundVolume = 0.5

clearSound.volume = soundVolume;
bgm.volume = 0.3;
bgm.loop = true;

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
function playSong1(){
  bgm.src = "source/sounds/typeb.mp3"
}