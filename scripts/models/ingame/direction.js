class Direction{
  constructor( {  text
                 ,x = CX
                 ,y = CY
                 ,textColor = colors.pink
                 ,text_size = 24
                 ,condition = null
                 ,callback = null
  } = {}){
        this.text = text
        this.x = x;
        this.y = y;
        this.textColor = textColor
        this.text_size = text_size
        this.condition = condition
        this.callback = callback
      }

  display(){
    push()
    textAlign(CENTER, CENTER)
    textFont(fonts.letters)
    fill(this.textColor)
    textSize(this.text_size)
    text(this.text, this.x, this.y)
    pop()
  }


  }
