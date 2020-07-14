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
    this.directions = []
    this.init_directions()
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

  this.parent.visibles.push(this.directions[this.index]);

  }

  nextDirection(){
    musician.kalimba.triggerAttackRelease(this.intervals[this.index], '4n' )
    this.parent.visibles.splice(this.parent.visibles.indexOf(this.directions[this.index]), 1)
    this.index++
    this.parent.visibles.push(this.directions[this.index]);
  }

  previousDirection(){
    musician.kalimba.triggerAttackRelease(this.intervals[this.index - 1], '4n' )
    this.parent.visibles.splice(this.parent.visibles.indexOf(this.directions[this.index]), 1)
    this.index--
    this.parent.visibles.push(this.directions[this.index]);
  }

  exec(someFunction){
    someFunction.call(this);
  }

  init_directions(){

    this.directions.push(new Direction({
                               text: 'Leverkuhn is a game of composition and modulation. '
                               }))
    this.directions.push(new Direction({
                                text: 'Your goal is to assert and defend your home key in the\n' +
                                      'context of the composition you author with your opponent.'
                               }))
    this.directions.push(new Direction({
                                 text: 'You\'re playing for '+ utility.keyCardinalToString(HOME_KEY)
                                }))
    this.directions.push(new Direction({
                                 text: 'Your opponent is playing for '+ utility.keyCardinalToString(OPPONENT_HOME_KEY)
                               }))
   this.directions.push(new Direction({
                                 text: 'The game begins in '+ utility.keyCardinalToString(CURRENT_KEY)
                              }))
   this.directions.push(new Direction({
                                text: 'It\'s your turn. Move the voice tokens to create a chord.'
                             }))
   this.directions.push(new Direction({
                                text: 'Click the notes on the staff wheel to hear it sound.'
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
}
