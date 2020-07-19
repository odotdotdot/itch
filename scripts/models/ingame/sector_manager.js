class SectorManager{
  constructor(){
    this.sectors = []
    for(var i = 0; i < 24; i ++)
      this.sectors.push(new Sector({id: i}))

    this.currentKey = CURRENT_KEY

    igmgr.repositionables.push(this)
  }
  display(){
    for(var i = 0; i < 12; i ++)
      this.sectors[i].display()
    push()
    fill(colors.background)
    noStroke()
    circle(geometry.KEYWHEEL_X, geometry.KEYWHEEL_Y, .75*geometry.KEYWHEEL_DIAMETER)
    pop()
    for(var i = 12; i < 24; i ++)
      this.sectors[i].display()
  }
  resize(){
    this.sectors.forEach(e => {
      e.resize
    });

  }
  homeKeyInit(){
    this.sectors[HOME_KEY].fillColor = color(colors.pink);
    this.sectors[HOME_KEY].textColor = color(colors.bass);
    this.sectors[HOME_KEY].setAlphas()
  }
  opponentHomeKeyInit(){
    this.sectors[OPPONENT_HOME_KEY].fillColor = color(colors.white);
    this.sectors[OPPONENT_HOME_KEY].textColor = color(colors.red);
    this.sectors[OPPONENT_HOME_KEY].setAlphas()
  }
  currentKeyInit(){
    this.sectors[CURRENT_KEY].fillColor = color(colors.blue);
    this.sectors[CURRENT_KEY].textColor = color(colors.white);
    this.sectors[CURRENT_KEY].setAlphas()
  }
  turnSignified(){
    this.sectors.forEach(e => {e.setAlphas()} )
  }
  updateCurrentKey(){
    this.sectors[this.currentKey].fillColor = color(colors.outline)
    this.sectors[this.currentKey].textColor = color(colors.pink)
    this.currentKey = CURRENT_KEY
    this.currentKeyInit()
  }
}
