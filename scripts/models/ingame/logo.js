class Logo{
  constructor(x, y){
    this.x = W - geometry.KEYWHEEL_X - .5*geometry.KEYWHEEL_DIAMETER;
    this.y = geometry.KEYWHEEL_Y - 3*geometry.RADIUS
    this.text_size = 40*geometry.SCALE
  }
  display(){
    push();
      textFont(fonts.leverkuhn);
      textSize(this.text_size);
      textAlign(LEFT, CENTER);
      fill(colors.leverkuhn);
      text("leverkuhn", this.x, this.y);
    pop();
  }
  resize(){
    this.text_size = 40*geometry.SCALE
    this.x = W - geometry.KEYWHEEL_X - .5*geometry.KEYWHEEL_DIAMETER;
    this.y = geometry.KEYWHEEL_Y - 3*geometry.RADIUS
  }
}
