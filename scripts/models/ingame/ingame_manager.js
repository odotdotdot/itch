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

    this.buttons.push(new Button(this, 0, 'tutorial', ()=>{this.tutorial = new Tutorial(this)}))
    this.buttons.push(new Button(this, 1, 'play by ear', ()=>{PLAY_BY_EAR = !PLAY_BY_EAR}))
    this.buttons.push(new Button(this, 2, 'show diatonics', ()=>{
      SHOW_DIATONICS = !SHOW_DIATONICS
      if(SHOW_DIATONICS){
        hexes.filter( e => isDiatonic(e.pitchChromatic) ).forEach( e => e.fillColor = colors.outline_plus);}
      if(!SHOW_DIATONICS)
        hexes.forEach( e => {e.fillColor = colors.outline});

    }))

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
        this.visibles = [hexes, hexLabels, this.tutorial.mask, sectorManager, cd, this.tutorial.activeDirection]
        break;
      case 6:
        this.visibles = [hexes, sectorManager, this.tutorial.keyWheelMask, cd, voix, hexLabels, this.tutorial.activeDirection]
        break;
      case 7:
        this.visibles = [hexes, sectorManager, cd, voix, hexLabels, this.tutorial.mask, sd, this.tutorial.activeDirection]
        break;
      case 8:
        this.visibles = [hexes, sectorManager, cd, sd, voix, hexLabels, opponent, this.tutorial.mask, me, this.tutorial.activeDirection]
        break;
      default:
        sectorManager.homeKeyInit()
        sectorManager.opponentHomeKeyInit()
        sectorManager.currentKeyInit()
        sectorManager.turnSignified()
        this.visibles = [hexes, this.buttons, sectorManager, cd, sd, logo, voix, hexLabels, me, opponent]
    }
  }

  reposition(){
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

      if(a > 12)
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
