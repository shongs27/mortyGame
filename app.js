const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//캔버스 구성
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight * (60 / 100);
//이미지 만들기
function makeRunner(src) {
  const temp = new Image();
  temp.src = src;
  return temp;
}

const runnerImage1 = makeRunner("img/morty.jpg");
const runnerImage2 = makeRunner("img/mortySit.jpg");
const ufo = makeRunner("img/UFO.jpg");

//state
const obstacles = [];
let getOff = false;
let player;
let keys = [];
let gravity = 1;
let gameSpeed;

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

////////////////
//플레이어//////
////////////////
class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dy = 0;
    this.grounded = false;
    this.jumpForce = 10;
    this.jumpTimer = 0;
    this.originalHeight = h;
  }
  jump() {
    //땅에 있는 경우
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer++; //jumpTimer 작동하기 시작
      this.dy -= this.jumpForce;
      this.grounded = false;
      //체공하고 있는 경우
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy -= this.jumpForce - this.jumpTimer / 40; // 0.3정도의 힘을 더 가함
    }
  }

  animate() {
    //점프기능
    if (keys["Space"] || keys["ArrowUp"]) {
      this.jump;
    } else {
      this.jumpTimer = 0;
    }

    this.y += this.dy; // 변화 반영 (일부로 중간에 둠- 속도조절)

    //중력기능
    if (!this.grounded && this.y + this.h < canvas.height) {
      this.grounded = false; //아직은 땅에 안닿았다
      this.dy += gravity;
    } else {
      this.grounded = true; //이제 땅에 닿았다
      getOff = true; // 이제 내렸다(한번만작동)
      this.dy = 0;
      this.y = canvas.height - this.h;
    }
    this.draw();
  }

  draw() {
    ctx.drawImage(runnerImage1, this.x, this.y, this.w, this.h);
    // ctx.drawImage(
    //   runnerImage2,
    //   260,
    //   160,
    //   130,
    //   110,
    //   this.x,
    //   this.y,
    //   this.w,
    //   this.h
  }
}

///////////////////
//장애물/////
/////////////////
class Obstacle {
  constructor(image, x, y, w, h) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dx = -gameSpeed;
  }

  animate() {
    this.x += this.dx;
    this.draw();
    this.dx = -gameSpeed; // 이걸 왜 해야하지?
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

const imgArr = [];
function makeObstacle(src, w, h) {
  const image = new Image();
  image.src = src;
  imgArr.push(new Obstacle(image, 20, 20, w, h));
}
makeObstacle("img/carcass1.png", 100, 80);
makeObstacle("img/carcass2.png", 100, 80);
makeObstacle("img/dino1.png", 50, 50);
makeObstacle("img/dino2.png", 50, 50);
makeObstacle("img/pickleRick.jpg", 80, 80);
makeObstacle("img/birdperson.png", 80, 100);
makeObstacle("img/friends.png", 200, 100);
///////////////////////
///구동////////////////
//////////////////////

let spawnTimer = 200;
let initialSpawnTimer = spawnTimer;
function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!getOff) {
    ctx.drawImage(ufo, 210, 78, 340, 179, canvas.width - 180, 5, 150, 80);
  }

  spawnTimer--;
  if (spawnTimer <= 0) {
    const r = Math.round(Math.random() * 7);
    obstacles.push(imgArr[r]); //imgArr에는 class로 만든 인스턴스 객체가 담겨져 있다
    spawnTimer = initialSpawnTimer;
    console.log(imgArr[r]);
  }

  //배열전개
  for (let i = 0; i < obstacles.length; i++) {
    console.log("봅시다", obstacles[i]);
    if (obstacles[i].x + obstacles[i].w < 0) {
      obstacles.splice(i, 1);
    }

    obstacles[i].animate();
  }

  player.animate();
}

function start() {
  gameSpeed = 2;
  player = new Player(canvas.width - 140, 70, 100, 100);

  update();
  // requestAnimationFrame(update);
}
start();
