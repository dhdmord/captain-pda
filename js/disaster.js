const Disaster = (() => {
  let phase   = 'none'; // 'flash' | 'result'
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
      R.txtCenter(result.disasterTitle, 85, result.disasterColor, 20);
      ctx.globalAlpha = 1;
    }
  }

  function drawResult() {
    R.clear(); // canvas is black; HTML overlay shows result content
  }

  function getResult() { return result; }
  function reset() { phase='none'; timer=0; result=null; flashAlpha=0; }

  return { start, update, drawFlash, drawResult, getResult, reset };
})();
