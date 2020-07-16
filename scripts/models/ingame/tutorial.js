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

  ping(message){
    if(message == 'next')
      this.nextDirection();
    if(message == 'prev')
      this.previousDirection()
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

      this.parent.ping(this.index)
  }

  previousDirection(){
    //pop the previous direction from visibles
      this.parent.visibles.splice(this.parent.visibles.indexOf(this.directions[this.index]), 1)
    //decrement the index
      this.index--
      if(this.index < 0){this.index == 0; this.parent.visibles.splice(this.parent.visibles.indexOf(this.previousOrb), 1)}
    //play the decrement sound
      musician.kalimba.triggerAttackRelease(this.intervals[this.index - 1], '4n' )
    //push the old/new direction to visibles
      this.parent.visibles.push(this.directions[this.index]);

  }

  init_directions(){
    //0
    this.directions.push(new Direction({
                                text: 'Leverkuhn is a game of composition and modulation.'
                               }))
    //1
    this.directions.push(new Direction({
                                text: 'You will compose a song with your opponent.'
                               }))
    //2
    this.directions.push(new Direction({
                                text: 'Your goal is to bring the song as elegantly as possible into your home key.'
                              }))
    //3
    this.directions.push(new Direction({
                                text: 'This is the key wheel. You\'re playing for '+ utility.keyCardinalToString(HOME_KEY) + '.'
                                }))
    //4
    this.directions.push(new Direction({
                                 text: 'The computer is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY) + '.'
                               }))
    //5
    this.directions.push(new Direction({
                                 text: 'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY) + '.'
                              }))
    //6
    this.directions.push(new Direction({
                                 text: 'It\'s your turn. Move the voice tokens to create a chord.'
                              }))
    //7
    this.directions.push(new Direction({
                                 text: 'Click the notes on the staff wheel to hear it sound.'
                             }))
    //8
    this.directions.push(new Direction({
                                 text: 'When you\'re satisfied, click your score orb to signify your turn'
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

  resize(){
    this.directions.forEach( e=> e.resize() )
  }

}
