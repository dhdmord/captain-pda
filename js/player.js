const GRAVITY    = 700;
const JUMP_VEL   = -310;
const MOVE_SPEED = 85;

class Player {
  constructor(tx, ty) {
    this.x       = tx * TILE + 1;
    this.y       = ty * TILE;
    this.w       = 14;
    this.h       = 22;
    this.vx      = 0;
    this.vy      = 0;
    this.grounded = false;
    this.prevY   = this.y;
    this.facingRight = true;
    this.frame   = 0;
    this.frameTimer = 0;
    this.hitTimer = 0; // invincibility after being hit
    this.inventory = new Set(); // file ids player is carrying
  }

  update(dt, map, keys, nodes, files, enemies, levelState) {
    this.prevY = this.y;
    if(this.hitTimer > 0) this.hitTimer -= dt;

    // Horizontal
    if(keys['ArrowLeft'] || keys['KeyA']) {
      this.vx = -MOVE_SPEED;
      this.facingRight = false;
    } else if(keys['ArrowRight'] || keys['KeyD']) {
      this.vx = MOVE_SPEED;
      this.facingRight = true;
    } else {
      this.vx = 0;
    }

    // Jump
    if((keys['ArrowUp'] || keys['Space']) && this.grounded) {
      this.vy = JUMP_VEL;
      this.grounded = false;
      Audio.jump();
    }

    // Gravity
    this.vy += GRAVITY * dt;
    if(this.vy > 600) this.vy = 600;

    // Move X
    this.x += this.vx * dt;
    this._resolveX(map);

    // Move Y
    this.y += this.vy * dt;
    this.grounded = false;
    this._resolveY(map);

    // Clamp to level
    const maxX = map.w * TILE - this.w;
    if(this.x < 0) this.x = 0;
    if(this.x > maxX) this.x = maxX;

    // Walk animation
    if(this.grounded && this.vx !== 0) {
      this.frameTimer += dt;
      if(this.frameTimer > 0.15) { this.frame ^= 1; this.frameTimer = 0; }
    } else {
      this.frame = 0; this.frameTimer = 0;
    }

    // Collect files
    files.forEach(f => {
      if(f.collected) return;
      if(this._overlaps(f.x, f.y, f.w, f.h)) {
        f.collected = true;
        this.inventory.add(f.id);
        levelState.addNotification('+FILE', f.x, f.y - 8, EGA.BRIGHT_YELLOW);
        Audio.collect();
        levelState.onFileCollected(f.id);
      }
    });

    // Enemy collision
    if(this.hitTimer <= 0) {
      enemies.forEach(e => {
        if(!e.alive) return;
        if(e.overlaps(this.x, this.y, this.w, this.h)) {
          this.hitTimer = 1.5;
          levelState.onEnemyHit();
          Audio.hit();
        }
      });
    }

    // Interact (Z key) with nearby node
    if(keys['KeyZ'] && !keys['_prevZ']) {
      const nearNode = nodes.find(n => n.alive && n.nearPlayer(this.x, this.y));
      if(nearNode && this.inventory.size > 0) {
        this.inventory.forEach(id => nearNode.deposits.add(id));
        levelState.addNotification('BACKED UP!', nearNode.x, nearNode.y - 14, EGA.BRIGHT_GREEN);
        Audio.deposit();
        levelState.onDeposit(nearNode);
      }
    }
  }

  _resolveX(map) {
    const tx = this.vx >= 0 ? Math.floor((this.x+this.w) / TILE) : Math.floor(this.x / TILE);
    const tyTop = Math.floor(this.y / TILE);
    const tyBot = Math.floor((this.y+this.h-1) / TILE);
    for(let ty=tyTop; ty<=tyBot; ty++) {
      const t = _getTile(map, tx, ty);
      if(t===1||t===3) {
        if(this.vx >= 0) this.x = tx*TILE - this.w;
        else             this.x = (tx+1)*TILE;
        this.vx = 0;
        break;
      }
    }
  }

  _resolveY(map) {
    if(this.vy >= 0) {
      const ty = Math.floor((this.y+this.h) / TILE);
      const txL = Math.floor((this.x+1)/TILE);
      const txR = Math.floor((this.x+this.w-2)/TILE);
      for(let tx=txL; tx<=txR; tx++) {
        const t = _getTile(map, tx, ty);
        const wasAbove = this.prevY + this.h <= ty*TILE + 2;
        if(t===1||t===3 || (t===2 && wasAbove)) {
          this.y = ty*TILE - this.h;
          this.vy = 0;
          this.grounded = true;
          break;
        }
      }
    } else {
      const ty = Math.floor(this.y / TILE);
      const txL = Math.floor((this.x+1)/TILE);
      const txR = Math.floor((this.x+this.w-2)/TILE);
      for(let tx=txL; tx<=txR; tx++) {
        const t = _getTile(map, tx, ty);
        if(t===1||t===3) {
          this.y = (ty+1)*TILE;
          this.vy = 0;
          break;
        }
      }
    }
  }

  _overlaps(ox, oy, ow, oh) {
    return this.x < ox+ow && this.x+this.w > ox && this.y < oy+oh && this.y+this.h > oy;
  }

  draw(camX) {
    // Flicker when hit
    if(this.hitTimer > 0 && Math.floor(this.hitTimer * 8) % 2 === 0) return;
    R.player(this.x - camX, this.y, this.facingRight, this.frame, this.grounded);
  }
}

function _getTile(map, tx, ty) {
  if(tx<0||tx>=map.w||ty<0||ty>=map.h) return 1;
  return map.tiles[ty*map.w+tx];
}
