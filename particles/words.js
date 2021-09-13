// To run this effect in loop set 'loop' to true
const instance = new Typewriter("#typewriter", {
  loop: true,
});

instance
  .typeString("Hello World!")
  .pauseFor(1000)
  .deleteAll()
  .typeString("천천히 발전하는 개발자")
  .pauseFor(1000)
  .deleteChars(15)
  .typeString("shongs27입니다")
  .pauseFor(1000)
  .deleteChars(29)
  .typeString("Javascript로 이것저것 만듭니다")
  .pauseFor(800)
  .deleteAll()
  .typeString("깃허브주소<br>github.com/your-username")
  .pauseFor(1000)
  .deleteAll()
  .start();
