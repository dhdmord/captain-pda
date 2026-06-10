const Disaster = (() => {
  let phase   = 'none'; // 'flash' | 'pause' | 'result'
  let timer   = 0;
  let result  = null;
  let flashAlpha = 0;

  function start(computedResult) {
    phase      = 'flash';
    timer      = 0;
    result     = computedResult;
    flashAlpha = 0;
    Audio.disaster();
  }

  function update(dt) {
    timer += dt;
    if(phase === 'flash') {
      flashAlpha = Math.min(1, timer * 3);
      if(timer > 1.2) { phase = 'result'; timer = 0; }
    }
    return phase;
  }

  function drawFlash(lvl) {
    lvl.draw();
    R.flash(result.disasterColor, flashAlpha * 0.8);
    const alpha = Math.min(1, timer * 4);
    if(alpha > 0.3) {
      const ctx = R.getCtx();
      ctx.globalAlpha = alpha;
      R.txtCenter(result.disasterTitle, 80, result.disasterColor, 14);
      ctx.globalAlpha = 1;
    }
  }

  function drawResult(lvl, levelIndex) {
    R.clear();
    // Title
    R.txtCenter(result.disasterTitle, 16, result.disasterColor, 9);
    R.r(0,22,CW,1,EGA.DARK_GRAY);

    // File results
    const fr = result.fileResults;
    const yBase = 32;
    fr.forEach((f, i) => {
      const fy = yBase + i * 22;
      if(!f.collected) {
        R.txt(`FILE ${f.id+1}: not collected`, 8, fy+7, EGA.DARK_GRAY, 4);
        return;
      }
      const label = f.full321 ? '3-2-1 OK' : f.safe ? 'PARTIAL' : 'LOST!';
      const col   = f.full321 ? EGA.BRIGHT_GREEN : f.safe ? EGA.BRIGHT_YELLOW : EGA.BRIGHT_RED;
      R.txt(`FILE ${f.id+1}:`, 8, fy+7, EGA.WHITE, 4);
      R.txt(`${f.copies}cp`, 70, fy+7, f.copies>=3?EGA.BRIGHT_GREEN:EGA.DARK_GRAY, 4);
      R.txt(`${f.media}med`, 100, fy+7, f.media>=2?EGA.BRIGHT_GREEN:EGA.DARK_GRAY, 4);
      R.txt(f.offsite?'OFS':'...', 142, fy+7, f.offsite?EGA.BRIGHT_GREEN:EGA.DARK_GRAY, 4);
      R.txt(label, 175, fy+7, col, 4);
    });

    const msgY = yBase + fr.length * 22 + 4;
    R.r(0, msgY, CW, 1, EGA.DARK_GRAY);

    // Educational message
    const data = LEVEL_DATA[levelIndex];
    const anyLost    = fr.some(f => f.collected && !f.safe);
    const msgs = anyLost ? data.disasterMessage : data.winMessage;
    msgs.forEach((line, i) => {
      if(!line) return;
      const c = i===0 ? EGA.BRIGHT_YELLOW : EGA.WHITE;
      R.txt(line, 8, msgY + 10 + i*10, c, 4);
    });

    const promptY = CH - 14;
    const blink = Math.floor(timer * 3) % 2 === 0;
    if(blink) R.txtCenter('PRESS ENTER TO CONTINUE', promptY, EGA.BRIGHT_CYAN, 4);
  }

  function getResult() { return result; }
  function reset() { phase='none'; timer=0; result=null; flashAlpha=0; }

  return { start, update, drawFlash, drawResult, getResult, reset };
})();
