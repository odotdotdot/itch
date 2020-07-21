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
    this.parent.repositionables.push(this)
    this.directions = []
    this.numberOfDirections = 9
    this.intervals = []
    this.activeDirection = null
    this.hexLabelRemoved = null
    this.initDirections()
  }

  directionParameters(id){
    //calculate constants at current dims
     var KX = geometry.KEYWHEEL_X - 5*geometry.RADIUS
     var KY = geometry.KEYWHEEL_Y
     var TX = geometry.STAFF_X + .5*geometry.STAFFWHEEL_DIAMETER * Math.cos(-geometry.OFFSET) + geometry.RADIUS
     var SX = geometry.STAFF_X + 3.5*geometry.RADIUS
     var SY = geometry.STAFF_Y
     var BX = geometry.STAFF_X + 4*geometry.RADIUS * Math.cos(Math.PI + geometry.OFFSET) + 1.5*geometry.ORB_MAX_RADIUS
     var BY = geometry.STAFF_Y + 4*geometry.RADIUS * Math.sin(Math.PI + geometry.OFFSET)
     var params =[ {x: CX, y: CY, align: CENTER, constrain: W, text: 'Leverkuhn is a game of composition and modulation.'}
                  ,{x: CX, y: CY, align: CENTER, constrain: W, text: 'You will compose a song with your opponent.'}
                  ,{x: CX, y: CY, align: CENTER, constrain: W, text: 'Your goal is to bring the song as elegantly as possible into your home key.'}
                  ,{x: KX, y: KY, align: RIGHT,  constrain: KX, text: 'This is the key wheel. You\'re playing for '+ utility.keyCardinalToString(HOME_KEY) + '.'}
                  ,{x: KX, y: KY, align: RIGHT,  constrain: KX, text: 'The computer is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY) + '.'}
                  ,{x: KX, y: KY, align: RIGHT,  constrain: KX, text: 'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY) + '.'}
                  ,{x: TX, y: CY, align: LEFT,   constrain: W - TX - logo.x, text: 'It\'s your turn. Move the voices onto the game board to create a chord.'}
                  ,{x: SX, y: SY, align: LEFT,   constrain: W - SX, text: 'Click the notes to hear it sound.'}
                  ,{x: BX, y: BY, align: LEFT,   constrain: W - BX, text: 'Click your score orb to signify the end of your turn.'}
                ]
    return params[id]
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
    if(this.hexLabelRemoved)
      this.hexLabelRemoved.resize()

    var currentIndex = this.activeDirection.id
    this.activeDirection.remove()
    this.activeDirection = this.loadDirection(currentIndex)
  }
  ping(message, id){
    musician.scoreTutorial(message, id)
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
    this.activeDirection.text = this.directionParameters(this.activeDirection.id).text
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
    this.parent.ping(this.numberOfDirections)
  }
  initDirections(){
    this.activeDirection = this.loadDirection(0)
  }
  loadDirection(id){
    var dir = this.directionParameters(id)
    var d = new Direction ({
                   id: id
                 , text: dir.text
                 , parent:this
                 , x: dir.x
                 , y: dir.y
                 , alignment: dir.align
                 , text_size: utility.setTextSize(fonts.letters, dir.text, 24, dir.constrain)
                 })
    return d
  }

}
