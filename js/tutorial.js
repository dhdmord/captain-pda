class TutorialSystem {
  constructor(messages) {
    this.messages = messages;
    this.queue    = [];
    this.current  = null;
    this._prevEnter = false;
  }

  trigger(triggerName) {
    const msg = this.messages.find(m => m.trigger === triggerName);
    if(msg) this.queue.push(msg);
    if(!this.current && this.queue.length > 0) this._next();
  }

  _next() {
    this.current = this.queue.shift() || null;
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
    R.popup(this.current.lines, EGA.BRIGHT_CYAN);
  }
}
