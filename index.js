const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  frameMax: 6,
});

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  frameMax: 8,
  scale: 2.5,
  offset: {
    x: 185,
    y: 156,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 40,
    },
    width: 120,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 185,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -160,
      y: 40,
    },
    width: 190,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function retangularCollision({ retangle1, retangle2 }) {
  return (
    retangle1.attackBox.position.x + retangle1.attackBox.width >=
      retangle2.position.x &&
    retangle1.attackBox.position.x <= retangle2.position.x + retangle2.width &&
    retangle1.attackBox.position.y + retangle1.attackBox.height >=
      retangle2.position.y &&
    retangle1.attackBox.position.y <= retangle2.position.y + retangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    document.querySelector("#textInfo").innerHTML = "Hoà";
  } else if (player.health > enemy.health) {
    document.querySelector("#textInfo").innerHTML = "Người chơi 1 Win";
  } else if (player.health < enemy.health) {
    document.querySelector("#textInfo").innerHTML = "Người chơi 2 Win";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  } else {
    determineWinner({ player, enemy, timerId });
  }
}
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  //player move

  if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x > 0) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;
    }
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x < 1024 - 100) {
      player.velocity.x = 5;
    } else {
      player.velocity.x = 0;
    }
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy move
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    if (enemy.position.x > -25) {
      enemy.velocity.x = -5;
    } else {
      enemy.velocity.x = 0;
    }
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    if (enemy.position.x < 1024 - 100) {
      enemy.velocity.x = 5;
    } else {
      enemy.velocity.x = 0;
    }
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  // player danh
  if (
    retangularCollision({
      retangle1: player,
      retangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  // enemy danh
  if (
    retangularCollision({
      retangle1: enemy,
      retangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // end game based health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -15;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -15;
        break;
      case "0":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
