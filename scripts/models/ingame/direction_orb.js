class DirectionOrb extends Orb{

  constructor( {
                 message
                ,theta
                ,semiMajorAxis
                ,parent
                ,semiMajorConstant
               } = {} ){
    super({
      message: message
    , fillColor: colors.outline
    , textColor: colors.pink
    , theta: theta
    , show: true
    , radius: geometry.ORB_MAX_RADIUS
    , semiMajorAxis: semiMajorAxis
    , semiMajorConstant: semiMajorConstant
    , primaryX : CX
    , primaryY : CY
    });

    this.parent = parent;
    this.state = false;
    this.tS = utility.setTextSize(fonts.letters, this.message, 18, 2*this.radius)
    this.parent.parent.clickables.push(this);
    this.parent.parent.respositionables.push(this);
  }

  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

  onClick(){
    /* if inside execute new loop or function */
    this.invertColors();
    this.state = true;
  }

  onRelease(){
    this.invertColors();
    this.parent.ping(this.message);
    this.state = false;
  }

  resize(){
    this.radius = geometry.ORB_MAX_RADIUS;
    this.primaryX = CX;
    this.primaryY = CY;
    this.tS = utility.setTextSize(fonts.letters, this.message, 18, 2*this.radius)
    this.semiMajorAxis = geometry.RADIUS * this.semiMajorConstant;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }
}
