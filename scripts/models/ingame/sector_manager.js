class SectorManager{
  constructor(){
    this.sectors = []
    for(var i = 0; i < 24; i ++)
      this.sectors.push(new Sector({id: i}))

    this.currentKey = CURRENT_KEY
    this.text_size = 22*geometry.SCALE;


    igmgr.repositionables.push(this)
  }
  display(){
    push()
    textSize(this.text_size)
    for(var i = 0; i < 12; i ++)
      this.sectors[i].display()

    fill(colors.background)
    noStroke()
    circle(geometry.KEYWHEEL_X, geometry.KEYWHEEL_Y, .75*geometry.KEYWHEEL_DIAMETER)

    for(var i = 12; i < 24; i ++)
      this.sectors[i].display()

    pop()
  }
  resize(){
    this.text_size = geometry.SCALE * 22;
    this.sectors.forEach(e => { e.resize() });

  }
  homeKeyInit(){
    this.sectors[HOME_KEY].fillColor = color(colors.pink);
    this.sectors[HOME_KEY].textColor = color(colors.bass);
  }
  opponentHomeKeyInit(){
    this.sectors[OPPONENT_HOME_KEY].fillColor = color(colors.white);
    this.sectors[OPPONENT_HOME_KEY].textColor = color(colors.red);
  }
  currentKeyInit(){
    this.sectors[CURRENT_KEY].fillColor = color(colors.blue);
    this.sectors[CURRENT_KEY].textColor = color(colors.white);
  }
  turnSignified(){
    this.sectors.forEach(e => {e.setAlphas()} )
  }

  handleLOI(loi){
    /* this function alerts the players to which keys are on the horizon.  Seems a little too useful. */
    //default style everything
      this.sectors.forEach( e => {
        e.fillColor = color(colors.outline);
        e.textColor = color(colors.pink); });
    //get the three special ones
      this.homeKeyInit()
      this.currentKeyInit()
      this.opponentHomeKeyInit()
    //text color loi sectors blue
      for(var i = 0; i < 24; i ++)
        if(loi.flat().includes(i))
          this.sectors[i].textColor = color(colors.blue)


  }

  updateCurrentKey(){
    //default style the old current key
    this.sectors[this.currentKey].fillColor = color(colors.outline)
    this.sectors[this.currentKey].textColor = color(colors.pink)

    //if that key was the a home key, style it appropriately
    if(this.currentKey == HOME_KEY)
      this.homeKeyInit();
    if(this.currentKey == OPPONENT_HOME_KEY)
      this.opponentHomeKeyInit();

    //update the new current key
    this.currentKey = CURRENT_KEY
    this.currentKeyInit()
  }
}
