const UI = (() => {
  let screenEl, hudEl;

  function init() {
    screenEl = document.getElementById('ui-screen');
    hudEl    = document.getElementById('ui-hud');
  }

  function clearScreen() { screenEl.innerHTML = ''; }
  function clearHud()    { hudEl.innerHTML = ''; }

  function setTitle() {
    clearHud();
    screenEl.innerHTML = `
      <div class="ui-title-wrap">
        <div class="ui-title-box">
          <div class="t-main">CAPTAIN</div>
          <div class="t-sub">PDA</div>
          <div class="t-desc">Personal Digital Archiving Adventure</div>
          <div class="t-start blink">PRESS ENTER TO START</div>
          <div class="t-controls">&#8592; &#8594; MOVE &nbsp;|&nbsp; &#8593; / SPACE JUMP &nbsp;|&nbsp; Z BACKUP &nbsp;|&nbsp; ENTER CONFIRM</div>
        </div>
      </div>`;
  }

  function setHud(lvl) {
    const timerVal   = Math.ceil(lvl.timer);
    const timerColor = lvl.timer <= 12
      ? (Math.floor(lvl.timer * 4) % 2 === 0 ? '#FF5555' : '#FFFF55')
      : '#55FFFF';
    const held = lvl.player.inventory.size;

    const slots = lvl.data.fileSpawns.map(({id}) => {
      const file     = lvl.files.find(f => f.id === id);
      const inBag    = lvl.player.inventory.has(id);
      const deposits = lvl.nodes.filter(n => n.deposits.has(id));
      const copies   = deposits.length;
      const mediaOk  = new Set(deposits.map(n => n.mediaType)).size >= 2;
      const offsite  = deposits.some(n => n.isOffsite);
      const iconBg   = !file.collected ? '#333333' : inBag ? '#FFFF55' : '#55FFFF';
      const dots     = [0,1,2].map(c =>
        `<span class="cdot" style="background:${c < copies ? '#55FF55' : '#333333'}"></span>`
      ).join('');
      return `<div class="hf-slot">
        <span class="fi" style="background:${iconBg}"></span>
        ${dots}
        <span class="hbadge" style="color:${mediaOk ? '#55FF55' : '#AAAAAA'}">${mediaOk ? '2M' : '--'}</span>
        <span class="hbadge" style="color:${offsite  ? '#55FF55' : '#AAAAAA'}">${offsite  ? 'OFS' : '---'}</span>
      </div>`;
    }).join('');

    hudEl.innerHTML = `
      <div class="ui-hud-bar">
        <div class="hud-l">
          <div class="hud-lvname">${lvl.data.name}</div>
          <div class="hud-lvsub">${lvl.data.subtitle}</div>
        </div>
        <div class="hud-files">${slots}</div>
        <div class="hud-r">
          <div class="hud-time-lbl">TIME:</div>
          <div class="hud-timer" style="color:${timerColor}">${timerVal.toString().padStart(2,'0')}</div>
          ${held > 0 ? `<div class="hud-bag">BAG:${held}</div>` : ''}
        </div>
      </div>`;
  }

  function setTutorial(lines) {
    const body = lines.map(({text: t, color: c = '#FFFFFF', size: sz = 5}) => {
      if (!t) return `<div style="height:10px"></div>`;
      const px = sz <= 4 ? 24 : sz <= 5 ? 26 : sz <= 6 ? 28 : sz <= 7 ? 34 : sz <= 8 ? 42 : 52;
      return `<div style="color:${c};font-size:${px}px;line-height:1.2;margin-bottom:2px">${t}</div>`;
    }).join('');
    screenEl.innerHTML = `
      <div class="ui-popup-wrap">
        <div class="ui-popup">${body}</div>
      </div>`;
  }

  function setResult(disasterTitle, disasterColor, fileResults, levelData) {
    clearHud();
    const anyLost = fileResults.some(f => f.collected && !f.safe);
    const msgs    = anyLost ? levelData.disasterMessage : levelData.winMessage;

    const rows = fileResults.map(f => {
      if (!f.collected) {
        return `<div class="res-row" style="color:#AAAAAA">FILE ${f.id+1}: not collected</div>`;
      }
      const lbl = f.full321 ? '3-2-1 OK' : f.safe ? 'PARTIAL' : 'LOST!';
      const lc  = f.full321 ? '#55FF55'   : f.safe ? '#FFFF55' : '#FF5555';
      const cpC = f.copies >= 3 ? '#55FF55' : '#AAAAAA';
      const mC  = f.media  >= 2 ? '#55FF55' : '#AAAAAA';
      const oC  = f.offsite     ? '#55FF55' : '#AAAAAA';
      return `<div class="res-row">
        <span style="color:#FFFFFF">FILE ${f.id+1}:</span>
        <span style="color:${cpC}">${f.copies}cp</span>
        <span style="color:${mC}">${f.media}med</span>
        <span style="color:${oC}">${f.offsite ? 'OFS' : '...'}</span>
        <span style="color:${lc}">${lbl}</span>
      </div>`;
    }).join('');

    const msgHtml = msgs.map((line, i) => {
      if (!line) return `<div style="height:6px"></div>`;
      return `<div class="res-msg" style="color:${i === 0 ? '#FFFF55' : '#FFFFFF'}">${line}</div>`;
    }).join('');

    screenEl.innerHTML = `
      <div class="ui-result">
        <div class="res-title" style="color:${disasterColor}">${disasterTitle}</div>
        <hr class="ui-hr">
        <div class="res-files">${rows}</div>
        <hr class="ui-hr">
        <div class="res-msgs">${msgHtml}</div>
        <div class="res-prompt blink">PRESS ENTER TO CONTINUE</div>
      </div>`;
  }

  function setVictory(score) {
    clearHud();
    screenEl.innerHTML = `
      <div class="ui-victory">
        <div class="v-title">CONGRATULATIONS!</div>
        <div class="v-sub">YOU ARE A DIGITAL PRESERVATION HERO!</div>
        <hr class="ui-hr" style="width:100%;border-color:#55FFFF">
        <div class="v-rule-hdr">THE 3-2-1 RULE:</div>
        <div class="v-rule">3 COPIES of your important data</div>
        <div class="v-rule">2 DIFFERENT storage media types</div>
        <div class="v-rule">1 copy stored OFFSITE</div>
        <hr class="ui-hr" style="width:100%;border-color:#55FFFF">
        <div class="v-score">FINAL SCORE: ${score}</div>
        <div class="v-prompt blink">PRESS ENTER TO PLAY AGAIN</div>
      </div>`;
  }

  return { init, clearScreen, clearHud, setTitle, setHud, setTutorial, setResult, setVictory };
})();
