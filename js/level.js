function makeRow(n, v) { return Array(n).fill(v); }
function makeMap(rows) { return rows.flat(); }

const LEVEL_DATA = [
  // ── LEVEL 1: One Copy Is Never Enough ──────────────────────────────────────
  {
    name: 'LEVEL 1',
    subtitle: 'One Copy Is Never Enough',
    mapW: 40, mapH: 10,
    tiles: makeMap([
      makeRow(40,0),
      makeRow(40,0),
      makeRow(40,0),
      [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0],
      makeRow(40,0),
      [0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0],
      makeRow(40,0),
      makeRow(40,0),
      makeRow(40,0),
      makeRow(40,1),
    ]),
    fileSpawns: [{id:0,tx:5,ty:8},{id:1,tx:17,ty:8},{id:2,tx:31,ty:8}],
    nodeSpawns: [
      {id:'n0',type:'hdd',tx:36,ty:8,mediaType:'A',isOffsite:false},
    ],
    enemySpawns: [],
    timer: 55,
    disasterType: 'fire',
    tutorial: [
      {trigger:'start', lines:[
        {text:'CAPTAIN PDA!', color: EGA.BRIGHT_CYAN, size:8},
        {text:'', size:4},
        {text:'You are a DIGITAL ARCHIVIST guarding precious data from disaster!', size:4},
        {text:'', size:4},
        {text:'Collect DATA FILES (floppies) and back them up to STORAGE NODES before disaster strikes!', size:4},
        {text:'', size:4},
        {text:'ARROW KEYS: move & jump', color:EGA.BRIGHT_YELLOW, size:4},
        {text:'Z near a node: back up files', color:EGA.BRIGHT_YELLOW, size:4},
        {text:'', size:4},
        {text:'>>> PRESS ENTER <<<', color:EGA.BRIGHT_GREEN, size:5},
      ]},
      {trigger:'firstCollect', lines:[
        {text:'FILE COLLECTED!', color:EGA.BRIGHT_YELLOW, size:7},
        {text:'', size:4},
        {text:'Now walk to the HARD DRIVE node on the right and press Z to back it up.', size:4},
        {text:'', size:4},
        {text:'The counter at the bottom shows your backup status.', size:4},
        {text:'', size:4},
        {text:'>>> PRESS ENTER <<<', color:EGA.BRIGHT_GREEN, size:5},
      ]},
      {trigger:'firstDeposit', lines:[
        {text:'BACKED UP!', color:EGA.BRIGHT_GREEN, size:7},
        {text:'', size:4},
        {text:'You have 1 copy. But is that safe?', size:4},
        {text:'', size:4},
        {text:'The 3-2-1 RULE says:', color:EGA.BRIGHT_YELLOW, size:5},
        {text:'3 copies of your data', size:4},
        {text:'on 2 different media types', size:4},
        {text:'with 1 copy stored OFFSITE', size:4},
        {text:'', size:4},
        {text:'This level only has 1 HDD...', color:EGA.BRIGHT_RED, size:4},
        {text:'Watch what happens!', color:EGA.BRIGHT_RED, size:4},
        {text:'', size:4},
        {text:'>>> PRESS ENTER <<<', color:EGA.BRIGHT_GREEN, size:5},
      ]},
    ],
    disasterTitle: 'FIRE!',
    disasterColor: EGA.BRIGHT_RED,
    disasterDestroys: n => !n.isOffsite,
    disasterMessage: [
      'The fire destroyed your only HDD!',
      'All your data is GONE.',
      '',
      'LOCKSS reminds us: Lots Of Copies',
      'Keeps Stuff Safe!',
      '',
      'You need MORE THAN 1 COPY.',
    ],
    winMessage: [
      'Your copies survived the fire!',
      '(This was rigged for the lesson.',
      'In the real world, fire takes',
      'all your local drives too!)',
    ],
  },

  // ── LEVEL 2: Different Media Matters ───────────────────────────────────────
  {
    name: 'LEVEL 2',
    subtitle: 'Different Media Matters',
    mapW: 42, mapH: 10,
    tiles: makeMap([
      makeRow(42,0),
      makeRow(42,0),
      [0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      makeRow(42,0),
      [0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0],
      makeRow(42,0),
      [0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0],
      makeRow(42,0),
      makeRow(42,0),
      makeRow(42,1),
    ]),
    fileSpawns: [{id:0,tx:4,ty:8},{id:1,tx:13,ty:8},{id:2,tx:24,ty:8},{id:3,tx:35,ty:8}],
    nodeSpawns: [
      {id:'n0',type:'hdd',     tx:8, ty:8,mediaType:'A',isOffsite:false},
      {id:'n1',type:'hdd',     tx:19,ty:8,mediaType:'A',isOffsite:false},
      {id:'n2',type:'external',tx:30,ty:8,mediaType:'B',isOffsite:false},
    ],
    enemySpawns: [
      {type:'corruption',tx:15,ty:8,dir:1,range:6},
    ],
    timer: 65,
    disasterType: 'power_surge',
    tutorial: [],
    disasterTitle: 'POWER SURGE!',
    disasterColor: EGA.BRIGHT_YELLOW,
    disasterDestroys: n => n.mediaType === 'A',
    disasterMessage: [
      'A power surge fried both HDDs!',
      '(They are the same media type: A)',
      '',
      'Files backed up to the EXTERNAL',
      'DRIVE (media type B) survived!',
      '',
      '3-2-1: Use 2 DIFFERENT media types',
      'so one failure cannot wipe all copies.',
    ],
    winMessage: [
      'Great work! Your external drive',
      'backup survived the power surge!',
      '',
      'Different media types protect',
      'against single-type failures.',
    ],
  },

  // ── LEVEL 3: Go Offsite ────────────────────────────────────────────────────
  {
    name: 'LEVEL 3',
    subtitle: 'Go Offsite',
    mapW: 44, mapH: 10,
    tiles: makeMap([
      makeRow(44,0),
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      makeRow(44,0),
      [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
      makeRow(44,0),
      [0,0,0,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0],
      makeRow(44,0),
      makeRow(44,0),
      makeRow(44,0),
      makeRow(44,1),
    ]),
    fileSpawns: [{id:0,tx:3,ty:8},{id:1,tx:12,ty:8},{id:2,tx:22,ty:8},{id:3,tx:34,ty:8}],
    nodeSpawns: [
      {id:'n0',type:'hdd',     tx:7, ty:8, mediaType:'A',isOffsite:false},
      {id:'n1',type:'external',tx:18,ty:8, mediaType:'B',isOffsite:false},
      {id:'n2',type:'cloud',   tx:19,ty:1, mediaType:'B',isOffsite:true},
    ],
    enemySpawns: [
      {type:'corruption',tx:10,ty:8,dir:1,range:5},
      {type:'bat',       tx:25,ty:6,dir:-1,range:6},
    ],
    timer: 70,
    disasterType: 'ransomware',
    tutorial: [],
    disasterTitle: 'RANSOMWARE!',
    disasterColor: EGA.BRIGHT_MAGENTA,
    disasterDestroys: n => !n.isOffsite,
    disasterMessage: [
      'Ransomware encrypted all local',
      'drives! HDD and External Drive',
      'are both locked.',
      '',
      'Only your CLOUD backup survived!',
      '(It is stored OFFSITE)',
      '',
      '3-2-1: Keep 1 copy OFFSITE so',
      'local disasters cannot reach it.',
    ],
    winMessage: [
      'Your cloud backup survived',
      'the ransomware attack!',
      '',
      'Offsite storage is immune to',
      'local disasters. Always keep',
      '1 copy somewhere else!',
    ],
  },

  // ── LEVEL 4: The 3-2-1 Champion ───────────────────────────────────────────
  {
    name: 'LEVEL 4',
    subtitle: 'The 3-2-1 Champion',
    mapW: 48, mapH: 10,
    tiles: makeMap([
      makeRow(48,0),
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      makeRow(48,0),
      [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
      makeRow(48,0),
      [0,0,2,2,2,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0],
      makeRow(48,0),
      makeRow(48,0),
      makeRow(48,0),
      makeRow(48,1),
    ]),
    fileSpawns: [
      {id:0,tx:3,ty:8},{id:1,tx:11,ty:8},{id:2,tx:20,ty:8},
      {id:3,tx:30,ty:8},{id:4,tx:40,ty:8},
    ],
    nodeSpawns: [
      {id:'n0',type:'hdd',     tx:7,  ty:8, mediaType:'A',isOffsite:false},
      {id:'n1',type:'hdd',     tx:16, ty:8, mediaType:'A',isOffsite:false},
      {id:'n2',type:'external',tx:25, ty:8, mediaType:'B',isOffsite:false},
      {id:'n3',type:'usb',     tx:35, ty:8, mediaType:'B',isOffsite:false},
      {id:'n4',type:'cloud',   tx:23, ty:1, mediaType:'B',isOffsite:true},
    ],
    enemySpawns: [
      {type:'corruption',tx:12,ty:8,dir:1,range:5},
      {type:'bat',       tx:28,ty:6,dir:-1,range:6},
      {type:'corruption',tx:38,ty:8,dir:1,range:4},
    ],
    timer: 75,
    disasterType: 'random',
    tutorial: [],
    disasterTitle: 'DISASTER!',
    disasterColor: EGA.BRIGHT_RED,
    disasterDestroys: null, // set dynamically
    disasterMessage: [],
    winMessage: [
      'Perfect 3-2-1 compliance!',
      'Your data is safe no matter',
      'what disaster strikes.',
      '',
      'You are a DIGITAL PRESERVATION',
      'HERO!',
    ],
  },
];

class LevelState {
  constructor(index) {
    this.index       = index;
    this.data        = LEVEL_DATA[index];
    this.map         = { w: this.data.mapW, h: this.data.mapH, tiles: this.data.tiles };
    this.cameraX     = 0;
    this.timer       = this.data.timer;
    this.warnPlayed  = false;
    this.done        = false;

    this.files   = this.data.fileSpawns.map(f => new DataFile(f.id, f.tx, f.ty));
    this.nodes   = this.data.nodeSpawns.map(n =>
      new StorageNode(n.id, n.type, n.tx, n.ty, n.mediaType, n.isOffsite));
    this.enemies = this.data.enemySpawns.map(e =>
      new Enemy(e.type, e.tx, e.ty, e.dir, e.range));
    this.player  = new Player(1, 7);

    this.notifications = [];
    this.tutorial  = new TutorialSystem(this.data.tutorial);
    this.firstCollectFired  = false;
    this.firstDepositFired  = false;
    this._startTutorial();
  }

  _startTutorial() {
    if(this.data.tutorial.length > 0) {
      this.tutorial.trigger('start');
    }
  }

  onFileCollected(id) {
    if(!this.firstCollectFired) {
      this.firstCollectFired = true;
      this.tutorial.trigger('firstCollect');
    }
  }

  onDeposit(node) {
    if(!this.firstDepositFired) {
      this.firstDepositFired = true;
      this.tutorial.trigger('firstDeposit');
    }
  }

  onEnemyHit() {
    // Penalty: lose 6 seconds
    this.timer = Math.max(0, this.timer - 6);
    this.addNotification('-6s!', this.player.x, this.player.y - 12, EGA.BRIGHT_RED);
  }

  addNotification(text, x, y, color) {
    this.notifications.push({ text, x, y, color, life: 1.4, maxLife: 1.4 });
  }

  update(dt, keys) {
    if(this.tutorial.isActive()) { this.tutorial.update(keys); return 'tutorial'; }
    if(this.done) return 'done';

    this.timer -= dt;
    if(!this.warnPlayed && this.timer <= 12) {
      this.warnPlayed = true;
      Audio.warn();
    }
    if(this.timer <= 0) { this.timer = 0; this.done = true; return 'disaster'; }

    this.files.forEach(f => f.update(dt));
    this.enemies.forEach(e => e.update(dt, this.map));
    this.player.update(dt, this.map, keys, this.nodes, this.files, this.enemies, this);

    // Camera
    const target = this.player.x - CW / 2;
    const maxCam = this.map.w * TILE - CW;
    this.cameraX = Math.max(0, Math.min(maxCam, target));

    // Notifications
    this.notifications = this.notifications.filter(n => {
      n.life -= dt;
      n.y   -= 20 * dt;
      return n.life > 0;
    });

    return 'playing';
  }

  draw() {
    R.sky();
    R.tileMap(this.map, this.cameraX);
    this.files.forEach(f => f.draw(this.cameraX));
    this.nodes.forEach(n => {
      const near = n.alive && n.nearPlayer(this.player.x, this.player.y);
      n.draw(this.cameraX, near);
    });
    this.enemies.forEach(e => e.draw(this.cameraX));
    this.player.draw(this.cameraX);
    this.notifications.forEach(n => {
      const a = n.life / n.maxLife;
      R.r(0,0,0,0,''); // noop to ensure ctx state
      HUD.drawNotification(n, this.cameraX, a);
    });
    HUD.draw(this);
    if(this.tutorial.isActive()) this.tutorial.draw();
  }

  // 3-2-1 compliance per file after disaster
  computeResult() {
    const d = this.data;
    let disasterDestroys = d.disasterDestroys;
    let disasterTitle    = d.disasterTitle;
    let disasterColor    = d.disasterColor;

    // Level 4 random disaster
    if(d.disasterType === 'random') {
      const options = [
        { title:'FIRE!',         color:EGA.BRIGHT_RED,     fn: n => !n.isOffsite },
        { title:'POWER SURGE!',  color:EGA.BRIGHT_YELLOW,  fn: n => n.mediaType==='A' },
        { title:'RANSOMWARE!',   color:EGA.BRIGHT_MAGENTA, fn: n => !n.isOffsite },
        { title:'FLOOD!',        color:EGA.BRIGHT_CYAN,    fn: n => n.mediaType!=='cloud' && !n.isOffsite },
      ];
      const pick = options[Math.floor(Math.random() * options.length)];
      disasterDestroys = pick.fn;
      disasterTitle    = pick.title;
      disasterColor    = pick.color;
    }

    // Apply disaster
    this.nodes.forEach(n => { if(disasterDestroys(n)) n.alive = false; });

    // Collect all file ids
    const allFileIds = this.data.fileSpawns.map(f => f.id);

    const fileResults = allFileIds.map(id => {
      const collected = this.files.find(f=>f.id===id).collected;
      if(!collected) return { id, collected:false, copies:0, media:0, offsite:false, safe:false, full321:false };
      const survivingNodes = this.nodes.filter(n => n.alive && n.deposits.has(id));
      const copies    = survivingNodes.length;
      const mediaSet  = new Set(survivingNodes.map(n=>n.mediaType));
      const offsite   = survivingNodes.some(n=>n.isOffsite);
      const safe      = copies >= 1;
      const full321   = copies >= 3 && mediaSet.size >= 2 && offsite;
      return { id, collected, copies, media: mediaSet.size, offsite, safe, full321 };
    });

    return { disasterTitle, disasterColor, fileResults };
  }
}
