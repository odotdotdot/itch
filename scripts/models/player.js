class Player{
  //td dynamize text size based on username length.  find new font
  constructor(uN, hK, t, fC, tC, turn){
    this.userName = uN;
    this.homeKey = hK;
    this.score = 0;
    this.radialPosition = 0;
    this.isMyTurn = turn;
    this.orb = new PlayerOrb(fC, tC, t, this);
    this.orb.initX = this.orb.u;
    this.orb.initY = this.orb.v;
  }

  display(){
    push();
    this.orb.controlledOrbit(checkIfGameIsOver);
    this.orb.display();
    pop();
  }

  resize(){
    this.orb.resize(geometry.STAFF_X, geometry.STAFF_Y, geometry.KEYWHEEL_DIAMETER);
    this.orb.u = this.orb.primaryX + this.orb.semiMajorAxis*Math.cos(this.orb.theta);
    this.orb.v = this.orb.primaryY + this.orb.semiMajorAxis*Math.sin(this.orb.theta);
  }

}
