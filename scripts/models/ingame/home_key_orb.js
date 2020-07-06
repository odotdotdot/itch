class HomeKeyOrb extends Orb{
  constructor(id, fillColor, textColor){
    super({
            fillColor : fillColor
          , textColor : textColor
          , primaryX : geometry.KEYWHEEL_X
          , primaryY : geometry.KEYWHEEL_Y
          , semiMajorAxis : .5*geometry.KEYWHEEL_DIAMETER
          , semiMajorConstant : .5
          , theta : id*2*PI/12 + (Math.floor(id/12)*2*PI/24)
          , message : spelling.pitchChromaticToLetter[id]
          , velocity : Math.PI/512
          , show: true
        });
    this.id = id;
    this.throwX = [];
    this.throwY = [];
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2);
  }

  setRadius(n){
    this.radius = n;
    this.tS = utility.setTextSize(fonts.letters,this.message,24,this.radius*2);
  }
    drag(){
      this.theta = atan2( (mouseY - geometry.KEYWHEEL_Y) , (mouseX - geometry.KEYWHEEL_X) );
      this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
      this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
      this.throwX.push(this.u);
      this.throwY.push(this.v);
    }
    inertia(){
      /*take a look at the direction of spin, taking an atan2, adjusted to the range of 0 - 2PI for the last ten position samples
        then run through the full position sample array and extract velocities into vSamples.  the average of vSamples is called aBar.
        it looks like this actually calculates the average velocity as opposed to acceleration but it's effectiv
        that "acceleration" is applied to the velocity through multiplication. friction works against it until it settles back around
        +/- PI/1028 rotations per frame*/

        if(this.throwX.length > 5){
        let pSamples = [];
        let direction = 0;

            for(var i = this.throwX.length - 1; i > this.throwX.length - 5 && i >= 0; i --){
              var b = utility.arcAdjust(Math.atan2(this.throwY[i] - geometry.KEYWHEEL_Y, this.throwX[i] - geometry.KEYWHEEL_X)/Math.PI);
              var a = utility.arcAdjust(Math.atan2(this.throwY[i-1] - geometry.KEYWHEEL_Y, this.throwX[i-1] - geometry.KEYWHEEL_X)/Math.PI);
                if( a < b)
                  direction+=1;
                else
                  direction-=1;
            }


          if(direction < 0)
            this.velocity = -1 * abs(this.velocity);
          else
            this.velocity = abs(this.velocity);

      //velocity/acceleration
        let vSamples = [];
        let aBar = 0;
        for(var i = 0; i < this.throwX.length-1; i ++)
          vSamples.push(((this.throwX[i+1] - this.throwX[i])**2 + (this.throwY[i+1] - this.throwY[i])**2)**.5);
        for(var i = 0; i < vSamples.length; i ++)
          aBar+=vSamples[i];
        aBar/=vSamples.length;
        this.velocity*=aBar;}

    }
    friction(){
      if(frameCount % 4 == 0 && Math.abs(this.velocity) > Math.PI/512)
        this.velocity*=.98;
      if(abs(this.velocity) <= Math.PI/512)
        this.velocity = (this.velocity/Math.abs(this.velocity))*Math.PI/512;
    }
    getSpinDirection(){
      return this.velocity/Math.abs(this.velocity);
    }
    getVelocity(){
      return 1 - (Math.abs(PI/this.velocity)/1028);
    }
}
