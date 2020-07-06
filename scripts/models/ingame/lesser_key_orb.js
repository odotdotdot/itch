class LesserKeyOrb extends Orb{
  constructor(id, fillColor, textColor, axis = .5){
    super({
            fillColor : fillColor
          , textColor : textColor
          , primaryX : geometry.KEYWHEEL_X
          , primaryY : geometry.KEYWHEEL_Y
          , semiMajorAxis : axis*geometry.KEYWHEEL_DIAMETER
          , semiMajorConstant : axis
          , theta : ((id*7)%12)*2*PI/12 - PI/2 - (PI/2)*Math.floor(id/12)
          , message : spelling.pitchChromaticToLetter[id]
          , show: true
        });
    this.id = id;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2);
  }

  setAxis(){
    this.semiMajorAxis = this.semiMajorConstant*.5*geometry.KEYWHEEL_DIAMETER;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  setRadius(n){
    this.radius = n;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2);
  }

  setTheta(n){
    this.theta = n;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  resize(x = geometry.KEYWHEEL_X, y = geometry.KEYWHEEL_Y, coefficient=geometry.KEYWHEEL_DIAMETER){
    this.radius = .7 * geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2);
    this.primaryX = x;
    this.primaryY = y;
    this.semiMajorAxis = this.semiMajorConstant*coefficient;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

}
