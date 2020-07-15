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
    this.parent.visibles.push(this.mask)
    this.parent.repositionables.push(this)
    this.directions = []
    this.index = 0
    this.intervals = []
    this.init_intervals()
    this.nextOrb = new DirectionOrb({
                                message:'next'
                               ,semiMajorAxis: 6.5*geometry.RADIUS
                               ,semiMajorConstant : 6.5
                               ,theta:0
                               ,parent: this
                               ,callback: this.nextDirection
                            });
    this.previousOrb = new DirectionOrb({
                                message:'prev'
                               ,semiMajorAxis: 6.5*geometry.RADIUS
                               ,semiMajorConstant : 6.5
                               ,theta:Math.PI
                               ,parent: this
                               ,callback: this.previousDirection
                            });

  this.init_directions()
  this.parent.visibles.push(this.directions[this.index]);
  this.directions[this.index].push_to_visible.forEach( e => {this.pushToParent(e)});
  musician.kalimba.triggerAttackRelease(this.intervals[this.index], '4n' )


  }

  nextDirection(){
    //pop the last direction from visibles
      this.parent.visibles.splice(this.parent.visibles.indexOf(this.directions[this.index]), 1)
    //augment the index
      this.index++
    //play the augment sound
      musician.kalimba.triggerAttackRelease(this.intervals[this.index], '4n' )
    //push the new direction to visibles
      this.parent.visibles.push(this.directions[this.index]);
    //if it has an orb to push or pop, do so
      this.directions[this.index].push_to_visible.forEach( e => {this.pushToParent(e)});
      this.directions[this.index].pop_from_visible.forEach( e => {this.popFromParent(e)});
  }

  previousDirection(){
    //pop the previous direction from visibles
      this.parent.visibles.splice(this.parent.visibles.indexOf(this.directions[this.index]), 1)
    //decrement the index
      this.index--
    //play the decrement sound
      musician.kalimba.triggerAttackRelease(this.intervals[this.index - 1], '4n' )
    //push the old/new direction to visibles
      this.parent.visibles.push(this.directions[this.index]);
    //if it has an orb to push or pop, do so
      this.directions[this.index].push_to_visible.forEach( e => {this.pushToParent(e)});
      this.directions[this.index].pop_from_visible.forEach( e => {this.popFromParent(e)});
  }

  popFromParent(obj){
    if(this.parent.visibles.includes(obj))
      this.parent.visibles.splice(this.parent.visibles.indexOf(obj), 1);
  }

  pushToParent(obj){
    if(!this.parent.visibles.includes(obj))
      this.parent.visibles.push(obj);
  }

  exec(someFunction){
    someFunction.call(this);
  }

  init_directions(){

    this.directions.push(new Direction({
                                text: 'Leverkuhn is a game of composition and modulation.'
                               ,push_to_visible: [this.nextOrb]
                               ,pop_from_visible: [this.previousOrb]
                               }))
    this.directions.push(new Direction({
                                text: 'You will write a song with your opponent.'
                               ,push_to_visible: [this.previousOrb]
                               }))
   this.directions.push(new Direction({
                                text: 'Your goal is to assert your home key in the context of that composition.'
                              }))
    this.directions.push(new Direction({
                                text: 'This is the key wheel. You\'re playing for '+ utility.keyCardinalToString(HOME_KEY)
                                }))
    this.directions.push(new Direction({
                                 text: 'The computer is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY)
                               }))
   this.directions.push(new Direction({
                                 text: 'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY)
                              }))
   this.directions.push(new Direction({
                                 text: 'It\'s your turn. Move the voice tokens to create a chord.'
                                ,y:50
                                ,pop_from_visible: [this.nextOrb, this.previousOrb, this.mask]
                             }))
   this.directions.push(new Direction({
                                 text: 'Click the notes on the staff wheel to hear it sound.'
                                ,y: 50
                             }))
  }

  init_intervals(){
    var p = (CURRENT_KEY % 12)
    var o = p < 9 ? 5 : 4
    this.intervals = CURRENT_KEY < 12 ? [  [p, p + 4]
                                          ,[p + 2, p + 5]
                                          ,[p + 4, p + 7]
                                          ,[p + 5, p + 9]
                                          ,[p + 7, p + 11]
    ].map( e => [ musician.makeTone(e[0] + o*12), musician.makeTone(e[1] + o*12) ])
                                      :[  [p, p + 3]
                                         ,[p + 2, p + 5]
                                         ,[p + 3, p + 7]
                                         ,[p + 5, p + 9]
                                         ,[p + 7, p + 11]
    ].map( e => [ musician.makeTone(e[0] + o*12), musician.makeTone(e[1] + o*12) ])
  }

  attach_leverkuhn_objects(){
    this.directions[3].push_to_visible = [homeKeyOrb]
    this.directions[4].push_to_visible = [opponentKeyOrb]
    this.directions[5].push_to_visible = [currentKeyOrb]
  }

  resize(){
    this.directions.forEach( e=> e.resize() )
  }
}
