class TutorialSystem {
  constructor(messages) {
    this.messages    = messages;
    this.queue       = [];
    this.current     = null;
    this._lastDrawn  = null;
    this._prevEnter  = false;
  }

  trigger(triggerName) {
    const msg = this.messages.find(m => m.trigger === triggerName);
    if(msg) this.queue.push(msg);
    if(!this.current && this.queue.length > 0) this._next();
  }

  _next() {
    this.current = this.queue.shift() || null;
    if(!this.current) {
      UI.clearScreen();
      this._lastDrawn = null;
    }
  }

  isActive() { return this.current !== null; }

  update(keys) {
    const enterNow = keys['Enter'] || keys['Space'];
    if(enterNow && !this._prevEnter) {
      this._next();
    }
    this._prevEnter = enterNow;
  }

  draw() {
    if(!this.current) return;
    if(this.current !== this._lastDrawn) {
      UI.setTutorial(this.current.lines);
      this._lastDrawn = this.current;
    }
  }
}
