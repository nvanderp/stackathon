window.onload = function() {

  // Game OBJ
  const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, create: create, update: update, render: render
  })

  // Cloud variables
  let clouds, cloud, cloudTwo
  let cloudArr = []
  let cloudCollisionGroup
  let cloudBounds

  // Leaf variables
  let leafs, leafOne, leafTwo, leafThree, leafFour, leafFive, leafSix
  let curLeafSelected = null

  // Stem variables
  let stems
  let stemOneAnchor, stemOneLeft, stemOneMiddle, stemOneRight
  let stemTwoAnchor, stemTwoLeft, stemTwoMiddle, stemTwoRight
  let stemThreeAnchor, stemThreeLeft, stemThreeMiddle, stemThreeRight
  let stemFourAnchor, stemFourLeft, stemFourMiddle, stemFourRight
  let stemFiveAnchor, stemFiveLeft, stemFiveMiddle, stemFiveRight
  let selectedStemArr = []
  let stemCollisionGroup
  let stemsToRotate

  // Drop variables
  let drops, drop
  let dropCollisionGroup
  let dropTimer = 0

  // Global User variables
  let dragging = false

  function preload() {

    game.input.maxPointers = 1

    game.load.image('cloud', '../assets/cloud.png')
    game.load.image('leaf', '../assets/leaf_pad.png')
    game.load.image('stemWhole', '../assets/stem.png')
    game.load.image('stemLeft', '../assets/stem_left.png')
    game.load.image('stemMiddle', '../assets/stem_split.png')
    game.load.image('stemRight', '../assets/stem_right.png')
    game.load.image('drop', '../assets/blue_circle.png')

  }

  function create() {

    // Physics
    game.physics.startSystem(Phaser.Physics.P2JS)

    game.physics.p2.setImpactEvents(true)

    game.physics.p2.restitution = 0.6
    game.physics.p2.gravity.y = 300

    // Stage Background settings
    game.stage.backgroundColor = '#DCDCDC'

    // Collision Groups
    dropCollisionGroup = game.physics.p2.createCollisionGroup()
    stemCollisionGroup = game.physics.p2.createCollisionGroup()
    cloudCollisionGroup = game.physics.p2.createCollisionGroup()

    game.physics.p2.updateBoundsCollisionGroup()

  /* Drops */
    drops = game.add.group()
    drops.enableBody = true
    drops.physicsBodyType = Phaser.Physics.P2JS

    drops.createMultiple(60, 'drop')
    drops.setAll('anchor.x', 0.5)
    drops.setAll('anchor.y', 0.5)

  /* Stems */
    stems = game.add.group()
    stems.enableBody = true
    stems.physicsBodyType = Phaser.Physics.P2JS

    // StemOne
    stemOneAnchor = stems.create(480, 300)
    stemOneAnchor.name = 'leafOne stemAnchor'
    game.physics.p2.enable(stemOneAnchor)
    stemOneAnchor.body.kinematic = true
    stemOneAnchor.anchor.setTo(0.5, 0.5)

    stemOneLeft = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemLeft')
    stemOneLeft.name = 'leafOne stem stemLeft'
    stemOneLeft.body.setRectangle(41.5, 10, -41.5)
    stemOneLeft.body.setCollisionGroup(stemCollisionGroup)
    stemOneLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneLeft)
    stemOneLeft.body.kinematic = true
    stemOneLeft.anchor.setTo(0.5, 0.5)

    stemOneMiddle = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemMiddle')
    stemOneMiddle.name = 'leafOne stem stemMiddle'
    stemOneMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemOneMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemOneMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneMiddle)
    stemOneMiddle.body.kinematic = true
    stemOneMiddle.anchor.setTo(0.5, 0.5)

    stemOneRight = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemRight')
    stemOneRight.name = 'leafOne stem stemRight'
    stemOneRight.body.setRectangle(41.5, 10, 41.5)
    stemOneRight.body.setCollisionGroup(stemCollisionGroup)
    stemOneRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneRight)
    stemOneRight.body.kinematic = true
    stemOneRight.anchor.setTo(0.5, 0.5)

    // StemTwo
    stemTwoAnchor = stems.create(335, 300)
    stemTwoAnchor.name = 'leafTwo stemAnchor'
    game.physics.p2.enable(stemTwoAnchor)
    stemTwoAnchor.body.kinematic = true
    stemTwoAnchor.anchor.setTo(0.5, 0.5)

    stemTwoLeft = stems.create(stemTwoAnchor.x, stemTwoAnchor.y, 'stemLeft')
    stemTwoLeft.name = 'leafTwo stem stemLeft'
    stemTwoLeft.body.setRectangle(41.5, 10, -41.5)
    stemTwoLeft.body.setCollisionGroup(stemCollisionGroup)
    stemTwoLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemTwoLeft)
    stemTwoLeft.body.kinematic = true
    stemTwoLeft.anchor.setTo(0.5, 0.5)

    stemTwoMiddle = stems.create(stemTwoAnchor.x, stemTwoAnchor.y, 'stemMiddle')
    stemTwoMiddle.name = 'leafTwo stem stemMiddle'
    stemTwoMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemTwoMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemTwoMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemTwoMiddle)
    stemTwoMiddle.body.kinematic = true
    stemTwoMiddle.anchor.setTo(0.5, 0.5)

    stemTwoRight = stems.create(stemTwoAnchor.x, stemTwoAnchor.y, 'stemRight')
    stemTwoRight.name = 'leafTwo stem stemRight'
    stemTwoRight.body.setRectangle(41.5, 10, 41.5)
    stemTwoRight.body.setCollisionGroup(stemCollisionGroup)
    stemTwoRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemTwoRight)
    stemTwoRight.body.kinematic = true
    stemTwoRight.anchor.setTo(0.5, 0.5)

    // StemThree
    stemThreeAnchor = stems.create(505, 450)
    stemThreeAnchor.name = 'leafThree stemAnchor'
    game.physics.p2.enable(stemThreeAnchor)
    stemThreeAnchor.body.kinematic = true
    stemThreeAnchor.anchor.setTo(0.5, 0.5)

    stemThreeLeft = stems.create(stemThreeAnchor.x, stemThreeAnchor.y, 'stemLeft')
    stemThreeLeft.name = 'leafThree stem stemLeft'
    stemThreeLeft.body.setRectangle(41.5, 10, -41.5)
    stemThreeLeft.body.setCollisionGroup(stemCollisionGroup)
    stemThreeLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemThreeLeft)
    stemThreeLeft.body.kinematic = true
    stemThreeLeft.anchor.setTo(0.5, 0.5)

    stemThreeMiddle = stems.create(stemThreeAnchor.x, stemThreeAnchor.y, 'stemMiddle')
    stemThreeMiddle.name = 'leafThree stem stemMiddle'
    stemThreeMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemThreeMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemThreeMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemThreeMiddle)
    stemThreeMiddle.body.kinematic = true
    stemThreeMiddle.anchor.setTo(0.5, 0.5)

    stemThreeRight = stems.create(stemThreeAnchor.x, stemThreeAnchor.y, 'stemRight')
    stemThreeRight.name = 'leafThree stem stemRight'
    stemThreeRight.body.setRectangle(41.5, 10, 41.5)
    stemThreeRight.body.setCollisionGroup(stemCollisionGroup)
    stemThreeRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemThreeRight)
    stemThreeRight.body.kinematic = true
    stemThreeRight.anchor.setTo(0.5, 0.5)

    // StemFour
    stemFourAnchor = stems.create(310, 450)
    stemFourAnchor.name = 'leafFour stemAnchor'
    game.physics.p2.enable(stemFourAnchor)
    stemFourAnchor.body.kinematic = true
    stemFourAnchor.anchor.setTo(0.5, 0.5)

    stemFourLeft = stems.create(stemFourAnchor.x, stemFourAnchor.y, 'stemLeft')
    stemFourLeft.name = 'leafFour stem stemLeft'
    stemFourLeft.body.setRectangle(41.5, 10, -41.5)
    stemFourLeft.body.setCollisionGroup(stemCollisionGroup)
    stemFourLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFourLeft)
    stemFourLeft.body.kinematic = true
    stemFourLeft.anchor.setTo(0.5, 0.5)

    stemFourMiddle = stems.create(stemFourAnchor.x, stemFourAnchor.y, 'stemMiddle')
    stemFourMiddle.name = 'leafFour stem stemMiddle'
    stemFourMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemFourMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemFourMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFourMiddle)
    stemFourMiddle.body.kinematic = true
    stemFourMiddle.anchor.setTo(0.5, 0.5)

    stemFourRight = stems.create(stemFourAnchor.x, stemFourAnchor.y, 'stemRight')
    stemFourRight.name = 'leafFour stem stemRight'
    stemFourRight.body.setRectangle(41.5, 10, 41.5)
    stemFourRight.body.setCollisionGroup(stemCollisionGroup)
    stemFourRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFourRight)
    stemFourRight.body.kinematic = true
    stemFourRight.anchor.setTo(0.5, 0.5)

    // StemFive
    stemFiveAnchor = stems.create(150, 400)
    stemFiveAnchor.name = 'leafFive stemAnchor'
    game.physics.p2.enable(stemFiveAnchor)
    stemFiveAnchor.body.kinematic = true
    stemFiveAnchor.anchor.setTo(0.5, 0.5)

    stemFiveLeft = stems.create(stemFiveAnchor.x, stemFiveAnchor.y, 'stemLeft')
    stemFiveLeft.name = 'leafFive stem stemLeft'
    stemFiveLeft.body.setRectangle(41.5, 10, -41.5)
    stemFiveLeft.body.setCollisionGroup(stemCollisionGroup)
    stemFiveLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFiveLeft)
    stemFiveLeft.body.kinematic = true
    stemFiveLeft.anchor.setTo(0.5, 0.5)

    stemFiveMiddle = stems.create(stemFiveAnchor.x, stemFiveAnchor.y, 'stemMiddle')
    stemFiveMiddle.name = 'leafFive stem stemMiddle'
    stemFiveMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemFiveMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemFiveMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFiveMiddle)
    stemFiveMiddle.body.kinematic = true
    stemFiveMiddle.anchor.setTo(0.5, 0.5)

    stemFiveRight = stems.create(stemFiveAnchor.x, stemFiveAnchor.y, 'stemRight')
    stemFiveRight.name = 'leafFive stem stemRight'
    stemFiveRight.body.setRectangle(41.5, 10, 41.5)
    stemFiveRight.body.setCollisionGroup(stemCollisionGroup)
    stemFiveRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemFiveRight)
    stemFiveRight.body.kinematic = true
    stemFiveRight.anchor.setTo(0.5, 0.5)

    // StemSix
    stemSixAnchor = stems.create(660, 400)
    stemSixAnchor.name = 'leafSix stemAnchor'
    game.physics.p2.enable(stemSixAnchor)
    stemSixAnchor.body.kinematic = true
    stemSixAnchor.anchor.setTo(0.5, 0.5)

    stemSixLeft = stems.create(stemSixAnchor.x, stemSixAnchor.y, 'stemLeft')
    stemSixLeft.name = 'leafSix stem stemLeft'
    stemSixLeft.body.setRectangle(41.5, 10, -41.5)
    stemSixLeft.body.setCollisionGroup(stemCollisionGroup)
    stemSixLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemSixLeft)
    stemSixLeft.body.kinematic = true
    stemSixLeft.anchor.setTo(0.5, 0.5)

    stemSixMiddle = stems.create(stemSixAnchor.x, stemSixAnchor.y, 'stemMiddle')
    stemSixMiddle.name = 'leafSix stem stemMiddle'
    stemSixMiddle.body.setRectangle(41.5, 10) // 42, 10
    stemSixMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemSixMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemSixMiddle)
    stemSixMiddle.body.kinematic = true
    stemSixMiddle.anchor.setTo(0.5, 0.5)

    stemSixRight = stems.create(stemSixAnchor.x, stemSixAnchor.y, 'stemRight')
    stemSixRight.name = 'leafSix stem stemRight'
    stemSixRight.body.setRectangle(41.5, 10, 41.5)
    stemSixRight.body.setCollisionGroup(stemCollisionGroup)
    stemSixRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemSixRight)
    stemSixRight.body.kinematic = true
    stemSixRight.anchor.setTo(0.5, 0.5)

  /* Leafs */
    leafs = game.add.group()
    game.world.sendToBack(leafs)

    // leafOne
    leafOne = leafs.create(stemOneAnchor.body.x - 62.5, stemOneAnchor.body.y - 60, 'leaf')
    leafOne.name = 'leafOne'
    leafOne.inputEnabled = true

    // leafTwo
    leafTwo = leafs.create(stemTwoAnchor.body.x - 62.5, stemTwoAnchor.body.y - 60, 'leaf')
    leafTwo.name = 'leafTwo'
    leafTwo.inputEnabled = true

    // leafThree
    leafThree = leafs.create(stemThreeAnchor.body.x - 62.5, stemThreeAnchor.body.y - 60, 'leaf')
    leafThree.name = 'leafThree'
    leafThree.inputEnabled = true

    // leafFour
    leafFour = leafs.create(stemFourAnchor.body.x - 62.5, stemFourAnchor.body.y - 60, 'leaf')
    leafFour.name = 'leafFour'
    leafFour.inputEnabled = true

    // leafFive
    leafFive = leafs.create(stemFiveAnchor.body.x - 62.5, stemFiveAnchor.body.y - 60, 'leaf')
    leafFive.name = 'leafFive'
    leafFive.inputEnabled = true

    // leafSix
    leafSix = leafs.create(stemSixAnchor.body.x - 62.5, stemSixAnchor.body.y - 60, 'leaf')
    leafSix.name = 'leafSix'
    leafSix.inputEnabled = true

  /* Clouds */
    clouds = game.add.group()
    clouds.enableBody = true
    game.world.bringToTop(clouds)

    // Cloud Dragging Bounds
    cloudBounds = new Phaser.Rectangle(0, 0, 800, 200)

    // Cloud
    cloud = clouds.create(270, 0, 'cloud')
    cloud.inputEnabled = true
    cloud.input.enableDrag(true)
    cloud.input.boundsRect = cloudBounds

    // cloudTwo
    cloudTwo = clouds.create(425, 0, 'cloud')
    cloudTwo.inputEnabled = true
    cloudTwo.input.enableDrag(true)
    cloud.input.boundsRect = cloudBounds

  /* Event Listeners */
    leafOne.events.onInputDown.add(selectLeaf, this)
    leafOne.events.onInputUp.add(resetSelectLeaf)

    leafTwo.events.onInputDown.add(selectLeaf, this)
    leafTwo.events.onInputUp.add(resetSelectLeaf)

    leafThree.events.onInputDown.add(selectLeaf, this)
    leafThree.events.onInputUp.add(resetSelectLeaf)

    leafFour.events.onInputDown.add(selectLeaf, this)
    leafFour.events.onInputUp.add(resetSelectLeaf)

    leafFive.events.onInputDown.add(selectLeaf, this)
    leafFive.events.onInputUp.add(resetSelectLeaf)

    leafSix.events.onInputDown.add(selectLeaf, this)
    leafSix.events.onInputUp.add(resetSelectLeaf)

    // Listners with Tone
    stemOneLeft.body.onBeginContact.add(() => playNote('C4'))
    stemOneMiddle.body.onBeginContact.add(() => playNote('C3'))
    stemOneRight.body.onBeginContact.add(() => playNote('C2'))

    stemTwoLeft.body.onBeginContact.add(() => playNote('A4'))
    stemTwoMiddle.body.onBeginContact.add(() => playNote('A3'))
    stemTwoRight.body.onBeginContact.add(() => playNote('A2'))

    stemThreeLeft.body.onBeginContact.add(() => playNote('E4'))
    stemThreeMiddle.body.onBeginContact.add(() => playNote('E3'))
    stemThreeRight.body.onBeginContact.add(() => playNote('E2'))

    stemFourLeft.body.onBeginContact.add(() => playNote('G4'))
    stemFourMiddle.body.onBeginContact.add(() => playNote('G3'))
    stemFourRight.body.onBeginContact.add(() => playNote('G2'))

    stemFiveLeft.body.onBeginContact.add(() => playNote('B4'))
    stemFiveMiddle.body.onBeginContact.add(() => playNote('B3'))
    stemFiveRight.body.onBeginContact.add(() => playNote('B2'))

    stemSixLeft.body.onBeginContact.add(() => playNote('F4'))
    stemSixMiddle.body.onBeginContact.add(() => playNote('F3'))
    stemSixRight.body.onBeginContact.add(() => playNote('F2'))

  }

  function update() {

    // Timer for spawning drops
    if (game.time.now > dropTimer) spawnDrop()

    // Clicking and rotating leaves
    if (game.input.activePointer.isDown && curLeafSelected) {
      stems.forEach(stem => {
        if (stem.name.includes(curLeafSelected.name)) selectedStemArr.push(stem)
      })
      rotateLeaf(selectedStemArr)
      selectedStemArr = []
    }

  }

  function render() {

  }

  function spawnDrop() {

    cloudArr = []

    clouds.forEach(cloud => {
      cloudArr.push(cloud)
    })

    drop = drops.getFirstExists(false)

    if (drop) {
      let random = game.rnd.integerInRange(0, cloudArr.length-1)
      let randomX = game.rnd.integerInRange(30, 95)

      let randoCloud = cloudArr[random]

      drop.body.setCircle(12.5)
      drop.body.setCollisionGroup(dropCollisionGroup)
      drop.body.collides([stemCollisionGroup])
      game.physics.p2.enable(drop)

      drop.reset(randoCloud.body.x + randomX, randoCloud.body.y + 30)

      dropTimer = game.time.now + 2000
    }

  }

  function rotateLeaf(stemArr) {
    let targetAngle
    let anchor

    stemArr.forEach(stem => {

      if (stem.name.includes('stemAnchor')) {
        anchor = stem
        targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
          stem.x, stem.y,
          game.input.activePointer.x, game.input.activePointer.y
        ) + 90

        if (targetAngle < 0) targetAngle += 360

        if (game.input.activePointer.isDown && !dragging) dragging = true

        if (!game.input.activePointer.isDown && dragging) dragging = false

        if (dragging) {
          stem.body.angle = targetAngle
        }
      }
      if (stem.name.includes('stem')) {
        stem.reset(anchor.body.x, anchor.body.y)
        stem.body.angle = anchor.body.angle
      }
    })

  }

  function selectLeaf(leaf) {

    curLeafSelected = leaf

  }

  function resetSelectLeaf() {

    curLeafSelected = null

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