var game = new Phaser.Game(500, 600, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#b7b7b7';

        game.load.image('car', 'assets/car.png');
        game.load.image('stair', 'assets/stair.png');
    },

    create: function() {
        this.gamePaused = false;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.stairs = game.add.group();
        this.stairs.enableBody = true;
        this.stairs.createMultiple(20, 'stair');
        this.timer = this.game.time.events.loop(1500, this.addRowOfStairs, this);

        this.moveTimer = 5;
        this.carPosition = 0;

        this.car = this.game.add.sprite(5, 540, 'car');
        game.physics.arcade.enable(this.car);

        // New anchor position
        this.car.anchor.setTo(-0.2, 0.5);

        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.score = -2;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    },

    goRight: function() {
        if(this.carPosition != 7) {
            if(this.moveTimer == 5) {
                this.car.body.x = this.car.body.x + 60;
                this.moveTimer = 0;
                this.carPosition = this.carPosition + 1;
            } else {
                this.moveTimer = this.moveTimer + 1;
            }
        }
    },

    goLeft: function() {
        if(this.carPosition != 0) {
            if(this.moveTimer == 5) {
                this.car.body.x = this.car.body.x - 60;
                this.moveTimer = 0;
                this.carPosition = this.carPosition - 1;
            } else {
                this.moveTimer = this.moveTimer + 1;
            }
        }
    },

    stopCar: function() {
        this.moveTimer = 5;
    },

    update: function() {
        if(!this.gamePaused) {
            if(this.leftKey.isDown)
                this.goLeft();
            else if(this.rightKey.isDown)
                this.goRight();
            else
                this.stopCar();
            game.physics.arcade.overlap(this.car, this.stairs, this.hitStair, null, this);
        } else {
            if(this.spacebar.justPressed()) {
                this.gamePaused = false;
                game.state.start('main');
            }
        }
    },

    hitStair: function() {
        // If the car has already hit a stair, we have nothing to do
        if (this.car.alive == false)
            return;

        // Set the alive property of the car to false
        this.car.alive = false;

        // Prevent new stairs from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the stairs, and stop their movement
        this.stairs.forEachAlive(function(p) {
            p.body.velocity.y = 0;
        }, this);

        this.restartGame();
    },

    restartGame: function() {
        // Print the score for the user
        this.endMessage = this.game.add.text(100, 245, "Score: " + this.score, {
            font: "24px Arial", fill: "#ffffff"
        });

        //Print the option for the user to restart the game
        this.endMessage = this.game.add.text(100, 275, "Press spacebar to restart", {
            font: "24px Arial", fill: "#ffffff"
        });

        this.gamePaused = true;
    },

    addOneStair: function(x, y) {
        var stair = this.stairs.getFirstDead();

        stair.reset(x, y);
        stair.body.velocity.y = 200;
        stair.checkWorldBounds = true;
        stair.outOfBoundsKill = true;
    },

    addRowOfStairs: function() {
        var stairs1 = Math.floor(Math.random()*6);
        var stairs2 = Math.floor(Math.random()*6);

        for (var i = 0; i < 8; i++)
            if (i == stairs1 || i == stairs1 +1 || i == stairs1 +2 || i == stairs2 || i == stairs2 +1 || i == stairs2 +2)
                this.addOneStair(i*60+10, -40);

        this.score += 1;
        if(this.score >= 0){
            this.labelScore.text = this.score;
        }
    }
};

//Start the game
game.state.add('main', mainState);
game.state.start('main');
