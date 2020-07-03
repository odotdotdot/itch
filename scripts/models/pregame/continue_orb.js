class ContinueOrb extends Orb {
    constructor(){
      super({
        message: 'continue'
      , fillColor: colors.pink
      , textColor: colors.background
      , theta: 0
      , show: true
      , radius: geometry.ORB_MAX_RADIUS
      , semiMajorAxis: .5*W-2*geometry.ORB_MAX_RADIUS
      , velocity: 0

      });
  }
  onClick(){
    PRE_GAME = false;
    IN_GAME = true;
    _init_leverkuhn();
  }
}
