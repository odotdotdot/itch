class PregameManager{
  constructor(){
    this.centerText = new CenterText();
    this.keyGlyph = new KeyGlyph();
    this.orbs = [];
    this.clickables = [];
    this.repositionables = [this.centerText];
    this.visibles = [this.centerText];
    this.firstTime = true;


    for(var i = 0; i < 24; i ++)
      this.orbs.push( new KeyOrb(i, this) );

    for(var i = 0; i < 24; i ++){
      this.clickables.push(this.orbs[i])
      this.visibles.push(this.orbs[i])
      this.repositionables.push(this.orbs[i])
    }

    setTimeout( ()=> {this.centerText.currentText = this.centerText.commands[1]}, 1500);

  }

  clearPreviousOrbSelection(exception){
    for(var i = 0; i < 24; i ++ )
      if(i != exception)
        this.orbs[i].restoreToDefault();
  }

  signal(){
    if( this.firstTime ){
      this.visibles.splice(0,1);
      this.visibles.push( this.keyGlyph )
      this.firstTime = false;
    }
  }

  reposition(){
    for(var i = 0; i < this.repositionables.length; i ++)
      this.repositionables[i].resize();
  }
}
