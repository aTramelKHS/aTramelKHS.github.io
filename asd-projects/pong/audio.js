// song vars
const menuMusic = new Howl({ 
  src: ["sounds/menu.wav"], 
  html5: false
});
const gameMusic = new Howl({
  src: ["sounds/song1.mp3"],
  html5: false,
  preload: true,
});
const hoverSound = new Howl({ src: ["sounds/hover.mp3"], volume: 0.7 });
const clickSound = new Howl({ src: ["sounds/click.mp3"] });
const backSound = new Howl({ src: ["sounds/back-click.mp3"] });
const heartBeat = new Howl({ src: ["sounds/heartbeat.mp3"], loop: true });
let musicMuted = false;
let muteSfx = false;

let filterNode;
const aCtx = Howler.ctx;

function startMuffleFadeIn(sound, duration) {
  sound.play();

  sound.on("play", () => {
    // duration in seconds
    const durationS = duration / 1000;

    const targetFrequency = 20000;

    filterNode = aCtx.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(400, aCtx.currentTime);

    const soundNode = sound._sounds[0]._node;
    soundNode.disconnect();
    soundNode.connect(filterNode);
    filterNode.connect(Howler.masterGain);

    const now = aCtx.currentTime;
    filterNode.frequency.exponentialRampToValueAtTime(targetFrequency, now + durationS);
    sound.fade(0, 1, duration);
  });
}

$(document).ready(() => {
  $("button:not(.back), input").on("click", () => {
    if (!muteSfx) {
      clickSound.seek(0);
      clickSound.play();
    }
  });
  $("button, input").on("mouseenter", () => {
    if (!muteSfx) {
      hoverSound.seek(0);
      hoverSound.play();
    }
  });
  $(".back").on("click", () => {
    if (!muteSfx) {
      backSound.seek(0);
      backSound.play();
    }
  });
  $("#muteBtn").on("click", () => {
    musicMuted = !musicMuted;
    $("#muteBtn").text(musicMuted ? "UNMUTE MUSIC" : "MUTE MUSIC");
    menuMusic.mute(musicMuted);
    gameMusic.mute(musicMuted);
  });
  $("#otherMuteBtn").on("click", () => {
    muteSfx = !muteSfx;
    $("#otherMuteBtn").text(muteSfx ? "UNMUTE SOUNDS" : "MUTE SOUNDS");
    hoverSound.mute(muteSfx);
    clickSound.mute(muteSfx);
    backSound.mute(muteSfx);
    heartBeat.mute(muteSfx);
  });
});

menuMusic.on("end", () => {
  menuMusic.seek(1.95);
  menuMusic.play();
});

gameMusic.on("end", () => {
  gameMusic.seek(0.26);
  gameMusic.play();
});

function startGameMusic() {
  gameMusic.volume(1);
  startMuffleFadeIn(gameMusic, 5000);
}

function panicMode() {
  $('#red-screen').css('display', 'block');
  gameMusic.fade(gameMusic.volume(), 0.35, 800);
  filterNode.frequency.setTargetAtTime(400, aCtx.currentTime, 0.5);
  if (!heartBeat.playing()) {
    heartBeat.rate(1);
    heartBeat.play();
  }
}

function stopPanic() {
  $('#red-screen').css('display', 'none');
  filterNode.frequency.setTargetAtTime(20000, aCtx.currentTime, 0.5);
  heartBeat.stop();
}
