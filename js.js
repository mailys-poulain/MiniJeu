let doodler;
let platforms = [];
let monsters = []; // Tableau pour stocker les monstres
let platformGap = 40; // Espace entre les plateformes
let platformSpeed = 1; // Vitesse de défilement des plateformes
let jumpInterval = 1000; // Intervalle de saut automatique en millisecondes
let lastJumpTime = 0;
let moveSpeed = 5; // Vitesse de déplacement par défaut
let moveSpeedBoost = 1; // Augmentation de la vitesse de déplacement lorsqu'une touche est enfoncée
let isLeftKeyPressed = false;
let isRightKeyPressed = false;
let score = 0; // Variable pour stocker le score
let level2DisplayTime = 0; // Variable pour suivre le moment où le message du niveau 2 a été affiché
let plateformeSpeedTime = 0; // Variable pour suivre le moment où le message du niveau 2 a été affiché
let displayLevel2 = false; // Variable pour contrôler l'affichage du message "Niveau 2"
let isGameOver = false; // Variable pour suivre l'état du jeu
let bestScores = [100, 80, 60]; // Exemple de meilleurs scores, remplacez par vos données

function setup() {
    createCanvas(800, 600); // Modification de la largeur du canvas à 800 pixels
    doodler = new Doodler();

    doodler.draw();

    // Initialiser les premières plateformes
    for (let i = 0; i < 25; i++) { // Initialiser plus de plateformes
        platforms.push(new Platform(random(width - 60), i * platformGap));
    }
}

function createMonsters() {
    // Créer des monstres à chaque frame
    if (frameCount % 60 === 0) {
        monsters.push(new Monster(random(width - 40), random(-height, -40))); // Apparaître au-dessus de l'écran
    }
}

// Fonction pour gérer la fin du jeu
function gameOver() {
    isGameOver = true;
    textSize(32);
    fill(255, 0, 0);
    text(" ᒪOOᔕEᖇ ", width / 2, height / 2);
    noLoop(); // Arrêter la boucle de dessin
}

function draw() {
    background(150, 0, 150); // Fond violet
    // Créer des monstres si le score est supérieur ou égal à 5
    if (score >= 5) {
        createMonsters();
    }

    // Afficher et déplacer les plateformes
    for (let platform of platforms) {
        platform.draw();
        platform.moveDown(platformSpeed);
    }

    // Supprimer les plateformes qui sortent de l'écran
    platforms = platforms.filter(platform => platform.y + platform.height < height);

    // Ajouter de nouvelles plateformes en haut de l'écran
    while (platforms[0].y >= 0) {
        platforms.unshift(new Platform(random(width - 60), platforms[0].y - platformGap));
    }

    // Afficher et déplacer les monstres
    for (let monster of monsters) {
        monster.draw();
        monster.moveDown(platformSpeed);
    }

    // Vérifier les collisions avec les monstres
    if (!isGameOver) {
        for (let monster of monsters) {
            // Vérifier si le doodler touche le sol
            if (doodler.y + doodler.height >= height && !isGameOver) {
                gameOver();
            }
        }
    }

    doodler.draw();
    doodler.update();

    
    // Afficher le message "Niveau 2" pendant 1 seconde
    if (score >= 5 && score < 6 && millis() - level2DisplayTime < 1000) {
        textSize(32);
        fill(255, 0, 0);
        text("ᗩTTEᑎTIOᑎ ᗩTTᗩᑫᑌE ᗪEᔕ ᗰᗩᖇᔕIEᑎᔕ", width / 2, height / 2);
    }

    // Réinitialiser le temps d'affichage du niveau 2 si nécessaire
    if (score < 5 || score >= 6) {
        level2DisplayTime = millis(); // Réinitialiser le temps lorsque le score n'est pas entre 10 et 14 inclusivement
    }

    
        // Augmenter la vitesse des plateformes après un score de 5
    if (score >= 12) {
        platformSpeed = 1.25; // Augmenter la vitesse de défilement des plateformes
    }

    // Afficher le message "MODE SUPERSONIC ACTIVER" pendant 1 seconde
    if (score >= 11 && score < 12 && millis() - level2DisplayTime < 1000) {
        textSize(32);
        fill(255, 0, 0);
        text("ᗰOᗪE ᔕᑌᑭEᖇᔕOᑎIᑕ ᗩᑕTIᐯEᖇ", width / 2, height / 2);
    }

    // Réinitialiser le temps d'affichage du message si nécessaire
    if (score < 11 || score >= 12) {
        level2DisplayTime = millis(); // Réinitialiser le temps lorsque le score n'est pas entre 2 et 4 inclusivement
    }

    // Afficher les meilleurs scores à droite du jeu
    textSize(20);
    fill(255);
    textAlign(RIGHT); // Alignement du texte à droite
    text("Best Scores:", width - 20, 30); // Position du texte à droite en haut
    for (let i = 0; i < bestScores.length; i++) {
        text(bestScores[i], width - 20, 60 + i * 30); // Afficher chaque score sous le précédent avec un espacement vertical de 30 pixels
    }



    // Vérifier si le doodler touche le sol
    if (doodler.y + doodler.height >= height) {
        gameOver();
    }

    // Vérifier les collisions avec les monstres
    if (score >= 3) {
        for (let monster of monsters) {
            // Vérifier si le doodler entre en collision avec un monstre
            if (doodler.x < monster.x + monster.width &&
                doodler.x + doodler.width > monster.x &&
                doodler.y < monster.y + monster.height &&
                doodler.y + doodler.height > monster.y) {
                gameOver();
            }
        }
    }
}

// Votre code pour la classe Doodler, la classe Platform et la classe Monster ici...


function keyPressed() {
    if (key === ' ' && millis() - lastJumpTime > jumpInterval) {
        doodler.jump();
        lastJumpTime = millis();
    } else if (keyCode === LEFT_ARROW) {
        isLeftKeyPressed = true;
    } else if (keyCode === RIGHT_ARROW) {
        isRightKeyPressed = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        isLeftKeyPressed = false;
    } else if (keyCode === RIGHT_ARROW) {
        isRightKeyPressed = false;
    }
}

class Doodler {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.height = 60;
        this.width = 40;

        this.velocity = 0;
        this.gravity = 0.05; // Réduire la gravité pour rendre le saut moins lourd
        this.jumpForce = 3.5;
        this.isJumping = false; // Ajout d'une variable pour suivre l'état de saut
    }

    draw() {
        fill(0, 255, 0); // Couleur verte pour le joueur
        // Dessin de l'extraterrestre
        noStroke();
        // Corps
        fill(150, 0, 255); // Couleur violette
        rect(this.x, this.y + 10, this.width, this.height - 10, 10);
        // Tête
        fill(150, 0, 255); // Couleur violette
        ellipse(this.x + this.width / 2, this.y, this.width / 2, this.height / 2);
        // Yeux
        fill(255);
        ellipse(this.x + this.width / 3, this.y - this.height / 8, this.width / 8, this.height / 8);
        ellipse(this.x + this.width * 2 / 3, this.y - this.height / 8, this.width / 8, this.height / 8);
        // Bouche
        stroke(0);
        strokeWeight(2);
        line(this.x + this.width / 3, this.y + this.height / 8, this.x + this.width * 2 / 3, this.y + this.height / 8);

        // Affichage du score en haut à gauche de l'écran
        textSize(20);
        fill(255);
        text("Score: " + score, 100, 30); // Position du texte en haut à gauche de l'écran
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

        // Déplacement horizontal continu
        if (isLeftKeyPressed) {
            this.x -= moveSpeed;
        }
        if (isRightKeyPressed) {
            this.x += moveSpeed;
        }

        // Empêcher le joueur de sortir du cadre
        this.x = constrain(this.x, 0, width - this.width);
        this.y = constrain(this.y, 0, height - this.height);

        // Vérifier les collisions avec les plateformes
        for (let platform of platforms) {
            // Détection de collision avec le dessous de la plateforme
            if (this.velocity > 0 && // Vérifier si le doodler est en train de descendre
                this.y + this.height >= platform.y && this.y + this.height <= platform.y + platform.height &&
                this.x + this.width >= platform.x && this.x <= platform.x + platform.width) {
                // Réinitialiser la position du doodler et inverser sa vitesse pour simuler un rebond
                this.y = platform.y - this.height;
                this.velocity = -this.jumpForce; // Force de rebondissement
                this.isJumping = false;
                score++; // Incrémenter le score uniquement lorsque le doodler rebondit
            }
            // Détection de collision avec le dessus de la plateforme
            else if (this.velocity < 0 && // Vérifier si le doodler est en train de monter
                this.y <= platform.y + platform.height && this.y >= platform.y &&
                ((this.x + this.width >= platform.x && this.x + this.width <= platform.x + platform.width) ||
                (this.x <= platform.x + platform.width && this.x >= platform.x))) {
                // Rebondir vers le bas
                this.velocity = 0;
            }

        }
    }

    collide(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}


class Platform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 15;
        this.width = 60;
        this.cornerRadius = 10; // Rayon de l'arrondi des coins
    }

    draw() {
        fill(100, 255, 100);
        rectMode(CORNER); // Définir le mode de dessin des rectangles sur CORNER
        rect(this.x, this.y, this.width, this.height, this.cornerRadius); // Dessiner un rectangle avec des coins arrondis
    }

    // Méthode pour déplacer la plateforme vers le bas
    moveDown(speed) {
        this.y += speed;
    }
}


class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }

    draw() {
        fill(255, 0, 0); // Couleur rouge pour les monstres
        // Dessin du monstre
        noStroke();
        // Corps
        fill(255, 0, 0); // Couleur rouge
        rect(this.x + this.width / 4, this.y + this.height / 2, this.width / 2, this.height / 2);
        // Yeux
        fill(0);
        ellipse(this.x + this.width / 4, this.y + this.height / 3, this.width / 8, this.height / 8);
        ellipse(this.x + this.width * 3 / 4, this.y + this.height / 3, this.width / 8, this.height / 8);
        // Sourcils
        stroke(0);
        strokeWeight(2);
        line(this.x + this.width / 4 - 5, this.y + this.height / 4, this.x + this.width / 4 + 5, this.y + this.height / 4 - 5);
        line(this.x + this.width * 3 / 4 - 5, this.y + this.height / 4 - 5, this.x + this.width * 3 / 4 + 5, this.y + this.height / 4);
        // Bouche
        noFill();
        stroke(0);
        strokeWeight(2);
        arc(this.x + this.width / 2, this.y + this.height * 2 / 3, this.width / 2, this.height / 4, PI, TWO_PI);
    }

    // Méthode pour déplacer le monstre vers le bas
    moveDown(speed) {
        this.y += speed;
    }
}

