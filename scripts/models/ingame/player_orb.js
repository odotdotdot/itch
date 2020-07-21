class PlayerOrb extends Orb{
  constructor(fC, tC, t, player){
    super({
      radius: geometry.ORB_MAX_RADIUS
    , show: true
    , fillColor: fC
    , textColor: tC
    , theta: t
    , primaryX: geometry.STAFF_X
    , primaryY: geometry.STAFF_Y
    , semiMajorConstant : 4
    , semiMajorAxis:4*geometry.RADIUS
    , message: player.userName
  });

  this.player = player;
  this.score = 0;
  this.collisions = null;
  this.expectedCollisions = null;
  igmgr.clickables.push(this)
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
       igmgr.visibles.splice(igmgr.visibles.indexOf(scoreKeeper), 1)

       setTimeout( ()=>{
        this.setMessage(this.player.userName);
        this.tS = utility.setTextSize(fonts.letters, this.message,24,this.radius*2-5);
        this.twin.setMessage(this.twin.player.userName);
        this.twin.tS = utility.setTextSize(fonts.letters, this.twin.message,24,this.twin.radius*2-5);
      }, 2500 );
  }

}
  resize(){
    this.radius = geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2-5);
    this.primaryX = geometry.STAFF_X;
    this.primaryY = geometry.STAFF_Y;
    this.semiMajorAxis = 4*geometry.RADIUS
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

  onClick(){
    if(this.player.isMyTurn)
      this.invertColors()
  }
  onRelease(){
    if(this.player.isMyTurn  && !TUTORIAL && this.player == me){
      this.invertColors()
      turnSignified(this.player)}

    if(this.player.isMyTurn && TUTORIAL && this.player == me){
      this.invertColors()
      igmgr.tutorial.changeText('Click done first.')
    }
  }
  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

}
