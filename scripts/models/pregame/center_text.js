class CenterText{
  constructor(){

    this.command_index = 0;

    this.commands = [
       "welcome to leverkuhn"
      ,"enter your user name"
      ,"select your home key"
    ];

    this.userName = "";
    this.userNameCreated = false;
    this.enteringUserName = false;

    this.currentText = this.commands[0];

    this.tS = 24;
  }
  display(){
    push();
      textSize(this.tS)
      textFont(fonts.leverkuhn);
      fill(colors.pink);
      text(this.currentText, CX, CY );
    pop();
  }
  resize(){
    this.tS = utility.setTextSize(fonts.letters, this.currentText, 24, 5 * geometry.RADIUS, )
  }
}
