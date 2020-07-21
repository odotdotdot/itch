class Button{
  constructor({parent, id, message, callback} = {}){
    this.message = message;
    this.tSize = 20 * geometry.SCALE;
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

    this.x = this.parent.buttonStop - .5*this.w
    this.y = geometry.STAFF_Y + 3*geometry.RADIUS;
    this.parent.buttonStop = this.x - .5*this.w - 20

    this.parent.clickables.push(this);
    this.parent.repositionables.push(this);
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
    this.tSize = 20 * geometry.SCALE;
    push();
    textFont(fonts.letters)
    textSize(this.tSize);
    this.w = textWidth(this.message);
    this.h = textAscent() + textDescent();
    pop();

    this.x = this.parent.buttonStop - .5*this.w
    this.y = geometry.STAFF_Y + 3*geometry.RADIUS;
    this.parent.buttonStop = this.x - .5*this.w - 20
  }

}
