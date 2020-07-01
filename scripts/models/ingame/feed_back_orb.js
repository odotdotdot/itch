class FeedBackOrb extends Orb{
  constructor(type, theta, message){
    super({
        radius: .9*geometry.ORB_MAX_RADIUS
      , fillColor: "#fa9b9b"
      , textColor: "#353535"
      , velocity: -Math.PI/256
      , type: type
      , theta: theta
      , message: message
      , omega: -2.5*Math.PI
      , semiMajorAxis: 4*geometry.RADIUS
    });

    this.coloric = color(this.fillColor);
    this.coloric.setAlpha(230);
    this.movementProtocol = 0;
    this.releaseAcceleration = 3;

    //bezier terms
    this.t = 0;
    this.tinc = 0.01;
    this.CPX = [];
    this.CPY = [];

  }

  movement(){
    switch(this.movementProtocol){
      case 0:
        this.orbit();
        break;
      case 1:
        this.controlledOrbit( ()=>{this.initBezier(geometry.STAFF_X, .25*geometry.STAFF_Y); this.movementProtocol++;} )
        break;
      case 2:
        this.bezier();
        break;
      }
  }

  initBezier(x,y){
    this.CPX = [this.u, x, scoreKeeper.playerWhoseTurnIsBeingScored.orb.u];
    this.CPY = [this.v, y, scoreKeeper.playerWhoseTurnIsBeingScored.orb.v];
  }

  bezier(){
    this.t+=this.tinc;
    //quadratic
        this.u = this.CPX[0] * (1-this.t)**2 + this.CPX[1]*2*(1-this.t)*this.t + this.CPX[2]*this.t**2;
        this.v = this.CPY[0] * (1-this.t)**2 + this.CPY[1]*2*(1-this.t)*this.t + this.CPY[2]*this.t**2;

    /* if the satellite reaches the planet, cease to show it and augment the planet's size accordingly
       the message has to operated on to extract the +/-. the musician should signify this.
       also the player orb socre should only show for n seconds after impact.  then we're back to the name*/
       if(this.t > .99 && this.show == true){

         this.show = false;

         var scoreToSend = parseInt(this.message, 10);

         scoreKeeper.playerWhoseTurnIsBeingScored.orb.collide(scoreToSend);
       }
  }

  release(){
    this.velocity *= this.releaseAcceleration;
    this.theta %= 2*Math.PI;
    this.movementProtocol++;

}
  resize(){
    this.primaryX = CX;
    this.primaryY = CY;
    this.radius = .9*geometry.ORB_MAX_RADIUS;
    this.semiMajorAxis = 4*geometry.RADIUS;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  display(){
    if(this.show==true){
      fill(this.coloric);
      circle(this.u, this.v, 2*this.radius);
      fill(this.textColor);
      textSize(this.tS);
      text(this.message, this.u, this.v);
    }
  }

}
