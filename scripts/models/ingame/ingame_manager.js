class InGameManager{
  constructor(){
    OPPONENT_HOME_KEY = this.weightedRandomKey(HOME_KEY);
    STARTING_KEY = this.findStartKey(HOME_KEY, OPPONENT_HOME_KEY);
    CURRENT_KEY = STARTING_KEY;

    this.visibles = []
    this.clickables = []
    this.repositionables = []
    this.buttons = [];
    this.conditions = [];

    this.voicesHaveBeenIntroduced = false;

    this.buttonStop = geometry.KEYWHEEL_X + .5*geometry.KEYWHEEL_DIAMETER

    this.buttons.push(new Button({parent:this
                                  ,id: 0
                                  ,message: 'tutorial'
                                  ,callback: ()=>{TUTORIAL = true; this.tutorial = new Tutorial(this); this.ping(0); musician.scoreButton();}}))
    this.buttons.push(new Button({parent:this
                                 ,id: 1
                                 ,message: 'diatonics'
                                 ,callback: ()=>{
                                   musician.scoreButton();
                                   SHOW_DIATONICS = !SHOW_DIATONICS
                                   if(SHOW_DIATONICS){hexes.filter( e => isDiatonic(e.pitchChromatic) ).forEach( e => e.fillColor = colors.outline_plus);}
                                   if(!SHOW_DIATONICS)hexes.forEach( e => {e.fillColor = colors.outline}, RIGHT);}}))

    this.mask = new Mask({parent: this, type: 'rect', init_alpha: 0xff});

    this.tutorial = new Tutorial(this);
    this.ping(0)

    this.mask.fade_down( ()=>{
      });
  }


  ping(i){
    switch (i) {
      case 0:
        this.visibles = [hexes, hexLabels, this.tutorial.mask, this.tutorial.activeDirection]
        break;
      case 1:
        this.visibles = [hexes, hexLabels, this.tutorial.mask, this.tutorial.activeDirection]
        break;
      case 2:
        this.visibles = [hexes, hexLabels, this.tutorial.mask, this.tutorial.activeDirection]
        break;
      case 3://homekey
        sectorManager.homeKeyInit()
        this.visibles = [hexes, hexLabels, this.tutorial.mask, sectorManager, cd, this.tutorial.activeDirection]
        break;
      case 4:
        sectorManager.opponentHomeKeyInit()
        this.visibles = [hexes, hexLabels, this.tutorial.mask, sectorManager, cd, this.tutorial.activeDirection]
        break;
      case 5:
        sectorManager.currentKeyInit()
        if(hexLabels.length != hexes.length) hexLabels.splice(0, 0, this.tutorial.hexLabelRemoved)
        this.visibles = [hexes, hexLabels, this.tutorial.mask, sectorManager, cd, this.tutorial.activeDirection]
        break;
      case 6:
        if(!this.voicesHaveBeenIntroduced){
        voix.forEach( (e, index)=>{
          e.move(geometry.STAFF_X + .5*geometry.STAFFWHEEL_DIAMETER * Math.cos(Math.PI+geometry.OFFSET)
                 + index/3 * 2 * .5*geometry.STAFFWHEEL_DIAMETER*Math.sin(Math.PI/2 - geometry.OFFSET)
                ,CY)})
        this.voicesHaveBeenIntroduced = true;}
        this.tutorial.showText();
        this.visibles = [hexes, sectorManager, this.tutorial.keyWheelMask, cd, sd, this.tutorial.staffWheelMask, voix, hexLabels, this.tutorial.activeDirection]
        if(!this.clickables.includes(voix))
          this.clickables.push(voix)
        break;
      case 7:
        if(hexLabels.length != hexes.length) hexLabels.splice(0, 0, this.tutorial.hexLabelRemoved)
        this.visibles = [hexes, sectorManager, cd, voix, hexLabels, this.tutorial.mask, sd, this.tutorial.activeDirection]
        if(this.clickables.includes(voix))
          this.clickables.splice(this.clickables.indexOf(voix), 1)
        break;
      case 8:
        this.visibles = [hexes, sectorManager, cd, sd, voix, hexLabels, opponent, this.tutorial.mask, me, this.tutorial.activeDirection]
        if(!this.clickables.includes(voix))
          this.clickables.push(voix)
        break;
      default:
        sectorManager.homeKeyInit()
        sectorManager.opponentHomeKeyInit()
        sectorManager.currentKeyInit()
        sectorManager.turnSignified()
        if(hexLabels.length != hexes.length)
          hexLabels.splice(0, 0, this.tutorial.hexLabelRemoved)
        voix.forEach( (e, index) => {
          if(e.serialRecord == null){
              var K = .5 * 3**.5;
              var x = [3      , 2*K       , 2*K        , 3]
              var y = [Math.PI, 5*Math.PI/6, -Math.PI/6, 0]
              e.move(CX + x[index]*geometry.RADIUS*Math.cos(y[index] + geometry.OFFSET)
                   , CY + x[index]*geometry.RADIUS*Math.sin(y[index] + geometry.OFFSET))}});
        this.visibles = [hexes, this.buttons, sectorManager, cd, sd, logo, voix, hexLabels, me, opponent]
        this.repositionables.splice(this.repositionables.indexOf(this.tutorial), 1)
        if(!this.clickables.includes(voix))
          this.clickables.push(voix)
        TUTORIAL = false;
    }
  }

  reposition(){
      this.buttonStop = geometry.KEYWHEEL_X + .5*geometry.KEYWHEEL_DIAMETER
    for(var i = 0; i < this.repositionables.length; i ++)
      if(Array.isArray(igmgr.repositionables[i]))
        igmgr.repositionables[i].forEach( e => e.resize() )
      else
        igmgr.repositionables[i].resize();
  }
  weightedRandomKey(exclusion){
      var exclusions = [HOME_KEY
                       , this.fifth(HOME_KEY)
                       , this.fourth(HOME_KEY)
                       , this.relative(HOME_KEY)
                       , this.relative(this.fifth(HOME_KEY))
                       , this.relative(this.fourth(HOME_KEY))
                       ]
      var randomKeys =       [ //w = 4 C, G, F
                              0,  7,  5,
                              0,  7,  5,
                              0,  7,  5,
                              0,  7,  5,
                            //w = 3 D, A, E, Bb
                              2, 10,  9, 4,
                              2, 10,  9, 4,
                              2, 10,  9, 4,
                            //w = 3 Am, Em, Dm, C#m, Bm
                              21, 16, 14, 13, 23,
                              21, 16, 14, 13, 23,
                              21, 16, 14, 13, 23,
                            //w = 2 Eb, Fm, Gm, Cm
                              3, 12, 17, 19, 11,
                              3, 12, 17, 19, 11,
                            //w = 1 B, F#, Db, Ab, Ebm, G#m, Abm, Bbm
                              1, 6, 8, 11, 15, 18, 20, 22
                           ];
      var r = randomKeys[utility.getRandomInt(randomKeys.length - 1)];
      while( exclusions.includes(r)){
        r = randomKeys[utility.getRandomInt(randomKeys.length - 1)];}
      return r;
  }
  findStartKey(a, b){
      var a_on_circle = a < 12 ? (a*7)%12 : (7*((a+3)%12))%12;
      var b_on_circle = b < 12 ? (b*7)%12 : (7*((b+3)%12))%12;
      var delta = b_on_circle > a_on_circle ? b_on_circle - a_on_circle : 12 + b_on_circle - a_on_circle;
      //index is delta   n/a, n/a, 2, 3, 4, 5, 6, 7,  8, 9, 10, n/a
      var fifthsUp = [10, 4, 1, 9, 2, 3, 3, 9, 10, 3, 11, 2];

      if(a >= 12)
        a = this.relative(a)

      var major = ( a + 7*fifthsUp[delta]) % 12;
      var minor = this.relative(major);

      if(Math.floor(Math.random()*2))
        return major;
      else
        return minor;
  }
  parallel(n){
    var p = n < 12 ? n + 12 : n - 12;
    return p;
  }
  relative(n){
    var r = n < 12 ? ((n + 9 ) % 12) + 12 : ((n%12) + 3) % 12;
    return r;
  }
  fifth(n){
    var r = n < 12 ? (n+7) % 12 : (((n-12) + 7)%12) + 12;
    return r;
  }
  fourth(n){
    var r = n < 12 ? (n+5) % 12 : (((n-12) + 5)%12) + 12;
    return r;
  }

}
