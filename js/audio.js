const Audio = (() => {
  let ctx = null;

  function init() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function tone(freq, dur, type = 'square', vol = 0.12, delay = 0) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur);
  }

  return {
    init,
    collect()   { init(); tone(880,0.08); tone(1100,0.1,undefined,undefined,0.08); },
    deposit()   { init(); tone(440,0.05); tone(660,0.05,undefined,undefined,0.07); tone(880,0.12,undefined,undefined,0.14); },
    jump()      { init(); const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type='square'; o.frequency.setValueAtTime(300,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(550,ctx.currentTime+0.14); g.gain.setValueAtTime(0.1,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.14); o.start(); o.stop(ctx.currentTime+0.14); },
    warn()      { init(); tone(880,0.07); tone(880,0.07,undefined,undefined,0.18); },
    disaster()  { init(); [200,180,160,140,120,100].forEach((f,i) => tone(f,0.18,'sawtooth',0.18,i*0.14)); },
    win()       { init(); [523,659,784,1047].forEach((f,i) => tone(f,0.18,undefined,0.15,i*0.15)); },
    lose()      { init(); [400,350,300,250].forEach((f,i) => tone(f,0.18,'sawtooth',0.15,i*0.15)); },
    hit()       { init(); tone(200,0.15,'sawtooth',0.2); },
  };
})();
