/* These are the possible states the game can be in.
 * All of the objects in the game update the game condition and the
 * Game Engine looks at the state of the game and decides what to do.
 */
var GameConditionEnum = {
    Lose: 0,
    Playing: 1,
    Win: 2,
    Start: 3
};

/* The gems information, images and their values */
var GemSprites = [
    {
        sprite: 'images/GemBlue.png',
        value: 50
    },
    {
        sprite: 'images/GemGreen.png',
        value: 100
    },
    {
        sprite: 'images/GemOrange.png',
        value: 200
    }
];

/* We Will create only one object of the GameState class so using functional
 * class pattern as there will be no degradation of performance.
 */
var GameState = function(){
    this.gameCondition = GameConditionEnum.Start;
    this.score = 0;
    this.scoreX = 10;
    this.scoreY = 80;

    this.highScore = 0;
    this.highScoreX = 10;
    this.highScoreY = 110;

    this.timeLeftInSeconds = 300;
    this.timeX = 300
    this.timeY = 80;

    this.lives = 1;
    this.livesX = 300;
    this.livesY = 110;

    this.previousScore = 0;

    this.changeScoreBy = function(scoreChange) {
        this.score += scoreChange;
        if(this.score > this.highScore) {
            this.highScore = this.score;
        }
    }
    this.update = function(dt) {
        this.timeLeftInSeconds = this.timeLeftInSeconds - dt;
        if(this.timeLeftInSeconds < 0) {
            this.endGame();
        }
    }
    this.render = function() {
        ctx.fillStyle = "yellow";
        ctx.font = "32px sans-serif";
        ctx.fillText("Score: " + this.score, this.scoreX, this.scoreY);
        ctx.fillText("High Score: " + this.highScore, this.highScoreX, this.highScoreY);
        ctx.fillText("Time Left: " + Math.round(this.timeLeftInSeconds), this.timeX, this.timeY);
        ctx.fillText("Lives: " + this.lives, this.livesX, this.livesY);
    }
    this.reset = function() {
        this.timeLeftInSeconds = 300;
        this.score = 0;
        this.lives = 1;
        // High score should not be reset, will only be reset on reloading page
    }
    //This function is called in the end game condition:
    this.endGame = function() {
        gameState.previousScore = gameState.score;
        this.gameCondition = GameConditionEnum.Start;
    }
    //The function is called if player has reached water, or any other win condition
    this.winGame = function() {
        gameState.changeScoreBy(50);
        this.gameCondition = GameConditionEnum.Win;
    }
};

//Entity class is the superclass of the Enemy and the Player classes
var Entity = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
}
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy class is the subclass of the Entity class using pseudoclassical prototypal patternn
var Enemy = function() {
    var sprite = 'images/enemy-bug.png';
    var position = this.getRandomPosition();
    this.speed = this.getRandomSpeed();
    Entity.call(this, sprite, position.x, position.y);
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

/* getRandomSpeed() is an Enemy prototype function as it's specific to
 * how the enemy moves in the game. Returns the speed of the enemy.
 */
Enemy.prototype.getRandomSpeed = function(){
    var baseSpeed = 250;
    var rangeSpeed = 300;
    return baseSpeed + Math.floor(Math.random() * rangeSpeed);
}

/* The enemy get's placed at a random position in one of the three rows
 * of the game board as a starting point.
 */
Enemy.prototype.getRandomPosition = function(){
    var position = {};
    var enemyRow = 0 + Math.floor(Math.random() * 3);
    position.x = -80;
    position.y = 65 + 83*enemyRow;
    return position;
}

// Position updated based on speed and resets itself if crosses board
Enemy.prototype.update = function(dt) {
    this.x += dt*this.speed;
    if(this.x > 505) {
        this.reset();
    }
};
Enemy.prototype.reset = function() {
    var position = this.getRandomPosition();
    this.speed = this.getRandomSpeed();
    this.x = position.x;
    this.y = position.y;
}

// Player class is a subclass of the Entity class following pseudoclassical prototypal pattern
var Player = function() {
    var sprite = 'images/char-boy.png';
    Entity.call(this, sprite, this.PLAYERSTARTX, this.PLAYERSTARTY);
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.PLAYERSTARTX = 202;
Player.prototype.PLAYERSTARTY = 380;
Player.prototype.update = function() {

    /* Determines if the player reached the water tiles */
    function onWater(){
        if(this.y === this.PLAYERSTARTY - 83*5) {
            return true;
        }

        return false;
    }

    /* Determines if the player collided with one of the enemies */
    function collisionOccured() {
        var collided = false;
        for(var i = 0; i < allEnemies.length ;i++) {
            if(Math.abs(allEnemies[i].x - this.x) <= 60 &&
                Math.abs(allEnemies[i].y - this.y) <= 20) {
                collided = true;
            }
        }

        return collided;
    }

    /* Change game state based on whether the collision occured
     * or whether the player is on water.
     */
    if(collisionOccured.call(this)) {
        if(gameState.lives === 1){
            gameState.endGame();
        }
        else {
            this.reset();
            gameState.lives -= 1;
        }
    }
    else if(onWater.call(this)) {
        gameState.winGame();
    }
}
Player.prototype.reset = function() {
    this.x = this.PLAYERSTARTX;
    this.y = this.PLAYERSTARTY;
}

/* Handles change in position of the player based on the keyboard input
 *
 */
Player.prototype.handleInput = function(key) {

    function handleChange(changeX, changeY) {
        if(withinBounds.call(this, changeX, changeY)) {
            this.x = this.x + changeX;
            this.y = this.y + changeY;
        }

        function withinBounds(changeX, changeY) {
            var newX = this.x + changeX;
            var newY = this.y + changeY;
            if(newX >= 0 && newX <= 490 && newY >=-80 && newY <= 400) {
                return true;
            }

            return false;
        }
    }

    if(key === undefined) {
        return;
    }

    var changeX = 0, changeY = 0;
    if(key === 'left') {
        changeX = -101;
        changeY = 0;
    }
    else if(key === 'right') {
        changeX = 101;
        changeY = 0;
    }
    else if(key === 'up') {
        changeX = 0;
        changeY = -83;
    }
    else if(key === 'down') {
        changeX = 0;
        changeY = 83;
    }

    handleChange.call(this, changeX, changeY);
}

//Superclass of the Heart and Gem classes
var Collectible = function(sprite, probabilityToOccurOnBoard) {
    /* The parameter probabilityToOccurOnBoard is the probability that the collectible
       will appear on the board for this turn
    */
    this.probabilityToOccurOnBoard = probabilityToOccurOnBoard;
    this.sprite = sprite;
    var position = this.getRandomPosition();
    this.x = position.x;
    this.y = position.y;
}
/* The collectible shows up in a random position on the board and whether
 * it shows up is based on the probability of the collectible occuring on the board.
 */
Collectible.prototype.getRandomPosition = function() {
    var position = {};
    var gemColumn = 0 + Math.floor(Math.random() * 5 * (1/this.probabilityToOccurOnBoard));
    var gemRow = 0 + Math.floor(Math.random() * 3);
    position.x = 0 + 101*gemColumn;
    position.y = 65 + 83*gemRow;
    return position;
}
/*
 * This function is because the collectible is too big and want to scale it down
   at the center of the image
 */
Collectible.prototype.render = function() {
    ctx.save();
    /* 50 is half the width of the png file
     * and 85 is half the height of the png file
    */
    ctx.translate(this.x + 50, this.y + 85);
    ctx.scale(0.5, 0.5);
    ctx.drawImage(Resources.get(this.sprite), -50, -80);
    ctx.restore();
}

// Returns if the player has successfully collected the gem based on the positions
Collectible.prototype.hasPlayerCollected = function() {
    return (Math.abs(this.x - player.x) <= 60 &&
        Math.abs(this.y - player.y) <= 20);
}

// Make the gem go off the board
Collectible.prototype.disappear = function() {
    this.x = 1000;
    this.y = 1000;
}

// A subclass of the superclass Collectible
var Gem = function() {
    var index = this.getRandomGemSpriteIndex();
    var sprite = GemSprites[index].sprite;
    Collectible.call(this, sprite, 1);

    this.value = GemSprites[index].value;
}
Gem.prototype = Object.create(Collectible.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function() {
    if(this.hasPlayerCollected()) {
        gameState.changeScoreBy(this.value);
        this.disappear();
    }
}
Gem.prototype.getRandomGemSpriteIndex = function() {

    /* The spec indicates the probability of occurrence of the gems
     * Blue being most common, then green and orange being rarest
     */
    spec = {
        0: 0.6,
        1: 0.3,
        2: 0.1
    };

    // Return one of the gem indexes based on their relative probabilities of occuring
    var i, sum=0, r=Math.random();
    for (i in spec) {
        sum += spec[i];
        if (r <= sum) {
            return i;
        }
    }
}
Gem.prototype.reset = function() {
    var index = this.getRandomGemSpriteIndex();
    var sprite = GemSprites[index].sprite;
    Collectible.call(this, sprite, 1);

    this.value = GemSprites[index].value;
}

// A subclass on the superclass Collectible
var Heart = function() {
    var sprite = 'images/Heart.png';
    Collectible.call(this, sprite, 0.25);
}
Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.update = function() {
    if(this.hasPlayerCollected()) {
        gameState.lives += 1;
        this.disappear();
    }
}
Heart.prototype.reset = function() {
    var sprite = 'images/Heart.png';
    Collectible.call(this, sprite, 0.25);
}

/* Instantiating the game state. The game state is modified in update methods
 * of the enemies or/and player.
*/
var gameState = new GameState();

// Instantiating the enemy array, the player and a random gem on random location.
var allEnemies = [];
for(var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();
var gem = new Gem();
var heart = new Heart();

//Adding the listener for the keys which move the player
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This functions toggles the ingame menu
function toggleMenu(display, previousScore) {
    var playerMenu = document.getElementsByClassName('player');
    for(var i = 0; i < playerMenu.length; i++) {
        playerMenu[i].style.display = display;
    }
    var header = document.getElementById('choose-player-header');
    header.style.display = display === 'none' ? display : 'block';

    header = document.getElementById('previous-score-header');
    header.innerHTML = "Previous Score: " + previousScore;
    header.style.display = display === 'none' ? display : 'block';

    header = document.getElementById('rules-header');
    header.style.display = display === 'none' ? display : 'block';
}

/* Once the player chooses the character the event fires to load the game
 * by setting the gameState of the game and removing the game menu.
 */
window.onload = function() {
    var playerSprites = document.getElementsByTagName('img');
    for(var i = 0; i < playerSprites.length; i++) {
        playerSprites[i].addEventListener('click', function(e){
            toggleMenu('none', gameState.previousScore);
            gameState.gameCondition = GameConditionEnum.Playing;
            player.sprite = e.currentTarget.getAttribute('data-src');
        });
    }
}