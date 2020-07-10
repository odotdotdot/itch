class Logo{
  constructor(x, y){
    this.x = 50;
    this.y = geometry.KEYWHEEL_Y - 3*geometry.RADIUS;
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
  resize(){
    this.x = 50;
    this.y = geometry.KEYWHEEL_Y - 3*geometry.RADIUS;
  }
}
