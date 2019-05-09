var game = new Phaser.Game(800, 1000, Phaser.AUTO, ''); //this creates our game object. its pretty a pretty good thing to use.
//here we declare our variables we use later in the code. I think its good form to declare variables at the top of the program for globals (which these all are)
var player; //marking memory for our player
var platforms; //this is declared a group later, but JS doesnt care, its all a var for now (i personally dont like this about JS, to much room for confusion)
var cursors;
var stars;
var diomond;
var enemy;
var enemy1;
var enemy2;
var scoreText;
var startText;
var endText;
var bop;

var MainMenu = function(game) {this.snow};
MainMenu.prototype = {
	preload: function() { //this preloads out images and audio files
	game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
    game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
	game.load.spritesheet('enemy', 'assets/img/baddie.png', 32, 32);
	game.load.audio('bop', 'assets/audio/bop.mp3');
	game.load.image('snow', 'assets/img/snow.png');
		console.log('MainMenu: preload');
	},
	create: function() {
		cursors = game.input.keyboard.createCursorKeys(); //allows input checking from keyboard
		startText=game.add.text(25, 25, 'use arrow keys to move, Press space to start. Collect the stars to win!', { fontSize: '20px', fill: '#555' }); //adds starting text


	},
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ 
			game.state.start('Play', true, false, 0);
		} //changes the state if the spacebar is pushed
	}
}

var Play = function(game) {this.snow};
Play.prototype = { //prototype of our play state
	init: function(passscore) { //passing the score variable locally
		score=passscore;
	},
	preload: function() {
		//not preloading anything here, dont have to, already did in mainmenu
    
	},
	create: function() {
		bop=game.add.audio('bop'); //adds audio and gives it a name
	game.physics.startSystem(Phaser.Physics.ARCADE); //this is the physics system being implimented into our game. Needed for several things including collisions and velocity tracking.

    game.add.sprite(0, 0, 'sky'); //adds our background

    platforms = game.add.group(); //creates the platform group

    platforms.enableBody = true; //makes the platforms solid.
	
	diomond = game.add.group();
	diomond.enableBody=true;
	var dioinstance=diomond.create(800-Math.random()*700, 1000-Math.random()*900, 'diamond'); 
	//adds our diamond
	console.log(dioinstance.x, dioinstance.y);
    var ground = platforms.create(0, game.world.height - 64, 'ground'); //creates the ground 64 pixels from the bottom of the screen, left alligned

    ground.scale.setTo(2, 2); //makes the ground go across the screen with a width that covers all the way to the bottom. sclaes the image to be bigger.

    ground.body.immovable = true; //makes the ground not fall

    var ledge = platforms.create(400, 500, 'ground'); //creates a ledge
    ledge.body.immovable = true; //makes one ledge not fall when they collide.

    ledge = platforms.create(-300, 250, 'ground'); //creates second ledge
    ledge.body.immovable = true; //does the same for the second ledge
 
	ledge = platforms.create(-150, 350, 'ground'); //creates third ledge
    ledge.body.immovable = true; //does the same for the third ledge
	
	ledge = platforms.create(-100, 700, 'ground'); //creates fourth ledge
    ledge.body.immovable = true; //does the same for the fourth ledge
	
	enemy = game.add.group();
	enemy.enableBody = true; 
	
	var enemy1= enemy.create(50,game.world.height - 700, 'enemy'); //create first enemy
	var enemy2 = enemy.create(700, game.world.height - 950, 'enemy'); //create second enemy
	
	enemy1.body.gravity.y=10000; //sets fun gravity
	enemy1.body.bounce.y = 0; //no bounce for enemy
	enemy1.animations.add('left', [0, 1], 10, true); //sets anumation
	enemy2.body.gravity.y=10000; //sets fun gravity
	enemy2.body.bounce.y = 0; //no bounce for u
	enemy2.animations.add('right', [2, 3], 10, true);//sets animation
	enemy1.animations.play('left'); //plays animation
	enemy2.animations.play('right'); //plays animation
	
	
	
	
    player = game.add.sprite(32, game.world.height - 150, 'dude'); //makes our player sprite appear.
	
    game.physics.arcade.enable(player); //puts physics on our player.

    player.body.bounce.y = 1.1; //makes our player bounce faster over time
    player.body.gravity.y = 1000; //sets the gravity low AF
    player.body.collideWorldBounds = true; //makes our player not fly off the screen

    player.animations.add('left', [0, 1, 2, 3], 10, true); //sets walking animations from our spritemap
    player.animations.add('right', [5, 6, 7, 8], 10, true);//sets walking animations from our spritemap

    stars = game.add.group(); //makes a new group for the stars

    stars.enableBody = true; //gives the stars a physics body

	var placedstar1 = stars.create(40,650, 'star'); //creates a random star for fun
	placedstar1.body.gravity.y = 300; //same settings tho lol
    placedstar1.body.bounce.y = 1; //same settings tho lol
	
    for (var i = 0; i != 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');

        star.body.gravity.y = 300;

        star.body.bounce.y = 1;
    } //creates the stars, 12 of them 70 apart, and sets their variables.
    for(var k = 0; k!=100; k++){
    	this.snow=new snowstorm(game, 'snow', .04, 0);
		game.add.existing(this.snow);
    } //spawns 100 snow


    scoreText = game.add.text(16, 16, 'score: '+score, { fontSize: '32px', fill: '#000' }); //creates text

    cursors = game.input.keyboard.createCursorKeys(); //creates the ability to monitor keyboard keys (a necessity for any game im sure)
   },
	update: function() {
		    var hitPlatform = game.physics.arcade.collide(player, platforms); //checks for collisions between players and platforms
    game.physics.arcade.collide(stars, platforms); //colliders btween stars and platforms
	game.physics.arcade.collide(enemy, platforms); //colliders btween enemy and platforms
	game.physics.arcade.overlap(diomond, platforms, retry, null, this); //moves the diomond out of the platforms
	game.physics.arcade.overlap(player, enemy, oof, null, this, score); //collisions between player and enemy
    game.physics.arcade.overlap(player, stars, collectStar, null, this); //calls a function (collectstar) if the player collides with the star.
	 game.physics.arcade.overlap(player, diomond, collectdamond, null, this); //collision between diomond and player

    player.body.velocity.x = 0; // reduces velocity each frame, so the player doesnt slide around if hes not holding a key down.

    if (cursors.left.isDown) //check to see if we tryna move left
    {
        
        player.body.velocity.x = -150; //move us left

        player.animations.play('left'); //play the left animation
    }
    else if (cursors.right.isDown) //now same for the right side
    {

        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else //if not moving left or right, dont play a walking animation
    {

        player.animations.stop();

        player.frame = 4;
    }
    
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) //jumpy boi
    {
        player.body.velocity.y = -350;
    }
	if(stars.total<1){
		game.state.start('GameOver', true, false, score);
	}
	}
}

var GameOver = function(game) {};
GameOver.prototype = {
	
	init: function(passscore) { //once again score is being passed locally
		score=passscore;
	},
	preload: function() {
	},
	create: function() {
		endText=game.add.text(25, 25, 'game over, your score was  '+ score + '! press r to retry', { fontSize: '20px', fill: '#555' }); //displays text
	},
	update: function() {
		changescore(); //this doesnt really do anything, its just there because i wanted to test something. technically updates the score if it changes in the game over state
		if(game.input.keyboard.isDown(Phaser.Keyboard.R)){ 
			game.state.start('Play', true, false, 0);
		} //restarts the game
	}
}

game.state.add('MainMenu', MainMenu); //adds the states
game.state.add('Play', Play); 
game.state.add('GameOver', GameOver);
game.state.start('MainMenu'); //sets starting state




function collectStar (player, star) {    
    star.kill(); //absolutly destroys the stars when they touch the player (collects is a good word to lol)
    score += 10; //changes the score
    scoreText.text = 'Score: ' + score; //updates the text on the board.
   bop.play('',0,0.5,false);
}
function collectdamond (player, diamond) {   
    diamond.kill(); //absolutly destroys the diamond when it touches the player (collects is a good word to lol)
    score += 50; //changes the score
    scoreText.text = 'Score: ' + score; //updates the text on the board.
}
function retry (diomond, platforms) {
    diomond.y+=50; //moves the diomond
}
function oof (player, enemy) {
    enemy.kill(); //absolutly destroys the enemy when it touches the player 
    score -=25; //changes the score
    changestatetoover(); //changes the state to gameover when called
}
function changescore(){
	endText.text =  'game over, your score was '+ score + '! press r to retry'; //updates the text
}
function changestatetoover(){
	  game.state.start('GameOver',true,false, score); //changes gamestate to game over
}