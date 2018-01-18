window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    let leafPad
    let leafPads
    let leaf
    let dot
    let dots
    let dotCollisionGroup
    let leafCollisionGroup
    let dotTimer = 0
    let dragging = false

    function preload() {

        game.input.maxPointers = 1

        game.load.image('dot', '../assets/blue_circle.png')
        game.load.image('leaf', '../assets/leaf.png')
        game.load.image('leafPad', '../assets/leaf_pad.png')

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
        leafPads = game.add.group()

        leafs.enableBody = true
        leafs.physicsBodyType = Phaser.Physics.P2JS

        leaf = leafs.create(375, 300, 'leaf')
        leafPad = leafPads.create(312.5, 240, 'leafPad')

        game.world.sendToBack(leafPads)

        leaf.body.setRectangle(125, 10)

        leaf.body.setCollisionGroup(leafCollisionGroup)

        leaf.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(leaf)

        leaf.body.kinematic = true

        leaf.anchor.setTo(0.5, 0.5)

    /* Event Listeners */

        // leaf.inputEnabled = true
        leafPad.inputEnabled = true

        // leafPad.events.onInputDown.add(() => rotateLeaf(leaf))

    }

    function update() {

        if (game.time.now > dotTimer) spawnDot()

        if (game.input.activePointer.isDown) {rotateLeaf(leaf)}

    }

    function render() {

    }

    function spawnDot() {

        dot = dots.getFirstExists(false)    
    
        if (dot) {

            dot.body.setCircle(12.5)
    
            dot.body.setCollisionGroup(dotCollisionGroup)
        
            dot.body.collides([dotCollisionGroup, leafCollisionGroup])
        
            game.physics.p2.enable(dot)
            
            dot.reset(400, 0)

            dotTimer = game.time.now + 2000
        }
    }

    function rotateLeaf(leaf) {

        let targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
            leaf.x, leaf.y,
            game.input.activePointer.x, game.input.activePointer.y
        ) + 90

        if (targetAngle < 0) targetAngle += 360

        if (game.input.activePointer.isDown && !dragging) dragging = true

        if (!game.input.activePointer.isDown && dragging) dragging = false

        if (dragging) leaf.body.angle = targetAngle
    }

}
