function loop() {
  window.game.update();
  requestAnimationFrame(loop);
}

class Game {
  constructor() {
    this.VIEWPORT_HORIZONTAL_WIDTH = 800;
    this.VIEWPORT_HORIZONTAL_HEIGHT = 600;
    this.canvasElm = document.createElement("canvas");
    this.canvasElm.width = this.VIEWPORT_HORIZONTAL_WIDTH;
    this.canvasElm.height = this.VIEWPORT_HORIZONTAL_HEIGHT;

    this.worldSpaceMatrix = new M3x3();

    this.gl = this.canvasElm.getContext("webgl2");
    this.gl.clearColor(0.4, 0.6, 1.0, 0.0);

    document.body.appendChild(this.canvasElm);

    let vs = document.getElementById("vs_01").innerHTML;
    let fs = document.getElementById("fs_01").innerHTML;

    this.sprite1 = new Sprite(this.gl, "img/manonfire.png", vs, fs, {
      width: 48,
      height: 48,
    });
    this.sprite2 = new Sprite(this.gl, "img/walker.png", vs, fs, {
      width: 64,
      height: 64,
    });

    this.sprite1Pos = new Point();
    // this.sprite2Pos = new Point(VIEWPORT_HORIZONTAL_WIDTH / 2, 1);
    this.sprite2Pos = new Point(this.VIEWPORT_HORIZONTAL_WIDTH / 4, 1);

    this.radius = 10;
    this.angle = 30;

    this.sprite1Frame = new Point();
    this.sprite2Frame = new Point();
  }

  resize(x, y) {
    this.canvasElm.width = x;
    this.canvasElm.height = y;

    let wRatio = x / (y / 240);
    this.worldSpaceMatrix = new M3x3()
      .transition(-1, 1)
      .scale(2 / wRatio, -2 / 240);
  }

  update() {
    this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.sprite1Frame.x = (new Date() * 0.006) % 3;
    this.sprite1Frame.y = (new Date() * 0.002) % 2;

    this.sprite2Frame.x = (new Date() * 0.006) % 3;
    this.sprite2Frame.y = (new Date() * 0.002) % 2;

    this.sprite2Pos.x =
      this.VIEWPORT_HORIZONTAL_WIDTH / 4 + Math.sin(this.angle) * this.radius;
    this.sprite2Pos.y =
      this.VIEWPORT_HORIZONTAL_HEIGHT / 8 + Math.cos(this.angle) * this.radius;
    this.angle += 0.01;

    this.sprite1.render(this.sprite1Pos, this.sprite1Frame);
    this.sprite2.render(this.sprite2Pos, this.sprite2Frame);

    this.gl.flush();
  }
}
