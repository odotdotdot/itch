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

    this.tS = utility.setTextSize(fonts.letters, this.message, 40, 4*geometry.RADIUS)
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
    setTimeout( ()=>{
      this.show = true;
      this.message = m;
      var textSetMessage = this.message.includes('\n') ? this.message.split('\n')[1] : this.message
      this.tS = utility.setTextSize(fonts.letters, textSetMessage, 40, 4*geometry.RADIUS);
    }, n);
  }
  
  turnOffDisplayAtTime(n){
    setTimeout( ()=>{this.show = false;}, n);
  }
}
