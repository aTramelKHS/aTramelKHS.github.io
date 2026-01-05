// song vars
const menuMusic = new Audio('sounds/menu.wav');
const gameMusic = new Audio('sounds/song1.mp3');
const hoverSound = new Audio('sounds/hover.mp3');
const clickSound = new Audio('sounds/click.mp3');
const backSound = new Audio('sounds/back-click.mp3');
let musicMuted = false;
let muteSfx = false;
hoverSound.volume = 0.7;

$(document).ready(() => {
  $('button:not(.back), input').on('click', () => {
    if (!muteSfx) {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  });
  $('button, input').on('mouseenter', () => {
    if (!muteSfx) {
      hoverSound.currentTime = 0;
      hoverSound.play();
    }
  });
  $('.back').on('click', () => {
    if (!muteSfx) {
      backSound.currentTime = 0;
      backSound.play();
    }
  });
  $('#muteBtn').on('click', () => {
    musicMuted = !musicMuted;
    $('#muteBtn').text(musicMuted ? 'Unmute Music' : 'Mute Music');
    menuMusic.muted = musicMuted;
    gameMusic.muted = musicMuted
  });
  $('#otherMuteBtn').on('click', () => {
    muteSfx = !muteSfx;
    $('#otherMuteBtn').text(musicMuted ? 'Unmute Sounds' : 'Mute Sounds');
    hoverSound.muted = muteSfx;
    clickSound.muted = muteSfx;
    backSound.muted = muteSfx;
  });
});

menuMusic.addEventListener('ended', () => {
  menuMusic.currentTime = 1.95;
  menuMusic.play();
});

gameMusic.addEventListener('ended', () => {
  gameMusic.currentTime = 0.26;
  gameMusic.play();
});

function fadeIn(song, target, step, interval) {
  song.volume = 0;
  song.play();
  const fade = setInterval(() => {
    if (song.volume < target) {
      song.volume = Math.min(song.volume + step, target);
    } else {
      clearInterval(fade);
    }
  }, interval);
}