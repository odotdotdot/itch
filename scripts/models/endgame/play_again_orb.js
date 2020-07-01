class PlayAgainOrb extends Orb{
  constructor(i, parent){
    super({
      message: "play again"
    , fillColor: "#353535"
    , textColor: "#fa9b9b"
    , theta: i*2*Math.PI/7
    , show: true
    , radius: geometry.ORB_MAX_RADIUS
    , semiMajorAxis: 4*geometry.RADIUS
    });

    this.outlineColor = "#fa9b9b";
    this.parent = parent;
    this.state = false;


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
    this.state = true;
  }

  onRelease(){
    this.invertColors();
    this.parent.playAgain();
    this.state = false;
  }

  display(){
    fill(this.outlineColor);
    circle(this.u, this.v, 2*this.radius + 1);
    super.display();
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

}
