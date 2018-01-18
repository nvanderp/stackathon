window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    function preload() {

        game.load.image('dot', '../assets/blue_circle.png')
        game.load.image('leaf', '../assets/leaf.png')

    }

    let dot

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.stage.backgroundColor = '#2d2d2d'

        game.physics.p2.restitution = 0.5
        game.physics.p2.gravity.y = 300

        dot = game.add.sprite(400, 0, 'dot')

        game.physics.p2.enable(dot)

        dot.body.fixedRotation = true

    }

    function update() {

        // Collide dots with platforms
        // game.physics.arcade.collide(dots, platforms)


    }

    function render() {

    }

}

