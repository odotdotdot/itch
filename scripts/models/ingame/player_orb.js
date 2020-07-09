class PlayerOrb extends Orb{
  constructor(fC, tC, t, player){
    super({
      radius: geometry.ORB_MAX_RADIUS * .8
    , show: true
    , fillColor: fC
    , textColor: tC
    , theta: t
    , primaryX: geometry.STAFF_X
    , primaryY: geometry.STAFF_Y
    , semiMajorConstant : .7
    , semiMajorAxis: .7*geometry.KEYWHEEL_DIAMETER
    , message: player.userName
  });

  this.player = player;
  this.score = 0;
  this.collisions = null;
  this.expectedCollisions = null;
  }
  collide(n){
    /* expand or contract the orb in accordance with the value of the satellite that's struck it
       make it jump up in glee or cower down in shame by varying this.vel... that velocity will be
       applied in aux
       also make a sound */

    this.score+=n;

    this.setMessage(this.score.toString());
    this.twin.setMessage(this.twin.score.toString());

    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2 - 10);
    this.twin.tS = utility.setTextSize(fonts.letters,this.twin.message,24,this.twin.radius*2 - 10);

    this.vel = 5;
    this.r = 1.5*Math.PI + Math.sin(Math.random()*2*Math.PI)*0.125*Math.random()*Math.PI*Math.sign(n);

    //trying ascending 6ths
    musician.scoreCollision(n, this.collisions);

    this.collisions++;

    if(this.collisions == this.expectedCollisions){
       this.init_controlledOrbit(Math.PI/128);
       this.twin.init_controlledOrbit(Math.PI/128);

       setTimeout( ()=>{
        this.setMessage(this.player.userName);
        this.tS = utility.setTextSize(fonts.letters, this.message,24,this.radius*2-5);
        this.twin.setMessage(this.twin.player.userName);
        this.twin.tS = utility.setTextSize(fonts.letters, this.twin.message,24,this.twin.radius*2-5);
      }, 2500 );
  }

}
  resize(x = geometry.STAFF_X, y=geometry.STAFF_Y, coefficient = geometry.KEYWHEEL_DIAMETER){
    this.radius = .8 * geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2-5);
    this.primaryX = x;
    this.primaryY = y;
    this.semiMajorAxis = this.semiMajorConstant * coefficient;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

}
