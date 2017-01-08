// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.setRandomPosition();
    this.setRandomSpeed();
};

var playerStartX = 202;
var playerStartY = 380;
var allEnemies = [];
var player;

Enemy.prototype.setRandomSpeed = function(){
    this.speed = 250 + Math.floor(Math.random() * 300);
}

Enemy.prototype.setRandomPosition = function(){
    var enemyRow = 0 + Math.floor(Math.random() * 3);
    this.x = -80;
    this.y = 65 + 83*enemyRow;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += dt*this.speed;
    if(this.x > 505) {
        this.setRandomPosition();
        this.setRandomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
}
Player.prototype.update = function() {

    function winPosition(){
        if(this.y === playerStartY - 83*5) {
            return true;
        }

        return false;
    }

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

    if(winPosition.call(this) || collisionOccured.call(this)) {
        this.x = playerStartX;
        this.y = playerStartY;
    }
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
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

function createEnemies(){
    for(var i = 0; i < 3; i++) {
        allEnemies.push(new Enemy());
    }
}

createEnemies();
player = new Player(playerStartX, playerStartY);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
