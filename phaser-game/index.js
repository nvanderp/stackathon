window.onload = function() {

  // Game OBJ
  const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, create: create, update: update, render: render
  })

  // Game World Wall variables
  let wallLeft, wallRight, floor
  let floorCollisionGroup
  let wallCollisionGroup

  // Water variables
  let waterBounds, water

  // Cloud variables
  let clouds, cloudOne, OneTwo, OneThree
  let cloudBounds
  let curCloudSelected = null

  // Leaf variables
  let leafs, leafOne, leafTwo, leafThree, leafFour, leafFive, leafSix
  let curLeafSelected = null

  // Tree variables
  let trees, treeOne, treeTwo, treeThree, treeFour, treeFive, treeSix

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
  let dropTimerOne = 0
  let dropTimerTwo = 0
  let dropTimerThree = 0

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
    game.load.spritesheet('cloudAnim', '../assets/cloud_spritesheet.png', 125, 125, 3)
    game.load.image('LRWall', '../assets/LRWall.png')
    game.load.image('floor', '../assets/bottomWall.png')
    game.load.image('water', '../assets/water.png')
    game.load.image('tree', '../assets/tree.png')

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
    floorCollisionGroup = game.physics.p2.createCollisionGroup()
    wallCollisionGroup = game.physics.p2.createCollisionGroup()

    game.physics.p2.updateBoundsCollisionGroup()

  /* World Walls */
    floorBounds = game.add.group()
    floorBounds.enableBody = true
    floorBounds.physicsBodyType = Phaser.Physics.P2JS

    wallBounds = game.add.group()
    wallBounds.enableBody = true
    wallBounds.physicsBodyType = Phaser.Physics.P2JS

    // Floor
    floor = floorBounds.create(400, 600, 'floor')
    floor.name = 'floor'
    floor.body.setRectangle(800, 4)
    floor.body.setCollisionGroup(floorCollisionGroup)
    floor.body.collides([dropCollisionGroup])
    game.physics.p2.enable(floor)
    floor.body.kinematic = true
    floor.anchor.setTo(0.5, 0.5)

    // Left Wall
    leftWall = wallBounds.create(0, 300, 'LRWall')
    leftWall.name = 'leftWall'
    leftWall.body.setRectangle(2, 600)
    leftWall.body.setCollisionGroup(wallCollisionGroup)
    leftWall.body.collides([dropCollisionGroup])
    game.physics.p2.enable(leftWall)
    leftWall.body.kinematic = true
    leftWall.anchor.setTo(0.5, 0.5)

    // right Wall
    rightWall = wallBounds.create(800, 300, 'LRWall')
    rightWall.name = 'rightWall'
    rightWall.body.setRectangle(2, 600)
    rightWall.body.setCollisionGroup(wallCollisionGroup)
    rightWall.body.collides([dropCollisionGroup])
    game.physics.p2.enable(rightWall)
    rightWall.body.kinematic = true
    rightWall.anchor.setTo(0.5, 0.5)


  /* Water */
    waterBounds = game.add.group()
    waterBounds.enableBody = true

    water = waterBounds.create(400, 585, 'water')
    water.anchor.setTo(0.5, 0.5)

  /* Drops */
    drops = game.add.group()
    drops.enableBody = true
    drops.physicsBodyType = Phaser.Physics.P2JS

    drops.createMultiple(600, 'drop')
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
    stemTwoAnchor = stems.create(260, 320)
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
    stemThreeAnchor = stems.create(525, 450)
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
    stemFourAnchor = stems.create(350, 490)
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

  /* Trees */
    trees = game.add.group()
    game.world.sendToBack(trees)

    treeOne = trees.create(stemOneAnchor.body.x - 40, stemOneAnchor.body.y + 65, 'tree')        
    treeTwo = trees.create(stemTwoAnchor.body.x - 40, stemTwoAnchor.body.y + 50, 'tree')    
    treeThree = trees.create(stemThreeAnchor.body.x - 40, stemThreeAnchor.body.y, 'tree')
    treeFour = trees.create(stemFourAnchor.body.x - 40, stemFourAnchor.body.y, 'tree')
    treeFive = trees.create(stemFiveAnchor.body.x - 40, stemFiveAnchor.body.y + 20, 'tree')
    treeSix = trees.create(stemSixAnchor.body.x - 40, stemSixAnchor.body.y + 10, 'tree')

  /* Clouds */
    clouds = game.add.group()
    clouds.enableBody = true
    game.world.bringToTop(clouds)

    // Cloud Dragging Bounds
    cloudBounds = new Phaser.Rectangle(0, 0, 800, 200)

    // Cloud
    let randomCloudStartX = game.rnd.integerInRange(200, 350)
    let randomCloudStartY = game.rnd.integerInRange(0, 100)
    cloudOne = clouds.create(randomCloudStartX, randomCloudStartY, 'cloudAnim')
    cloudOne.name = 'cloudOne'
    cloudOne.inputEnabled = true
    cloudOne.input.enableDrag(true)
    cloudOne.input.boundsRect = cloudBounds

    // cloudTwo
    randomCloudStartX = game.rnd.integerInRange(400, 550)
    randomCloudStartY = game.rnd.integerInRange(0, 100)
    cloudTwo = clouds.create(randomCloudStartX, randomCloudStartY, 'cloudAnim')
    cloudTwo.name = 'cloudTwo'
    cloudTwo.inputEnabled = true
    cloudTwo.input.enableDrag(true)
    cloudTwo.input.boundsRect = cloudBounds

    // cloudThree
    randomCloudStartX = game.rnd.integerInRange(0, 200)
    randomCloudStartY = game.rnd.integerInRange(0, 100)
    cloudThree = clouds.create(randomCloudStartX, randomCloudStartY, 'cloudAnim')
    cloudThree.name = 'cloudThree'
    cloudThree.inputEnabled = true
    cloudThree.input.enableDrag(true)
    cloudThree.input.boundsRect = cloudBounds

  /* Event Listeners */
    // Leafs
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

    // Clouds
    cloudOne.events.onInputDown.add(selectCloud, this)
    cloudOne.events.onInputUp.add(resetSelectCloud)

    cloudTwo.events.onInputDown.add(selectCloud, this)
    cloudTwo.events.onInputUp.add(resetSelectCloud)

    cloudThree.events.onInputDown.add(selectCloud, this)
    cloudThree.events.onInputUp.add(resetSelectCloud)

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

    randomLeafStart(stems)

  }

  function update() {
  

    // Timer for spawning drops
    if (game.time.now > dropTimerOne) spawnDrop(cloudOne)
    else if (game.time.now < dropTimerOne && !curCloudSelected) {
      cloudOne.frame = 0
    }
    if (game.time.now > dropTimerTwo) spawnDrop(cloudTwo)
    else if (game.time.now < dropTimerTwo && !curCloudSelected) {
      cloudTwo.frame = 0
    }
    if (game.time.now > dropTimerThree) spawnDrop(cloudThree)
    else if (game.time.now < dropTimerThree && !curCloudSelected) {
      cloudThree.frame = 0
    }

    if (game.input.activePointer.isDown && curCloudSelected) {
      clouds.forEach(cloud => {
        if (cloud.name.includes(curCloudSelected.name)) cloud.frame = 2
      })
    }


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

  function spawnDrop(curCloud) {

    drop = drops.getFirstExists(false)

    if (drop) {
      curCloud.frame = 1
      let randomX = game.rnd.integerInRange(30, 95)

      drop.body.setCircle(12.5)
      drop.body.setCollisionGroup(dropCollisionGroup)
      drop.body.collides(stemCollisionGroup)   
      drop.body.collides(floorCollisionGroup, hitFloor, this)
      drop.body.collides(wallCollisionGroup, randomNote, this)
      game.physics.p2.enable(drop)

      drop.reset(curCloud.body.x + randomX, curCloud.body.y + 30)

      let randoTimer = game.rnd.integerInRange(2500, 3500)

      if (curCloud.name === 'cloudOne') dropTimerOne = game.time.now + randoTimer
      if (curCloud.name === 'cloudTwo') dropTimerTwo = game.time.now + randoTimer
      if (curCloud.name === 'cloudThree') dropTimerThree = game.time.now + randoTimer

    }

  }

  function randomNote() {
    let randomNoteArr = [
      'A2', 'A3', 'A4', 'B2', 'B3', 'B4', 'C2', 'C3' , 'C4', 'D2', 'D3', 'D4', 
      'E2', 'E3', 'E4', 'F2', 'F3', 'F4', 'G2', 'G3', 'G4'
    ]
    let randoIndex = game.rnd.integerInRange(0, 5)
    let randoNote = randomNoteArr[randoIndex]
    playNote(randoNote)
  }

  function hitFloor(body1, body2) {
    body1.destroy()
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

  function randomLeafStart(stems) {
    let targetAngle
    let anchor

    stems.forEach(stem => {
      let randomX = game.rnd.integerInRange(0, 800)
      let randomXTwo = game.rnd.integerInRange(0, 800)
      let randomY = game.rnd.integerInRange(0, 600)
      let randomYTwo = game.rnd.integerInRange(0, 600)

      if (stem.name.includes('stemAnchor')) {
        anchor = stem
        targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
          randomX, randomY,
          randomXTwo, randomYTwo
        ) + 90
        stem.body.angle = targetAngle
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

  function selectCloud(cloud) {

    curCloudSelected = cloud

  }

  function resetSelectCloud() {

    curCloudSelected = null

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