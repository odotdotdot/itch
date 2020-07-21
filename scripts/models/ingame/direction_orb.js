class DirectionOrb extends Orb{

  constructor( {
                 message
                ,parent
                ,position
               } = {} ){
    super({
      message: message
    , fillColor: colors.outline
    , textColor: colors.pink
    , theta: 0
    , show: true
    , radius: geometry.ORB_MAX_RADIUS
    , semiMajorAxis: 0
    , semiMajorConstant: 0
    , primaryX : 0
    , primaryY : 0
    });

    this.parent = parent;
    this.state = false;
    this.position = position
    this.tS = utility.setTextSize(fonts.letters, this.message, 18, 2*this.radius - 5)
    this.parent.parent.parent.clickables.push(this)

    if(parent.alignment == CENTER)
      this.u = parent.x + .5 * parent.calculate_text_width() - 2*geometry.RADIUS*this.position
    if(parent.alignment == RIGHT)
      this.u = parent.x - 2*geometry.RADIUS*this.position
    if(parent.alignment == LEFT)
      this.u = parent.x + parent.calculate_text_width() - 2*geometry.RADIUS*this.position

    this.v = parent.y + 1.5*geometry.RADIUS

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

    if(this.state){
      this.invertColors();
      this.parent.parent.ping(this.message, this.parent.id);
      this.state = false
    }

  }

  calculateUV(){
    if(this.parent.alignment == CENTER)
      this.u = this.parent.x + .5 * this.parent.calculate_text_width() - 2*geometry.RADIUS*this.position
    if(this.parent.alignment == RIGHT)
      this.u = this.parent.x - 2*geometry.RADIUS*this.position
    if(this.parent.alignment == LEFT)
      this.u = this.parent.x + this.parent.calculate_text_width() - 2*geometry.RADIUS*this.position

    this.v = this.parent.y + 1.5*geometry.RADIUS
  }

}
