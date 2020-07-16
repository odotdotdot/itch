class Hex {
  constructor({ index
              , x
              , y
              , isCopy = false
              , isCopyOf = null
              , hasCopy = false
              , pitchChromatic = (3+index*7)%12
              , impermanent_index = null
              , fillColor = colors.outline} = {}){

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
    this.fillColor = fillColor

    //add label info to hex labels
      hexLabels.push(new HexLabel({center: this.center, pitchChromatic:this.pitchChromatic, serial:this.serial}))
  }

  display(){
    fill(this.fillColor)
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

}
