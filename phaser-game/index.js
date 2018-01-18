window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    let dot
    let leaf
    let dots
    let dotCollisionGroup
    let leafCollisionGroup
    let dotTimer = 0

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

        dotCollisionGroup = game.physics.p2.createCollisionGroup()
        leafCollisionGroup = game.physics.p2.createCollisionGroup()

        game.physics.p2.updateBoundsCollisionGroup()

    /* Dots */

        dots = game.add.group()
        dots.enableBody = true
        dots.physicsBodyType = Phaser.Physics.P2JS
        dots.createMultiple(30, 'dot')
        dots.setAll('anchor.x', 0.5)
        dots.setAll('anchor.y', 0.5)

    /* leafs */

        leafs = game.add.group()
        leafs.enableBody = true
        leafs.physicsBodyType = Phaser.Physics.P2JS

        leaf = leafs.create(375, 300, 'leaf')
        leaf.body.setRectangle(125, 10)

        leaf.body.setCollisionGroup(leafCollisionGroup)

        leaf.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(leaf)

        leaf.body.kinematic = true

        leaf.using = false

        leaf.anchor.setTo(0, 0.5)

    }

    function update() {

        leaf.body.angle -= 1

        if (game.time.now > dotTimer) {
            spawnDot()
        }

    }

    function render() {

    }

    function spawnDot() {
        
        dot = dots.getFirstExists(false)
    
        // dot = dots.create(400, 0, 'dot')
        dot.body.setCircle(12.5)
    
        dot.body.setCollisionGroup(dotCollisionGroup)
    
        dot.body.collides([dotCollisionGroup, leafCollisionGroup])
    
        game.physics.p2.enable(dot)
    
        if (dot) {
            dot.reset(400, 0)

            dotTimer = game.time.now + 2000
        }
    }

}
