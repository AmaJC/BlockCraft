let gameScene = new Phaser.Scene('Game');

let config = {
	type: Phaser.AUTO,
	width: 852,
	height: 480,
	scene: gameScene
};

let game = new Phaser.Game(config);

// Initialize scene parameters
gameScene.init = function() {
	this.playerSpeed = 5;
}

// Preload assets
gameScene.preload = function() {
	this.load.image('background', 'assets/sky.jpg');
	this.load.image('player', 'assets/player.png');
};
 
// Initialize game scene
gameScene.create = function() {
	let bg = this.add.sprite(0, 0, 'background');
	bg.setOrigin(0,0);
	this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
	this.player.setScale(0.5);
	this.isPlayerAlive = true;
	cursors = game.input.keyboard.createCursorKeys();
};

// Update game frame (called repeatedly)
gameScene.update = function() {
	if (!this.isPlayerAlive) {
		return;
	}
	// check for active input
	if (cursors.right.isDown) {
		this.player.x += this.playerSpeed;
	} else if (cursors.left.isDown) {
		this.player.x -= this.playerSpeed;
	} else if (this.input.activePointer.isDown) {
		// mouse left click
		this.player.x += this.playerSpeed;
	}
};

gameScene.gameOver = function() {
	// shake the camera
	this.cameras.main.shake(500);

	// restart game
	this.scene.manager.bootScene(this);
}


