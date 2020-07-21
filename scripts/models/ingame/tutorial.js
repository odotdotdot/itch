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
                     ,type : 'key'
                     ,init_alpha : 220
    })
    this.staffWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'staff'
                     ,init_alpha : 220
    })
    this.parent.visibles.push(this.mask)
    this.directions = []
    this.index = 0
    this.intervals = []
    this.activeDirection = null

    this.hexLabelRemoved = null


  this.tutorialText = [
    'Leverkuhn is a game of composition and modulation.'
    ,'You will compose a song with your opponent.'
    ,'Your goal is to bring the song as elegantly as possible into your home key.'
    ,'This is the key wheel. You\'re playing for '+ utility.keyCardinalToString(HOME_KEY) + '.'
    ,'The computer is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY) + '.'
    ,'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY) + '.'
    ,'It\'s your turn. Move the voices onto the game board to create a chord.'
    ,'Click the notes to hear it sound.'
    ,'Click your score orb to signify the end your turn.'
  ]

  this.tutorialLocations = [
     [CX,CY]
    ,[CX,CY]
    ,[CX,CY]
    ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
    ,[geometry.STAFF_X + .5*geometry.STAFFWHEEL_DIAMETER * Math.cos(-geometry.OFFSET) + geometry.RADIUS, CY]
    ,[geometry.STAFF_X + 3.5*geometry.RADIUS, geometry.STAFF_Y]
    ,[geometry.STAFF_X + 4*geometry.RADIUS * Math.cos(Math.PI + geometry.OFFSET) + 1.5*geometry.ORB_MAX_RADIUS
      ,geometry.STAFF_Y + 4*geometry.RADIUS * Math.sin(Math.PI + geometry.OFFSET)]
  ]

  this.tutorialAlignments = [
     CENTER
    ,CENTER
    ,CENTER
    ,RIGHT
    ,RIGHT
    ,RIGHT
    ,LEFT
    ,LEFT
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
                     ,type : 'key'
                     ,init_alpha : 220
    })
    this.staffWheelMask = new Mask({
                      mask_color : colors.background
                     ,speed : 7
                     ,parent: this
                     ,type : 'staff'
                     ,init_alpha : 220
    })
    this.tutorialLocations = [
       [CX,CY]
      ,[CX,CY]
      ,[CX,CY]
      ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.KEYWHEEL_X - 5*geometry.RADIUS, geometry.KEYWHEEL_Y]
      ,[geometry.STAFF_X + .5*geometry.STAFFWHEEL_DIAMETER * Math.cos(-geometry.OFFSET) + geometry.RADIUS, CY]
      ,[geometry.STAFF_X + 3.5*geometry.RADIUS, geometry.STAFF_Y]
      ,[geometry.STAFF_X + 4*geometry.RADIUS * Math.cos(Math.PI + geometry.OFFSET) + 1.5*geometry.ORB_MAX_RADIUS
        ,geometry.STAFF_Y + 4*geometry.RADIUS * Math.sin(Math.PI + geometry.OFFSET)]
    ]
    if(this.hexLabelRemoved)
      this.hexLabelRemoved.resize()
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

  hideText(){
    this.activeDirection.text = ''
    hexLabels.splice(0, 0, this.hexLabelRemoved)
  }

  showText(){
    this.activeDirection.text = this.tutorialText[this.activeDirection.id]
    this.hexLabelRemoved = hexLabels[0]
    hexLabels.splice(0,1)
  }

  changeText(str){
    this.activeDirection.text = str
  }

  nextDirection(id){
    //pop the last direction from visibles
      this.activeDirection.remove()
    //load next direction
      this.activeDirection = this.loadDirection(id + 1)
    //tell igmgr to shuffle visibles as is necessary
      this.parent.ping(id + 1)
  }

  previousDirection(id){
    //pop the last direction from visibles
      this.activeDirection.remove()
    //load next direction
      this.activeDirection = this.loadDirection(id - 1)
    //tell igmgr to shuffle visibles as is necessary
      this.parent.ping(id - 1)
  }

  skipDirections(){
    this.activeDirection.remove()
    this.parent.ping(this.tutorialText.length)
  }

  initDirections(){
    this.activeDirection = new Direction ({id: 0, text: this.tutorialText[0], parent: this})
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
