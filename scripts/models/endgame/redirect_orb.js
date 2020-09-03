class RedirectOrb extends Orb{
  constructor({i
              ,parent
              ,url
              ,message
              ,semiMajorConstant = 8
              ,semiMajorAxis = 8*geometry.RADIUS
              ,tab = false}={}){
    super({
      message: message
    , fillColor: colors.alto
    , textColor: colors.black
    , theta: 0
    , show: true
    , radius: 1.25*geometry.ORB_MAX_RADIUS
    , semiMajorAxis: semiMajorAxis
    , semiMajorConstant: semiMajorConstant
    , primaryY: H - 2.25*geometry.ORB_MAX_RADIUS
    });

    this.outlineColor = colors.outline;
    this.parent = parent;
    this.state = false;
    this.url = url;
    this.tab = tab;
    this.tS = utility.setTextSize(fonts.letters, this.parent.redirectOrbTextSizeTest, 24, this.radius * 2 - 5)

    this.parent.clickables.push(this);
    this.parent.repositionables.push(this);


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
    this.parent.redirect(this.url, this.tab);
    this.state = false;
  }

  display(){
    //fill(this.outlineColor);
    //circle(this.u, this.v, 2*this.radius + 1);
    super.display();
  }

  resize(){
    this.semiMajorAxis = this.semiMajorConstant*geometry.RADIUS;
    this.radius = 1.25*geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters, this.parent.redirectOrbTextSizeTest, 24, this.radius * 2 - 5)
    this.primaryX = CX;
    this.primaryY = H - 2.25*geometry.ORB_MAX_RADIUS;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

}
