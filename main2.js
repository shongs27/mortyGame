const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score;
let scoreText;
let highscorelet;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gamespeed;
let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0; //dy는 뭐지? 이동한 거리인가?
    this.jumpForce = 15;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }
  Animate() {
    console.log(this.jumpTimer);
    if (keys["Space"] || keys["ArrowUp"]) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys["ShiftLeft"] || keys["ArrowDown"]) {
      this.h = this.originalHeight / 2;
    } else {
      //   this.h = this.originalHeight
    }

    this.y += this.dy;

    if (this.y + this.h < canvas.height) {
      //점프중이라면 중력을 가한다
      this.dy += gravity;
      this.grounded = false;
    } else {
      //아니라면 초기화
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }
    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
      //부드럽게 뛰는거 구현
    }
  }
  Draw() {
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

function Start() {
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  ctx.font = "20px sans-serif";

  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highScore = 0;
  highscore = localStorage.getItem("highscore");

  player = new Player(25, 0, 50, 50, "#FF5858");

  scoreText = new Text("Score:" + score, 25, 25, "left", "#212121", 20);
  highscoreText = new Text(
    "Highscore" + highscore,
    canvas.width - 25,
    25,
    "right",
    "#212121",
    "20"
  );
  requestAnimationFrame(Update);
}
Start();

function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.Animate();
}
Start();
