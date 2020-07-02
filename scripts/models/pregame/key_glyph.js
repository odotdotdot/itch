class KeyGlyph{
  constructor(){
    this.positions = {
       letter : createVector(CX - .5*geometry.RADIUS,CY)
      ,accent : createVector(CX + 50, CY - 50)
      ,quality: createVector(CX + 100, CY)
      ,mattheson : createVector(CX, CY + 200)
    }

    this.rootSize = 150;

    this.data =   [
    {"letter": "C", "accent":""       , "quality": "maj",      "mattheson": "rude, bold, and tender"}
  , {"letter": "D", "accent":"\u266D" , "quality": "maj",      "mattheson": "leering, aggrieved, rapturous, grimacing, unusual"}
  , {"letter": "D", "accent":""       , "quality": "maj",      "mattheson": "sharp, headstrong, for warlike and merry things"}
  , {"letter": "E", "accent":"\u266D" , "quality": "maj",      "mattheson": "pathetic, serious, sad, hostile to all sensuality"}
  , {"letter": "E", "accent":""       , "quality": "maj",      "mattheson": "despairing, fatally sad, hopeless as of extreme love"}
  , {"letter": "F", "accent":""       , "quality": "maj",      "mattheson": "evocative of beautiful sentiments: generosity, constancy, love"}
  , {"letter": "F", "accent":"\u266F" , "quality": "maj",      "mattheson": "triumphant and relieved, as in glory over struggle"}
  , {"letter": "G", "accent":""       , "quality": "maj",      "mattheson": "suggestive and rhetorical, for serious as well as happy times"}
  , {"letter": "A", "accent":"\u266D" , "quality": "maj",      "mattheson": "key of the grave: full of death, putrefaction, judgment, eternity"}
  , {"letter": "A", "accent":""       , "quality": "maj",      "mattheson": "affecting and brilliant, inclined to complaining, sad passions"}
  , {"letter": "B", "accent":"\u266D" , "quality": "maj",      "mattheson": "diverting, magnificent, but also dainty and clear of conscience"}
  , {"letter": "B", "accent":""       , "quality": "maj",      "mattheson": "offensive, harsh, unpleasant, gaudy and desperate in character"}
  , {"letter": "C", "accent":""       , "quality": "min",      "mattheson": "sweet, sad, and lovesick"}
  , {"letter": "C", "accent":"\u266F" , "quality": "min",      "mattheson": "penitential lament, disappointment with the world, confession to God"}
  , {"letter": "D", "accent":""       , "quality": "min",      "mattheson": "devout, tranquil, grand, melancholic, flowing as brooding humors"}
  , {"letter": "E", "accent":"\u266D" , "quality": "min",      "mattheson": "anxious, of brooding despair, of black depression, of a gloomy mind"}
  , {"letter": "E", "accent":""       , "quality": "min",      "mattheson": "naive, innocent, and hopeful"}
  , {"letter": "F", "accent":""       , "quality": "min",      "mattheson": "tender, calm, profound, weighty, of a fatal mental anxiety"}
  , {"letter": "F", "accent":"\u266F" , "quality": "min",      "mattheson": "languishing, amorous, unrestrained, and strange"}
  , {"letter": "G", "accent":""       , "quality": "min",      "mattheson": "graceful, agreeable, tender, yearning, diverting, of tempered joyfulness"}
  , {"letter": "A", "accent":"\u266D" , "quality": "min",      "mattheson": "grumbling, suffocative, grappling, wailing in lament"}
  , {"letter": "A", "accent":""       , "quality": "min",      "mattheson": "plaintive, decorous, resigned, inviting sleep"}
  , {"letter": "B", "accent":"\u266D" , "quality": "min",      "mattheson": "quaint, surly, and mocking"}
  , {"letter": "B", "accent":""       , "quality": "min",      "mattheson": "bizarre, morose, and melancholic"} ]



  }
  display(){
    push();
    fill(colors.pink);
    textAlign(CENTER,CENTER);
    textSize(this.rootSize);
    text(this.data[HOME_KEY].letter, this.positions.letter.x, this.positions.letter.y)

    textSize(.5 * this.rootSize)
    text(this.data[HOME_KEY].quality, this.positions.quality.x, this.positions.quality.y)

    textSize(.5 * this.rootSize)
    textFont(fonts.accents)
    text(this.data[HOME_KEY].accent, this.positions.accent.x, this.positions.accent.y)
    pop();

  }
}
