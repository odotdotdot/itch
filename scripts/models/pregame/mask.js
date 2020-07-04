class Mask{
  constructor(){
    this.color = color(this.background);
}
display(){
  rectMode(CENTER);
  this.color.setAlpha(30);
  fill(this.color);
  rect(CX, CY, W, H);
}
}
