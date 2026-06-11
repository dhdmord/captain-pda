const HUD = (() => {
  function draw(lvl) {
    UI.setHud(lvl);
  }

  function drawNotification(n, camX, alpha) {
    const ctx = R.getCtx();
    ctx.globalAlpha = alpha;
    R.txt(n.text, n.x - camX, n.y, n.color, 10);
    ctx.globalAlpha = 1;
  }

  return { draw, drawNotification };
})();
