var GameConditionEnum = {
    Lose: 0,
    Playing: 1,
    Win: 2,
    Start: 3
};

/* Will create only one object of this class so using functional class pattern
 * as there will be no degradation of performance
 */
var GameState = function(){
    this.gameCondition = GameConditionEnum.Start;

    this.score = 0;
    this.scoreX = 10;
    this.scoreY = 80;

    this.highScore = 0;
    this.highScoreX = 10;
    this.highScoreY = 110;

    this.changeScoreBy = function(scoreChange) {
        this.score += scoreChange;
        if(this.score > this.highScore) {
            this.highScore = this.score;
        }
        else if(this.score < 0){
            this.lostGame();
        }
    }
    this.lostGame = function() {
        this.score = 0;
        this.gameCondition = GameConditionEnum.Start;
    }

    this.render = function() {
        ctx.fillStyle = "yellow";
        ctx.font = "32px sans-serif";
        ctx.fillText("Score: " + this.score, this.scoreX, this.scoreY);
        ctx.fillText("High Score: " + this.highScore, this.highScoreX, this.highScoreY);
    }
};

//Superclass of all the renderable objects in game
var Entity = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
}
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
    var sprite = 'images/enemy-bug.png';
    var position = this.getRandomPosition();
    this.speed = this.getRandomSpeed();
    Entity.call(this, sprite, position.x, position.y);
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

/* getRandomSpeed() is an Enemy prototype function as it's specific to
 * how the enemy moves
 */
Enemy.prototype.getRandomSpeed = function(){
    return 250 + Math.floor(Math.random() * 300);
}

/* getRandomPosition() is an Enemy prototype function as it's specific to
 * how the enemy is positioned on the canvas
 */
Enemy.prototype.getRandomPosition = function(){
    var position = {};
    var enemyRow = 0 + Math.floor(Math.random() * 3);
    position.x = -80;
    position.y = 65 + 83*enemyRow;
    return position;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += dt*this.speed;
    if(this.x > 505) {
        var position = this.getRandomPosition();
        this.speed = this.getRandomSpeed();
        this.x = position.x;
        this.y = position.y;
    }
};

var Player = function() {
    var sprite = 'images/char-boy.png';
    this.score = 0;
    Entity.call(this, sprite, this.PLAYERSTARTX, this.PLAYERSTARTY);
}
Player.prototype = Object.create(Entity.prototype);

Player.prototype.PLAYERSTARTX = 202;
Player.prototype.PLAYERSTARTY = 380;
Player.prototype.constructor = Player;
Player.prototype.update = function() {

    function onWater(){
        if(this.y === this.PLAYERSTARTY - 83*5) {
            gameState.changeScoreBy(50);
            return true;
        }

        return false;
    }

    function collisionOccured() {
        var collided = false;
        for(var i = 0; i < allEnemies.length ;i++) {
            if(Math.abs(allEnemies[i].x - this.x) <= 60 &&
                Math.abs(allEnemies[i].y - this.y) <= 20) {
                gameState.lostGame();
                collided = true;
            }
        }

        return collided;
    }

    if(onWater.call(this) || collisionOccured.call(this)) {
        this.x = this.PLAYERSTARTX;
        this.y = this.PLAYERSTARTY;
    }
}
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

/* Instantiating the game state. The game state is modified in update methods
 * of the enemies or/and player.
*/
var gameState = new GameState();

// Instantiating the enemy array and the player.
var allEnemies = [];
var player;
for(var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
player = new Player();

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

function toggleMenu(display) {
    var playerMenu = document.getElementsByClassName('player');
    for(var i = 0; i < playerMenu.length; i++) {
        playerMenu[i].style.display = display;
    }
    var header = document.getElementsByTagName('h1')[0];
    header.style.display = display === 'none' ? display : 'block';
}

window.onload = function() {
    var playerSprites = document.getElementsByTagName('img');
    for(var i = 0; i < playerSprites.length; i++) {
        playerSprites[i].addEventListener('click', function(e){
            gameState.gameCondition = GameConditionEnum.Playing;
            player.sprite = e.currentTarget.getAttribute('data-src');
        });
    }
}