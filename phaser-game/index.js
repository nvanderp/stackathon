window.onload = function() {

  // Game OBJ
  const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, create: create, update: update, render: render
  })

  // Cloud variables
  let clouds, cloud
  // let cloudArr = []
  let cloudCollisionGroup

  // Leaf variables
  let leafs, leaf
  let curLeafSelected = null

  // Stem variables
  let stems, stemOneAnchor, stemOneLeft, stemOneMiddle, stemOneRight
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

    game.physics.p2.restitution = 0.7
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

    drops.createMultiple(30, 'drop')
    drops.setAll('anchor.x', 0.5)
    drops.setAll('anchor.y', 0.5)

  /* Stems */
    stems = game.add.group()
    stems.enableBody = true
    stems.physicsBodyType = Phaser.Physics.P2JS

    stemOneAnchor = stems.create(375, 300)
    stemOneAnchor.name = 'leafOne stemAnchor'
    game.physics.p2.enable(stemOneAnchor)
    stemOneAnchor.body.kinematic = true
    stemOneAnchor.anchor.setTo(0.5, 0.5)

    stemOneLeft = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemLeft')
    stemOneLeft.name = 'leafOne stem stemLeft'
    stemOneLeft.body.setRectangle(42, 10, -42)
    stemOneLeft.body.setCollisionGroup(stemCollisionGroup)
    stemOneLeft.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneLeft)
    stemOneLeft.body.kinematic = true
    stemOneLeft.anchor.setTo(0.5, 0.5)

    stemOneMiddle = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemMiddle')
    stemOneMiddle.name = 'leafOne stem stemMiddle'
    stemOneMiddle.body.setRectangle(42, 10) // 42, 10
    stemOneMiddle.body.setCollisionGroup(stemCollisionGroup)
    stemOneMiddle.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneMiddle)
    stemOneMiddle.body.kinematic = true
    stemOneMiddle.anchor.setTo(0.5, 0.5)

    stemOneRight = stems.create(stemOneAnchor.x, stemOneAnchor.y, 'stemRight')
    stemOneRight.name = 'leafOne stem stemRight'
    stemOneRight.body.setRectangle(42, 10, 42)
    stemOneRight.body.setCollisionGroup(stemCollisionGroup)
    stemOneRight.body.collides([dropCollisionGroup, stemCollisionGroup])
    game.physics.p2.enable(stemOneRight)
    stemOneRight.body.kinematic = true
    stemOneRight.anchor.setTo(0.5, 0.5)

  /* Leafs */
    leafs = game.add.group()
    game.world.sendToBack(leafs)

    leafOne = leafs.create(312.5, 240, 'leaf')
    leafOne.name = 'leafOne'
    leafOne.inputEnabled = true

  /* Clouds */
    clouds = game.add.group()
    clouds.enableBody = true
    game.world.bringToTop(clouds)

    cloud = clouds.create(200, 0, 'cloud')
    cloud.inputEnabled = true
    cloud.input.enableDrag(true)

  /* Event Listeners */
    leafOne.events.onInputDown.add(selectLeaf, this)
    leafOne.events.onInputUp.add(resetSelectLeaf)

  /* Pivot Points */
    let constraint = game.physics.p2.createLockConstraint(stemOneMiddle, stemOneRight, [42, 0], 0)

  }

  function update() {

    // Timer for spawning drops
    if (game.time.now > dropTimer) spawnDrop()

    if (game.input.activePointer.isDown && curLeafSelected) {
      stems.forEach(stem => {
        if (stem.name.includes(curLeafSelected.name)) selectedStemArr.push(stem)
      })
      rotateLeaf(selectedStemArr)
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
      let randomX = game.rnd.integerInRange(30, 85)

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
      // if (stem.name.includes('stemLeft')) {
      //   stem.reset(anchor.body.x - 42, anchor.body.y)
      //   stem.body.angle = anchor.body.angle
        
      // }
      if (stem.name.includes('stem')) {
        stem.reset(anchor.body.x, anchor.body.y)
        stem.body.angle = anchor.body.angle
      }
      // else if (stem.name.includes('stemRight')) {
      //   stem.reset(anchor.body.x + 42, anchor.body.y)
      //   // stem.body.angle = anchor.body.angle
      //   stem.position.rotate(anchor.body.x + 42, anchor.body.y, 10, true, 42)
      // }
    })

  }

  function selectLeaf(leaf) {

    curLeafSelected = leaf

  }

  function resetSelectLeaf() {

    curLeafSelected = null

  }

}