class DurationOrb extends Orb{
    constructor({  parent
                  ,bars = 2
                  ,theta = 0
                 } = {} ) {

      super({
        message: bars + ' bars'
      , fillColor: colors.outline
      , textColor: colors.pink
      , theta: theta
      , show: true
      , radius: .75*geometry.ORB_MAX_RADIUS
      , semiMajorAxis: 1.5*geometry.RADIUS
      , velocity: Math.PI/1028
      , primaryX : parent.continueOrb.u
      , primaryY : parent.continueOrb.v
      });

      this.bars = bars;
      this.barOptions = [2, 4, 8, 16]

      this.tS = utility.setTextSize(fonts.letters, this.message, 24, 2*this.radius - 5)
      this.parent = parent;
      this.parent.repositionables.push(this);
      this.state = false;
  }
  onClick(){
    this.bars = this.barOptions[(this.barOptions.indexOf(this.bars) + 1) % this.barOptions.length]
    this.message = this.bars + ' bars'
    this.tS = utility.setTextSize(fonts.letters, this.message, 24, 2*this.radius - 5)
    this.parent.durationChange(this.bars)
    musician.scoreDuration(this.bars)
    this.invertColors();
    this.state = true;
  }

  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

  onRelease(){
    this.invertColors();
    this.state = false;
  }

  resize(){
          this.primaryX = this.parent.continueOrb.u
          this.primaryY = this.parent.continueOrb.v
          this.radius = .75*geometry.ORB_MAX_RADIUS
          this.semiMajorAxis =  1.5*geometry.RADIUS
          this.tS = utility.setTextSize(fonts.letters, this.message, 24, 2*this.radius - 5)
          this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
          this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }
}
