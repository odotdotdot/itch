class PregameManager{
  constructor(){
    this.centerText = new CenterText();
    this.keyGlyph = new KeyGlyph();
    this.continueOrb = new ContinueOrb(this);
    this.orbs = [];
    this.clickables = [];
    this.repositionables = [this.centerText, this.keyGlyph, this.continueOrb];
    this.visibles = [this.centerText];
    this.firstTime = true;


    this.majorScale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
    this.majorScaleIndex = 0;



    for(var i = 0; i < 24; i ++)
      this.orbs.push( new KeyOrb(i, this) );

    for(var i = 0; i < 24; i ++){
      this.clickables.push(this.orbs[i])
      this.visibles.push(this.orbs[i])
      this.repositionables.push(this.orbs[i])
    }

    setTimeout( ()=> {this.centerText.currentText = this.centerText.commands[1]}, 1500);

  }

  transition_to_in_game(){
    this.hideOrbs();

    setTimeout( ()=>{
      PRE_GAME = false;
      IN_GAME = true;
      _init_leverkuhn();}
      ,5000);

  }

  clearPreviousOrbSelection(exception){
    for(var i = 0; i < 24; i ++ )
      if(i != exception)
        this.orbs[i].restoreToDefault();
  }

  signal(){
    if( this.firstTime ){
      this.visibles.splice(0,1);
      this.visibles.push( this.keyGlyph )
      this.firstTime = false;

      this.visibles.push(this.continueOrb);
      this.clickables.push(this.continueOrb);
      this.repositionables.push(this.continueOrb);
    }

    this.bangHomeKey();

  }

  bangHomeKey(){
    var chord = [
       (HOME_KEY % 12) + 36
      ,(HOME_KEY % 12) + 48
      ,(HOME_KEY % 12) + 48 + 7
      ,(HOME_KEY % 12) + 48 + 16 - Math.floor(HOME_KEY/12)
    ]

    for(var i = 0; i < musician.synth.length; i ++)
      musician.synth[i].triggerAttackRelease(musician.makeTone(chord[i]), "4n");
  }

  reposition(){
    for(var i = 0; i < this.repositionables.length; i ++)
      this.repositionables[i].resize();
  }

  revealOrbs(){
    for(var i = 0; i < 12; i ++){
      var major = (7*i) % 12;
      var relative = ( (major + 9) % 12) + 12;
      var time = 100*i - 4*i**2

      var t = Tone.Time("+" + time/1000)
      this.orbs[major].appearAtTime(time)
      this.orbs[relative].appearAtTime(time)

      if(i < 6){
        musician.EndSynth[i%4].triggerAttackRelease(musician.makeTone( (7*i) + 48), '4n', t );
      }

    }
  }

  hideOrbs(){
    for(var i = 12; i >=0; i --){
      var major = (7*i) % 12;
      var relative = ( (major + 9) % 12) + 12;
      var time = 100*(12-i) - 4*(12-i)**2

      var t = Tone.Time("+" + time/1000)
      this.orbs[major].disappearAtTime(time)
      this.orbs[relative].disappearAtTime(time)

      if(i > 6){
        musician.EndSynth[i%4].triggerAttackRelease(musician.makeTone( (7*i) + 48), '4n', t );
      }

    }
  }

  charAdded(){
    musician.EndSynth[this.majorScaleIndex%4].triggerAttackRelease(musician.makeTone( 60 + this.majorScale[this.majorScaleIndex]), '4n');
    this.majorScaleIndex++;
    if(this.majorScaleIndex > this.majorScale - 1)
      this.majorScaleIndex--;
  }

  charDelted(){
    this.majorScaleIndex--;
    if(this.majorScaleIndex < 0)
      this.majorScaleIndex++;
    musician.EndSynth[this.majorScaleIndex%4].triggerAttackRelease(musician.makeTone( 60 + this.majorScale[this.majorScaleIndex]), '4n');
  }

}
