class CenterText{
  constructor(){

    this.command_index = 0;

    this.commands = [
       "welcome to leverkuhn"
      ,"enter your user name"
      ,"select your home key"
    ]

  }
  display(){
    textFont(fonts.leverkuhn);
    fill(colors.pink);
    text(this.commands[this.command_index], CX, CY );
  }
}
