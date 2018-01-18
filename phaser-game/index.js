window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

    let leaf
    let dot

    let dragging = false

    function preload() {

        // Load assets
        game.load.image('blueCircle', './assets/blue_circle.png')
        game.load.image('leaf', './assets/leaf.png')

        game.input.maxPointers = 1

    }

    function create() {

        // Background for game
        game.stage.backgroundColor = "#4488AA"

        // Enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE)
        

    /*    GROUPS     */

        /*   DOT GROUP */

        // Group for any 'dot'
        dots = game.add.group()

        // Enables physics for any object of this group
        dots.enableBody = true

        dot = dots.create(game.world.centerX, 0, 'blueCircle' )

        // Dots physics properties
        dot.body.bounce.y = .85
        dot.body.gravity.y = 700

        /*    LEAF GROUP  */

        // Group for any 'platforms' (.i.e. 'leafs')
        platforms = game.add.group()

        // Enables physics for any object of this group
        platforms.enableBody = true

        // Create the actual 'leafs'
        leaf = platforms.create(game.world.centerX, game.world.centerY, 'leaf')

        // Anchor leaf on its right end
        leaf.anchor.setTo(0, 1)

        // Enable input and drag for 'leaf' sprite
        leaf.inputEnabled = true
        // leaf.input.enableDrag()

        // Event listeners for 'leafs'
        leaf.events.onInputDown.add(rotateLeaf, this)

        leaf.pivot.x = 0
        leaf.pivot.y = 0

        // Stops it from moving when 'pushed'
        leaf.body.immovable = true

    }

    function rotateLeaf(sprite) {
        
        let targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
            sprite.x, sprite.y,
            this.game.input.activePointer.x, this.game.input.activePointer.y
        )
        
        if (targetAngle < 0) targetAngle += 360
        if (game.input.activePointer.isDown && !dragging) {
            dragging = true
        }
        if (!game.input.activePointer.isDown && dragging) {
            dragging = false
        }
        if (dragging) sprite.angle = targetAngle
        
    }

    function update() {

        // Collide dots with platforms
        game.physics.arcade.collide(dots, platforms)


    }

}

