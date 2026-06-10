// ── Game State Machine ───────────────────────────────────────────────────────
const Game = (() => {
  let state      = 'title';   // title | playing | disaster_flash | result | victory
  let levelIndex = 0;
  let score      = 0;
  let lvl        = null;
  let lastTime   = 0;
  let titleBlink = 0;

  const keys     = {};
  const prevKeys = {};

  function init() {
    const canvas = document.getElementById('game');
    R.init(canvas);

    document.addEventListener('keydown', e => {
      keys[e.code] = true;
      Audio.init(); // unlock audio on first keypress
      e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });

    requestAnimationFrame(loop);
  }

  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;
    update(dt);
    render();
    // Copy key state for "just pressed" detection
    Object.keys(keys).forEach(k => { keys['_prev'+k] = prevKeys[k]; prevKeys[k] = keys[k]; });
    requestAnimationFrame(loop);
  }

  function justPressed(code) {
    return keys[code] && !prevKeys[code];
  }

  function update(dt) {
    titleBlink += dt;

    switch(state) {
      case 'title':
        if(justPressed('Enter') || justPressed('Space')) {
          levelIndex = 0;
          score      = 0;
          startLevel(0);
        }
        break;

      case 'playing': {
        // Pass prev-Z detection into keys object for player.js
        keys['_prevZ'] = prevKeys['KeyZ'];
        const result = lvl.update(dt, keys);
        if(result === 'disaster') {
          const computed = lvl.computeResult();
          Disaster.start(computed);
          state = 'disaster_flash';
        }
        break;
      }

      case 'disaster_flash': {
        const dPhase = Disaster.update(dt);
        if(dPhase === 'result') { state = 'result'; }
        break;
      }

      case 'result':
        Disaster.update(dt);
        if(justPressed('Enter') || justPressed('Space')) {
          const dr = Disaster.getResult();
          // Score: 100 per surviving copy, 200 bonus per full 3-2-1 file
          dr.fileResults.forEach(f => {
            if(f.collected) {
              score += f.copies * 50;
              if(f.full321) score += 200;
            }
          });
          Disaster.reset();
          if(levelIndex >= LEVEL_DATA.length - 1) {
            state = 'victory';
          } else {
            levelIndex++;
            startLevel(levelIndex);
          }
        }
        break;

      case 'victory':
        if(justPressed('Enter') || justPressed('Space')) {
          state = 'title';
        }
        break;
    }
  }

  function startLevel(index) {
    lvl   = new LevelState(index);
    state = 'playing';
  }

  function render() {
    switch(state) {
      case 'title':        drawTitle();              break;
      case 'playing':      lvl.draw();               break;
      case 'disaster_flash': Disaster.drawFlash(lvl); break;
      case 'result':       Disaster.drawResult(lvl, levelIndex); break;
      case 'victory':      drawVictory();            break;
    }
  }

  function drawTitle() {
    R.clear(EGA.BLACK);

    // Stars
    R.sky();

    // Title box
    R.r(20,30,280,100, EGA.DARK_BLUE);
    R.r(20,30,280,2, EGA.BRIGHT_CYAN);
    R.r(20,128,280,2, EGA.BRIGHT_CYAN);
    R.r(20,30,2,100, EGA.BRIGHT_CYAN);
    R.r(298,30,2,100, EGA.BRIGHT_CYAN);

    R.txtCenter('CAPTAIN', 52, EGA.BRIGHT_YELLOW, 12);
    R.txtCenter('PDA', 72, EGA.BRIGHT_CYAN, 16);

    R.txtCenter('Personal Digital Archiving', 90, EGA.LIGHT_GRAY, 4);
    R.txtCenter('Adventure', 100, EGA.LIGHT_GRAY, 4);

    if(Math.floor(titleBlink * 2) % 2 === 0) {
      R.txtCenter('PRESS ENTER TO START', 118, EGA.BRIGHT_GREEN, 5);
    }

    // Controls reminder
    R.r(0,HUD_Y,CW,HUD_H,EGA.BLACK);
    R.r(0,HUD_Y,CW,1,EGA.DARK_GRAY);
    R.txt('ARROWS: MOVE/JUMP', 10, HUD_Y+12, EGA.DARK_GRAY, 4);
    R.txt('Z: BACKUP', 10, HUD_Y+24, EGA.DARK_GRAY, 4);
    R.txt('SAVE DATA. SAVE THE WORLD.', 140, HUD_Y+18, EGA.DARK_CYAN, 4);

    // Draw a tiny Captain PDA on title screen
    R.player(148, 138, true, 0, true);
  }

  function drawVictory() {
    R.clear(EGA.DARK_BLUE);
    R.r(0,0,CW,2,EGA.BRIGHT_CYAN);
    R.r(0,CH-2,CW,2,EGA.BRIGHT_CYAN);

    R.txtCenter('CONGRATULATIONS!', 28, EGA.BRIGHT_YELLOW, 8);
    R.txtCenter('YOU ARE A DIGITAL', 50, EGA.BRIGHT_GREEN, 6);
    R.txtCenter('PRESERVATION HERO!', 62, EGA.BRIGHT_GREEN, 6);

    R.r(20,76,280,1,EGA.DARK_GRAY);

    R.txtCenter('THE 3-2-1 RULE:', 92, EGA.BRIGHT_CYAN, 6);
    R.txt('3 COPIES of your important data', 14, 108, EGA.WHITE, 5);
    R.txt('2 DIFFERENT storage media types', 14, 122, EGA.WHITE, 5);
    R.txt('1 copy stored OFFSITE', 14, 136, EGA.WHITE, 5);

    R.r(20,146,280,1,EGA.DARK_GRAY);

    R.txtCenter(`FINAL SCORE: ${score}`, 158, EGA.BRIGHT_YELLOW, 6);

    if(Math.floor(titleBlink * 2) % 2 === 0) {
      R.txtCenter('PRESS ENTER TO PLAY AGAIN', 184, EGA.BRIGHT_GREEN, 4);
    }

    // Draw celebratory Captain PDA
    R.player(22, 152, true, Math.floor(titleBlink*4)%2, true);
    R.player(284, 152, false, Math.floor(titleBlink*4)%2, true);
  }

  return { init };
})();

window.addEventListener('load', () => Game.init());
