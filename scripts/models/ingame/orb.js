class Orb{
  constructor( { radius = .7*geometry.ORB_MAX_RADIUS
                ,theta = 0
                ,omega = 0
                ,radialOffset = 2*Math.PI*Math.random()
                ,velocity = Math.PI/1028
                ,operativePlanet = null
                ,initX = null
                ,initY = null
                ,primaryX = windowWidth*.5
                ,primaryY = windowHeight*.5
                ,semiMajorAxis = 2.5*geometry.RADIUS
                ,semiMajorConstant = .7
                ,fillColor = colors.bass
                ,textColor = colors.soprano
                ,tS = 24
                ,message = null
                ,type = null
                ,show = false
                ,allowBreath = true
               } = {}){

    this.radius = radius;
    this.theta = theta;   // actually radial position
    this.omega = omega;
    this.velocity = velocity; // actually angular velocity in radians/frame
    this.radialOffset = radialOffset;

    this.initX = initX;
    this.initY = initY;

    this.primaryX = primaryX;
    this.primaryY = primaryY;
    this.semiMajorAxis = semiMajorAxis;
    this.semiMajorConstant = semiMajorConstant;

    this.show = show;
    this.type = type;
    this.fillColor = fillColor;
    this.textColor = textColor;
    this.tS = tS;
    this.message = message;

    if(this.message!=null)
      this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2-5);

    this.u = this.primaryX + this.semiMajorAxis*Math.cos(theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(theta);

    this.vel = 0; //actual velocity in px/f. components below.
    this.vx  = 0;
    this.vy  = 0;
    this.r = 0;
  }

  isInside(x,y){
    if( (x-this.u)**2 + (y-this.v)**2 < this.radius**2)
      return true;
    else {
      return false;
    }
  }
  orbit(t = 0){
    this.theta+=this.velocity;
    this.u = this.primaryX + (this.semiMajorAxis)*Math.cos(this.theta);
    this.v = this.primaryY + (this.semiMajorAxis)*Math.sin(this.theta);
    this.initX = this.u;
    this.initY = this.v;
    this.theta%=Math.PI*2;
  }
  init_controlledOrbit(w = this.velocity){
    this.velocity = w;
    this.theta %= 2*Math.PI;
    this.omega = this.theta + Math.PI - (this.theta % Math.PI);
  }
  controlledOrbit(callback){
    if( abs(this.theta) < abs(this.omega) ){
      this.theta += this.velocity;
      if( abs(this.theta) > abs(this.omega) ){
        callback();
        this.theta = this.omega;
      }
      this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
      this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
      this.initX = this.u;
      this.initY = this.v;
    }
  }
  setMessage(message){
    this.message = message;
  }
  appearAtTime(t){
    setTimeout( ()=>{
      this.show = true;
    }, t);
  }
  disappearAtTime(t){
      setTimeout( ()=>{
        this.show = false;
      }, t);
  }
  setTwin(twin){
    this.twin = twin;
  }
  resize(x = geometry.KEYWHEEL_X, y=geometry.KEYWHEEL_Y, coefficient = geometry.KEYWHEEL_DIAMETER){
    this.radius = .7 * geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2-5);
    this.primaryX = x;
    this.primaryY = y;
    this.semiMajorAxis = this.semiMajorConstant * coefficient;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }
  display(){

    if(this.show==true){
      fill(this.fillColor);
      circle(this.u, this.v, 2*this.radius);
      fill(this.textColor);
      textSize(this.tS);
      text(this.message, this.u, this.v);
    }
  }
}
