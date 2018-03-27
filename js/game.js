let game = new Phaser.Game(852, 480, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update });

// Declaration of global variables
let score = 0
let scoreText
let cursors
let player
let groundLayer
let map
/* Where the user is pointing at currently */
let marker

// Preload assets
function preload() {
	game.load.image('background', 'assets/sky.jpg');
	game.load.image('player', 'assets/player.png');
	game.load.image('dirt', 'assets/dirt.jpg');
	game.load.image('ground', 'assets/platform.png')
 	game.load.image('diamond', 'assets/diamond.png')
	game.load.spritesheet('woof', 'assets/woof.png', 32, 32) // frameWidth, frameHeight

	// this.game.load.tilemap('tilemap', 'assets/basicMap.json', null, Phaser.Tilemap.TILED_JSON);
 //    this.game.load.image('tiles', 'assets/basictileset.png');
 	// game.load.tilemap('map', 'assets/testMap_GroundLayer.csv');
 	// game.load.tilemap('water', 'assets/testMap_WaterLayer.csv');
 	// game.load.image('tileset', 'assets/basictileset.png')

 	this.game.load.tilemap('testmap', 'testMap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'basictileset.png');
};
 
// Initialize game scene
function create() {
	game.add.sprite(0, 0, 'background');
	cursors = game.input.keyboard.createCursorKeys();
	// Enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE)
	game.stage.backgroundColor = "#00bfff";

	map = game.add.tilemap('testmap');
    map.addTilesetImage('basictileset', 'tiles'); // Tiled tileset name, asset name from above
    groundLayer = map.createLayer('GroundLayer');
    map.setCollisionBetween(1, 100, true, 'GroundLayer');
    groundLayer.resizeWorld();

	// Create player and its physics properties
	player = game.add.sprite(game.world.width * 0.5, game.world.height * 0.2, 'woof')
	game.physics.arcade.enable(player)
	player.body.bounce.y = 0.2
	player.body.gravity.y = 800
	player.body.collideWorldBounds = true
	// Player walking animations
	player.animations.add('left', [0, 1], 10, true) // name, frames the animation will run, frameRate, loop
	player.animations.add('right', [2, 3], 10, true)

	game.camera.follow(player);
	
	// diamonds = game.add.group()
	marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);
 //    //  Enable physics for any object that is created in this group
 //  diamonds.enableBody = true

 //    //  Create 12 diamonds evenly spaced apart
 //  for (var i = 0; i < 12; i++) {
 //    let diamond = diamonds.create(i * 70, 0, 'diamond')

 //      //  Drop em from the sky and bounce a bit
 //    diamond.body.gravity.y = 1000
 //    diamond.body.bounce.y = 0.3 + Math.random() * 0.2
 //  }

	// scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
};

var lastMove;

// Update game frame (called repeatedly)
function update() {
	var currentTile;
	marker.x = groundLayer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = groundLayer.getTileY(game.input.activePointer.worldY) * 32;
    // if (game.input.mousePointer.isDown)
    // {
    //     if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
    //     {
    //         currentTile = map.getTile(groundLayer.getTileX(marker.x), groundLayer.getTileY(marker.y));
    //         console.log(currentTile);
    //     }
    //     else
    //     {
    //         if (map.getTile(groundLayer.getTileX(marker.x), groundLayer.getTileY(marker.y)).index != currentTile.index)
    //         {
    //         	console.log("put");
    //             map.putTile(currentTile, groundLayer.getTileX(marker.x), groundLayer.getTileY(marker.y));
    //         }
    //     }
    // }

	player.body.velocity.x = 0
	game.physics.arcade.collide(player, groundLayer);
	//  Setup collisions for the player, diamonds, and our platforms
	// game.physics.arcade.collide(player, platforms)
	// game.physics.arcade.collide(diamonds, platforms)
	// Input frmo arrow keys or mouse click
	if (cursors.right.isDown) {
		player.body.velocity.x = 150;
		player.animations.play('right');
		lastMove = 'right';
	} else if (cursors.left.isDown) {
		player.body.velocity.x = -150;
		player.animations.play('left');
		lastMove = 'left';
	} else if (this.input.activePointer.isDown) {
		// mouse left click
		player.body.velocity.x = 150
		player.animations.play('right')
	} else {
		if (lastMove == 'left') {
			player.animations.frame = 1;
		} else if (lastMove == 'right') {
			player.animations.frame = 2;
		}
		player.animations.stop()
	}
	if (cursors.up.isDown) {
	    player.body.velocity.y = -400
	}
};

function gameOver() {
	// shake the camera
	this.cameras.main.shake(500);

	// restart game
	this.scene.manager.bootScene(this);
}

function createPlayer(x, y) {
	var player = this.physics.add.image(x, y, 'player');
	player.setScale(0.5);
	player.isAlive = true;
	player.setCollideWorldBounds(true);
	player.setGravityY(200);
	// player.body.bounce.y = 0.2;
	// player.body.gravity.y = 300;
	
	//this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
	return player;
}

