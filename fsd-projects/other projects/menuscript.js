const start = document.getElementById('startBtn');

start.addEventListener('click', () => {
  game();
  start.hidden = true;
  document.getElementById('game').hidden = false;
  document.getElementById('queue').hidden = false;
  document.getElementById('UI').hidden = false;
  document.getElementById('mute').hidden = false;
});


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


