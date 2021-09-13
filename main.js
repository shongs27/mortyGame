const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score;
let highscore;
let player;
let obastacles;
let keys = [];

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 15;
    this.originateHeight = h;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }

  Animate() {
    this.Draw();
  }
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif";

  gameSpeed;
  3;
  gravity = 1;

  score = 0;
  highscore = 0;

  player = new Player(25, cavas.height - 150, 50, 50, "#fff858");
  player.Draw();

  requestAnimationFrame(Update);
}

function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.Draw();
}

Start();
