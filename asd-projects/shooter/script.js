$(document).ready(() => {
  // fetch weapon data
  fetch("weapons.json")
    .then(res => res.json())
    .then(data => {
      const player = new Hero(10, data.pistol);
      if (player) {
        startGame(player);
      }
    });
});

// canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height

const FPS = 60;

// game objects 

// hero
class Hero {
  constructor(health, weapon) {
    this.width = 40;
    this.height = 40;
    this.posX = CANVAS_WIDTH / 2;
    this.posY = CANVAS_HEIGHT / 2;
    this.speedX = 0;
    this.speedY = 0;
    this.ovSpeed = Math.hypot(this.speedX, this.speedY);
    this.health = health;
    this.weapon = weapon;
    this.angle = 0;
    this.color = 'red';
    this.maxSpeed = 5; // 5 pixels per 60 frames
    this.friction = 8; // per second
    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;
    this.canShoot = true;
    this.accel = 1500;
    this.accelX = 0;
    this.accelY = 0;
    this.isInvincible = false;
    this.iFrames = 2500; // 2.5 seconds (in ms) 
    this.primary = null;
    this.secondary = null;
  }

  update(dt) {
    this.posX += this.speedX * dt;
    this.posY += this.speedY * dt;
    this.ovSpeed = Math.hypot(this.speedX, this.speedY);
    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;
  }

  draw(ctx) {
    // render player
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    // render weapon
    ctx.save();
    ctx.fillStyle = this.weapon.color;
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.fillRect((-this.width / 2) + this.weapon.offX, (-this.height / 2) + this.weapon.offY, this.weapon.width, this.weapon.height);
    ctx.restore();
  }

  handler(dt) {
    // gets the distance from the mouse to the player's center
    const dx = mouseX - (this.posX + this.width / 2);
    const dy = mouseY - (this.posY + this.height / 2);
    // player looks at mouse
    this.angle = Math.atan2(dy, dx);

    this.accelX = 0;
    this.accelY = 0;
    
    if (KEYSTATES.w) this.accelY = -1;
    if (KEYSTATES.s) this.accelY = 1;
    if (KEYSTATES.d) this.accelX = 1;
    if (KEYSTATES.a) this.accelX = -1;

    if (this.accelX !== 0 && this.accelY !== 0) {
      this.accelX /= Math.sqrt(2);
      this.accelY /= Math.sqrt(2);
    }

    this.speedX += this.accelX * this.accel * dt;
    this.speedY += this.accelY * this.accel * dt;

    if (this.ovSpeed > (this.maxSpeed * FPS)) {
      this.speedX = (this.speedX / this.ovSpeed) * (this.maxSpeed * FPS);
      this.speedY = (this.speedY / this.ovSpeed) * (this.maxSpeed * FPS);
    }
    if (!this.accelX && !this.accelY) {
      this.speedX -= this.speedX * this.friction * dt;
      this.speedY -= this.speedY * this.friction * dt;
    }
  }
}

// spawns bullets
class Bullet {
  constructor(id, player) {
    this.id = id;
    const cos = Math.cos(player.angle);
    const sin = Math.sin(player.angle);
    const muzzleX = player.centX + (player.weapon.offX * cos / 2);
    const muzzleY = player.centY + (player.weapon.offX * sin / 2);
    this.posX = muzzleX;
    this.posY = muzzleY;
    this.direction = player.angle;
    this.speedX = Math.cos(this.direction) * player.weapon.speed;
    this.speedY = Math.sin(this.direction) * player.weapon.speed;
    this.width = 10;
    this.height = 5;
    this.centX = muzzleX;
    this.centY = muzzleY;
    this.friction = 8;
  }
  update(dt) {
    this.posX += this.speedX * dt;
    this.posY += this.speedY * dt;
  }
  draw(ctx) {
    // render bullets
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.translate(this.posX, this.posY);
    ctx.rotate(this.direction);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}


// dont worry ill finish later 
class Zombie {
  constructor() {

  }
  update() {

  }
  draw(ctx) {

  }
}

const KEYSTATES = {
  w: false,
  a: false,
  s: false,
  d: false
};

// event handlers
// change the keystate to true when a specified key is pressed
$(document).on("keydown", (e) => {
  if (KEYSTATES.hasOwnProperty(e.key)) {
    KEYSTATES[e.key] = true;
  }
});

// change the keystate to false when its released
$(document).on("keyup", (e) => {
  if (KEYSTATES.hasOwnProperty(e.key)) {
    KEYSTATES[e.key] = false;
  }
});


let mouseX = 0;
let mouseY = 0;

// detect mouse movement
$(document).mousemove(function(event) {
  // look in direction of mouse
  const rect = canvas.getBoundingClientRect();
  mouseX = event.pageX - rect.left;
  mouseY = event.pageY - rect.top;
});

function startGame(player) {
  // initialization
  let gameOver = false;

  // rAF
  let lastTimeStamp = 0;
  let rafID;

  // store projectiles
  let projectiles = [];

  // store enemies
  let enemies = [];

  // detect clicks
  $(document).on('mousedown', function() {
    if (!player.canShoot) return; 
    projectiles.push(new Bullet(projectiles.length, player));

    player.canShoot = false;
    setTimeout(() => {
      player.canShoot = true;
    }, player.weapon.rof);
  });

  // game loop
  function nextFrame(timestamp) {
    if (!gameOver) {
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      const deltaTime = (timestamp - lastTimeStamp) / 1000;
      lastTimeStamp = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let projectile of projectiles) {
        projectile.update(deltaTime);
      }
      player.handler(deltaTime);
      player.update(deltaTime);
      player.draw(ctx);
      for (let projectile of projectiles) {
        projectile.draw(ctx);
      }
      displayHealth();

      rafID = requestAnimationFrame(nextFrame);
    }
  }

  requestAnimationFrame(nextFrame);
  
  // helper functions

  function endGame() {
    gameOver = true;
    cancelAnimationFrame(rafID);
  }

  function displayHealth() {
    $('#hp').text(player.health);
  }
}