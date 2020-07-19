class LesserKeyOrb extends Orb{
  constructor({id
              ,fillColor = colors.outline
              ,textColor = colors.pink
              }= {}){
    super({
            fillColor : color(fillColor)
          , textColor : textColor
          , primaryX : geometry.KEYWHEEL_X
          , primaryY : geometry.KEYWHEEL_Y
          , semiMajorAxis : .5*geometry.KEYWHEEL_DIAMETER - 2*geometry.ORB_MAX_RADIUS*Math.floor(id/12)
          , semiMajorConstant : .5
          , theta : ( Math.PI/6 * ((id*7)%12) ) - Math.PI/2 - (11*Math.PI/12 * Math.floor(id/12))
          , message : spelling.pitchChromaticToLetter[id]
          , show: true
          , radius: geometry.ORB_MAX_RADIUS
        });
    this.id = id;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2 - 10);
    this.score = theoretician.SCALE_SCORES[this.id] + theoretician.GROWTH_BONUS[this.id]
    this.fillColor.setAlpha(220)
  }

  setAxis(){
    this.semiMajorAxis = this.semiMajorConstant*.5*geometry.KEYWHEEL_DIAMETER;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  setRadius(){
    this.score = theoretician.SCALE_SCORES[this.id] + theoretician.GROWTH_BONUS[this.id]
    this.radius = geometry.ORB_MAX_RADIUS * this.score/theoretician.highKeyScore();
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2 - 10);
  }

  setTheta(n){
    this.theta = n;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  resize(x = geometry.KEYWHEEL_X, y = geometry.KEYWHEEL_Y, coefficient=geometry.KEYWHEEL_DIAMETER){
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2 - 10);
    this.primaryX = x;
    this.primaryY = y;
    this.semiMajorAxis = this.semiMajorConstant*coefficient;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

}
