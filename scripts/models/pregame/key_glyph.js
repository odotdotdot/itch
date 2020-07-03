class KeyGlyph{
  constructor(){
    this.positions = {
       letter : createVector(CX - 1.25*geometry.RADIUS , CY)

      ,accidental : createVector(.5*(2*CX + (2**.5) * (4/12) * geometry.RADIUS * Math.cos(5*Math.PI/4))
                                , CY - 7/12*geometry.RADIUS)

      ,quality: createVector(CX + 11/12*geometry.RADIUS, CY)

      ,mattheson : createVector(CX, CY + 1.75*geometry.RADIUS)
    }
    this.rootSize = 150*geometry.SCALE;
    this.matthesonLength = 2 * 3*geometry.RADIUS * cos(Math.PI/4);
    this.accidentalRadius = 3/12 * geometry.RADIUS
    this.data =   [
    {"letter": "C", "accent":0        , "quality": "maj",      "mattheson": "rude, bold, and tender"}
  , {"letter": "D", "accent":1        , "quality": "maj",      "mattheson": "leering, aggrieved, grimacing"}
  , {"letter": "D", "accent":0        , "quality": "maj",      "mattheson": "for warlike and merry things"}
  , {"letter": "E", "accent":1        , "quality": "maj",      "mattheson": "hostile to all sensuality"}
  , {"letter": "E", "accent":0        , "quality": "maj",      "mattheson": "despairing, fatally sad, forlorn"}
  , {"letter": "F", "accent":0        , "quality": "maj",      "mattheson": "for generosity, constancy, love"}
  , {"letter": "F", "accent":2        , "quality": "maj",      "mattheson": "for glory after struggle"}
  , {"letter": "G", "accent":0        , "quality": "maj",      "mattheson": "suggestive and rhetorical"}
  , {"letter": "A", "accent":1        , "quality": "maj",      "mattheson": "key of the grave: death, putrefaction, eternity"}
  , {"letter": "A", "accent":0        , "quality": "maj",      "mattheson": "inclined to complain of sad passions"}
  , {"letter": "B", "accent":1        , "quality": "maj",      "mattheson": "dainty and clear of conscience"}
  , {"letter": "B", "accent":0        , "quality": "maj",      "mattheson": "gaudy and desperate"}
  , {"letter": "C", "accent":0        , "quality": "min",      "mattheson": "sweet, sad, and lovesick"}
  , {"letter": "C", "accent":2        , "quality": "min",      "mattheson": "for disappointment with the world"}
  , {"letter": "D", "accent":0        , "quality": "min",      "mattheson": "devout, flowing as brooding humors"}
  , {"letter": "E", "accent":1        , "quality": "min",      "mattheson": "of black depression, of a gloomy mind"}
  , {"letter": "E", "accent":0        , "quality": "min",      "mattheson": "naive, innocent, and hopeful"}
  , {"letter": "F", "accent":0        , "quality": "min",      "mattheson": "tender, calm, profound, weighty"}
  , {"letter": "F", "accent":2        , "quality": "min",      "mattheson": "languishing, amorous, and strange"}
  , {"letter": "G", "accent":0        , "quality": "min",      "mattheson": "graceful, agreeable, and tender"}
  , {"letter": "A", "accent":1        , "quality": "min",      "mattheson": "grumbling, suffocative, wailing in lament"}
  , {"letter": "A", "accent":0        , "quality": "min",      "mattheson": "plaintive, decorous, inviting sleep"}
  , {"letter": "B", "accent":1        , "quality": "min",      "mattheson": "quaint, surly, and mocking"}
  , {"letter": "B", "accent":0        , "quality": "min",      "mattheson": "bizarre, morose, and melancholic"} ]
    this.matthesonSize = utility.setTextSize(fonts.letters, this.data[HOME_KEY].mattheson,24, this.matthesonLength );
    this.sharpOffset = 1/12*geometry.RADIUS;

  }
  display(){
    push();
    noStroke();
    fill(colors.pink);
    rectMode(CENTER);
    textAlign(CENTER,CENTER);

    textSize(this.rootSize);
    text(this.data[HOME_KEY].letter, this.positions.letter.x, this.positions.letter.y)

    textSize(.5 * this.rootSize)
    text(this.data[HOME_KEY].quality, this.positions.quality.x, this.positions.quality.y)

    textSize(this.matthesonSize)
    text(this.data[HOME_KEY].mattheson, this.positions.mattheson.x, this.positions.mattheson.y)
    pop();

    this.accidental_display(this.data[HOME_KEY].accent)

  }

  resize(){
    this.positions = {
       letter : createVector(CX - 1.25*geometry.RADIUS , CY)
      ,quality: createVector(CX + 11/12*geometry.RADIUS, CY)
      ,mattheson : createVector(CX, CY + 1.75*geometry.RADIUS)
      ,accidental : createVector(.5*(2*CX + (2**.5) * (4/12) * geometry.RADIUS * Math.cos(5*Math.PI/4))
                                , CY - 7/12*geometry.RADIUS)
    }
    this.rootSize = 150*geometry.SCALE;
    this.matthesonLength = 2 * 3*geometry.RADIUS * cos(Math.PI/4);
    this.matthesonSize = utility.setTextSize(fonts.letters, this.data[HOME_KEY].mattheson,24, this.matthesonLength )
    this.accidentalRadius = 3/12 * geometry.RADIUS
    this.sharpOffset = 1/12*geometry.RADIUS;
  }

  accidental_display(selection){
    switch (selection) {
      case 1:
      push();
        stroke(colors.pink);
        strokeWeight(3);
        line(this.positions.accidental.x + this.accidentalRadius * Math.cos(5*Math.PI/4) + this.sharpOffset
            ,this.positions.accidental.y + this.accidentalRadius * Math.sin(5*Math.PI/4) - this.sharpOffset
            ,this.positions.accidental.x + this.accidentalRadius * Math.cos(3*Math.PI/4) + this.sharpOffset
            ,this.positions.accidental.y + this.accidentalRadius * Math.sin(3*Math.PI/4)
          )
          noFill();
          strokeWeight(4);
          circle( this.positions.accidental.x
                , this.positions.accidental.y
                , this.accidentalRadius
                )
      pop();
      break;

      case 2:
        push();
          stroke(colors.pink);
          strokeWeight(3);
          noFill();
          line(this.positions.accidental.x + this.accidentalRadius * Math.cos(5*Math.PI/4)
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(5*Math.PI/4) + this.sharpOffset
              ,this.positions.accidental.x + this.accidentalRadius * Math.cos(-Math.PI/4)
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(-Math.PI/4) + this.sharpOffset
              )
          line(this.positions.accidental.x + this.accidentalRadius * Math.cos(3*Math.PI/4)
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(3*Math.PI/4)-this.sharpOffset
              ,this.positions.accidental.x + this.accidentalRadius * Math.cos(Math.PI/4)
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(Math.PI/4)-this.sharpOffset
              )
          line(this.positions.accidental.x + this.accidentalRadius * Math.cos(5*Math.PI/4) + this.sharpOffset
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(5*Math.PI/4)
              ,this.positions.accidental.x + this.accidentalRadius * Math.cos(3*Math.PI/4) + this.sharpOffset
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(3*Math.PI/4)
              )
          line(this.positions.accidental.x + this.accidentalRadius * Math.cos(-Math.PI/4) - this.sharpOffset
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(-Math.PI/4)
              ,this.positions.accidental.x + this.accidentalRadius * Math.cos(Math.PI/4) - this.sharpOffset
              ,this.positions.accidental.y + this.accidentalRadius * Math.sin(Math.PI/4)
              )



        pop();
      break;

      default:

    }}

  signal(){
    this.matthesonSize = utility.setTextSize(fonts.letters, this.data[HOME_KEY].mattheson,24, this.matthesonLength );
  }
}
