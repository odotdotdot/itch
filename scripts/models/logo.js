class Logo{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  display(){
    push();
      textFont(fonts.leverkuhn);
      textSize(40);
      textAlign(LEFT, CENTER);
      fill(colors.leverkuhn);
      text("leverkuhn", this.x, this.y);
    pop();
  }
}
