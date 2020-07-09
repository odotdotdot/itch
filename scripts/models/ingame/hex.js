class Hex {
  constructor({ index
              , x
              , y
              , isCopy = false
              , isCopyOf = null
              , hasCopy = false
              , pitchChromatic = (3+index*7)%12
              , impermanent_index = null} = {}){

    this.center = createVector(CX + x*geometry.RADIUS*Math.cos(y + geometry.OFFSET)
                             , CY + x*geometry.RADIUS*Math.sin(y + geometry.OFFSET));
    this.x = x;
    this.y = y;
    this.coordinates = x + " " + y;
    this.serial = index;
    this.pitchChromatic = pitchChromatic;
    this.isActive = false;
    this.isCopy = isCopy;
    this.isCopyOf = isCopyOf;
    this.hasCopy = hasCopy;
    this.impermanent_index = impermanent_index;
    this.root = null;
    this.accent = null;
    this.hexSpelling();
  }

  display(){
    beginShape();
    for(var i = 0; i < 7; i ++)
      vertex( this.center.x + .985*geometry.RADIUS * Math.cos(i * Math.PI/3 + geometry.OFFSET)
            , this.center.y + .985*geometry.RADIUS * Math.sin(i * Math.PI/3 + geometry.OFFSET) )
    endShape();
  }
  resize(){
    this.center = createVector(CX + this.x*geometry.RADIUS*Math.cos(this.y + geometry.OFFSET)
                             , CY + this.x*geometry.RADIUS*Math.sin(this.y + geometry.OFFSET));
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
  displayHexLetter(){
    text(this.root, this.center.x, this.center.y);
  }
  displayHexAccent(){
    text(this.accent, this.center.x + 25*Math.cos(-geometry.OFFSET-Math.PI/6), this.center.y + 20*Math.sin(-geometry.OFFSET-Math.PI/6));
  }
}
