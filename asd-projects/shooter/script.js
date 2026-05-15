$(document).ready(() => {
  $('.MAIN-MENU').show();
});
document.addEventListener("contextmenu", e => e.preventDefault());
// default loadout
const loadout = {
  'primary' : null,
  'secondary' : 'pistol',
  'melee' : null // defaults to fists
}
function addWeaponToSlot(weapon, slot) {
  loadout[slot] = weapon;
}

function runProgram() {
  // fetch json data
  $('.MAIN-MENU').hide();
  $('.GAME').show();
  Promise.all ([
    fetch("json-files/weapons.json").then(r => r.json()),
    fetch("json-files/zombies.json").then(r => r.json()),
    fetch("json-files/characters.json").then(r => r.json()),
    fetch("json-files/status.json").then(r => r.json()),
    fetch("json-files/particles.json").then(r => r.json()),
    fetch("json-files/projectiles.json").then(r => r.json()),
    fetch("json-files/loot.json").then(r => r.json())
  ]) .then(([weaponData, zombieData, charData, statData, particleData, projectileData, lootData]) => {
    // game setup
    const game = new Game(particleData, projectileData, lootData);
    game.createEntities(charData.Garry, weaponData, zombieData);
    game.loadSprites([particleData, projectileData, lootData]);
    // todo add projectile and loot sprites here
    game.startGame();
  });
}

// create squares
function createPoly(obj, wOffset, hOffset, scale) {
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
const scale = 1.75;

// game objects 

// hero
class Hero {
  constructor(character, game) {
    this.game = game;
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
    this.maxHealth = this.char.health;
    this.angle = 0;
    this.source = 'player';

    // invincibility
    this.isInvincible = false;
    this.iFrames = this.char.iFrames; // 1.5 seconds (in ms) 
    this.iTimer = 0;

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

    // inventory
    this.inventory;
    this.canSwitch = true;

    // weapon equiped
    this.weapon;
    this.isGrabbing = false;

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, 2, 2, scale);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;

    // bobbing
    this.bobTimer = 0;
    this.bob = {
      x : 0,
      y : 0
    }

    // knockback
    this.knockX = 0;
    this.knockY = 0;
    this.knockTimer = 0;

    // recoil
    this.recOffset = 0; // push back
    this.recVelocity = 0; // snap back
    
    // sprites
    // body
    this.playerSprite = new Image();
    this.playerSprite.src = this.char.sprites.body.sprite;

    // weapons
    this.hands = {}
    for (const [key, path] of Object.entries(this.char.sprites.hands)) {
      const img = new Image();
      img.src = path;
      this.hands[key] = img;
    }
    this.weaponSprite;
    this.hideWeapon = false;

    // indices
    this.bodyFrame = this.char.sprites.body.frame.normal;

    // lower body
    this.walkSprite = new Image();
    this.walkSprite.src = this.char.sprites.walk.sprite;
    this.walkFrameWidth = this.char.sprites.walk.width;
    this.walkFrameHeight = this.char.sprites.walk.height
    this.walkFrames = this.char.sprites.walk.frames;
    this.currentWalkFrame = 0;
    this.walkFrameDuration = 1000 / this.char.sprites.walk.frames.length;
    this.walkLastFrameTime = performance.now();

    // circular ranges
    this.noSpawnRadius = 200 * scale;
    this.pickupRadius = 100 * scale;
    this.equipRadius = 25 * scale; 
  }

  update(dt) {
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

    // TIMED EVENTS
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
        this.hideWeapon = false;
        this.cdTimerM = 0;
      }
    }

    // charged cooldown
    if (!this.canCharge && !this.isCharging) {
      this.cdTimerC -= dt * 1000;
      if (this.cdTimerC <= 0) {
        this.canCharge = true;
        this.cdTimerC = 0;
      }
    }

    // invincibility timer
    if (this.isInvincible) {
      this.iTimer -= dt * 1000;
      if (this.iTimer <= 0) {
        this.isInvincible = false;
        this.iTimer = 0;
      }
    }

    // reload timer
    if (this.isReload) {
      this.reloadTimer -= dt * 1000
      if (this.reloadTimer <= 0) {
        this.ammoCount = this.weapon.ammo;
        this.ammoDisplay = this.ammoCount;
        if (this.consumesAmmo || this.weapon.type !== 'melee') {
          this.inventory.slots[this.inventory.currentSlot].ammo = this.ammoCount; // saves ammo count in inventory slot
        }
        this.isReload = false;
        this.canShoot = true;
      }
    }

    // charging
    if (this.isCharging) {
      this.timeCharged += dt * 1000; // increase charge time by delta time
      if (this.timeCharged > this.weapon.chargeTime) {
        // cap timer
        this.timeCharged = this.weapon.chargeTime;
        // draw full charge particle
        if (!this.chargeCapped) {
          this.game.createParticle(this, "full-charge");
          this.chargeCapped = true;
        }
      }
      // get charge percent
      this.chargePercent = this.timeCharged / this.weapon.chargeTime;
    }

    this.doBobbing(dt);

    this.doWalkAnim();

    if (this.isDodging) this.dodge(dt);

    this.move.update(this, dt);
  }

  draw(ctx) {
    // render walk
    if (this.isMoving) {
      ctx.save();
      ctx.translate(this.centX, this.centY);
      ctx.rotate(this.angle);
      ctx.drawImage(
        this.walkSprite, // sprite
        this.currentWalkFrame * this.walkFrameWidth, // sprite index
        0, 
        this.walkFrameWidth, 
        this.walkFrameHeight, 
        -this.walkFrameWidth * scale / 2, // sprite size
        -this.walkFrameHeight * scale / 2, 
        this.walkFrameWidth * scale, 
        this.walkFrameHeight * scale
      );
      ctx.restore();
    }
    // render weapon
    if (!this.hideWeapon) {
      ctx.save();
      ctx.fillStyle = this.weapon.color;
      ctx.translate(
        this.centX + this.bob.x - Math.cos(this.angle) * this.recOffset, 
        this.centY + this.bob.y - Math.sin(this.angle) * this.recOffset
      );
      ctx.rotate(this.angle);
      ctx.drawImage(
        this.weaponSprite, // sprite
        (-this.weapon.width * scale / 2) + (this.weapon.offX * scale), 
        (-this.weapon.height * scale / 2) + (this.weapon.offY * scale), 
        this.weapon.width * scale, 
        this.weapon.height * scale
      );
      ctx.restore();
    }
    // render player
    ctx.save();
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.playerSprite, // sprite
      this.bodyFrame * this.width, // sprite index
      0, 
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

  attack() {
    // GUNS
    if (this.weapon.type === 'gun') {
      if (!this.canShoot || this.ammoCount <= 0) return; 
      if (this.isReload) this.stopReload();
      // MUZZLE FLASH
      this.game.createParticleWithParent(this, "muzzle-flash");
      const {muzzleX, muzzleY} = this.getSpawnWP();

      if (this.weapon.fireMode === 'single') {
        const inaccuracy = (Math.random() - 0.5) * this.weapon.inaccuracy;
        this.game.createProjectile(this, inaccuracy, muzzleX, muzzleY);
      }
      if (this.weapon.fireMode === 'scatter') {
        for (let i = 0; i < this.weapon.count; i++) { 
          const spread = (Math.random() - 0.5) * this.weapon.inaccuracy;
          this.game.createProjectile(this, spread, muzzleX, muzzleY);
        }
      }
      this.ammoCount--;
      // save ammo loss in inventory
      this.inventory.slots[this.inventory.currentSlot].ammo = this.ammoCount;
      this.canShoot = false;
      this.ammoDisplay = this.ammoCount;
      this.recVelocity += this.weapon.recoil * 0.25;

      this.canShoot = false;
      this.cdTimerG = this.weapon.rof || 0;
    }
    // MELEE
    if (this.weapon.type === 'melee') {
      if (!this.canSwing) return;
      this.game.createMeleeSwing(this);

      this.canSwing = false;
      this.hideWeapon = true;
      this.cdTimerM = this.weapon.rof || 0;
    }
    // CHARGING
    if (this.weapon.type === 'charge') {
      const {muzzleX, muzzleY} = this.getSpawnWP();
      // increase values by percentage
      this.weapon.dmg = this.weapon.minDmg + (this.weapon.maxDmg - this.weapon.minDmg) * this.chargePercent;
      this.weapon.speed = this.weapon.minSpeed + (this.weapon.maxSpeed - this.weapon.minSpeed) * this.chargePercent;
      this.weapon.airTime = this.weapon.minAirTime + (this.weapon.maxAirTime - this.weapon.minAirTime) * this.chargePercent;
      const inaccuracy = (Math.random() - 0.5) * this.weapon.inaccuracy;

      this.game.createProjectile(this, inaccuracy, muzzleX, muzzleY);
      
      // start cooldown
      this.cdTimerC = this.weapon.minRateOfCharge + (this.weapon.maxRateOfCharge - this.weapon.minRateOfCharge) * this.chargePercent || 0;
      
      // revert starting values
      this.timeCharged = 0;
      this.isCharging = false;
      this.chargePercent = 0;
      this.chargeCapped = false;

      // revert back to base values
      this.weapon.dmg = this.weapon.minDmg;
      this.weapon.speed = this.weapon.minSpeed;
      this.weapon.airTime = this.weapon.minAirTime;
    }
  }

  getSpawnWP() {
    // gets the world position of muzzle (also refered as projectile spawn position)
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

  takeDmg(projectile) {
    if (!this.isInvincible) {
      let damage = projectile.dmg
      const randomizer = Math.random();
      if (randomizer < projectile.crit) {
        damage *= 2;
        this.game.createParticle("crit", this.centX, this.centY - 20);
      }
      this.health = Math.floor(this.health - damage);
      this.isInvincible = true;
      this.iTimer = this.iFrames;
    }
  }

  reload() {
    if (!this.consumesAmmo || this.weapon.type === 'melee') return;
    if (this.currentSlot !== null) {
      this.isReload = true; 
      this.canShoot = false;
      this.ammoDisplay = "RELOADING";
      this.isReload = true;
      this.reloadTimer = this.weapon.reloadSpd;
    }
  }
  stopReload() {
    if (this.isReload) {
      this.isReload = false;
      this.canShoot = true;
      this.ammoDisplay = this.ammoCount;
      this.reloadTimer = 0;
    }
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
  doBobbing(dt) {
    if (this.isMoving && !this.isDodging) {
      this.bobTimer += dt * 10;
    } else {
      this.bobTimer = 0;
    }
    const bobAmount = Math.min(this.ovSpeed * 0.04, 3);
    
    // sway the arm offset
    this.bob.x = Math.cos(this.bobTimer) * bobAmount;
    this.bob.y = Math.sin(this.bobTimer * 2) * (bobAmount * 0.5);

    // recoil 
    this.recOffset += this.recVelocity * dt;
    
    // spring force to bring the gun back to zero
    this.recVelocity += (0 - this.recOffset) * 40 * dt;

    // damping
    this.recVelocity *= 0.85;
  }
  doWalkAnim() {
    if (this.isMoving) {
      if (performance.now() - this.walkLastFrameTime > this.walkFrameDuration) {
        this.currentWalkFrame = (this.currentWalkFrame + 1) % this.walkFrames.length;
        this.walkLastFrameTime = performance.now();
      }
    } else {
      this.currentWalkFrame = 0;
    }
  }
  collisionLogic(projectiles) {
    // if any projectiles collide with any enemy
    for (let projectile of projectiles) {
      if (projectile.source !== 'enemy') continue;
      if (SAT.testPolygonPolygon(projectile.poly, this.poly)) {
        if (projectile instanceof MeleeHitbox && !projectile.canDamage) continue;
        if (!projectile.hitSet.has(this.id)) {
          projectile.hitSet.add(this.id);
          this.takeDmg(projectile);
          this.knockback(projectile);
          this.spawnBlood(projectile);
          if (projectile instanceof Projectile) {
            if (projectile.health !== null) {
              projectile.health--;
              if (projectile.health <= 0) {
                projectile.dead = true;
              }
            }
          }
        }
      }
    }
  }
  spawnBlood(projectile) {
    const particleX = (projectile.centX + this.centX) / 2;
    const particleY = (projectile.centY + this.centY) / 2;
    const spawnNumber = Math.floor(Math.random() * 3) + 3; // random number between 3 and 5
    for (let i = 0; i < spawnNumber; i++) {
      const angleOffset = (Math.random() - 0.5) * 35;
      const angle = this.angle + angleOffset * (Math.PI / 180);
      this.game.createParticle('blood-drop', particleX, particleY, angle);
    }
  }
  knockback(source) {
    if (source.force <= 0) return;
    //if (this.knockbackForce === 0) return; dont remember what this is for but looks important
    let dx = Math.cos(source.angle);
    let dy = Math.sin(source.angle);

    this.knockX = dx * source.force;
    this.knockY = dy * source.force;
    this.knockTimer = 0.12;
  }
}

class Inventory {
  constructor(player, weaponBP, lootData, game) {
    this.game = game;
    this.player = player;
    this.weapons = weaponBP;
    this.slots = { // stores weapon type and ammo count
      0: null,
      1: null,
      2: null
    }
    this.slotTypes = { // guides how to interpret each slot
      primary: 0,
      secondary: 1,
      melee: 2
    }
    this.currentSlot;
    this.lootData = lootData;
  }
  addWeapon(type, ammo) {
    const weaponData = this.weapons[type]; // gets json data of the weapon added
    const indexSlot = this.slotTypes[weaponData.slot]; // gets weapon slot's index
    if (indexSlot === undefined) return; // if weapon has no valid slot

    const current = this.slots[indexSlot];
    if (current !== null) {
      this.game.createDrop(
        {...this.lootData[current.weaponType], 
        ammo : current.ammo}, 
        this.player.pos.x, 
        this.player.pos.y,
        current.weaponType
      );
    }
    this.slots[indexSlot] = {
      weaponType: type,
      ammo: ammo
    }
    this.player.isGrabbing = false;
    this.switchSlot(indexSlot);
  }
  switchSlot(selectedSlot) {
    if (this.slots[selectedSlot] === null && selectedSlot !== 2) return;
    if (this.isReload) this.player.stopReload(); // stop player in the middle of reloading 
    const slot = this.slots[selectedSlot];
    // fist fallback
    if (selectedSlot === 2 && this.slots[selectedSlot] === null) {
      const fistData = this.weapons['fists'];
      this.player.weapon = fistData;
      this.player.canSwing = true;
      this.player.cdTimerM = 0; // cooldown timer (melee)
      this.player.consumesAmmo = false;
      this.player.weaponSprite = this.player.hands[fistData.name.toLowerCase()];
      this.currentSlot = 2;
      return;
    }
    // get weapon data of selected slot
    const weaponData = this.weapons[slot.weaponType];
    // swap to weapon
    this.player.weapon = weaponData;
    // create weapon data to player
    if (weaponData.type === "gun") {
      this.player.canShoot = true;
      this.player.ammoCount = slot.ammo;
      this.player.ammoDisplay = slot.ammo; // to display in UI only
      this.player.isReload = false;
      this.player.reloadTimer = 0; // reload timer
      this.player.cdTimerG = 0; // cooldown timer (gun)
      this.player.isAuto = this.player.weapon.canAutoFire || false;
    } else if (weaponData.type === "melee") {
      this.player.canSwing = true;
      this.player.cdTimerM = 0; // cooldown timer (melee)
    } else if (weaponData.type === "charge") {
      this.player.canCharge = true;
      this.player.timeCharged = 0;
      this.player.percentage = 0;
      this.player.isCharging = false;
      this.player.chargeCapped = false;
      this.player.cdTimerC = 0; // cool down timer (charge)
    }
    this.player.consumesAmmo = weaponData.ammo !== null;
    this.player.weaponSprite = this.player.hands[weaponData.name.toLowerCase()];
    this.currentSlot = selectedSlot;
  }
}

class Loot {
  constructor(lootData, x, y, name) {
    this.pos = {
      x: x,
      y: y
    }
    this.lootName = name;
    this.width = lootData.width;
    this.height = lootData.height;
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;
    this.category = lootData.category;
    switch(this.category) {
      case 'health':
        this.heal = lootData.health;
        break
      case 'weapon':
        this.ammo = lootData.ammo;
        break
    }
    this.sprite = lootData.sprite;
    this.dead = false;
    this.maxSpeed = 600;
    this.timer = 0;
    this.maxMins = 2 * 60000; // 2 minutes (in miliseconds)
  }
  update(dt, player) {
     this.timer += dt;
    if (this.timer >= this.maxMins) {
      this.dead = true;
    }
    // center difference
    const dx = player.centX - this.centX;
    const dy = player.centY - this.centY;
    const distFromPlayer = dx * dx + dy * dy;
    // if drop is in 
    if (distFromPlayer < player.pickupRadius**2) {
      if (this.category === 'weapon' && !player.isGrabbing) return
      // normalize 
      const dist = Math.hypot(dx, dy);
      const directX = dx / dist;
      const directY = dy / dist;
      // follow
      this.pos.x += directX * this.maxSpeed * dt;
      this.pos.y += directY * this.maxSpeed * dt;

      this.centX = this.pos.x + this.width / 2;
      this.centY = this.pos.y + this.height / 2;

      if (distFromPlayer < player.equipRadius**2) {
        this.dead = true;
        this.onPickup(player);
      }
    }
  }
  onPickup(player) {
    switch(this.category) {
      case 'health':
        player.health = Math.min(player.health + this.heal, player.maxHealth);
        break
      case 'weapon':
        player.inventory.addWeapon(this.lootName, this.ammo);
        player.isGrabbing = false;
        break
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.drawImage(
      this.sprite, // sprite
      -this.width * scale / 2, // sprite size
      -this.height * scale / 2, 
      this.width * scale, 
      this.height * scale
    );
    ctx.restore();
  }
}

// helpers
class HandleInputs {
  update(player, camera) {
    const worldMouseX = mouseX + camera.pos.x - CANVAS_WIDTH/2;
    const worldMouseY = mouseY + camera.pos.y - CANVAS_HEIGHT/2
    if (this.isDodging) return;
    // gets the distance from the mouse to the player's center
    const dx = worldMouseX - (player.pos.x + player.width / 2);
    const dy = worldMouseY - (player.pos.y + player.height / 2);
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
    if (Inp.pressOnce('1')) player.inventory.switchSlot(0);
    if (Inp.pressOnce('2')) player.inventory.switchSlot(1);
    if (Inp.pressOnce('3')) player.inventory.switchSlot(2);

    // test keys
    if (Inp.pressOnce('e') && !player.isGrabbing) player.isGrabbing = true;
    if (Inp.release('e')) player.isGrabbing = false;
    
    // detect clicks
    if (Inp.pressOnce('t')) player.inventory.addWeapon('rifle', 2);
    // left clicks
    if (player.weapon.type === "charge") {
      if (Mouse.held()) {
        if (!player.canCharge) return;
        player.isCharging = true;
        player.canCharge = false;
      }
      if (Mouse.release() && player.isCharging) player.attack();
      return;
    }
    if (player.isAuto !== true && Mouse.pressOnce()) player.attack();
     // detect autofire
    if (player.isAuto && Mouse.held()) player.attack();
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

class Draw {
  update(objects) {
    for (let obj of objects) {
      obj.draw(ctx);
    }
  }
}

class Projectile {
  constructor(id, entity, angleOffset, muzzleX, muzzleY, projectileTypes) {
    this.id = id;
    const base = projectileTypes[entity.weapon.projectileType];
    this.width = base.width;
    this.height = base.height
    this.behavior = base.behavior;
    this.pos = {
      x : muzzleX,
      y : muzzleY
    }
    
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;
    this.angle = entity.angle + angleOffset * (Math.PI / 180);
    this.type = entity.weapon.type;
    this.speedX = Math.cos(this.angle) * entity.weapon.speed;
    this.speedY = Math.sin(this.angle) * entity.weapon.speed;
    
    // damager
    this.dmg = entity.weapon.dmg;
    this.health = entity.weapon.health;
    this.hitSet = new Set();
    this.force = entity.weapon.knockback;
    this.crit = entity.weapon.critchance || 0;
    this.source = entity.source;

    // despawner
    this.dead = false;
    this.airTime = entity.weapon.airTime;
    this.spawnTime = performance.now();

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, 0, 0, scale);
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;

    // sprites
    this.color = base.color || null;
    this.sprite = base.sprite || null;
  }
  update(dt) {
    // update position
    if (this.behavior === "straight") {
      this.pos.x += this.speedX * dt;
      this.pos.y += this.speedY * dt;
    }

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
    if (this.color) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
    if (this.sprite) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.drawImage(
        this.sprite, // sprite
        -this.width * scale / 2, // sprite size
        -this.height * scale / 2, 
        this.width * scale, 
        this.height * scale
      );
      ctx.restore();
    }
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
  constructor(entity, projectileTypes) {
    // position
    this.entity = entity;
    this.weapon = entity.weapon;
    const base = projectileTypes[entity.weapon.projectileType];
    this.width = base.width;
    this.height = base.height;
    this.scale = scale + (entity.weapon.addToScale || 0);
    this.pos = {
      x: this.entity.centX + this.weapon.muzzle.x,
      y: this.entity.centY + this.weapon.muzzle.y
    }
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;

    this.reach = this.weapon.reach;
    this.mode = base.behavior;
    this.dmg = this.weapon.dmg;
    this.force = this.weapon.knockback;
    this.crit = this.weapon.critchance || 0;
    this.vel = {
      x: 0,
      y: 0
    }
    // determines if its an enemy attack or player attack
    this.source = entity.source;

    // damager
    this.canDamage = true;
    this.hitSet = new Set();

    // despawn
    this.dead = false;
    this.timer = 0;
    this.duration = this.weapon.duration;

    // attack direction
    if (this.mode === "swing") {
      this.arc = this.weapon.arc * (Math.PI / 180);
      this.startingAngle = entity.angle - this.arc / 2;
      this.endingAngle = entity.angle + this.arc / 2;
      this.angle = this.startingAngle;
    } 
    if (this.mode === "stab") {
      this.angle = entity.angle;
    }
    
    // hitbox
    this.poly = createPoly(this, 0, 0, this.scale);
    this.poly.pos.x = this.pos.x;
    this.poly.pos.y = this.pos.y;

    // sprites go here
    this.sprite = base.sprite;
  }
  update(dt) {
    this.timer += dt;
  
    const t = Math.min(this.timer / this.duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    if (this.mode === "swing") {
      // Always match player angle
      this.angle = this.startingAngle + (this.endingAngle - this.startingAngle) * ease;
      // Always stay in front of the player
      this.pos.x = this.entity.centX + Math.cos(this.angle) * this.reach;
      this.pos.y = this.entity.centY + Math.sin(this.angle) * this.reach;
       // velocity 
      const angleVel = (this.endingAngle - this.startingAngle) / this.duration;
      this.vel.x = Math.cos(this.angle) * this.reach * angleVel;
      this.vel.y = Math.sin(this.angle) * this.reach * angleVel;
    }
    if (this.mode === "stab") {
      this.angle = this.entity.angle;
      const {muzzleX, muzzleY} = this.entity.getSpawnWP();
      if ( t <= 0.5) { // punch in
        this.pos.x = muzzleX + Math.cos(this.angle) * (this.reach * t * 2);
        this.pos.y = muzzleY + Math.sin(this.angle) * (this.reach * t * 2);
      } else {
        this.canDamage = false;
        this.pos.x = muzzleX + Math.cos(this.angle) * (this.reach * (1 - (ease - 0.5) * 2));
        this.pos.y = muzzleY + Math.sin(this.angle) * (this.reach * (1 - (ease - 0.5) * 2));
      }
    }


    // Update polygon position
    this.poly.setAngle(this.angle);
    this.poly.pos.x = this.pos.x;
    this.poly.pos.y = this.pos.y;

    // despawner
    if (t >= 1 || this.entity.dead) this.dead = true;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.sprite, // sprite
      -this.width * this.scale / 2, // sprite size
      -this.height * this.scale / 2, 
      this.width * this.scale, 
      this.height * this.scale
    );
    ctx.restore();
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

class Particle {
  constructor(particleData, a, b, c, angle) {
    // case 1: parent and type
    if (typeof a === "object") {
      this.parent = a;
      this.type = b;
      this.x = this.parent.x;
      this.y = this.parent.y;
    }
    // case 2: type, x, and y
    else {
      this.parent = null;
      this.type = a;
      this.x = b;
      this.y = c;
    }

    const base = particleData[this.type];

    this.width = base.width;
    this.height = base.height;
    this.angle = 0;
    this.life = base.life; // ms
    this.start = performance.now();
    this.dead = false;
    this.sprite = base.sprite;
    this.behavior = base.behavior;
    this.scale = scale + (base.addToScale || 0);
    // indices
    if (base.frames) {
      this.frames = base.frames;
      this.currentFrame = 0;
      this.frameDuration = base.life / base.frames.length;
      this.lastFrameTime = performance.now();
      this.particleCapped = false;
    }
    if (this.type === 'blood-drop') {
      this.angle = angle;
      this.speedX = Math.cos(this.angle) * (Math.random() * 410 + 60);
      this.speedY = Math.sin(this.angle) * (Math.random() * 410 + 60);
    }
  }
  update(dt) {
    if (performance.now() - this.start > this.life) {
      this.dead = true;
    }
    if (this.behavior === 'follow-player') {
      const {muzzleX, muzzleY} = this.parent.getSpawnWP();
      this.x = muzzleX;
      this.y = muzzleY;
      this.angle = this.parent.angle;
    }
    if (this.type === "crit") {
      this.y -= 0.54;
    }
    if (this.frames) {
      if (performance.now() - this.lastFrameTime > this.frameDuration) {
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        this.lastFrameTime = performance.now();
      }
    }
    if (this.type === "blood-drop") {
      this.x += this.speedX * dt;
      this.y += this.speedY * dt;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.frames) {
      ctx.drawImage(
        this.sprite, // sprite
        this.currentFrame * this.width, // sprite index
        0, 
        this.width, 
        this.height, 
        -this.width * this.scale / 2, // sprite size
        -this.height * this.scale / 2, 
        this.width * this.scale, 
        this.height * this.scale
      );
    } else if (this.sprite) {
      ctx.drawImage(
        this.sprite,
        -this.width * this.scale / 2,
        -this.height * this.scale / 2,
        this.width * this.scale,
        this.height * this.scale
      );
    } else {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class Zombie {
  constructor(id, type, player, game, lootData) {
    this.game = game;
    // spawn area
    // choose a random spawn position if that spawn position is over the players radius^2 choose a new spawn
    let spawnX = Math.random() * CANVAS_WIDTH;
    let spawnY = Math.random() * CANVAS_HEIGHT;
    let dx = spawnX - player.pos.x;
    let dy = spawnY - player.pos.y;
    let distFromPlayer = dx * dx + dy * dy;
    while (distFromPlayer < player.noSpawnRadius**2) {
      spawnX = Math.random() * CANVAS_WIDTH;
      spawnY = Math.random() * CANVAS_HEIGHT;
      dx = spawnX - player.pos.x;
      dy = spawnY - player.pos.y;
      distFromPlayer = dx * dx + dy * dy
    }

    // define
    this.id = id;
    this.type = type;
    this.width = type.width;
    this.height = type.height;
    this.pos = {
      x: spawnX,
      y: spawnY
    }
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = type.spd;
    this.health = type.hp;
    this.angle = 0;
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;
    this.color = type.color;

    // knockback
    this.knockX = 0;
    this.knockY = 0;
    this.knockTimer = 0;

    // attack
    this.weaponType = type.weapon.type;
    if (this.weaponType === "melee") {
      this.weapon = {
        dmg : type.weapon.dmg,
        muzzle : { x: 0, y: 0 },
        arc : type.weapon.arc,
        knockback : type.weapon.knockback,
        reach : type.weapon.reach,
        duration : type.weapon.duration,
        critchance : 0,
        projectileType : type.weapon.projectileType
      }
    } else if (this.weaponType === "ranged") {
      this.weapon = {
        dmg : type.weapon.dmg,
        muzzle : { x: 0, y: 0 },
        critchance : 0,
        projectileType : type.weapon.projectileType,
        knockback : type.weapon.knockback,
        inaccuracy : type.weapon.inaccuracy,
        airTime : type.weapon.airTime,
        health : type.weapon.health,
        speed : type.weapon.speed,
        offX : type.weapon.offX,
        offY : type.weapon.offY
      }
    }
    this.canAttack = true;
    this.attackTimer = 0;
    this.attackCooldown = type.weapon.rof; 
    this.attackRange = type.weapon.canAttackRange;
    this.closeToPlayerRange = type.closeToPlayerRange;
    this.source = 'enemy';

    // ai logic
    this.stopMoving = false;
    this.behavior = type.behavior;

    // kill
    this.dead = false;
    this.spawnTime = performance.now();

    // loot
    this.lootTable = type.lootTable || null;
    this.lootData = lootData;

    // define da polygon (hitbox purposes)
    this.poly = createPoly(this, 0, 0, scale);
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
    if (!this.canAttack) {
      this.attackTimer -= dt * 1000; // convert dt to ms
      if (this.attackTimer <= 0) {
        this.canAttack = true;
        this.attackTimer = 0;
      }
    }
    // center difference
    const dx = player.centX - this.centX;
    const dy = player.centY - this.centY;

    // normalize 
    const distanceFromPlayer = Math.hypot(dx, dy);
    const directX = dx / distanceFromPlayer;
    const directY = dy / distanceFromPlayer;
    // attack
    if (distanceFromPlayer < this.attackRange && this.canAttack) {
      this.canAttack = false
      this.attack();
      this.attackTimer = this.attackCooldown;
      this.stopMoving = true;
    }
    this.stopMoving = distanceFromPlayer < this.closeToPlayerRange ? true : false
    if (!this.stopMoving) {
      // follow
      this.pos.x += directX * this.maxSpeed * dt;
      this.pos.y += directY * this.maxSpeed * dt;
    }
    this.centX = this.pos.x + this.width / 2;
    this.centY = this.pos.y + this.height / 2;

    this.angle = Math.atan2(dy, dx);

    // update hitbox
    this.poly.pos.x = this.centX; 
    this.poly.pos.y = this.centY;
    this.poly.setAngle(this.angle);
  }
  attack() {
    debugger;
    if (this.weaponType === "melee") {
      this.game.createMeleeSwing(this);
    } else if (this.weaponType === "ranged") {

      const inaccuracy = (Math.random() - 0.5) * this.weapon.inaccuracy;
      let {muzzleX, muzzleY} = this.getSpawnWP();
      this.game.createProjectile(this, inaccuracy, muzzleX, muzzleY);
    }
  }
  draw(ctx) {
    // draw zombie
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.centX, this.centY);
    ctx.rotate(this.angle);
    ctx.fillRect(
      -this.width / 2 * scale, 
      -this.height / 2 * scale, 
      this.width * scale, 
      this.height * scale
    );
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
    let damage = projectile.dmg
    const randomizer = Math.random();
    if (randomizer < projectile.crit) {
      damage *= 2;
      this.game.createParticle("crit", this.centX, this.centY - 20);
    }
    this.health = Math.floor(this.health - damage);
  }
  knockback(source) {
    if (source.force <= 0) return;
    //if (this.knockbackForce === 0) return; dont remember what this is for but looks important
    let dx = Math.cos(source.angle);
    let dy = Math.sin(source.angle);

    this.knockX = dx * source.force;
    this.knockY = dy * source.force;
    this.knockTimer = 0.12;
  }
  // loot table 
  rollLoot() {
    if (!this.lootTable) return;
    let weight = 0;
    for (let itemWeight of Object.values(this.lootTable)) weight += itemWeight;
    let random = Math.random() * weight
    for (let [item, itemWeight] of Object.entries(this.lootTable)) {
      if (random < itemWeight) return item;
      random -= itemWeight;
    }
  }
  dropLoot() {
    let loot = this.rollLoot();
    if (!loot || loot === 'nothing') return;
    this.game.createDrop(this.lootData[loot], this.centX, this.centY, loot);
  }
  collisionLogic(projectiles) {
    if (this.dead) return;
    // if any projectiles collide with any enemy
    for (let projectile of projectiles) {
      if (projectile.source !== 'player') continue;
      if (SAT.testPolygonPolygon(projectile.poly, this.poly)) {
        if (projectile instanceof MeleeHitbox && !projectile.canDamage) continue;
        if (!projectile.hitSet.has(this.id)) {
          projectile.hitSet.add(this.id);
          this.takeDmg(projectile);
          this.knockback(projectile);
          this.spawnBlood(projectile);
          if (projectile instanceof Projectile) {
            if (projectile.health !== null) {
              projectile.health--;
              if (projectile.health <= 0) {
                projectile.dead = true;
              }
            }
          }
          if (this.killCheck()) return;
        }
      }
    }
  }
  getSpawnWP() {
    // gets the world position of muzzle (also refered as projectile spawn position)
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
  spawnBlood(projectile) {
    const particleX = (projectile.centX + this.centX) / 2;
    const particleY = (projectile.centY + this.centY) / 2;
    const spawnNumber = Math.floor(Math.random() * 3) + 3; // random number between 3 and 5
    for (let i = 0; i < spawnNumber; i++) {
      const angleOffset = (Math.random() - 0.5) * 35;
      const angle = this.angle + angleOffset * (Math.PI / 180);
      this.game.createParticle('blood-drop', particleX, particleY, angle);
    }
  }
  killCheck() {
    if (this.health <= 0) {
      this.dead = true;
      this.dropLoot();
      return true;
    }
  }
}

class Wave {
  constructor(zombieData, playerData, game, lootData) {
    this.game = game;
    this.zombie = zombieData;
    this.player = playerData;
    this.lootData = lootData;
    this.waveNum = 0;
    // total enemies that can spawn in the wave
    this.totalEnemies = 0;
    // remaining zombies
    this.enemiesToSpawn = 0;
    // max amount of enemies that can be displayed on the screen
    this.maxEnemies = 15;
  }
  getAvailableZombies() {
    const unlocked = Object.entries(this.zombie)
      .filter(([name, z]) => this.waveNum >= z.waveUnlock)
      .map(([name]) => name);

    // fallback if nothing unlocked
    if (unlocked.length === 0) {
      return [Object.keys(this.zombie)[0]];
    }

    return unlocked;
  }
  spawnZombies() {
    const available = this.getAvailableZombies();
    const type = available[Math.floor(Math.random() * available.length)];
    const zomData = this.zombie[type];

    return new Zombie(this.game.enemies.length, zomData, this.player, this.game, this.lootData);
  }
  newWave() {
    this.waveNum++;
    this.totalEnemies++;
    this.enemiesToSpawn = this.totalEnemies;
    const spawnCount = Math.min(this.enemiesToSpawn, this.maxEnemies);
    for (let i = 0; i < spawnCount; i++) {
      this.game.enemies.push(this.spawnZombies());
      this.enemiesToSpawn--;
    }
  }
  isWaveComplete() {
    if (this.game.enemies.length === 0) {
      this.newWave();
    }
  }
  spawnMore() {
    while (this.game.enemies.length < this.maxEnemies && this.enemiesToSpawn !== 0) {
      this.game.enemies.push(this.spawnZombies());
      this.enemiesToSpawn--;
    }
  }
}

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

class Camera {
  constructor(player) {
    this.player = player;
    this.pos = {
      x : 0,
      y : 0,
    }
    this.targetX = this.player.centX;
    this.targetY = this.player.centY;
    this.lerpSpeed = 5;
  }
  update(dt) {
    this.targetX = this.player.centX;
    this.targetY = this.player.centY;
    this.pos.x += (this.targetX - this.pos.x) * this.lerpSpeed * dt;
    this.pos.y += (this.targetY - this.pos.y) * this.lerpSpeed * dt;
  }
}

class Game {
  constructor(particleJSON, projectileJSON, lootJSON) {
    // game objects and data
    this.objectTables = {
      particles : [],
      projectiles : [],
      drops : []
    };
    this.objectData = {
      particle : particleJSON,
      projectile : projectileJSON,
      drop : lootJSON
    };
    this.player;
    this.enemies = [];
    // helper systems 
    this.inputSystem = new HandleInputs();
    this.drawSystem = new Draw(); 
    this.camera;
    this.waveSetup;

    this.paused = false;
    this.gameOver = false;

    // frame stuff
    this.lastTimeStamp = 0
    this.rafID = null;
    this.newFrame = this.newFrame.bind(this);

    // detects when you are out of the tab
    $(document).on("visibilitychange", function() {
      if (document.hidden) {
          this.pause();
      } else {
          this.resume();
      }
    }.bind(this));
  }
  newFrame(timestamp) {
    // delta time
    if (!this.lastTimeStamp) this.lastTimeStamp = timestamp;
    let deltaTime = (timestamp - this.lastTimeStamp) / 1000;
    deltaTime = Math.min(deltaTime, 0.05); // max of 50ms
    this.lastTimeStamp = timestamp;
    // clear previous frame before everything draws
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // handle keyboard events
    this.inputSystem.update(this.player, this.camera);
    this.updateGameItems(deltaTime);
    ctx.translate(-this.camera.pos.x + CANVAS_WIDTH/2, -this.camera.pos.y + CANVAS_HEIGHT/2);
    // draw everything
    this.drawSystem.update([...this.objectTables.drops, ...this.objectTables.projectiles, this.player, ...this.enemies, ...this.objectTables.particles]);
    this.updateWave();
    ctx.restore();
    this.updateUI();

    // update inputs
    Mouse.update();
    Inp.update();
    if (this.player.health <= 0) {
      $('#death-screen').show();
      this.gameOver();
    }

    this.rafID = requestAnimationFrame(this.newFrame);
  }
  updateGameItems(deltaTime) {
    // player
    this.player.update(deltaTime);
    this.player.collisionLogic(this.objectTables.projectiles)
    // camera
    this.camera.update(deltaTime);
    // particles
    // get every particle of the particles object table then update
    for (let particle of this.objectTables.particles) particle.update(deltaTime);
    // filter every dead particle then replace the old object table's array
    this.objectTables.particles = this.objectTables.particles.filter(b => !b.dead);
    // projectiles
    for (let projectile of this.objectTables.projectiles) projectile.update(deltaTime);
    this.objectTables.projectiles = this.objectTables.projectiles.filter(b => !b.dead);
    // drops
    for (let drop of this.objectTables.drops) drop.update(deltaTime, this.player);
    this.objectTables.drops = this.objectTables.drops.filter(b => !b.dead);
    // zombies
    for (let zombie of this.enemies) {
      zombie.update(deltaTime, this.player);
      zombie.collisionLogic(this.objectTables.projectiles);
    }
    this.enemies = this.enemies.filter(b => !b.dead);
  }
  updateWave() {
    // check if more zombies need to be spawn
    this.waveSetup.spawnMore();
    // check if no more zombies are left
    this.waveSetup.isWaveComplete();
  }
  updateUI() {
    let healthPercentage = (this.player.health / this.player.maxHealth) * 100;
    $('#health-fill').css({
      'width' : healthPercentage + '%',
      'height' : healthPercentage + '%',
    });
    if (healthPercentage <= 45) {
      $('#health-fill').addClass('low');
    } else {
      $('#health-fill').removeClass('low');
    }
    $('#health-number').text(!this.gameOver ? this.player.health : 'YOU DIED');
    if (!this.player.weapon.ammo || this.player.weapon.type === 'melee') {
      $('#ammo').text('infinite');
    } else {
      $('#ammo').text(this.player.ammoDisplay + "/" + this.player.weapon.ammo ); 
    }
    $('#stamina').text(this.player.stamina + "/" + this.player.maxStamina);
    $('#wave').text(this.waveSetup.waveNum);
  }
  pause() {
    this.paused = true;
    this.lastTimeStamp = 0;
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
      this.rafID = null;
    }
  }
  resume() {
    this.paused = false;
    if (!this.rafID) {
      requestAnimationFrame(this.newFrame);
    }
  }
  gameOver() {
    this.gameOver = true;
    cancelAnimationFrame(this.rafID);
  }
  startGame() {
    requestAnimationFrame(this.newFrame);
  }
  createEntities(character, weaponData, zombieData) {
    this.player = new Hero(character, this);
    this.player.inventory = new Inventory(this.player, weaponData, this.objectData.drop, this);
    // add all of loadout to inventory
    for (let item of Object.values(loadout)) {
      if (item !== null) {
        this.player.inventory.addWeapon(item, weaponData[item].ammo);
      }
    }
    // swap to first available slot
    for (let item of Object.values(loadout)) {
      if (item !== null) {
        const slotIndex = this.player.inventory.slotTypes[weaponData[item].slot];
        this.player.inventory.switchSlot(slotIndex);
        break;
      }
    }
    this.waveSetup = new Wave(zombieData, this.player, this, this.objectData.drop);
    this.camera = new Camera(this.player);
  }
  createProjectile(entityRef, inaccuracy, x, y) {
    this.objectTables.projectiles.push(new Projectile(this.objectTables.projectiles.length, entityRef, inaccuracy, x, y, this.objectData.projectile));
  }
  createMeleeSwing(entityRef) {
    this.objectTables.projectiles.push(new MeleeHitbox(entityRef, this.objectData.projectile));
  }
  createParticle(type, x, y, angle) {
    this.objectTables.particles.push(new Particle(this.objectData.particle, type, x, y, angle));
  }
  createParticleWithParent(parent, type) {
    this.objectTables.particles.push(new Particle(this.objectData.particle, parent, type));
  }
  createDrop(data, x, y, name) {
    this.objectTables.drops.push(new Loot(data, x, y, name));
  }
  loadSprites(dataObjects) {
    for (let i = 0; i < dataObjects.length; i++) {
      for (const [key, path] of Object.entries(dataObjects[i])) {
        if (path.sprite) {
          const img = new Image();
          img.src = path.sprite;
          path.sprite = img; 
        }
      }
    }
  }
}