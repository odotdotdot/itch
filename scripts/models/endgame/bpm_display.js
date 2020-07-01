class BPMDisplay{
  constructor({ x = CX
              , y = CY
              , bpm = Tone.Transport.bpm.value
              , show = false
              } = {}){
        this.x = x;
        this.y = y;
        this.bpm = bpm;
        this.show = show;
        this.ROOTSIZE = 150*geometry.SCALE;
  }
  display(){
    if(this.show){
      push();
        fill(colors.pink);
        textAlign(CENTER, CENTER);
        textFont(fonts.letters);
        textSize(this.ROOTSIZE);
        text(this.bpm, this.x, this.y);
      pop();
    }
  }
  resize(){
    this.x = CX;
    this.y = CY;
  }
}
