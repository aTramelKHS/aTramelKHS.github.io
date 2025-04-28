const start = document.getElementById('startBtn');
const settings = document.getElementById('settings');
const back = document.getElementById('back');


start.addEventListener('click', () => {
  game();
  start.hidden = true;
  settings.hidden = true;
  document.getElementById('game').hidden = false;
  document.getElementById('queue').hidden = false;
  document.getElementById('UI').hidden = false;
  document.getElementById('viewnext').hidden = false;
  document.getElementById('text').hidden = true;
});

settings.addEventListener('click', () => {
  document.getElementById('allsettings').hidden = false;
  start.hidden = true;
  settings.hidden = true;
  back.hidden = false;
})

back.addEventListener('click', () => {
  back.hidden = true;
  settings.hidden = false;
  start.hidden = false;
  document.getElementById('allsettings').hidden = true;
})
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


