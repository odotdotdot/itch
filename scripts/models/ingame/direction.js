class Direction{
  constructor( {  text
                 ,x = CX
                 ,y = CY
                 ,textColor = colors.pink
                 ,text_size = 24
                 ,condition = null
                 ,callback = null
                 ,push_to_visible = []
                 ,pop_from_visible = []
                 ,execute_on_appearance = null
  } = {}){
        this.text = text
        this.x = x;
        this.y = y;
        this.textColor = textColor
        this.text_size = utility.setTextSize(fonts.letters, this.text, 24, 10*geometry.RADIUS)
        this.condition = condition
        this.callback = callback
        this.push_to_visible = push_to_visible
        this.pop_from_visible = pop_from_visible
        this.execute_on_appearance = execute_on_appearance
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

  resize(){
    this.text_size = utility.setTextSize(fonts.letters, this.text, 24, 10*geometry.RADIUS)
    this.x = this.x * W/Xo
    this.y = this.y * H/Yo
  }


  }
