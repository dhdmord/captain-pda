const EGA = {
  BLACK:        '#000000',
  DARK_BLUE:    '#0000AA',
  DARK_GREEN:   '#00AA00',
  DARK_CYAN:    '#00AAAA',
  DARK_RED:     '#AA0000',
  DARK_MAGENTA: '#AA00AA',
  BROWN:        '#AA5500',
  LIGHT_GRAY:   '#AAAAAA',
  DARK_GRAY:    '#555555',
  BRIGHT_BLUE:  '#5555FF',
  BRIGHT_GREEN: '#55FF55',
  BRIGHT_CYAN:  '#55FFFF',
  BRIGHT_RED:   '#FF5555',
  BRIGHT_MAGENTA:'#FF55FF',
  BRIGHT_YELLOW:'#FFFF55',
  WHITE:        '#FFFFFF',
};

const TILE    = 16;
const CW      = 320;
const CH      = 200;
const GAME_H  = 160;
const HUD_Y   = 160;
const HUD_H   = 40;

const R = (() => {
  let ctx;

  function init(canvas) {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
  }

  function r(x,y,w,h,c) { ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),w,h); }
  function clear(c=EGA.BLACK) { r(0,0,CW,CH,c); }

  function txt(s,x,y,c=EGA.WHITE,sz=10) {
    ctx.fillStyle=c;
    ctx.font=`${sz}px 'VT323', monospace`;
    ctx.fillText(s, Math.round(x), Math.round(y));
  }

  function txtCenter(s,y,c=EGA.WHITE,sz=10) {
    ctx.fillStyle=c;
    ctx.font=`${sz}px 'VT323', monospace`;
    const w = ctx.measureText(s).width;
    ctx.fillText(s, Math.round((CW-w)/2), Math.round(y));
  }

  function hline(x,y,w,c) { r(x,y,w,1,c); }
  function vline(x,y,h,c) { r(x,y,1,h,c); }

  // Tile drawing
  function tile(type, sx, sy) {
    const tx = Math.round(sx/TILE);
    switch(type) {
      case 1: // solid ground
        r(sx,sy,TILE,TILE, EGA.BROWN);
        hline(sx,sy,TILE, EGA.LIGHT_GRAY);
        hline(sx,sy+1,TILE, EGA.DARK_GRAY);
        // brick seam
        if(tx%2===0) { hline(sx,sy+6,TILE/2,EGA.DARK_GRAY); hline(sx+TILE/2,sy+11,TILE/2,EGA.DARK_GRAY); }
        else         { hline(sx+TILE/2,sy+6,TILE/2,EGA.DARK_GRAY); hline(sx,sy+11,TILE/2,EGA.DARK_GRAY); }
        break;
      case 2: // one-way platform
        r(sx,sy,TILE,3, EGA.DARK_CYAN);
        hline(sx,sy,TILE, EGA.BRIGHT_CYAN);
        hline(sx,sy+3,TILE, EGA.DARK_GRAY);
        break;
      case 3: // wall
        r(sx,sy,TILE,TILE, EGA.DARK_GRAY);
        hline(sx,sy,TILE,EGA.BLACK);
        vline(sx,sy,TILE,EGA.BLACK);
        break;
    }
  }

  function tileMap(map, camX) {
    const startTX = Math.max(0, Math.floor(camX/TILE));
    const endTX   = Math.min(map.w-1, startTX + Math.ceil(CW/TILE) + 1);
    for(let ty=0; ty<map.h; ty++) {
      for(let tx=startTX; tx<=endTX; tx++) {
        const t = map.tiles[ty*map.w+tx];
        if(!t) continue;
        tile(t, tx*TILE - camX, ty*TILE);
      }
    }
  }

  function sky() {
    r(0,0,CW,50,EGA.DARK_BLUE);
    r(0,50,CW,110,EGA.BLACK);
    // stars (deterministic)
    ctx.fillStyle = EGA.WHITE;
    const stars=[[20,10],[60,8],[90,20],[140,5],[180,14],[220,8],[280,18],[310,6],[50,35],[160,30],[260,25],[300,40]];
    stars.forEach(([x,y])=>ctx.fillRect(x,y,1,1));
  }

  // Player sprite
  function player(sx, sy, facingRight, frame, grounded) {
    sx=Math.round(sx); sy=Math.round(sy);
    // Helmet
    r(sx+2,sy,10,2, EGA.BRIGHT_CYAN);
    r(sx+1,sy+2,12,4, EGA.BRIGHT_CYAN);
    // Visor
    r(sx+3,sy+2,8,4, EGA.DARK_BLUE);
    r(sx+3,sy+2,2,2, EGA.BRIGHT_BLUE); // shine
    // Body
    r(sx+1,sy+6,12,8, EGA.WHITE);
    r(sx+4,sy+7,3,1, EGA.DARK_BLUE);
    r(sx+4,sy+9,3,1, EGA.DARK_BLUE);
    r(sx+8,sy+7,3,1, EGA.DARK_BLUE);
    // Cape
    const cx = facingRight ? sx : sx+11;
    r(cx,sy+6,2,9, EGA.BRIGHT_MAGENTA);
    // Belt
    r(sx+1,sy+14,12,2, EGA.BROWN);
    r(sx+6,sy+14,2,2, EGA.BRIGHT_YELLOW);
    // Legs
    if(grounded && frame===0) {
      r(sx+2,sy+16,5,5, EGA.LIGHT_GRAY);
      r(sx+8,sy+16,5,3, EGA.LIGHT_GRAY);
    } else if(grounded) {
      r(sx+2,sy+16,5,3, EGA.LIGHT_GRAY);
      r(sx+8,sy+16,5,5, EGA.LIGHT_GRAY);
    } else {
      r(sx+2,sy+16,5,4, EGA.LIGHT_GRAY);
      r(sx+8,sy+16,5,4, EGA.LIGHT_GRAY);
    }
    // Boots
    r(sx+1,sy+20,6,2, EGA.DARK_GRAY);
    r(sx+8,sy+20,6,2, EGA.DARK_GRAY);
  }

  // Data file (floppy disk)
  function dataFile(sx, sy) {
    sx=Math.round(sx); sy=Math.round(sy);
    r(sx,sy,12,12, EGA.DARK_GRAY);
    r(sx+2,sy+1,8,7, EGA.WHITE);
    r(sx+3,sy+2,6,1, EGA.DARK_BLUE);
    r(sx+3,sy+4,6,1, EGA.DARK_BLUE);
    r(sx+3,sy+6,6,1, EGA.DARK_BLUE);
    r(sx+3,sy+9,6,2, EGA.LIGHT_GRAY);
    r(sx,sy,1,12, EGA.LIGHT_GRAY);
  }

  // Storage nodes
  function node(type, sx, sy, backedUp, nearPlayer) {
    sx=Math.round(sx); sy=Math.round(sy);
    if(nearPlayer) txt('[Z]', sx, sy-3, EGA.BRIGHT_YELLOW, 9);
    switch(type) {
      case 'hdd': {
        r(sx,sy,16,14, EGA.LIGHT_GRAY);
        r(sx+1,sy+1,14,10, backedUp?EGA.DARK_GREEN:EGA.DARK_BLUE);
        if(backedUp) { r(sx+3,sy+3,10,2,EGA.BRIGHT_GREEN); r(sx+3,sy+7,10,1,EGA.BRIGHT_GREEN); }
        else         { r(sx+6,sy+5,4,2,EGA.DARK_GRAY); }
        r(sx+5,sy+14,6,2, EGA.DARK_GRAY);
        r(sx+3,sy+15,10,2, EGA.DARK_GRAY);
        txt('HDD', sx-1, sy+23, EGA.LIGHT_GRAY, 7);
        break;
      }
      case 'external': {
        r(sx,sy,22,10, EGA.BROWN);
        r(sx+1,sy+1,20,8, backedUp?EGA.DARK_GREEN:EGA.DARK_GRAY);
        r(sx+8,sy+3,6,2, backedUp?EGA.BRIGHT_GREEN:EGA.DARK_RED);
        r(sx+18,sy+3,3,4, EGA.DARK_GRAY);
        txt('EXT', sx+1, sy+17, EGA.LIGHT_GRAY, 7);
        break;
      }
      case 'cloud': {
        const c = backedUp ? EGA.BRIGHT_CYAN : EGA.LIGHT_GRAY;
        r(sx+4,sy+6,16,8, c);
        r(sx,sy+8,24,6, c);
        r(sx+8,sy+2,10,8, c);
        r(sx+16,sy+4,8,6, c);
        if(backedUp) r(sx+8,sy+6,8,3, EGA.DARK_GREEN);
        txt('CLOUD', sx-2, sy+20, backedUp?EGA.BRIGHT_GREEN:EGA.WHITE, 7);
        break;
      }
      case 'usb': {
        r(sx,sy,8,16, EGA.DARK_MAGENTA);
        r(sx+1,sy+1,6,14, backedUp?EGA.DARK_GREEN:EGA.DARK_GRAY);
        r(sx+2,sy+13,4,5, EGA.LIGHT_GRAY);
        if(backedUp) r(sx+2,sy+5,4,6, EGA.BRIGHT_GREEN);
        txt('USB', sx-2, sy+24, EGA.LIGHT_GRAY, 7);
        break;
      }
    }
  }

  // Dead node (destroyed by disaster)
  function deadNode(type, sx, sy) {
    sx=Math.round(sx); sy=Math.round(sy);
    // Draw as charred/grey version
    r(sx,sy,24,18, EGA.DARK_GRAY);
    r(sx+2,sy+2,20,14, EGA.BLACK);
    txt('X', sx+6, sy+14, EGA.BRIGHT_RED, 12);
  }

  // Enemy sprites
  function enemy(type, sx, sy, frame) {
    sx=Math.round(sx); sy=Math.round(sy);
    switch(type) {
      case 'corruption':
        r(sx+2,sy,8,8, frame?EGA.BRIGHT_RED:EGA.DARK_RED);
        r(sx,sy+2,12,4, frame?EGA.BRIGHT_RED:EGA.DARK_RED);
        r(sx+3,sy+2,2,2, EGA.BLACK); r(sx+7,sy+2,2,2, EGA.BLACK);
        r(sx+3,sy+6,6,1, EGA.BLACK);
        break;
      case 'bat':
        r(sx,sy+3,5,5, EGA.DARK_MAGENTA);
        r(sx+9,sy+3,5,5, EGA.DARK_MAGENTA);
        r(sx+4,sy,6,8, EGA.DARK_GRAY);
        r(sx+5,sy+2,2,2, EGA.BRIGHT_RED);
        break;
    }
  }

  // Flash overlay
  function flash(color, alpha) {
    ctx.globalAlpha = alpha;
    r(0,0,CW,GAME_H,color);
    ctx.globalAlpha = 1;
  }

  function getCtx() { return ctx; }
  return { init, r, clear, txt, txtCenter, tileMap, sky, player, dataFile, node, deadNode, enemy, flash, getCtx };
})();
