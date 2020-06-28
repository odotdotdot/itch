class LargeText{
  constructor({ x = CX
              , y = CY
              , tS = 40
              , fC = colors.pink
              , message
              , show = true} = {}){
    this.x = x;
    this.y = y;
    this.tS = tS;
    this.fC = fC;
    this.message = message;
    this.show = show;
  }
  display(){
    if(this.show){
      push();
      textFont(fonts.leverkuhn);
      textSize(this.tS);
      textAlign(CENTER, CENTER);
      fill(this.fC);
      text(this.message, this.x, this.y);
      pop();
    }
  }

  resize(){
    this.x = CX;
    this.y = CY;
  }

  updateMessageAtTime(m,n){
    setTimeout( ()=>{this.show = true;this.message = m;}, n);
  }
  turnOffDisplayAtTime(n){
    setTimeout( ()=>{this.show = false;}, n);
  }
}
