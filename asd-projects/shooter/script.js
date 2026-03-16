$(document).ready(() => {
  $('.MAIN-MENU').show();
});
let spawnWeapon = 'pistol';
function changeWeapon(weapon) {
  spawnWeapon = weapon;
}
function runProgram() {
  // fetch json data
  $('.MAIN-MENU').hide();
  $('.GAME').show();
  Promise.all ([
    fetch("json-files/weapons.json").then(r => r.json()),
    fetch("json-files/zombies.json").then(r => r.json()),
    fetch("json-files/characters.json").then(r => r.json()),
    fetch("json-files/status.json").then(r => r.json())
  ]) .then(([weaponData, zombieData, charData, statData]) => {
    // player setup
    const player = new Hero(weaponData[spawnWeapon], charData.Garry); 
    startGame(player, zombieData);
  });
}

// create squares
function createPoly(obj, wOffset, hOffset) {
  const poly = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(-obj.width * scale /2 - wOffset, -obj.height * scale/2  - hOffset),
    new SAT.Vector(obj.width * scale /2 + wOffset, -obj.height * scale /2  - hOffset),
    new SAT.Vector(obj.width * scale /2 + wOffset, obj.height * scale /2 + hOffset),
    new SAT.Vector(-obj.width * scale /2 - wOffset, obj.height * scale /2 + hOffset)
  ]);
  return poly;
}

// game initialization
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
let stopMoving = false;
function stopZombies() {
  stopMoving = !stopMoving;
}
const scale = 1.5;

// game objects 

// hero
class Hero {
  constructor(weapon, character) {
    // hero constructor
    this.char = character
    this.width = this.char.width;
    this.height = this.char.height;
    this.pos = {
      x : CANVAS_WIDTH / 2,
      y : CANVAS_HEIGHT / 2
    }
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;
    this.health = this.char.health;
    this.angle = 0;

    // invincibility
    this.isInvincible = false;
    this.iFrames = this.char.iFrames; // 1.5 seconds (in ms) 

    // movement
    this.isMoving = false;
    this.speedX = 0;
    this.speedY = 0;
    this.ovSpeed = Math.hypot(this.speedX, this.speedY); // overall combined speed
    this.maxSpeed = this.char.maxSpeed; 
    this.friction = 8; 
    this.accel = 1500;
    this.directionX = 0; // -1 for left, 1 for right
    this.directionY = 0; // -1 for up, 1 for down
    // movement class
    this.move = new MovementSyst();

    // stamina
    this.stamina = 10;
    this.maxStamina = this.char.stamina;
    this.regenStamina = true;
    this.staminaInterval = 600; // ms
    this.staminaTimer = 0;
    this.decreaseStamina = 4;

    // dodge
    this.dodgeTimer = 0;
    this.canDodge = true;
    this.isDodging = false;
    this.dodgeDuration = 0.25 // in seconds
    this.dodgeDirection = 0;
    this.dodgeStartSpd = 800;
    this.dodgeEndSpd = 200;

    // weapon equiped
    this.weapon = weapon;
    this.wName = this.weapon.name;
    this.usingGun = this.weapon.type === "gun";
    this.usingMelee = this.weapon.type === "melee";
    if (this.usingGun) {
      this.canShoot = true;
      this.ammoCount = this.weapon.ammo;
      this.ammoDisplay = this.ammoCount; // to display in UI only
      this.isReload = false;
      this.cdTimerG = 0; // cooldown timer (gun)
    } else if (this.usingMelee) {
      this.canSwing = true;
      this.cdTimerM = 0; // cooldown timer (melee)
    }


    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, -9, 0);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;

    // status effects
    this.status = new Set();

    // inventory
    this.inventory = {
      primary: null,
      secondary: null,
      melee: null
    }
    if (this.weapon.slot === "primary") this.inventory.primary = this.weapon;
    else if (this.weapon.slot === "secondary") this.inventory.secondary = this.weapon;
    else if (this.weapon.slot === "melee") this.inventory.melee = this.weapon;

    this.currentSlot = this.weapon.slot; // either primary (1) secondary (2) or melee (3)
    
    // sprites
    // body
    this.playerSprite = new Image();
    this.playerSprite.src = this.char.sprites.body.sprite;

    // gun
    this.hands = {}
    for (const [key, path] of Object.entries(this.char.sprites.hands)) {
      const img = new Image();
      img.src = path;
      this.hands[key] = img;
    }
    this.weaponSprite = this.hands[this.weapon.name.toLowerCase()];

    // indices
    this.bodyFrame = this.char.sprites.body.frame.normal;

    // circular ranges
    this.noSpawnRadius = 80; 
  }

  update(dt) {
    // update player position
    this.pos.x += this.speedX * dt;
    this.pos.y += this.speedY * dt;
    
    this.ovSpeed = Math.hypot(this.speedX, this.speedY);
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;

    // update sprite index
    this.bodyFrame = this.isInvincible 
      ? this.char.sprites.body.frame.hurt
      : this.char.sprites.body.frame.normal;

    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.angle);

    // timed events
    // update stamina
    if (this.regenStamina && this.stamina < this.maxStamina) {
      this.staminaTimer -= dt * 1000; // converts deltatime to miliseconds
      if (this.staminaTimer <= 0) {
        this.stamina++;
        this.staminaTimer = this.staminaInterval
      }
    }

    // gun cooldown
    if (!this.canShoot) {
      this.cdTimerG -= dt * 1000; // convert dt to ms
      if (this.cdTimerG <= 0) {
        this.canShoot = true;
        this.cdTimerG = 0;
      }
    }

    // melee cooldown
    if (!this.canSwing) {
      this.cdTimerM -= dt * 1000; // convert dt to ms
      if (this.cdTimerM <= 0) {
        this.canSwing = true;
        this.cdTimerM = 0;
      }
    }

    if (this.isDodging) this.dodge(dt);

    this.move.update(this, dt);
  }

  draw(ctx) {
    // render weapon
    ctx.save();
    ctx.fillStyle = this.weapon.color;
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.weaponSprite, // sprite
      (-this.weapon.width * scale / 2) + (this.weapon.offX * scale), 
      (-this.weapon.height * scale / 2) + (this.weapon.offY * scale), 
      this.weapon.width * scale, 
      this.weapon.height * scale
    );
    ctx.restore();
    // render player
    ctx.save();
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.playerSprite, // sprite
      1 + this.bodyFrame * this.width, // sprite index
      1, 
      this.width, 
      this.height, 
      -this.width * scale / 2, // sprite size
      -this.height * scale / 2, 
      this.width * scale, 
      this.height * scale
    );
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

  attack(projectiles, particles) {
    // GUNS
    if (this.weapon.type === 'gun') {
      if (!this.canShoot || this.ammoCount <= 0) return; 
      // MUZZLE FLASH
      particles.push(new Particle(this, "muzzle-flash"));
      const {muzzleX, muzzleY} = this.getMuzzlePos();

      if (this.weapon.fireMode === 'single' || this.weapon.fireMode === 'auto') {
        const inaccuracy = (Math.random() - 0.5) * this.weapon.inaccuracy;
        projectiles.push(new Projectile(projectiles.length, this, inaccuracy, muzzleX, muzzleY));
      }
      if (this.weapon.fireMode === 'scatter') {
        for (let i = 0; i < this.weapon.bullet.count; i++) { 
          const spread = (Math.random() - 0.5) * this.weapon.inaccuracy;
          projectiles.push(new Projectile(projectiles.length, this, spread, muzzleX, muzzleY));
        }
      }

      this.ammoCount--;
      this.canShoot = false;
      this.ammoDisplay = this.ammoCount;

      this.canShoot = false;
      this.cdTimer = this.weapon.rof;
    }
    // MELEE
    if (this.weapon.type === 'melee') {
      if (!this.canSwing) return;
      projectiles.push(new MeleeHitbox(this));

      this.canSwing = false;
    }
  }

  getMuzzlePos() {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);

    // weapon origin
    const weaponX = this.centX 
      + (this.weapon.offX * scale) * cos
      - (this.weapon.offY * scale) * sin;

    const weaponY = this.centY
      + (this.weapon.offX * scale) * sin
      + (this.weapon.offY * scale) * cos;

    // muzzle world position
    const muzzleX = weaponX
      + (this.weapon.muzzle.x * scale) * cos 
      - (this.weapon.muzzle.y * scale) * sin;

    const muzzleY = weaponY
      + (this.weapon.muzzle.x * scale) * sin
      + (this.weapon.muzzle.y * scale) * cos;
    return {muzzleX, muzzleY}
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

  reload() {
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

  beginDodge() {
    if (!this.isDodging) {
      if (this.stamina < this.decreaseStamina) return;
      this.isDodging = true;
      this.dodgeTimer = 0;
      this.dodgeDirection = this.angle;

      // stamina
      this.stamina -= this.decreaseStamina;
      this.stamina = Math.max(this.stamina, 0);
      this.regenStamina = false;
      this.staminaTimer = this.staminaInterval;
    }
  }

  dodge(dt) {
    this.dodgeTimer += dt;

    // get time
    const t = Math.min(this.dodgeTimer / this.dodgeDuration, 1);

    // lerping vars
    const ease = 1 - Math.pow(1 - t, 3);
    const speed =  this.dodgeStartSpd * (1 - ease) + this.dodgeEndSpd * ease;

    // normalize the direction
    let dx = this.directionX;
    let dy = this.directionY;

    if (dx === 0 && dy === 0) {
      dx = Math.cos(this.angle);
      dy = Math.sin(this.angle);
    }

    let length = Math.hypot(dx, dy) || 1;

    dx /= length;
    dy /= length;

    this.dodgeDirection = Math.atan2(dy, dx);

    // reposition
    this.pos.x += dx * speed * dt; 
    this.pos.y += dy * speed * dt;
    
    // dodge ends
    if (t >= 1) {
      this.isDodging = false;
      this.regenStamina = true;
    }
    return;
  }
}

// helpers
class HandleInputs {
  update(player, projectiles, particles, dt) {
    if (this.isDodging) return;
    // gets the distance from the mouse to the player's center
    const dx = mouseX - (player.pos.x + player.width / 2);
    const dy = mouseY - (player.pos.y + player.height / 2);
    // player looks at mouse
    player.angle = Math.atan2(dy, dx);

    player.directionX = 0;
    player.directionY = 0;
    
    player.isMoving = KEYSTATES.w || KEYSTATES.s || KEYSTATES.d || KEYSTATES.a;
    // movement
    if (Inp.held('w') || Inp.held('W')) player.directionY = -1;
    if (Inp.held('s') || Inp.held('S')) player.directionY = 1;
    if (Inp.held('d') || Inp.held('D')) player.directionX = 1;
    if (Inp.held('a') || Inp.held('A')) player.directionX = -1;

    // dodge roll
    if (Inp.pressOnce(' ') && (player.stamina > 0) && !player.isDodging) player.beginDodge();

    // reload
    if (Inp.pressOnce('r') && !player.isReload) player.reload();
    
    // inventory
    if (Inp.pressOnce('1') && player.primary) {
      // swap to primary
    }
    if (Inp.pressOnce('2') && player.secondary) {
      // swap to secondary
    }
    if (Inp.pressOnce('3') && player.melee) {
      // swap to melee
    }

    // detect clicks
    if (player.weapon.fireMode !== "auto" && Mouse.pressOnce()) player.attack(projectiles, particles);
     // detect autofire
    if (player.weapon.fireMode === "auto" && Mouse.held()) player.attack(projectiles, particles);
  }
}

class MovementSyst {
  update(player, dt) {
    if (player.isDodging) return;
    // divide directional movement with square root of 2
    if (player.directionX !== 0 && player.directionY !== 0) {
      player.directionX /= Math.sqrt(2);
      player.directionY /= Math.sqrt(2);
    }

    // add speed
    player.speedX += player.directionX * player.accel * dt;
    player.speedY += player.directionY * player.accel * dt;

    // speed clamp
    if (player.ovSpeed > player.maxSpeed) {
      player.speedX = (player.speedX / player.ovSpeed) * player.maxSpeed;
      player.speedY = (player.speedY / player.ovSpeed) * player.maxSpeed;
    }
    // stop moving if not moving
    if (!player.directionX && !player.directionY) {
      player.speedX -= player.speedX * player.friction * dt;
      player.speedY -= player.speedY * player.friction * dt;
    }
  }
}

class Inventory {
  switch() {
    // swaps the current weapon you are holding with another weapon in your inventory
  }
  pickup(slot) {
    // put the weapon you pick up off the floor into its corresponding slot and drops any weapons and their data on the floor if it already exists on that slot
    // swaps and stores the ammount of ammunition it last had to avoid the reload mechanic from becoming redundant
    const newWeapon = this.slots[slot];
  }
  drop() {
    // drops a weapon pickup entity (using the z key) with the stored ammunition so no ammo duplication
  }
}

class Draw {
  update(objects) {
    for (let obj of objects) {
      obj.draw(ctx);
    }
  }
}

// contains every entity besides player
// todo: make entity class and make every moving object (except particles and player) and extent of entity
class Entity {
  constructor(x, y, width, height) {
    this.pos = {
      x: x,
      y: y
    }
    this.dead = false;
  }

  update(dt) {};
  draw(ctx){};
}

// extents of the Entity class
class Projectile {
  constructor(id, player, angleOffset, muzzleX, muzzleY) {
    this.id = id;
    this.width = player.weapon.bullet.width;
    this.height = player.weapon.bullet.height;
    
    this.pos = {
      x : muzzleX,
      y : muzzleY
    }
    this.centX = muzzleX;
    this.centY = muzzleY;
    this.angle = player.angle + angleOffset * (Math.PI / 180);
    this.type = player.weapon.type;
    this.speedX = Math.cos(this.angle) * player.weapon.speed;
    this.speedY = Math.sin(this.angle) * player.weapon.speed;
    this.color = player.weapon.bullet.color;
    
    // damager
    this.dmg = player.weapon.dmg;
    this.health = player.weapon.bullet.health;
    this.hitSet = new Set();
    this.force = player.weapon.knockback;

    // despawner
    this.dead = false;
    this.airTime = player.weapon.bullet.airTime;
    this.spawnTime = performance.now();

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, 0, 0);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
  }
  update(dt) {
    // update position
    this.pos.x += this.speedX * dt;
    this.pos.y += this.speedY * dt;

    this.centX = this.pos.x;
    this.centY = this.pos.y;
    
    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.angle);

    // kill the bullet if it goes past its air time
    if (performance.now() - this.spawnTime >= this.airTime) {
      this.dead = true;
    }
  }
  draw(ctx) {
    // render bullets
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);
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

class MeleeHitbox {
  constructor(player) {
    // position
    this.player = player;
    this.weapon = player.weapon;
    this.width = this.weapon.hitbox.width; // placeholders
    this.height = this.weapon.hitbox.height;
    this.reach = this.weapon.reach;
    this.mode = this.weapon.mode;
    this.dmg = this.weapon.dmg;
    this.force = this.weapon.knockback;
    this.vel = {
      x: 0,
      y: 0
    }
    // damager
    this.canDamage = false;
    this.hitSet = new Set();

    // despawn
    this.dead = false;
    this.timer = 0;
    this.duration = this.weapon.duration;

    // attack direction
    if (this.mode === "swing") {
      this.arc = this.weapon.arc * (Math.PI / 180);
      this.startingAngle = player.angle - this.arc / 2;
      this.endingAngle = player.angle + this.arc / 2;
      this.angle = this.startingAngle;
    } 
    if (this.mode === "stab") {
      this.angle = player.angle;
    }
    
    // hitbox
    this.poly = createPoly(this, 0, 0);
    this.poly.pos.x = player.centX;
    this.poly.pos.y = player.centY;
  }
  update(dt) {
    this.timer += dt;
  
    const t = Math.min(this.timer / this.duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    let x;
    let y;
    if (this.mode === "swing") {
      // Always match player angle
      this.angle = this.startingAngle + (this.endingAngle - this.startingAngle) * t;
      // Always stay in front of the player
      x = this.player.centX + Math.cos(this.angle) * this.reach;
      y = this.player.centY + Math.sin(this.angle) * this.reach;
    }
    if (this.mode === "stab") {
      x = this.player.centX + Math.cos(this.angle) * (this.reach * t);
      y = this.player.centY + Math.sin(this.angle) * (this.reach * t);
    }

    // velocity 
    const angleVel = (this.endingAngle - this.startingAngle) / this.duration;
    this.vel.x = Math.cos(this.angle) * this.reach * angleVel;
    this.vel.y = Math.sin(this.angle) * this.reach * angleVel;

    // Update polygon position
    if (this.mode !== "stab") {
      this.poly.setAngle(this.angle);
      this.poly.pos.x = x;
      this.poly.pos.y = y;
    }

    // despawner
    if (t >= 1) this.dead = true;
  }
  draw(ctx) {
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

class Particle {
  constructor(player, type) {
    this.parent = player;
    this.x = this.parent.x;
    this.y = this.parent.y;
    this.angle;
    this.life = 80; // ms
    this.start = performance.now();
    this.dead = false;
    this.type = type;
  }
  update() {
    if (performance.now() - this.start > this.life) {
      this.dead = true;
    }
    if (this.type === "muzzle-flash") {
      const {muzzleX, muzzleY} = this.parent.getMuzzlePos();
      this.x = muzzleX;
      this.y = muzzleY;
      this.angle = this.parent.angle;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Zombie {
  constructor(id, type, player) {
    // spawn area
    // choose a random spawn position if that spawn position is over the players radius^2 choose a new spawn
    let spawnX = Math.random() * CANVAS_WIDTH;
    let spawnY = Math.random() * CANVAS_HEIGHT;
    let dx = spawnX - player.pos.x;
    let dy = spawnY - player.pos.y;
    let distFromPlayer = dx * dx + dy * dy;
    while (distFromPlayer < player.noSpawnRadius**2) {
      console.log('you cant spawn there!')
      spawnX = Math.random() * CANVAS_WIDTH;
      spawnY = Math.random() * CANVAS_HEIGHT;
      dx = spawnX - player.pos.x;
      dy = spawnY - player.pos.y;
      distFromPlayer = dx * dx + dy * dy
    }

    // define
    this.id = id;
    this.type = type;
    this.width = this.type.width;
    this.height = this.type.height;
    this.pos = {
      x: spawnX,
      y: spawnY
    }
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = this.type.spd;
    this.health = this.type.hp;
    this.angle = 0;
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;
    this.color = this.type.color;

    // knockback
    this.knockX = 0;
    this.knockY = 0;
    this.knockTimer = 0;

    // attack
    this.damage = this.type.dmg;

    // distance
    this.diffX = this.trackX - this.pos.x;
    this.diffY = this.trackY - this.pos.y;

    // kill
    this.dead = false;
    this.spawnTime = performance.now();

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, 0, 0);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
  }
  update(dt, player) {
    // kill the zombie if health drops to 0 or below
    if (this.health <= 0) {
      this.dead = true;
    }
    // start knockback
    if (this.knockTimer > 0) {
      this.pos.x += this.knockX * dt;
      this.pos.y += this.knockY * dt;

      // force decay
      this.knockX *= 0.85;
      this.knockY *= 0.85;

      // decrease the timer
      this.knockTimer -= dt;

      // update
      this.centX = this.pos.x + this.width / 2;
      this.centY = this.pos.y + this.height / 2;

      this.poly.pos.x = this.centX; 
      this.poly.pos.y = this.centY;
      this.poly.setAngle(this.angle);

      return; // dont calculate normal movement
    }
    // center difference
    const dx = player.centX - this.centX;
    const dy = player.centY - this.centY;

    // normalize 
    const dist = Math.hypot(dx, dy);
    const directX = dx / dist;
    const directY = dy / dist;
    if (!stopMoving) {
      // follow
      this.pos.x += directX * this.maxSpeed * dt;
      this.pos.y += directY * this.maxSpeed * dt;

      this.centX = this.pos.x + this.width / 2;
      this.centY = this.pos.y + this.height / 2;

      this.angle = Math.atan2(dy, dx);

      // update hitbox
      this.poly.pos.x = this.centX; 
      this.poly.pos.y = this.centY;
      this.poly.setAngle(this.angle);
    }
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
    ctx.fillText(this.health.toString(), this.pos.x, this.pos.y);
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
  takeDmg(projectile) {
    this.health -= projectile.dmg;
  }
  knockback(source) {
    if (source.force <= 0) return;
    if (this.knockbackForce === 0) return;
    let dx = Math.cos(source.angle);
    let dy = Math.sin(source.angle);

    this.knockX = dx * source.force;
    this.knockY = dy * source.force;
    this.knockTimer = 0.12;
  }
  // loot table 
  dropLoot(type) {
    if (this.type === 'reg') {
      // item drop logic
    }
  }
}

// status effects
class Effect {
  constructor(status) {
    this.effect = status;
    this.width = status.width;
    this.height = status.height;
    this.timer = status.duration;

    this.sprite = new Image();
    this.sprite.src = status.sprite.sheet;
  }
  update(obj) {
    if (obj.status.has('dazed')) {
      // timer
    }
  }
  draw(ctx) {

  }
}

/* dew later
class Pickup {

}
*/


// INPUT HANDLERS

const KEYSTATES = {};

// key helper
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

// click helper
const Mouse = {
  prev: { down: false },
  curr: { down: false },
  update() {
    this.prev = { ...this.curr };
  },
  pressOnce() {
    return this.curr.down && !this.prev.down;
  },
  release() {
    return !this.curr.down && this.prev.down;
  },
  held() {
    return this.curr.down;
  }
}

// detect clicks and mouse movements
$(document).on('mousedown', () => Mouse.curr.down = true);
$(document).on('mouseup', () => Mouse.curr.down = false);

// get mouse X and Y
let mouseX = 0;
let mouseY = 0;

$(document).mousemove(function(event) {
  // look in direction of mouse
  const rect = canvas.getBoundingClientRect();
  mouseX = event.pageX - rect.left;
  mouseY = event.pageY - rect.top;
});

// change the keystate to true when a specified key is pressed
$(document).on("keydown", (e) => KEYSTATES[e.key] = true);

// change the keystate to false when its released
$(document).on("keyup", (e) => KEYSTATES[e.key] = false );

// play game with player and zombie data
function startGame(player, zombie) {
  // initialization

  // class setup
  const inputSystem = new HandleInputs();
  const draw = new Draw();

  // store projectiles
  let projectiles = [];

  // store enemies
  let enemies = [];
  const maxEnemies = 15;

  // store particles
  let particles = [];
  

  // wave number 
  let waveNum = 0;


  let isPaused = false;

  let gameOver = false;

  // detect if you are out of the tab
  $(document).on("visibilitychange", function() {
    if (document.hidden) {
        pauseGame();
    } else {
        resumeGame();
    }
  });

  // rAF
  let lastTimeStamp = 0;
  let rafID = null;

  // game loop
  /* how the loop works
    first handle the players inputs
    then update everything about the projectiles players ect.
    then 
  */
  function nextFrame(timestamp) {
    if (gameOver || isPaused) return;
      // delta time
      if (!lastTimeStamp) lastTimeStamp = timestamp;
      let deltaTime = (timestamp - lastTimeStamp) / 1000;
      deltaTime = Math.min(deltaTime, 0.05); // max of 50ms
      lastTimeStamp = timestamp;
      // clear previous frame before everything draws
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // handle keyboard events
      inputSystem.update(player, projectiles, particles, deltaTime);

      // iterate though particles and update 
      for (let particle of particles) {
        particle.update();
      }
      // filter through dead particles
      particles = particles.filter(b => !b.dead);
      // iterate through projectiles then update
      for (let projectile of projectiles) {
        projectile.update(deltaTime);
      }
      // filter through projectiles and remove the one that are dead
      projectiles = projectiles.filter(b => !b.dead);
      player.update(deltaTime);
      // iterate through enemies then update
      for (let enemy of enemies) {
        enemy.update(deltaTime, player);
        // if player collides with any enemy
        if (SAT.testPolygonPolygon(player.poly, enemy.poly)) { 
          player.takeDmg(enemy.damage); 
        }
        // if any projectiles collide with any enemy
        for (let projectile of projectiles) {
          if (SAT.testPolygonPolygon(projectile.poly, enemy.poly)) { 
            if (!projectile.hitSet.has(enemy.id)) {
              projectile.hitSet.add(enemy.id);
              enemy.takeDmg(projectile); 
              enemy.knockback(projectile);
              if (projectile instanceof Projectile) {
                projectile.health--;
                if (projectile.health <= 0) {
                  projectile.dead = true;
                }
              }
            }
          } 
        }
      }
      // filter remove dead enemies
      enemies = enemies.filter(b => !b.dead);
      // start a new wave if there are no more zombies
      if (enemies.length === 0) {
        waveNum += 1;
        newWave(waveNum);
      }
      // update UI
      displayUI();
      // draw everything
      draw.update([player, ...projectiles, ...enemies, ...particles]);
      // update inputs
      Mouse.update();
      Inp.update();
      // end the game if you die
      if (player.health <= 0) {
        endGame();
      }
      // get the next frame
      rafID = requestAnimationFrame(nextFrame);
  }

  requestAnimationFrame(nextFrame);


  // WAVES
  // filter through all the zombies and include zombies that are unlocked
  function getAvailableZombie(wave) {
    const unlocked = Object.entries(zombie)
      .filter(([name, z]) => wave >= z.waveUnlock)
      .map(([name]) => name);

    // fallback if nothing unlocked
    if (unlocked.length === 0) {
      return [Object.keys(zombie)[0]];
    }

    return unlocked;
  }

  // spawn the zombies and their type
  function spawnZombies(wave) {
    const available = getAvailableZombie(wave);
    const type = available[Math.floor(Math.random() * available.length)];
    const zomData = zombie[type];

    return new Zombie(enemies.length, zomData, player);
  }

  // get a new wave
  function newWave(currentWave) {
    const spawnCount = Math.min(currentWave, maxEnemies);
    for (let i = 0; i < spawnCount; i++) {
      enemies.push(spawnZombies(currentWave));
    }
  }

  // pause functionality
  function pauseGame() {
    isPaused = true;
    lastTimeStamp = 0;
    if (rafID) {
      cancelAnimationFrame(rafID);
      rafID = null;
    }
  }
  
  function resumeGame() {
    isPaused = false;
    if (!rafID) {
      requestAnimationFrame(nextFrame);
    }
  }

  function endGame() {
    gameOver = true;
    cancelAnimationFrame(rafID);
  }

  function displayUI() {
    player.health > 0 ? $('#hp').text(player.health) : $('#hp').text('YOU DIED');
    $('#ammo').text(player.ammoDisplay + "/" + player.weapon.ammo /* replace with mags when the ammo boxes are implemented */); 
    $('#stamina').text(player.stamina + "/" + player.maxStamina);
    $('#wave').text(waveNum);
  }
}