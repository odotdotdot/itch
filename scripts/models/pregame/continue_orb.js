class ContinueOrb extends Orb {
    constructor(parent){
      super({
        message: 'continue'
      , fillColor: colors.outline
      , textColor: colors.pink
      , theta: 0
      , show: true
      , radius: 1.25*geometry.ORB_MAX_RADIUS
      , semiMajorAxis: .5*(5*geometry.RADIUS + CX)
      , velocity: 0

      });

      this.parent = parent;
      this.state = false;
  }
  onClick(){
    this.state = true;
    this.invertColors();
  }

  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;

  }

  onRelease(){
    this.invertColors();
    this.parent.transition_to_in_game();
    this.state = false;
  }

  resize(){
          this.primaryX = CX
          this.primaryY = CY
          this.radius = 1.25*geometry.ORB_MAX_RADIUS
          this.semiMajorAxis =  .5*(5*geometry.RADIUS + CX)
          this.tS = utility.setTextSize(fonts.letters, this.message, 24, 2*this.radius - 5)
          this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
          this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }
}
