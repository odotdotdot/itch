class KeyOrb extends Orb{
  constructor(i){
    super({
      message: spelling.pitchChromaticToLetter[i]
    , fillColor: colors.pink
    , textColor: colors.background
    , theta: i*2*Math.PI/12 + (Math.floor(i/12)*2*Math.PI/24) + (Math.floor(i/12)*Math.PI/2)
    , show: true
    , radius: geometry.ORB_MAX_RADIUS
    , semiMajorAxis: 5.5*geometry.RADIUS - Math.floor(i/12)*1.5*geometry.RADIUS
    , velocity: Math.PI / (1<<13)
    });

    //this.parent = parent;
    this.state = false;

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
    this.state = false;
  }

  resize(){
    this.semiMajorAxis =5.5*geometry.RADIUS - Math.floor(i/12)*1.5*geometry.RADIUS;
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
