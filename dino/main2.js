const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const morty = new Image();
morty.src = "../img/morty.jpg";
const cactus = new Image();
cactus.src = "../img/cactus1.png";

let player;
let gravity;
let gameSpeed;
let obstacles = [];
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

    this.dy = 0;
    this.jumpForce = 10;
    this.jumpTimer = 0;
    this.grounded = true;
    this.originalHeight = h;
  }

  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      //부드럽게 뛰는거 구현
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  animate() {
    if (keys["Space"] || keys["ArrowUp"]) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys["ShiftLeft"] || keys["ArrowDown"]) {
      // y가 아니라 h만 조절해도
      //중력 기능에 의해서 더 떨어져진다
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    //중력기능
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h; // 초기화 안해주면 계속 작아짐
    }
    this.draw();
  }

  draw() {
    // ctx.fillStyle = this.c;
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(morty, this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  animate() {
    this.x += this.dx;
    this.draw();
    this.dx = -gameSpeed;
  }

  draw() {
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // ctx.drawImage(cactus, this.x, this.y);
  }
}

function spawnObstacle() {
  const size = Math.round(Math.random() * (70 - 20) + 20);
  const type = Math.round(Math.random());
  const obs = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "gray"
  );

  // 나는 장애물
  if (type === 1) {
    obs.y -= player.originalHeight - 10;
  }
  obstacles.push(obs);
}

class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  draw() {
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
  }
}

let spawnTimer = 200;
const initialSpawnTimer = spawnTimer;

//1초에 60번 코드 실행 = 프레임마다 코드 실행 => 60fps
function 프레임마다실행() {
  requestAnimationFrame(프레임마다실행); //60번 실행뒤에 다시 실행
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = initialSpawnTimer;
    // spawnTimer = initialSpawnTimer - gameSpeed * 8;
  }

  for (const obs of obstacles) {
    //패스
    if (obs.x + obs.w < 0) {
      obstacles.splice(0, 1);
    }

    //충돌
    if (
      player.x < obs.x + obs.w &&
      player.x + player.w > obs.x &&
      player.y < obs.y + obs.h &&
      player.y + player.h > obs.y
    ) {
      obstacles = [];
      score = 0;
      window.localStorage.setItem("highscore", highscore);
      //   alert("탈ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ락!!");
    }
    obs.animate();
  }
  player.animate();
  score++;
  scoreText.t = "Score:" + score;
  scoreText.draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }

  highscoreText.draw();

  gameSpeed += 0.003;
}

function start() {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight * (60 / 100);
  ctx.font = "20px sans-serif";
  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highscore = 0;

  //점수 저장되어 있으면 가져오기
  if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
  }

  scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
  highscoreText = new Text(
    "Highscore: " + highscore,
    canvas.width - 25,
    25,
    "right",
    "#212121",
    "20"
  );

  player = new Player(25, 0, 50, 50, "red");
  프레임마다실행();
}
start();
