class EndGameOrb extends Orb{
  constructor( {  i
                , m
                , state = false
                , tickLength
                , parts
                , bpm = 96
                , parent
                , patch = 3}){
      super({
          message: m
        , fillColor: "#353535"
        , textColor: "#fa9b9b"
        , theta: i*2*Math.PI/6
        , show: true
        , radius: geometry.ORB_MAX_RADIUS
        , semiMajorAxis: 4*geometry.RADIUS
      });
    this.outlineColor = "#fa9b9b";
    this.tickLength = tickLength;
    this.parts = parts;
    this.state = state;
    this.bpm = bpm;
    this.parent = parent;
    this.chordDisplayID = null;
    this.patch = patch;


  }

  resize(){
    this.semiMajorAxis = 4*geometry.RADIUS;
    this.radius = geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters, this.message, 24, this.radius * 2 - 5)
    this.primaryX = CX;
    this.primaryY = CY;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
    this.outlineColor = this.textColor;
  }

  onClick(){
    /* if inside execute new loop or function */
    this.invertColors();
    this.state = !this.state;
    for(var i = 0; i < this.parts.length; i ++){
      this.parts[i].part.mute = !this.parts[i].part.mute;
      }
    if(this.state == true){
      for(var i = 0; i < musician.EndSynth.length; i ++)
        musician.EndSynth[i].set(musician.program[this.patch]);
      this.transpoInit();
    }
    if(this.state == false){
      Tone.Transport.stop();
      Tone.Transport.clear(this.chordDisplayID);
      this.parent.egcd.show = false;
      this.parent.egcd.trexIndice = null;
    }

  }

  display(){
    fill(this.outlineColor);
    circle(this.u, this.v, 2*this.radius + 1);
    super.display();

  }

  transpoInit(){
    this.chordDisplayID = Tone.Transport.scheduleRepeat( (time)=>{this.parent.egcd.advanceTrex();}, this.tickLengthToChordLength(this.tickLength));

    Tone.Transport.set({  loop : true
                        , loopEnd : this.tickLength
                        , bpm: this.bpm
                        , position: "0:0:0"});

    Tone.Transport.start("+.1");

  }

  tickLengthToChordLength(tL){
      var chordUnit = Math.round(1/GAME_DURATION_IN_TURNS * parseInt(tL.slice(0,-1)));
    return chordUnit.toString() + "i";
  }

}
