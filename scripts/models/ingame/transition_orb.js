class TransitionOrb extends Orb{
  constructor(){
    super({
        radius : 2.5*geometry.RADIUS
      , show: false
      , primaryX : .5*windowWidth
      , primaryY: .5*windowHeight
      , semiMajorAxis: 0
      , fillColor: colors.background
      , textColor: colors.bass
    });
   this.tx = this.u;
   this.ty = this.v;
   this.yOFF = 0;

   this.coloric = color(this.fillColor);
   this.coloric.setAlpha(240);
 }

   display(){
     if(this.show){
       push();
         stroke(colors.outline)
         strokeWeight(1);
         fill(this.coloric);
         circle(this.u, this.v, 2*this.radius);
         fill(this.textColor);
         textSize(this.tS);
         text(this.message, this.tx, this.ty);
      pop();
    }
   }

   setTextSize(){
     /*
     overwrite this method so the comparison is to the chord length at tx, ty rather than the diameter
     */
     let s = 24*geometry.SCALE;
     textFont(fonts.letters);
     textSize(s);
     while( textWidth(this.message) > 2*(this.radius**2 - this.yOFF**2)**.5 - 10 && s > 2){
       s-=.5;
       textSize(s);
     }
     this.tS = s;
   }

   resize(){
      this.radius = 2.5 * geometry.RADIUS;
      if(this.message)
        this.setTextSize()
      this.primaryX = CX;
      this.primaryY = CY;
      this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
      this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
      this.tx = this.u;
      this.ty = this.v;
   }

}
