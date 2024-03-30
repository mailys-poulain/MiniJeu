class Doodler {
  constructor() {
      this.x = width / 2;
      this.y = height / 2;
      this.height = 60;
      this.width = 40;

      this.velocity = 0;
      this.gravity = 0.1;
      this.jumpForce = 9;
      this.isJumping = false; // Ajout d'une variable pour suivre l'état de saut
  }

  draw() {
      fill(0, 255, 0); // Couleur verte pour le joueur
      rect(this.x, this.y, this.width, this.height);
  }

  jump() {
      if (!this.isJumping) { // Assurez-vous que le joueur ne peut pas sauter s'il est déjà en train de sauter
          this.velocity -= this.jumpForce;
          this.isJumping = true;
      }
  }

  update() {
      this.velocity += this.gravity;
      this.y += this.velocity;

      // Empêcher le joueur de sortir du cadre
      this.x = constrain(this.x, 0, width - this.width);
      this.y = constrain(this.y, 0, height - this.height);

      // Vérifier les collisions avec les plateformes
      for (let platform of platforms) {
          if (this.y + this.height >= platform.y && this.y <= platform.y + platform.height &&
              this.x + this.width >= platform.x && this.x <= platform.x + platform.width) {
              // Inverser la direction de déplacement vertical du joueur
              this.velocity = -Math.abs(this.velocity);
              this.isJumping = false; // Le joueur n'est plus en train de sauter
              break; // Sortir de la boucle dès qu'une collision est détectée
          }
      }
  }
}

class Platform {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.height = 15;
      this.width = 60;
  }

  draw() {
      fill(100, 255, 100);
      rect(this.x, this.y, this.width, this.height);
  }
}

let doodler;
let platforms = [];

function setup() {
  createCanvas(400, 600);
  doodler = new Doodler();

  let platformCount = 6;
  let gap = height / platformCount;
  for (let i = 1; i < platformCount; i++) {
      platforms.push(new Platform(random(width - 60), height - i * gap));
  }
}

function draw() {
  background(100, 100, 255);
  doodler.draw();
  doodler.update();

  for (let platform of platforms) {
      platform.draw();
  }
}

function keyPressed() {
  if (key === ' ') {
      doodler.jump();
  }
}
