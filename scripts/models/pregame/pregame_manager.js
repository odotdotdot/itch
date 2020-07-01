class PregameManager{
  constructor(){
    this.centerText = new CenterText();
    this.orbs = [];
    this.clickables = [];
    this.visibles = [this.centerText];


    for(var i = 0; i < 24; i ++)
      this.orbs.push( new KeyOrb(i,this) );

    for(var i = 0; i < 24; i ++){
      this.clickables.push(this.orbs[i])
      this.visibles.push(this.orbs[i])
    }

    setTimeout( ()=> {this.centerText.command_index++}, 1500);

  }
}
