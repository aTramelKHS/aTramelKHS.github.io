$(document).ready(() => {
  // fetch weapon data
  fetch("json-files/weapons.json")
    .then(res => res.json())
    .then(data => {
      try {
        const player = new Hero(10, data.pistol);
        startGame(player);
      } catch(error) {
        console.log('Something wrong happened: ' + error);
      }
    });
});

// create polygons
function createPoly(obj) {
  const poly = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(-obj.width/2, -obj.height/2),
    new SAT.Vector(obj.width/2, -obj.height/2),
    new SAT.Vector(obj.width/2, obj.height/2),
    new SAT.Vector(-obj.width/2, obj.height/2)
  ]);
  return poly;
}


// canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height

const FPS = 60;
let debug = false;

function togDebug() {
  debug = !debug;
}

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
    this.isMoving = false;
    this.health = health;
    this.weapon = weapon;
    this.angle = 0;
    this.color = 'red';
    this.maxSpeed = 300; 
    this.friction = 8; 
    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;
    this.canShoot = true;
    this.ammoCount = this.weapon.ammo;
    this.ammoDisplay = this.ammoCount; // to display in UI only
    this.isReload = false;
    this.accel = 1500;
    this.accelX = 0;
    this.accelY = 0;
    this.isInvincible = false;
    this.iFrames = 1500; // 1.5 seconds (in ms) 
    this.primary = null;
    this.secondary = null;

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
  }

  update(dt, weapon) {
    this.posX += this.speedX * dt;
    this.posY += this.speedY * dt;
    this.ovSpeed = Math.hypot(this.speedX, this.speedY);
    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;
    this.isInvincible ? this.color = 'maroon' : this.color = 'red';

    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.angle);
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
    // draw hitbox (debug)
    if (debug) {
      ctx.save();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = this.poly.calcPoints;
      const pos = this.poly.pos;
      ctx.moveTo(points[0].x + pos.x, points[0].y + pos.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x + pos.x, points[i].y + pos.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // handles inputs
  handler(dt) {
    // gets the distance from the mouse to the player's center
    const dx = mouseX - (this.posX + this.width / 2);
    const dy = mouseY - (this.posY + this.height / 2);
    // player looks at mouse
    this.angle = Math.atan2(dy, dx);

    this.accelX = 0;
    this.accelY = 0;
    
    this.isMoving = KEYSTATES.w || KEYSTATES.s || KEYSTATES.d || KEYSTATES.a;
    if (Inp.held('w')) this.accelY = -1;
    if (Inp.held('s')) this.accelY = 1;
    if (Inp.held('d')) this.accelX = 1;
    if (Inp.held('a')) this.accelX = -1;
    if (Inp.pressOnce('r') && !this.isReload) {
      this.isReload = true; 
      this.canShoot = false;
      this.ammoDisplay = "RELOADING";
      setTimeout(() => {
        this.canShoot = true;
        this.ammoCount = this.weapon.ammo;
        this.ammoDisplay = this.ammoCount;
        this.isReload = false;
      }, this.weapon.reloadSpd);
    }

    if (this.accelX !== 0 && this.accelY !== 0) {
      this.accelX /= Math.sqrt(2);
      this.accelY /= Math.sqrt(2);
    }

    this.speedX += this.accelX * this.accel * dt;
    this.speedY += this.accelY * this.accel * dt;

    if (this.ovSpeed > this.maxSpeed) {
      this.speedX = (this.speedX / this.ovSpeed) * this.maxSpeed;
      this.speedY = (this.speedY / this.ovSpeed) * this.maxSpeed;
    }
    if (!this.accelX && !this.accelY) {
      this.speedX -= this.speedX * this.friction * dt;
      this.speedY -= this.speedY * this.friction * dt;
    }
  }

  takeDmg(dmg) {
    if (!this.isInvincible) {
      this.health -= dmg;
      this.isInvincible = true;
      setTimeout(() => {
        this.isInvincible = false;
      }, this.iFrames);
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
    this.width = player.weapon.bullet.width;
    this.height = player.weapon.bullet.height;
    this.centX = muzzleX;
    this.centY = muzzleY;
    this.friction = 8;
    this.color = player.weapon.bullet.color;

    // despawner
    this.dead = false;
    this.airTime = player.weapon.bullet.airTime;
    this.spawnTime = performance.now();

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
  }
  update(dt) {
    // update position
    this.posX += this.speedX * dt;
    this.posY += this.speedY * dt;
    this.centX = this.posX;
    this.centY = this.posY;

    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.direction);

    // kill the bullet if it goes past its air time
    if (performance.now() - this.spawnTime >= this.airTime) {
      this.dead = true;
    }
  }
  draw(ctx) {
    // render bullets
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.posX, this.posY);
    ctx.rotate(this.direction);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    // draw hitbox (debug)
    if (debug) {
      ctx.save();
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = this.poly.calcPoints;
      const pos = this.poly.pos;
      ctx.moveTo(points[0].x + pos.x, points[0].y + pos.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x + pos.x, points[i].y + pos.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }
}


class Zombie {
  constructor(id, player) {
    this.id = id;
    this.width = 40;
    this.height = 40;
    this.posX = Math.random() * CANVAS_WIDTH;
    this.posY = Math.random() * CANVAS_HEIGHT;
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 80;
    this.health = 10;
    this.angle = 0;
    this.damage = 1;
    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;
    this.color = 'green';
    this.diffX = this.trackX - this.posX;
    this.diffY = this.trackY - this.posY;

    // kill
    this.dead = false;
    this.spawnTime = performance.now();

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
  }
  update(dt, player) {
    // kill the zombie if health drops to 0 or below
    if (this.health <= 0) {
      this.dead = true;
    }
    // center difference
    const dx = player.centX - this.centX;
    const dy = player.centY - this.centY;

    // normalize 
    const dist = Math.hypot(dx, dy);
    const directX = dx / dist;
    const directY = dy / dist;

    // follow
    this.posX += directX * this.maxSpeed * dt;
    this.posY += directY * this.maxSpeed * dt;

    this.centX = this.posX + this.width / 2;
    this.centY = this.posY + this.height / 2;

    this.angle = Math.atan2(dy, dx);

    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.angle);
  }
  draw(ctx) {
    // draw zombie
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    // draw health bar
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(this.health.toString(), this.posX, this.posY);
    ctx.restore();
    // draw hitbox (debug)
    if (debug) {
      ctx.save();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = this.poly.calcPoints;
      const pos = this.poly.pos;
      ctx.moveTo(points[0].x + pos.x, points[0].y + pos.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x + pos.x, points[i].y + pos.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }
  takeDmg(dmg, bullet) {
    this.health -= dmg;
    bullet.dead = true;
  }
}

/* dew later
class Pickup {

}
*/

const KEYSTATES = {
  // movement
  w: false,
  a: false,
  s: false,
  d: false,
  // reload
  r: false,
  // inventory 1 = primary, 2 = secondary, 3 = melee, 4 = throwables, q = quick throw
  1: false,
  2: false,
  3: false,
  4: false,
  q: false
};

let mouseX = 0;
let mouseY = 0;

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

// detect mouse movement
$(document).mousemove(function(event) {
  // look in direction of mouse
  const rect = canvas.getBoundingClientRect();
  mouseX = event.pageX - rect.left;
  mouseY = event.pageY - rect.top;
});

// input helper
const Inp = {
  prev: {},
  curr: KEYSTATES,
  update() {
    this.prev = { ...this.curr };
  },
  pressOnce(key) {
    return this.curr[key] && !this.prev[key];
  },
  release(key) {
    return !this.curr[key] && this.prev[key];
  },
  held(key) {
    return this.curr[key];
  }
}


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
    if (!player.canShoot || player.ammoCount <= 0) return; 

    projectiles.push(new Bullet(projectiles.length, player));
    player.ammoCount -= 1;

    player.canShoot = false;
    
    player.ammoDisplay = player.ammoCount;
    setTimeout(() => {
      player.canShoot = true;
    }, player.weapon.rof);
  });
  enemies.push(new Zombie(enemies.length, player));
  // game loop
  function nextFrame(timestamp) {
    if (!gameOver) {
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      const deltaTime = (timestamp - lastTimeStamp) / 1000;
      lastTimeStamp = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player.handler(deltaTime);
      for (let projectile of projectiles) {
        projectile.update(deltaTime);
      }
      projectiles = projectiles.filter(b => !b.dead);
      player.update(deltaTime);
      for (let enemy of enemies) {
        enemy.update(deltaTime, player);
        // if player collides with any enemy
        if (SAT.testPolygonPolygon(player.poly, enemy.poly)) { 
          player.takeDmg(enemy.damage); 
        }
        // if any projectiles collide with any enemy
        for (let projectile of projectiles) {
          if (SAT.testPolygonPolygon(projectile.poly, enemy.poly)) { 
            enemy.takeDmg(enemy.damage, projectile); 
          }
        }
      }
      enemies = enemies.filter(b => !b.dead);
      if (enemies.length === 0) {
        enemies.push(new Zombie(enemies.length, player), new Zombie(enemies.length, player));
      }
      displayUI();
      player.draw(ctx);
      for (let projectile of projectiles) {
        projectile.draw(ctx);
      }
      for (let enemy of enemies) {
        enemy.draw(ctx);
      }
      Inp.update();
      if (player.health <= 0) {
        endGame();
      }
      rafID = requestAnimationFrame(nextFrame);
    }
  }

  requestAnimationFrame(nextFrame);

  function endGame() {
    gameOver = true;
    cancelAnimationFrame(rafID);
  }

  function displayUI() {
    $('#hp').text(player.health);
    $('#ammo').text(player.ammoDisplay + "/" + player.weapon.ammo /* replace with mags when the ammo boxes are implemented */); 
  }
}