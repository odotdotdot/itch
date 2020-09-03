class TempoOrb extends Orb{
  constructor(i, parent, theta){
      super({
          message: "tempo"
        , fillColor: "#353535"
        , textColor: "#fa9b9b"
        , theta: theta
        , show: true
        , radius: 1.25*geometry.ORB_MAX_RADIUS
        , semiMajorAxis: 4*geometry.RADIUS
        , velocity: Math.PI/1028
    });
      this.outlineColor = colors.outline;
      this.bpm = Tone.Transport.bpm.value;
      this.bpmAugment = .25;
      this.parent = parent;
      this.parent.orbs.push(this);
      this.parent.clickables.push(this);
      this.parent.repositionables.push(this);

  }
  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

  resize(){
    this.semiMajorAxis =  4*geometry.RADIUS;
    this.radius = 1.25*geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters, this.message, 24, this.radius * 2 - 5)
    this.primaryX = CX;
    this.primaryY = CY;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  onClick(){
    /* if inside execute new loop or function */
    this.invertColors();
    TEMPO_DRAG = !TEMPO_DRAG;
    this.parent.bpmDisplay.show = !this.parent.bpmDisplay.show;
    this.bpm = Tone.Transport.bpm.value;
  }

  drag(){
    /* we want the players to be able to drag the tempo orb around the feedback wheel to speed up or retardando the song
       the atan2 protocol takes care of the positioning.  if we ignore crossovers at pi & 0 by only looking at matching signs
       clockwise and counter-clockwise motion can be reduced to a simple comparison, handled in affectTempo */
    this.omega = this.theta
    this.theta = Math.atan2( (mouseY - this.primaryY) , (mouseX - this.primaryX) );
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
    if(Math.sign(this.omega) == Math.sign(this.theta))
      this.affectTempo(this.omega, this.theta);
  }

  affectTempo(omega, theta){
    if(omega < theta)
      this.bpm += this.bpmAugment;
    if(theta < omega)
      this.bpm -= this.bpmAugment;

    if(this.bpm < 20)
      this.bpm = 20;
    if(this.bpm > 220)
      this.bpm = 220;

    this.parent.bpmDisplay.bpm = Math.floor(this.bpm);

    if(frameCount%10 == 0){
      Tone.Transport.bpm.rampTo(this.bpm, 2);
    }

  }

  display(){
    fill(this.outlineColor);
    circle(this.u, this.v, 2*this.radius + 1);
    super.display();
  }

}
