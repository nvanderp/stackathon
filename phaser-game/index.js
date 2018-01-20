window.onload = function() {

    // Game OBJ
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update, render: render
    })

    let clouds
    let cloud
    let leafPad
    let leafPads
    let leaf
    let leaf2
    let dot
    let dots
    let dotCollisionGroup
    let leafCollisionGroup
    let dotTimer = 0
    let dragging = false
    let curPadClicked = null
    let leafToRotate
    let leafArr = []

    function preload() {

        game.input.maxPointers = 1

        game.load.image('dot', '../assets/blue_circle.png')
        game.load.image('leaf', '../assets/leaf.png')
        game.load.image('leafPad', '../assets/leaf_pad.png')
        game.load.image('cloud', '../assets/cloud.png')

    }

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.stage.backgroundColor = '#DCDCDC'

        game.physics.p2.setImpactEvents(true)

        game.physics.p2.restitution = 0.7
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
        leaf.name = 'leaf'
        leaf2 = leafs.create(200, 450, 'leaf')
        leaf2.name = 'leaf2'
        leafPad = leafPads.create(312.5, 240, 'leafPad')
        leafPad.name = 'leaf'
        leafPad2 = leafPads.create(137.5, 390, 'leafPad')
        leafPad2.name = 'leaf2'

        leafArr.push(leaf, leaf2)

        game.world.sendToBack(leafPads)

        leaf.body.setRectangle(125, 10)
        leaf2.body.setRectangle(125, 10)

        leaf.body.setCollisionGroup(leafCollisionGroup)
        leaf2.body.setCollisionGroup(leafCollisionGroup)

        leaf.body.collides([dotCollisionGroup, leafCollisionGroup])
        leaf2.body.collides([dotCollisionGroup, leafCollisionGroup])

        game.physics.p2.enable(leaf)
        game.physics.p2.enable(leaf2)

        leaf.body.kinematic = true
        leaf2.body.kinematic = true

        leaf.anchor.setTo(0.5, 0.5)
        leaf2.anchor.setTo(0.5, 0.5)

    /* Clouds */
        
        clouds = game.add.group()
        clouds.enableBody = true

        cloud = clouds.create(0, 0, 'cloud')
        game.world.bringToTop(clouds)

        cloud.inputEnabled = true

        cloud.input.enableDrag(true)

    /* Event Listeners */

        leafPad.inputEnabled = true
        leafPad2.inputEnabled = true

        leafPad.events.onInputDown.add(recordClick, this)
        leafPad.events.onInputUp.add(resetClick)

        leafPad2.events.onInputDown.add(recordClick, this)
        leafPad2.events.onInputUp.add(resetClick)

        // Point of contact

        // Listeners with Tone
        leaf.body.onBeginContact.add(() => playNote('C3'))
        leaf2.body.onBeginContact.add(() => playNote('A3'))
    }

    function update() {

        if (game.time.now > dotTimer) spawnDot()

        if (game.input.activePointer.isDown && curPadClicked) {
            leafToRotate = leafArr.find((leaf) => {
                return leaf.name === curPadClicked.name
            })
            rotateLeaf(leafToRotate)
        }

    }

    function render() {

    }

    function spawnDot() {

        dot = dots.getFirstExists(false)    
    
        if (dot) {

            // let randoX = Math.floor(Math.random() * 800)

            dot.body.setCircle(12.5)
    
            dot.body.setCollisionGroup(dotCollisionGroup)
        
            dot.body.collides([dotCollisionGroup, leafCollisionGroup])
        
            game.physics.p2.enable(dot)
            
            dot.reset(400, 0)

            dotTimer = game.time.now + 2000
        }
    }

    function rotateLeaf(curLeaf) {

        let targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
            curLeaf.x, curLeaf.y,
            game.input.activePointer.x, game.input.activePointer.y
        ) + 90

        if (targetAngle < 0) targetAngle += 360

        if (game.input.activePointer.isDown && !dragging) dragging = true

        if (!game.input.activePointer.isDown && dragging) dragging = false

        if (dragging) curLeaf.body.angle = targetAngle
    }

    function recordClick(leafPad) {

        curPadClicked = leafPad

    }

    function resetClick() {

        curPadClicked = null

    }

}

/* TONE JS */

const synth = new Tone.PolySynth(4, Tone.Synth, {
    "oscillator" : {
        "partials" : [0, 2, 3, 4]
    },
    "envelope" : {
        "attack" : 0.01,
        "decay" : 0.2,
        "sustain" : 0.02,
        "release" : 0.02,
    }
}).toMaster()

synth.set("volume", -5)

function playNote (note) {
    synth.triggerAttackRelease(note, .5)
}
