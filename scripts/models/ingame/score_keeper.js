class ScoreKeeper{
  constructor(){
    //scoring constants
        this.diatonicConstant = 25;
        this.commonConstant = 8; // add diatonicity light to theoretician.analyze and pass active players home key
        this.preparationConstant = 50;
        this.resolutionConstant = 70;
        this.modulationConstant = 150; // modulation to homeKey comes in as a 2, so double bonus
        this.emergentConstant = 80;

  //feedback information
        this.feedBack = loadJSON('./scripts/constants/feedBack.json');
        this.keyInfo = loadJSON('./scripts/constants/keyInfo.json');
        this.feedBackText = null;
        this.feedBackEventCount = 0;
        this.feedBackEventsCompleted = 0;
        this.feedBackInterval = 2000;//maybe set dyanmically based on the size of score / feedbackeventcount
        this.intervalID = null;
        this.t0 = 0;//time param for fade in and out
        this.diatonicNotes = null;
        this.playerWhoseTurnIsBeingScored = null;
        this.currentBar = 1;
        this.keyToDisplay = CURRENT_KEY;
        this.roman = null;
        this.feedBackOrb = new TransitionOrb();
        this.x = this.feedBackOrb.primaryX;
        this.y = this.feedBackOrb.primaryY;
  //feedback styling
        this.scoreOrbs = [];
        this.feedBackYOffset = 0;
        this.feedBackTextColor = null;
        this.feedBackTextSize = 40;
        this.feedBackCircleColor = null;

    //key glyph
        this.ROOTSIZE = 100*geometry.SCALE;
        this.showKey = false;
        this.showRoman = false;
        this.showCount = false;
        this.showBar = false;
  }

  resize(){
    this.x = CX;
    this.y = CY;
    this.feedBackOrb.resize();
    for(var i = 0; i < this.scoreOrbs.length; i ++)
      this.scoreOrbs[i].resize();
  }
  scoreTurn(score, player){
    this.playerWhoseTurnIsBeingScored = player;
    this.interpret(score);
  }
  interpret(score){
      this.feedBackEventCount = 0;
      this.feedBackEventsCompleted = 0;
      this.scoreOrbs = [];
      musician.feedBackIndex = 0;

      var numberOfActiveVoices = 0;
      for(var i = 0; i < 4; i ++)
        if(utility.getByte(i,MIDI_RECORD)!=255)
          numberOfActiveVoices++;

        var diatonicOrbDisplacementIndex = 0;
        for(var i = 0; i < score.diatonic; i ++){
          this.scoreOrbs.push(new FeedBackOrb(
             'diatonic'
            , -i*Math.PI*.5
            , "+"+String(this.diatonicConstant)));
            diatonicOrbDisplacementIndex++;}
        for(var i = 0; i < (numberOfActiveVoices-score.diatonic); i ++){
          this.scoreOrbs.push(new FeedBackOrb(
              'diatonic'
            , -diatonicOrbDisplacementIndex*Math.PI*.5
            , "-"+String(this.diatonicConstant)));
            diatonicOrbDisplacementIndex++;}
        this.schedule('diatonic');

      if(score.common == 8){
        this.scoreOrbs.push(new FeedBackOrb(
            'common'
          , -Math.PI*.25
          , "+"+String(this.commonConstant*score.common)));
          this.schedule('common');}

      if(score.preparation !=null){
        this.roman = score.preparation.verbal;
        this.scoreOrbs.push(new FeedBackOrb(
            'preparation'
          , -Math.PI*.75
          , "+"+String(this.preparationConstant * score.preparation.coefficient)));
          this.schedule('preparation');
      }

      if(score.resolution != null){
        this.roman = score.resolution.verbal;
        this.scoreOrbs.push(new FeedBackOrb(
            'resolution'
          , -Math.PI*.75
          , "+"+String(this.resolutionConstant * score.resolution.coefficient)));
          this.schedule('resolution');}

      if(score.emergent > 0){
        this.scoreOrbs.push(new FeedBackOrb(
            'emergent'
          , -Math.PI*1.75
          , "+"+String(this.emergentConstant )));
          this.schedule('emergent');}

      if(score.modulation == 1){
        this.scoreOrbs.push(new FeedBackOrb(
           'modulation'
          , -Math.PI*1.25
          , "+"+String(this.modulationConstant)));
          this.schedule('modulation');}

      if(score.modulation == 2){
        this.scoreOrbs.push(new FeedBackOrb(
            'modulationToHomeKey'
          , -Math.PI*1.75
          , "+"+String(2*this.modulationConstant)));
        this.schedule('modulationToHomeKey');}

      if(composer.turnsPrevious.length < 2+GAME_DURATION_IN_TURNS){
        /* if the next turn is the start of a new bar, schedule new bar.
           This happens "after" turn 3, 7, and 11, turn 0 having been announced
           in the start up routine */
        if( (composer.turnsPrevious.length - 3) % 4 == 3){
          this.schedule('newBar');
          this.currentBar = Math.floor((composer.turnsPrevious.length - 3)/4) + 2;
        }
        /* schedule change over as the last event */
        this.schedule('changeOver');
    }


    }
  feedBackSettings(event){
    //change feedback circle and its text
      this.feedBackOrb.show = true;
      this.feedBackOrb.setMessage(this.feedBack[event].txt);
      this.feedBackOrb.textColor = color(this.feedBack[event].tclr);
      this.feedBackOrb.fillColor = color(this.feedBack[event].cclr);
      this.feedBackOrb.yOFF = Number(this.feedBack[event].yOFF)*this.feedBackOrb.radius;
      this.feedBackOrb.ty = this.feedBackOrb.v - this.feedBackOrb.yOFF;
      this.feedBackOrb.setTextSize();
  }
  feedBackAnnull(){
    this.feedBackOrb.show = false;
    this.showKey = false;
    this.showRoman = false;
    this.showBar = false;
  }
  schedule(event){
      this.feedBackEventCount++;
      var time = (this.feedBackEventCount - 1)*this.feedBackInterval;

        setTimeout( ()=> {
            this.feedBackSettings(event);
          //activate score orbs to coincide with their text. stagger the arrival of the score orbs
            var orbsOfType = 0;
            for(var i = 0; i < this.scoreOrbs.length; i ++)
              if(event == this.scoreOrbs[i].type){
                this.scoreOrbs[i].appearAtTime( (orbsOfType+1) * this.feedBackInterval/8);
                var t = (orbsOfType+1) * this.feedBackInterval/8;
                setTimeout( musician.scoreFeedback.bind(musician), t, this.scoreOrbs[i].message)
                orbsOfType++;
              }
          /* flip display binaries and make accomodations for variable additions */
            if(event == 'modulation' || event == 'modulationToHomeKey'){this.showKey = true; this.keyToDisplay = CURRENT_KEY;}
            if(event == 'resolution' || event == 'preparation') this.showRoman = true;
            if(event == 'newBar') this.showBar = true;
            if(event == 'changeOver') this.feedBackOrb.setMessage( utility.whosTurn() + this.feedBack['changeOver'].txt);
          /* on second to last event, i.e. before changeover, we speed up rotation by a factor of 4
             and prepare the orbs for release. prepareTangential returns an estimated rendezvous time,
             which is ultimately used to initiate the final phase rotation that marks a turn's end*/
            if(this.feedBackEventCount - this.feedBackEventsCompleted == 1){

              for(var i = 0; i < this.scoreOrbs.length; i ++){
                this.scoreOrbs[i].release();
              }
              this.playerWhoseTurnIsBeingScored.orb.collisions = 0;
              this.playerWhoseTurnIsBeingScored.orb.expectedCollisions = this.scoreOrbs.length;
              musician.prepareCollisionScore(this.playerWhoseTurnIsBeingScored.orb.expectedCollisions);
            }
        } , time );

        /*  1 feedBackInterval later, we schedule annullment */
        setTimeout( ()=> {
            this.feedBackEventsCompleted++;
            this.feedBackAnnull();
        } , time + this.feedBackInterval);
}
  display(){
        this.feedBackOrb.display();

      //extra info
        if(this.showKey)    this.displayKey();
        if(this.showRoman)  this.displayRoman();
        if(this.showBar)    this.displayBar();
      //always show score orbs (once they've been rendered visible)
        for(var i = 0; i < this.scoreOrbs.length; i ++){
            this.scoreOrbs[i].movement();
            this.scoreOrbs[i].display();
        }
    }
  displayKey(){
    push();
      //letter
        textFont(fonts.letters);
        textAlign(CENTER, CENTER);
        textSize(this.ROOTSIZE);
        fill(this.feedBackOrb.textColor);
        var letterWidth = textWidth(this.keyInfo.keys[this.keyToDisplay].letter);
        text(this.keyInfo.keys[this.keyToDisplay].letter ,this.x - .5*letterWidth ,this.y + .1*geometry.KEYWHEEL_DIAMETER);

      //quality
          textAlign(LEFT, CENTER);
          textSize(.5*this.ROOTSIZE);
          text(this.keyInfo.keys[this.keyToDisplay].quality
              ,this.x
              ,this.y  + .1*geometry.KEYWHEEL_DIAMETER);

      //accent
          textAlign(CENTER, CENTER);
          textFont(fonts.accents);
          textSize(.5*this.ROOTSIZE);
          text(this.keyInfo.keys[this.keyToDisplay].accent
              ,this.x + .4*textWidth(this.keyInfo.keys[this.keyToDisplay].accent)
              ,this.y - textDescent());
    pop();
  }
  displayRoman(){
    push();
    textFont(fonts.letters);
    fill(this.feedBackOrb.textColor);
    textAlign(CENTER, CENTER);
    textSize(.25*this.ROOTSIZE);
    text(this.roman, this.x, this.y);
    pop();
  }
  displayBar(){
      //letter
        push();
        textFont(fonts.letters);
        textAlign(CENTER, CENTER);
        textSize(this.ROOTSIZE);
        fill(this.feedBackOrb.textColor);
        text(this.currentBar + "/" + TOTAL_BARS, this.x, this.y + .1*geometry.KEYWHEEL_DIAMETER);
        pop();
    }
}
