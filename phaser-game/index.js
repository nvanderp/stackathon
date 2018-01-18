window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    let dot
    let leaf

    function preload() {

        game.load.image('dot', '../assets/blue_circle.png')
        game.load.image('leaf', '../assets/leaf.png')

    }

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.stage.backgroundColor = '#DCDCDC'

        game.physics.p2.setImpactEvents(true)

        game.physics.p2.restitution = 0.5
        game.physics.p2.gravity.y = 300

        let dotCollisionGroup = game.physics.p2.createCollisionGroup()
        let leafCollisionGroup = game.physics.p2.createCollisionGroup()

        game.physics.p2.updateBoundsCollisionGroup()

    /* Dots */

        let dots = game.add.group()
        dots.enableBody = true
        dots.physicsBodyType = Phaser.Physics.P2JS

        dot = dots.create(400, 0, 'dot')
        dot.body.setCircle(12.5)

        dot.body.setCollisionGroup(dotCollisionGroup)

        dot.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(dot)

    /* leafs */

        let leafs = game.add.group()
        leafs.enableBody = true
        leafs.physicsBodyType = Phaser.Physics.P2JS

        leaf = leafs.create(375, 300, 'leaf')
        leaf.body.setRectangle(125, 10)

        leaf.body.setCollisionGroup(leafCollisionGroup)

        leaf.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(leaf)

        leaf.body.kinematic = true

        leaf.using = false

        leaf.anchor.setTo(0.5, 0.5)

    }

    function update() {

        leaf.body.angle -= 1

    }

    function render() {

    }

}

