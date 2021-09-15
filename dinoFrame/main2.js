const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

//공룡
const dino = {
  x: 10,
  y: 200,
  width: 50,
  height: 50,
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};
dino.draw();

const dinoImage = new Image();
//   dinoImage.src
const cactusImage = new Image();
// cactusImage.src

//장애물
//여러개니 클래스로 만든다
class Cactus {
  constructor() {
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }

  draw() {
    ctx.fillStyle = "red";
    //hitbox
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(cactusImage, this.x, this.y);
  }
}

//2. 애니메이션 만들때 기본적인 함수 window.requestAnimationFrame();
//라이브러리를 더 추천

let timer = 0;
const cactusArr = [];
let jumpSwitch = false;
let animation;

// 120fps라면 1초에 120장의 그림을 보여주는것
// 프레임마다 실행한다면
// 120프레임마다 장애물 생성
function 프레임마다생성() {
  animation = requestAnimationFrame(프레임마다생성);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //120프레임마다 장애물 생성
  //== 1초마다 장애물 생성
  if (timer % 250 === 0) {
    //배열로 관리
    const cactus = new Cactus();
    cactusArr.push(cactus);
  }

  cactusArr.forEach((v, i, arr) => {
    if (v.x <= 0) arr.splice(i, 1);
    v.x--;

    perceptCrash(dino, v);
    v.draw();
  });

  if (jumpSwitch === true) {
    dino.y -= 3;
  }
  if (jumpSwitch === false) {
    dino.y < 200 && (dino.y += 1.5);
  }
  if (dino.y < 100) {
    jumpSwitch = false;
  }
  dino.draw();
}
프레임마다생성();

//3. 충돌확인
function perceptCrash(dino, cactus) {
  const xDiff = cactus.x - (dino.x + dino.width);
  const yDiff = cactus.y - (dino.y + dino.height);
  if (xDiff < 0 && yDiff < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jumpSwitch = true;
});
