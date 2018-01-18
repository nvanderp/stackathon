window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    function preload() {

        game.load.image('dot', '../assets/blue_circle.png')
        game.load.image('leaf', '../assets/leaf.png')

    }

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.stage.backgroundColor = '#2d2d2d'

        game.physics.p2.setImpactEvents(true)

        game.physics.p2.restitution = 0.5
        game.physics.p2.gravity.y = 300

        let dotCollisionGroup = game.physics.p2.createCollisionGroup()
        let leafCollisionGroup = game.physics.p2.createCollisionGroup()

        game.physics.p2.updateBoundsCollisionGroup()

        let dots = game.add.group()
        dots.enableBody = true
        dots.physicsBodyType = Phaser.Physics.P2JS

        let dot = dots.create(400, 0, 'dot')
        dot.body.setCircle(12.5)

        dot.body.setCollisionGroup(dotCollisionGroup)

        dot.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(dot)

    }

    function update() {

        // Collide dots with platforms
        // game.physics.arcade.collide(dots, platforms)


    }

    function render() {

    }

}

