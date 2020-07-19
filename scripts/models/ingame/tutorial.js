class Tutorial{
  constructor(parent){
    this.parent = parent;
    this.mask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'rect'
                     ,init_alpha : 220
    })
    this.keyWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'circle'
                     ,init_alpha : 220
                     ,x: geometry.KEYWHEEL_X
                     ,y: geometry.KEYWHEEL_Y
                     ,radius: 8*geometry.RADIUS
    })
    this.staffWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'circle'
                     ,init_alpha : 220
                     ,x: geometry.STAFF_X
                     ,y: geometry.STAFF_Y
                     ,radius: 8*geometry.RADIUS
    })
    this.parent.visibles.push(this.mask)
    this.directions = []
    this.index = 0
    this.intervals = []
    this.init_intervals()
    this.activeDirection = null


  this.tutorialText = [
    'Leverkuhn is a game of composition and modulation.'
    ,'You will compose a song with your opponent.'
    ,'Your goal is to bring the song as elegantly as possible into your home key.'
    ,'This is the key wheel. You\'re playing for '+ utility.keyCardinalToString(HOME_KEY) + '.'
    ,'The computer is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY) + '.'
    ,'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY) + '.'
    ,'Move the voice tokens to create a chord.'
    ,'Click the notes to hear it sound.'
    ,'If you need some help,\ntry the buttons in the corner.'
    ,'When you\'re satisfied, click your score orb to signify your turn'
  ]

  this.tutorialLocations = [
     [CX,CY]
    ,[CX,CY]
    ,[CX,CY]
    ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[CX - 2.5*geometry.RADIUS,CY]
    ,[geometry.STAFF_X + 3.5*geometry.RADIUS, geometry.STAFF_Y]
    ,[CX - 2.5*geometry.RADIUS,CY]
    ,[geometry.STAFF_X - 3*geometry.RADIUS, geometry.STAFF_Y]
  ]

  this.tutorialAlignments = [
     CENTER
    ,CENTER
    ,CENTER
    ,RIGHT
    ,RIGHT
    ,RIGHT
    ,RIGHT
    ,LEFT
    ,RIGHT
    ,LEFT
  ]

  this.initDirections()
  this.parent.repositionables.push(this)

  }

  resize(){
    this.keyWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'circle'
                     ,init_alpha : 220
                     ,x: geometry.KEYWHEEL_X
                     ,y: geometry.KEYWHEEL_Y
                     ,radius: 8*geometry.RADIUS
    })
    this.staffWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'circle'
                     ,init_alpha : 220
                     ,x: geometry.STAFF_X
                     ,y: geometry.STAFF_Y
                     ,radius: 8*geometry.RADIUS
    })
    this.tutorialLocations = [
       [CX,CY]
      ,[CX,CY]
      ,[CX,CY]
      ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.KEYWHEEL_X - 4.5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.STAFF_X + 3.5*geometry.RADIUS, geometry.STAFF_Y]
      ,[CX + 2.5*geometry.RADIUS,CY]
      ,[CX - 2.5*geometry.RADIUS,CY]
      ,[geometry.STAFF_X - 3*geometry.RADIUS, geometry.STAFF_Y]
    ]
  }

  ping(message, id){
    if(message == 'next')
      this.nextDirection(id);
    if(message == 'prev')
      this.previousDirection(id)
    if(message == 'skip')
      this.skipDirections()
    if(message == 'done')
      this.skipDirections()
  }

  nextDirection(id){
    //pop the last direction from visibles
      this.activeDirection.remove()
    //load next direction
      this.activeDirection = this.loadDirection(id + 1)
    //tell igmgr to shuffle visibles as is necessary
      this.parent.ping(id + 1)
    //sound
      musician.kalimba.triggerAttackRelease(this.intervals[id], "8n")
  }

  previousDirection(id){
    //pop the last direction from visibles
      this.activeDirection.remove()
    //load next direction
      this.activeDirection = this.loadDirection(id - 1)
    //tell igmgr to shuffle visibles as is necessary
      this.parent.ping(id - 1)
    //sound
      musician.kalimba.triggerAttackRelease(this.intervals[id], "8n")
  }

  skipDirections(){
    this.activeDirection.remove()
    this.parent.ping(this.tutorialText.length)
  //sound
    musician.kalimba.triggerAttackRelease(this.intervals[this.intervals.length - 1], "8n")
  }

  initDirections(){
    this.activeDirection = new Direction ({id: 0, text: this.tutorialText[0], parent: this})
  }

  init_intervals(){
    var p = (CURRENT_KEY % 12)
    var o = p < 9 ? 5 : 4
    this.intervals = CURRENT_KEY < 12 ? [  p
                                          ,p+2
                                          ,p+4
                                          ,p+5
                                          ,p+7
                                          ,p+9
                                          ,p+11
                                          ,p+12
                                          ,p+7
                                          ,p

    ].map( e => musician.makeTone(e + o*12) )
                                      :[   p
                                          ,p+2
                                          ,p+3
                                          ,p+5
                                          ,p+7
                                          ,p+9
                                          ,p+11
                                          ,p+12
                                          ,p+7
                                          ,p

    ].map( e => musician.makeTone(e + o*12) )
  }

  loadDirection(id){
    var d = new Direction ({
                   id: id
                 , text: this.tutorialText[id]
                 , parent:this
                 , x:this.tutorialLocations[id][0]
                 , y: this.tutorialLocations[id][1]
                 , alignment:this.tutorialAlignments[id]
                 })
    return d
  }

}
