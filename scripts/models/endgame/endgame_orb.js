class EndGameOrb extends Orb{
  constructor( {  i
                , egoi
                , m
                , state = false
                , tickLength
                , parts
                , bpm = 96
                , parent
                , patch = 3}){
      super({
          message: m
        , fillColor: colors.background
        , textColor: colors.pink
        , theta: i*2*Math.PI/7
        , show: true
        , radius: 1.25*geometry.ORB_MAX_RADIUS
        , semiMajorAxis: 4*geometry.RADIUS
      });
    this.outlineColor = colors.outline;
    this.tickLength = tickLength;
    this.parts = parts;
    this.state = state;
    this.bpm = bpm;
    this.parent = parent;
    this.chordDisplayID = null;
    this.patch = patch;
    this.egoi = egoi;


  }

  resize(){
    this.semiMajorAxis = 4*geometry.RADIUS;
    this.radius = 1.25*geometry.ORB_MAX_RADIUS;
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
  }

  onClick(){
    /* if inside execute new loop or function */
    switch(this.state){
      case true:
        this.deactivate();
        break;
      case false:
        this.invertColors();
        this.parent.ping(this.egoi);
        break;
    }
  }

  activate(){
    this.state = true;
    for(var i = 0; i < this.parts.length; i ++)
      this.parts[i].part.mute = false;
    this.transpoInit();
  }

  deactivate(){
    this.fillColor = colors.background;
    this.textColor = colors.pink;
    if(this.state == true){
      for(var i = 0; i < this.parts.length; i ++)
        this.parts[i].part.mute = true;
      Tone.Transport.stop();
      Tone.Transport.clear(this.chordDisplayID);
      this.parent.egcd.show = false;
      this.parent.egcd.trexIndice = null;
      this.state = false;
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
