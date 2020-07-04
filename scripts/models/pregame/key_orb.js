class KeyOrb extends Orb{
  constructor(i, parent){
    super({
      message: spelling.pitchChromaticToLetter[i]
    , fillColor: colors.pink
    , textColor: colors.background
    , theta: ((i*7)%12)*2*Math.PI/12 - (Math.PI/2)*Math.floor(i/12) + Math.floor(i/12)*Math.PI/12
    , show: false
    , radius: geometry.ORB_MAX_RADIUS
    , semiMajorAxis: 5*geometry.RADIUS - Math.floor(i/12)*1*geometry.RADIUS
    , velocity: Math.PI / (1<<13)
    });

    this.parent = parent;
    this.state = false;
    this.key_id = i;

  }
  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

  onClick(){
    /* if inside execute new loop or function */
    if(this.state == false){
      this.invertColors();
      this.state = true;
      HOME_KEY = this.key_id;
      this.parent.clearPreviousOrbSelection(this.key_id);
      this.parent.signal();
    }
  }

  restoreToDefault(){
    this.fillColor = colors.pink;
    this.textColor = colors.background;
    this.state = false;
  }

  resize(){
    this.semiMajorAxis = 5*geometry.RADIUS - Math.floor(this.key_id/12)*1*geometry.RADIUS;
    this.radius = geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters, this.message, 24, this.radius * 2 - 5)
    this.primaryX = CX;
    this.primaryY = CY;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  display(){
    this.orbit();
    super.display();
  }
}
