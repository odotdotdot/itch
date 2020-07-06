class Directions{
  constructor(parent){
    this.fColor = colors.background;
    this.tColor = colors.pink;
    this.tSize = utility.setTextSize(fonts.letters, 'context of the composition you author with your opponent.', 18, 8.5*geometry.RADIUS);

    push();
    textSize(this.tSize)
    this.lineHeight = textAscent() + textDescent() + 2;
    pop();

    this.parent = parent;
    this.circleColor = color(colors.background)
    this.circleColor.setAlpha(240);
    this.directionTextIndex = 0;
    this.directionBoxHeight = [7, 4, 5, 2, 2, 1, 1, 1, 1]

    this.directionText = [

                  { header:
                    'DIRECTIONS'
                   ,body:[
                     'Leverkuhn is a game of composition and modulation.'
                    ,''
                    ,'Your goal is to assert and defend your home key in the'
                    ,'context of the composition you author with your opponent.'
                    ,''
                    ,'You must balance the exigencies of melody with the will'
                    ,'to new tonicities.']
                  }

                , { header:
                     'THE GAME BOARD'
                   ,body:[
                     'The voice tokens at the foot of the game board'
                     ,'act like voices in a choir.']
                  }

                , { header:
                     'THE GAME BOARD'
                   ,body:[
                    ,'As you arrange them on the game board, you\'ll see music'
                    ,'written on the STAFF WHEEL.'
                    ,''
                    ,'Click the notes to hear the chords.'
                    ]
                  }

                , { header:
                    'THE GAME BOARD'
                  ,body:[
                     ,'Known chords will be figured in the center of the KEY WHEEL,'
                     ,'which also contains important information about which key'
                     ,'the song is in and which keys are on the horizon.'
                  ]
                }

                , { header:
                      'THE KEY WHEEL IN DETAIL'
                    ,body:[
                       'Your home key is pink.'
                      ,'Your opponent\'s key is white.'
                      ,'The current key is blue.'
                      ,''
                      ,'As new tonicities emerge, they will appear in pink'
                      ,'on the wheel\'s outer orbits.'
                    ]
                }

                , { header:
                      'TAKING A TURN'
                    ,body:[
                       'Arrange the voices on the board to create a chord.'
                      ,''
                      ,'If necessary, listen back to the progression by clicking'
                      ,'chords on the staff wheel.'
                      ,''
                      ,'When you\'re satisfied, drag your home key orb around'
                      ,'the key wheel to signify the end of your turn.'
                    ]
                  }

                , { header:
                      'SCORING'
                  , body:[
                      'Each chord is scored for diatonicity with the current key.'
                      ,''
                      ,'Bonuses are available for chord commonality and the pre-'
                      ,'paration and resolution of dissonance.'
                  ]
                  }

                , { header:
                      'SCORING'
                  , body:[
                     'There is a small reward for opening onto new tonalities'
                     ,'and big points to be gained for acheiving a modulation.'
                     ,''
                     ,'At the end of ' + TOTAL_BARS + ' bars, the player with the highest'
                     ,'score wins.'
                     ,''
                     ,'Click help at any time to review these directions.'
                     ,''
                     ,'Good luck and thanks for playing.'
                  ]
                }
     ];
  //create orbs
    this.nextOrb = new DirectionOrb({
       message:'next'
      ,semiMajorAxis: 6.5*geometry.RADIUS
      ,semiMajorConstant : 6.5
      ,theta:0
      ,parent: this
    });
    this.previousOrb = new DirectionOrb({
      message: 'prev'
     ,semiMajorAxis: 6.5*geometry.RADIUS
     ,semiMajorConstant : 6.5
     ,theta:Math.PI
     ,parent:this
   });
      this.previousOrb.show = false;
    this.skipOrb = new DirectionOrb({
     message: 'skip'
    ,semiMajorAxis: 8.5*geometry.RADIUS
    ,semiMajorConstant : 8.5
    ,theta:0
    ,parent: this
   });

   this.parent.visibles.push(this);
   this.parent.respositionables.push(this);
  }

  resize(){
    this.nextOrb.resize();
    this.previousOrb.resize();
    this.skipOrb.resize();
    this.tSize = utility.setTextSize(fonts.letters, 'context of the composition you author with your opponent.', 18, 8.5*geometry.RADIUS);
    push();
    textSize(this.tSize)
    this.lineHeight = textAscent() + textDescent() + 2;
    pop();

  }

  ping(message) {

    if( this.directionTextIndex < this.directionText.length - 1 && message == 'next')
        this.directionTextIndex++

    if( this.directionTextIndex > 0 && message == 'prev')
        this.directionTextIndex--

    if( this.directionTextIndex > 0)
        this.previousOrb.show = true;

    if( this.directionTextIndex == 0)
        this.previousOrb.show = false;

    if( this.directionTextIndex < this.directionText.length - 1){
        this.skipOrb.show = true;
        this.nextOrb.message = 'next'
    }

    if( this.directionTextIndex == this.directionText.length - 1){
        this.skipOrb.show = false;
        this.nextOrb.message = 'done'
    }

    if( message == 'skip' || message == 'done'){
      this.parent.visibles.splice(this.parent.visibles.indexOf(this), 1);

      this.parent.clickables.splice(this.parent.clickables.indexOf(this.nextOrb), 1);
      this.parent.clickables.splice(this.parent.clickables.indexOf(this.previousOrb), 1);
      this.parent.clickables.splice(this.parent.clickables.indexOf(this.skipOrb), 1);

      this.parent.respositionables.splice(this.parent.respositionables.indexOf(this.nextOrb), 1);
      this.parent.respositionables.splice(this.parent.respositionables.indexOf(this.previousOrb), 1);
      this.parent.respositionables.splice(this.parent.respositionables.indexOf(this.skipOrb), 1);
      DIRECTIONS = false;
      }
  }

  display(){
    //back mask translude
      push()
      fill(53,53,53,220);
      rect(CX, CY, W, H);

    //point out pieces
      if(this.directionTextIndex >= 1)
        voix.forEach( e => { e.display();});
      if(this.directionTextIndex >= 2)
        sd.display();
      if(this.directionTextIndex >= 3){
        cd.display();
        opponentKeyOrb.display();
        currentKeyOrb.display();
        homeKeyOrb.display();
      }

    //text
      textSize(this.tSize)
      textAlign(LEFT, CENTER)
      fill(colors.pink)
      var start = CY - .5*this.directionText[this.directionTextIndex].body.length * this.lineHeight;
      for(var i = 0; i < this.directionText[this.directionTextIndex].body.length; i ++)
        text(this.directionText[this.directionTextIndex].body[i]
        , CX - 4.25*geometry.RADIUS
        , start + i*this.lineHeight
      )
    //header
      textAlign(CENTER, CENTER)
      textSize(this.tSize * 1.5)
      text(this.directionText[this.directionTextIndex].header
        , CX
        , start - 3 * this.lineHeight
      );
      pop();




    this.nextOrb.display();
    this.previousOrb.display();
    this.skipOrb.display();

}

}
