class DataFile {
  constructor(id, tx, ty) {
    this.id   = id;
    this.x    = tx * TILE + 2;
    this.y    = ty * TILE + 2;
    this.w    = 12;
    this.h    = 12;
    this.collected = false;
    this.bob  = 0; // animation offset
  }
  update(dt) {
    this.bob = (this.bob + dt * 3) % (Math.PI * 2);
  }
  draw(camX) {
    if(this.collected) return;
    const bobY = Math.round(Math.sin(this.bob) * 2);
    R.dataFile(this.x - camX, this.y + bobY);
  }
}

class StorageNode {
  constructor(id, type, tx, ty, mediaType, isOffsite) {
    this.id        = id;
    this.type      = type;
    this.x         = tx * TILE;
    this.y         = ty * TILE;
    this.mediaType = mediaType;
    this.isOffsite = isOffsite;
    this.deposits  = new Set(); // file ids backed up here
    this.alive     = true;
    // Interaction zone
    this.zoneW = (type === 'external' || type === 'cloud') ? 30 : 24;
  }
  nearPlayer(px, py) {
    const cx = this.x + 8;
    const cy = this.y + 8;
    const pcx = px + 7;
    const pcy = py + 10;
    return Math.abs(pcx - cx) < this.zoneW && Math.abs(pcy - cy) < 28;
  }
  draw(camX, nearPlayer) {
    if(!this.alive) {
      R.deadNode(this.type, this.x - camX, this.y);
      return;
    }
    R.node(this.type, this.x - camX, this.y, this.deposits.size > 0, nearPlayer);
  }
}

class Enemy {
  constructor(type, tx, ty, dir, rangeTiles) {
    this.type   = type;
    this.x      = tx * TILE;
    this.y      = ty * TILE;
    this.w      = 12;
    this.h      = 8;
    this.vx     = (type==='bat' ? 40 : 50) * dir;
    this.vy     = 0;
    this.startX = tx * TILE;
    this.range  = rangeTiles * TILE;
    this.frame  = 0;
    this.frameTimer = 0;
    this.alive  = true;
  }
  update(dt, map) {
    this.frameTimer += dt;
    if(this.frameTimer > 0.3) { this.frame ^= 1; this.frameTimer = 0; }
    this.x += this.vx * dt;
    if(this.x < this.startX)             { this.x = this.startX; this.vx = Math.abs(this.vx); }
    if(this.x > this.startX + this.range) { this.x = this.startX + this.range; this.vx = -Math.abs(this.vx); }
  }
  draw(camX) {
    if(!this.alive) return;
    R.enemy(this.type, this.x - camX, this.y, this.frame);
  }
  overlaps(px, py, pw, ph) {
    return this.x < px+pw && this.x+this.w > px &&
           this.y < py+ph && this.y+this.h > py;
  }
}
