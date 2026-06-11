const Game = (() => {
  let state      = 'title';
  let prevState  = null;
  let levelIndex = 0;
  let score      = 0;
  let lvl        = null;
  let lastTime   = 0;

  const keys     = {};
  const prevKeys = {};

  function init() {
    const canvas = document.getElementById('game');
    R.init(canvas);
    UI.init();

    document.addEventListener('keydown', e => {
      keys[e.code] = true;
      Audio.init();
      e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });

    requestAnimationFrame(loop);
  }

  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    // On state entry, set up the HTML overlay once
    if(state !== prevState) {
      onStateEnter(state);
      prevState = state;
    }

    update(dt);
    render();

    Object.keys(keys).forEach(k => { keys['_prev'+k] = prevKeys[k]; prevKeys[k] = keys[k]; });
    requestAnimationFrame(loop);
  }

  function onStateEnter(s) {
    switch(s) {
      case 'title':
        UI.setTitle();
        break;
      case 'playing':
        UI.clearScreen();
        break;
      case 'result': {
        const dr = Disaster.getResult();
        UI.setResult(dr.disasterTitle, dr.disasterColor, dr.fileResults, LEVEL_DATA[levelIndex]);
        break;
      }
      case 'victory':
        UI.setVictory(score);
        break;
    }
  }

  function justPressed(code) {
    return keys[code] && !prevKeys[code];
  }

  function update(dt) {
    switch(state) {
      case 'title':
        if(justPressed('Enter') || justPressed('Space')) {
          levelIndex = 0;
          score      = 0;
          startLevel(0);
        }
        break;

      case 'playing': {
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
      case 'title':          drawTitle();              break;
      case 'playing':        lvl.draw();               break;
      case 'disaster_flash': Disaster.drawFlash(lvl);  break;
      case 'result':         Disaster.drawResult();    break;
      case 'victory':        drawVictory();            break;
    }
  }

  // Canvas background only — text is in HTML overlay
  function drawTitle() {
    R.clear(EGA.BLACK);
    R.sky();
    // Captain PDA sprite on the title screen
    R.player(148, 138, true, 0, true);
  }

  // Canvas background only — text is in HTML overlay
  function drawVictory() {
    R.clear(EGA.DARK_BLUE);
    R.r(0,0,CW,2,EGA.BRIGHT_CYAN);
    R.r(0,CH-2,CW,2,EGA.BRIGHT_CYAN);
  }

  return { init };
})();

window.addEventListener('load', () => Game.init());
