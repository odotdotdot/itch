class ChordDisplay{
  constructor( { x = geometry.KEYWHEEL_X
               , y = geometry.KEYWHEEL_Y
               , show = true
               , trex = []
               , outlineColor = colors.outline
             } = {}){
    //load fonts
    //prepare components
      this.root = "";
      this.accent = "";
      this.quality = "";
      this.tetrad = "";
      this.upperFigure = "";
      this.lowerFigure = "";
      this.displayFont = fonts.letters;
      this.ROOTSIZE = 150*geometry.SCALE;
      this.x = x;
      this.y = y;
      this.show = show
      this.trex = trex
      this.trexIndice = null;
      this.outlineColor = outlineColor;
  }
  resize(x = geometry.KEYWHEEL_X, y=geometry.KEYWHEEL_Y){
    this.x = x;
    this.y = y;
    this.ROOTSIZE = 150*geometry.SCALE;
  }
  setChord(theoryRecord, ck){
    if(theoryRecord>>>12 < 12){
      var rootPitchChromatic = theoryRecord>>>12;
      var spellingRule =  (spelling.spelling[ck - (Math.floor(ck/12)*(ck - ((ck-9)%12)))] >>> (2*rootPitchChromatic)) & 0x00000003;
      switch(spellingRule){
        //natural
          case 0: this.root = spelling.pitchChromaticToLetter[rootPitchChromatic]; break;
        //sharp
          case 1: this.root = spelling.pitchChromaticToLetter[ (rootPitchChromatic-1 + 12) %12 ]; break;
        //flat
          case 2: this.root = spelling.pitchChromaticToLetter[ (rootPitchChromatic+1) %12 ]; break;
        //out of key. should look at voice movement
          case 3: this.root = spelling.pitchChromaticToLetter[ (rootPitchChromatic-1 + 12) %12 ]; break;
      }
      this.accent = spelling.accents[spellingRule];
    }
    else{
      this.root = "";
      this.accent = "";}
  //set quality
    let qualities = ["", "m", "o", "+", "", "", "", "m", "o", "\u00F8", "+", "sus2", "sus4"];
    if( ((theoryRecord>>>8) & 0x0f) != 15)
      this.quality = qualities[(theoryRecord>>>8) & 0x0f];
    else
      this.quality =  "";
  //set tetrad
    let tetrads = ["", "", "", "", "M7", "7", "m7", "M7", "7", "7", "7"];
    if( ((theoryRecord>>>8) & 0x0f) != 15)
      this.tetrad = tetrads[(theoryRecord>>8) & 0x0f];
    else
      this.tetrad =  "";
  //set figured bass
    let upperFigures = ["", "6", "6", "6", "4", "4"];
    let lowerFigures = ["",  "", "4", "5", "3", "2"];
    if(( ((theoryRecord>>>4) & 0x000f) != 15)){
      this.upperFigure = upperFigures[(theoryRecord>>>4) & 0x000f];
      this.lowerFigure = lowerFigures[(theoryRecord>>>4) & 0x000f];}
    else{
      this.upperFigure = "";
      this.lowerFigure = "";}
  }
  advanceTrex(){
    if(this.trexIndice == null){
      this.trexIndice = 0;
      this.setChord(this.trex[this.trexIndice], CURRENT_KEY);
      this.show = true;
    }
    else{
      this.trexIndice++;
      this.trexIndice%=this.trex.length;
      this.setChord(this.trex[this.trexIndice], CURRENT_KEY);
    }
  }
  display(){
        if(this.show && !TEMPO_DRAG){
          push();
        //circle
          stroke(this.outlineColor);
          strokeWeight(2);
          noFill();
          circle(this.x, this.y, 6 * geometry.RADIUS);
          noStroke();
        //root
          fill(colors.pink);
          textAlign(CENTER, CENTER);
          textFont(fonts.letters);
          textSize(this.ROOTSIZE);
          text(this.root, this.x, this.y);
        //quality
          textAlign(LEFT, CENTER);
          textSize(.5*this.ROOTSIZE);
          text(this.quality, this.x + textWidth(this.root) + .0325*this.ROOTSIZE, this.y);
        //tetrad
          textSize(.375*this.ROOTSIZE);
          text(this.tetrad, this.x + .6*this.ROOTSIZE*Math.cos(-4*PI/16) + textWidth(this.accent), this.y + .6*this.ROOTSIZE*Math.sin(-4*PI/16));
        //figured bass
          textAlign(RIGHT, CENTER);
          textSize(.275*this.ROOTSIZE);
          text(this.upperFigure, this.x + .45*this.ROOTSIZE*Math.cos(-29*PI/32), this.y + .45*this.ROOTSIZE*Math.sin(-29*PI/32));
          text(this.lowerFigure, this.x + .45*this.ROOTSIZE*Math.cos(-35*PI/32), this.y + .45*this.ROOTSIZE*Math.sin(-35*PI/32));
        //accent
          textAlign(CENTER, CENTER);
          textFont(fonts.accents);
          textSize(.4*this.ROOTSIZE);
          text(this.accent,  this.x + textWidth(this.root) + .225*this.ROOTSIZE, this.y - .55*this.ROOTSIZE);
          pop();}
  }
}
