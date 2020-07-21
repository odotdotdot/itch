class Sector{
  constructor({
               id
              ,fillColor = colors.outline
              ,textColor = colors.pink

          } = {}){
            this.id = id
            this.fillColor = color(fillColor)
            this.textColor = color(textColor)
            this.message = spelling.pitchChromaticToLetter[id]
            this.theta = ((id*7%12) * Math.PI/6) - (Math.PI/2 * (1 + Math.floor(id/12)))
            var axis_to_text = id < 12 ? 7/8*.5*geometry.KEYWHEEL_DIAMETER : 5/8*.5*geometry.KEYWHEEL_DIAMETER
            this.center = createVector( geometry.KEYWHEEL_X + axis_to_text*Math.cos(this.theta), geometry.KEYWHEEL_Y + axis_to_text*Math.sin(this.theta) )
            this.axis_to_outer_arc = id < 12 ? geometry.KEYWHEEL_DIAMETER : 3/4*geometry.KEYWHEEL_DIAMETER
            this.score = theoretician.SCALE_SCORES[this.id] + theoretician.GROWTH_BONUS[this.id]
            this.alpha = 255 * this.score/theoretician.highKeyScore();
            this.fillColor.setAlpha(this.alpha)
            this.textColor.setAlpha(this.alpha)
  }

  display(){
    push()
    noStroke()
    fill(this.fillColor)
    arc(geometry.KEYWHEEL_X, geometry.KEYWHEEL_Y, this.axis_to_outer_arc, this.axis_to_outer_arc, this.theta - Math.PI/12, this.theta + Math.PI/12)
    fill(this.textColor)
    text(this.message, this.center.x, this.center.y)
    pop()
  }
  resize(){
    var axis_to_text = this.id < 12 ? 7/8*.5*geometry.KEYWHEEL_DIAMETER : 5/8*.5*geometry.KEYWHEEL_DIAMETER
    this.center = createVector( geometry.KEYWHEEL_X + axis_to_text*Math.cos(this.theta), geometry.KEYWHEEL_Y + axis_to_text*Math.sin(this.theta) )
    this.axis_to_outer_arc = this.id < 12 ? geometry.KEYWHEEL_DIAMETER : 3/4*geometry.KEYWHEEL_DIAMETER
  }
  setAlphas(){
    this.score = theoretician.SCALE_SCORES[this.id] + theoretician.GROWTH_BONUS[this.id]
    this.alpha = 255 * this.score/theoretician.highKeyScore();
    this.fillColor.setAlpha(this.alpha)
    this.textColor.setAlpha(this.alpha)
  }
}
