class HexLabel{
  constructor({   center
                 ,pitchChromatic
                 ,serial
  } = {}) {
    this.center = center
    this.pitchChromatic = pitchChromatic
    this.serial = serial
    this.root = null
    this.accent = null
    this.hexSpelling()

  }
  display(){
    push()
    fill(colors.pink)
    textFont(fonts.letters)
    textSize(24*geometry.SCALE)
    text(this.root, this.center.x, this.center.y);
    textSize(.6 * 32*geometry.SCALE)
    textFont(fonts.accents)
    text(this.accent, this.center.x + 25*geometry.SCALE*Math.cos(-geometry.OFFSET-Math.PI/6), this.center.y + 20*geometry.SCALE*Math.sin(-geometry.OFFSET-Math.PI/6));
    pop()
  }
  hexSpelling(){
      var root = "";
      var spellingRule =  (spelling.spelling[CURRENT_KEY] >> (2*this.pitchChromatic)) & 0x00000003;
      switch(spellingRule){
        //natural
          case 0: root = spelling.pitchChromaticToLetter[this.pitchChromatic]; break;
        //sharp
          case 1: root = spelling.pitchChromaticToLetter[ (this.pitchChromatic-1 + 12) %12 ]; break;
        //flat
          case 2: root = spelling.pitchChromaticToLetter[ (this.pitchChromatic+1) %12 ]; break;
      }
      this.root = root;
      this.accent = spelling.accents[spellingRule];
    }
  resize(){
      this.center = hexes.find( h => this.serial == h.serial).center
  }

}
