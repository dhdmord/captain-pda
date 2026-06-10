const HUD = (() => {
  function draw(lvl) {
    const y = GAME_H; // 160
    // Background panel
    R.r(0, y, CW, HUD_H, EGA.BLACK);
    R.r(0, y, CW, 1, EGA.DARK_GRAY);

    // Level name & timer
    const timerStr = Math.ceil(lvl.timer).toString().padStart(2,'0');
    const timerCol = lvl.timer <= 12 ? (Math.floor(lvl.timer*4)%2===0 ? EGA.BRIGHT_RED : EGA.BRIGHT_YELLOW) : EGA.BRIGHT_CYAN;
    R.txt(lvl.data.name, 4, y+10, EGA.WHITE, 5);
    R.txt('TIME:', 200, y+10, EGA.LIGHT_GRAY, 5);
    R.txt(timerStr, 240, y+10, timerCol, 5);

    // Files HUD: show each file with status
    const fileIds = lvl.data.fileSpawns.map(f=>f.id);
    const totalFiles = fileIds.length;
    const slotW = Math.floor((CW - 8) / totalFiles);
    fileIds.forEach((id, i) => {
      const x = 4 + i * slotW;
      const fy = y + 18;
      const file = lvl.files.find(f=>f.id===id);
      const heldByPlayer = lvl.player.inventory.has(id);
      const deposits = lvl.nodes.filter(n=>n.deposits.has(id));
      const copies   = deposits.length;

      // File icon
      if(!file.collected) {
        R.r(x, fy+3, 6, 6, EGA.DARK_GRAY); // uncollected, dim
      } else if(heldByPlayer) {
        R.r(x, fy+3, 6, 6, EGA.BRIGHT_YELLOW); // in inventory, yellow
      } else {
        R.r(x, fy+3, 6, 6, EGA.BRIGHT_CYAN);   // deposited somewhere
      }

      // Copy count indicators
      for(let c=0; c<3; c++) {
        const col = c < copies ? EGA.BRIGHT_GREEN : EGA.DARK_GRAY;
        R.r(x + 8 + c*6, fy+4, 4, 4, col);
      }

      // Media diversity & offsite
      const mediaTypes = new Set(deposits.map(n=>n.mediaType));
      const hasOffsite = deposits.some(n=>n.isOffsite);
      const mediaOk    = mediaTypes.size >= 2;
      R.txt(mediaOk?'2M':'..', x+8, fy+12, mediaOk?EGA.BRIGHT_GREEN:EGA.DARK_GRAY, 4);
      R.txt(hasOffsite?'OFS':'...', x+24, fy+12, hasOffsite?EGA.BRIGHT_GREEN:EGA.DARK_GRAY, 4);
    });

    // Inventory indicator
    const held = lvl.player.inventory.size;
    if(held > 0) {
      R.txt(`BAG:${held}`, 272, y+28, EGA.BRIGHT_YELLOW, 4);
    }
  }

  function drawNotification(n, camX, alpha) {
    const ctx = R.getCtx();
    ctx.globalAlpha = alpha;
    R.txt(n.text, n.x - camX, n.y, n.color, 5);
    ctx.globalAlpha = 1;
  }

  return { draw, drawNotification };
})();
