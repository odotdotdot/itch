class Direction{
  constructor( {  id
                 ,text
                 ,x = CX
                 ,y = CY
                 ,textColor = colors.pink
                 ,text_size = 24 * geometry.SCALE
                 ,parent
                 ,alignment = CENTER

  } = {}){
        this.id = id
        this.text = text
        this.x = x;
        this.y = y;
        this.alignment = alignment
        this.textColor = textColor
        this.text_size = text_size
        this.parent = parent
        this.orbs = []

        if(this.id < this.parent.numberOfDirections - 1){
        this.nextOrb = new DirectionOrb({
                                    message:'next'
                                   ,parent: this
                                   ,position: 1
                                });
        this.orbs.push(this.nextOrb)

      if(this.id > 0){
        this.previousOrb = new DirectionOrb({
                                    message:'prev'
                                   ,position:2
                                   ,parent: this
                                });
        this.orbs.push(this.previousOrb)
        }

        this.skipOrb = new DirectionOrb({
                                   message: 'skip'
                                  ,parent: this
                                  ,position: 0
                                 });
        this.orbs.push(this.skipOrb)
    }
      //the last direction has prev / done
        if(this.id == this.parent.numberOfDirections - 1){
  this.doneOrb = new DirectionOrb({
     message:'done'
    ,parent: this
    ,position: 0
  })
  this.orbs.push(this.doneOrb)
  this.previousOrb = new DirectionOrb({
      message:'prev'
     ,position:1
     ,parent: this
  });
  this.orbs.push(this.previousOrb)
}

    this.parent.parent.visibles.push(this)
    }

  display(){
    push()
    textAlign(this.alignment, CENTER)
    textFont(fonts.letters)
    fill(this.textColor)
    textSize(this.text_size)
    text(this.text, this.x, this.y)
    pop()

    this.orbs.forEach( e => {
      e.display()
    });


  }
  calculate_text_width(){
    textFont(fonts.letters)
    textSize(this.text_size)
    var lines = this.text.split('\n')
    return textWidth(lines[lines.length-1])
  }
  remove(){
    if(this.parent.parent.visibles.includes(this))
      this.parent.parent.visibles.splice(this.parent.parent.visibles.indexOf(this), 1)
    for(var i = 0; i < this.orbs.length; i++){
      if(this.parent.parent.clickables.includes(this.orbs[i]))
        this.parent.parent.clickables.splice(this.parent.parent.clickables.indexOf(this.orbs[i]), 1)}
  }
}
