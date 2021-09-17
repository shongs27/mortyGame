const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//캔버스 구성
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight * (45 / 100);
//이미지 만들기
function makeObject(src) {
  const temp = new Image();
  temp.src = src;
  return temp;
}

const runnerImage1 = makeObject("img/morty.jpg");
const runnerImage2 = makeObject("img/mortySit.jpg");
const ufo = makeObject("img/UFO.jpg");
const landImage = makeObject("img/terrain.png");
const skyImage = makeObject("img/cloud.png");

const imgArr = [];
function makeObstacle(src, type, w, h) {
  const image = new Image();
  image.src = src;
  image.appearType = type;
  image.WHsize = [w, h];
  imgArr.push(image);
}
makeObstacle("img/carcass1.png", 0, 100, 80);
makeObstacle("img/carcass2.png", 0, 100, 80);
makeObstacle("img/dino1.png", 0, 50, 50);
makeObstacle("img/dino2.png", 0, 50, 50);
makeObstacle("img/pickleRick.jpg", 0, 80, 80);
makeObstacle("img/birdperson.png", 0, 80, 100);
makeObstacle("img/friends.png", 1, 200, 100);

//state
let obstacles = [];
let sky = [];
let getOff = false;
let player;
let cloud;
let terrain;
let keys = [];
let gravity = 1;
let gameSpeed;
let jumpForce;

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

////////////////
//플레이어//////
////////////////
class Player {
  constructor(image, x, y, w, h) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dy = 0;
    this.grounded = false; //처음에 땅에 없으니깐 우주선에서부터 내려와진다
    this.jumpForce = jumpForce;
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
      this.dy = -this.jumpForce - this.jumpTimer / 50; // 0.3정도의 힘을 더 가함
    }
  }

  animate() {
    //점프기능
    if (keys["Space"] || keys["ArrowUp"]) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    //주저앉는기능
    if (keys["ShiftLeft"] || keys["ArrowDown"]) {
      this.image = runnerImage2;
      this.h = this.originalHeight * (2 / 3);
    } else {
      this.image = runnerImage1;
      this.h = this.originalHeight;
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
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

//////////////////
//장애물//////////
/////////////////
class Obstacle {
  constructor(image, x, y, w, h) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dx = gameSpeed;
  }

  animate() {
    this.x += this.dx;
    this.draw();
    this.dx = gameSpeed; // 이걸 왜 해야하지?
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

function spawnObstacle() {
  const r = Math.round(Math.random() * 6);
  const obs = new Obstacle(
    imgArr[r],
    imgArr[r].WHsize[0],
    canvas.height - imgArr[r].WHsize[1],
    imgArr[r].WHsize[0],
    imgArr[r].WHsize[1]
  );

  // 나는 유형이면
  if (imgArr[r].appearType === 1) {
    obs.y -= player.originalHeight - 20;
  }
  obstacles.push(obs);
}

function spawnCloud() {
  const position = Math.round(Math.random() * (canvas.height / 2 - 50) + 20);
  sky.push(new Obstacle(skyImage, 0, position, 100, 100));
}

///////////////////////
///구동////////////////
//////////////////////
let spawnTimer = 200;
let cloudTimer = 100;
let initialSpawnTimer = spawnTimer;
let initialCloudTimer = cloudTimer;
function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!getOff)
    ctx.drawImage(ufo, 210, 78, 340, 179, canvas.width - 180, 5, 150, 80);

  //장애물생성
  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = initialSpawnTimer;
  }

  //구름생성
  cloudTimer--;
  if (cloudTimer <= 0) {
    spawnCloud();
    cloudTimer = initialCloudTimer;
  }

  //장애물 그리기
  for (let i = 0; i < obstacles.length; i++) {
    //성공적으로 지나감
    const obs = obstacles[i]; // 이걸해줘야지
    //뒤에서 obstacles.splice(i,1)
    //obstacles[i]. animate 가 연속해서 나와도 이상하지 않다
    if (obs.x + obs.w > canvas.width) {
      obstacles.splice(i, 1);
    }

    //실패했음 부딪혀서
    if (
      player.x < obs.x + obs.w &&
      player.x + player.w > obs.x &&
      player.y < obs.y + obs.h &&
      player.y + player.h > obs.y
    ) {
      obstacles = [];
      sky = [];
      spawnTimer = initialSpawnTimer;
      gameSpeed = 5;
    }

    obs.animate();
  }

  //구름그리기
  for (const cld of sky) {
    if (cld.x + cld.w > canvas.width) {
      sky.shift();
    }
    cld.animate();
  }

  player.animate();
  terrain.animate();
}

function start() {
  gameSpeed = 5;
  jumpForce = 15;
  player = new Player(runnerImage1, canvas.width - 140, 70, 100, 100);
  terrain = new Obstacle(landImage, 0, canvas.height - 20, 20000, 20);

  update();
  // requestAnimationFrame(update);
}
start();
