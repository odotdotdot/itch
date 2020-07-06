class Button{
  constructor(parent, id, message, callback){
    this.message = message;
    this.tSize = 18;
    this.linkID = id;
    push();
    textFont(fonts.letters)
    textSize(this.tSize);
    this.w = textWidth(this.message);
    this.h = textAscent() + textDescent();
    pop();
    this.f = callback;
    this.parent = parent;

    this.color_A = colors.pink;
    this.color_B = colors.outline;

    this.x = this.linkID > 0 ? this.parent.buttons[this.linkID-1].x - .5*this.parent.buttons[this.linkID-1].w - 20 - .5*this.w :
             W - 20 - .5*this.w;

    this.y = H - 20;

    this.parent.visibles.push(this);
    this.parent.clickables.push(this);
    this.parent.respositionables.push(this);
  }

  onClick(){
    this.invertColors();
    this.f();
  }

  onRelease(){
    this.invertColors();
  }

  invertColors(){
    var temp = this.color_A;
    this.color_A = this.color_B;
    this.color_B = temp;
  }

  isInside(x,y){
    if( abs(x - this.x)<.5*this.w && abs(y - this.y)<.5*this.h)
      return true;
    else
      return false;
  }

  display(){
    push();
      fill(this.color_A);
      noStroke();
      textSize(this.tSize);
      textAlign(CENTER, CENTER);
      text(this.message, this.x, this.y);
    pop();
  }



  resize(){
    this.x = this.linkID > 0 ? this.parent.buttons[this.linkID-1].x - .5*this.parent.buttons[this.linkID-1].w - 20 - .5*this.w :
             W - 20 - .5*this.w;
    this.y = H - 20;
  }

}
