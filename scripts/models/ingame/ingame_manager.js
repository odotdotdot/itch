class InGameManager{
  constructor(){
    this.visibles = []
    this.clickables = []
    this.respositionables = []
    this.buttons = [];

    this.mask = new Mask({parent: this, type: 'rect', init_alpha: 0xff});
    this.directions = new Directions(this)

    this.buttons.push(new Button(this, 0, 'help', ()=>{this.directions = new Directions(this); DIRECTIONS = true;}))
    this.buttons.push(new Button(this, 1, 'play by ear', ()=>{PLAY_BY_EAR = !PLAY_BY_EAR}))
    this.buttons.push(new Button(this, 2, 'show diatonics', ()=>{SHOW_DIATONICS = !SHOW_DIATONICS}))



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
    var randomized_cpu_home_key = randomKeys[utility.getRandomInt(randomKeys.length - 1)];

    while(randomized_cpu_home_key == HOME_KEY){
      randomized_cpu_home_key = randomKeys[utility.getRandomInt(randomKeys.length - 1)];}

    var randomized_starting_key = randomKeys[utility.getRandomInt(randomKeys.length - 1)];
    while(randomized_starting_key == randomized_cpu_home_key || randomized_starting_key == HOME_KEY){
      randomized_starting_key = randomKeys[utility.getRandomInt(randomKeys.length - 1)];}

    STARTING_KEY = randomized_starting_key;
    CURRENT_KEY = STARTING_KEY;
    OPPONENT_HOME_KEY = randomized_cpu_home_key;

    this.mask.fade_down( ()=>{

    });
  }

  reposition(){
    for(var i = 0; i < this.respositionables.length; i ++)
      this.respositionables[i].resize();
  }

}
