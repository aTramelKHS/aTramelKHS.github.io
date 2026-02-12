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
const sfx = {
  hover: new Howl({ src: ["sounds/hover.mp3"], volume: 0.7 }),
  click: new Howl({ src: ["sounds/click.mp3"] }),
  back: new Howl({ src: ["sounds/back-click.mp3"] }),
  heartbeat: new Howl({ src: ["sounds/heartbeat.mp3"], loop: true }),
  ballhit: new Howl({ src: ['sounds/ping.mp3'] })
}
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
    sfx.click.seek(0);
    sfx.click.play();
  });
  $("button, input").on("mouseenter", () => {
    sfx.hover.seek(0);
    sfx.hover.play();
  });
  $(".back").on("click", () => {
    sfx.back.seek(0);
    sfx.back.play();
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
    for (const key in sfx) {
      sfx[key].mute(muteSfx);
    }
  });
});
// save mute settings later


menuMusic.on("end", () => {
  menuMusic.seek(1.95);
  menuMusic.play();
});

gameMusic.on("end", () => {
  gameMusic.seek(0.26);
  gameMusic.play();
})

function playPaddleHit(num) {
  // randomize later
  const pitch = 0.8 + Math.random() * 0.3;
  (Math.random() < 0.5) ? sfx.ballhit.src = 'sounds/ping.mp3' : sfx.ballhit.src = 'sounds/pong.mp3';
  sfx.ballhit.rate(pitch);
  sfx.ballhit.play();
}

function startGameMusic() {
  gameMusic.volume(1);
  startMuffleFadeIn(gameMusic, 5000);
}

function panicMode() {
  $('#red-screen').css('display', 'block');
  gameMusic.fade(gameMusic.volume(), 0.35, 800);
  filterNode.frequency.setTargetAtTime(400, aCtx.currentTime, 0.5);
  if (!sfx.heartbeat.playing()) {
    sfx.heartbeat.rate(1);
    sfx.heartbeat.play();
  }
}

function stopPanic() {
  $('#red-screen').css('display', 'none');
  filterNode.frequency.setTargetAtTime(20000, aCtx.currentTime, 0.5);
  sfx.heartbeat.stop();
}
