class EndGameMgmt{
  /* here we can manage orb state and not fuck around so much with tempo and also have a real display orb to pass chords etc
     takes references to endGameOrbs, tempoOrb, downloadOrb & a few other visible components
  */
  constructor(){
    this.endGameOrbs = [];
    this.orbs = [];
    this.visibles = [];
    this.clickables = [];
    this.repositionables = [];
    this.redirectOrbTextSizeTest = 'play again';
    this.firstClick = false;

    this.tempoOrb = new TempoOrb(0, this, 0);
    this.downloadOrb = new DownloadOrb(1, this, 0);
    this.playAgainOrb = new RedirectOrb({i:2
                                       , parent:this
                                       , message:'play again'
                                       , url:""});
    this.contactOrb = new RedirectOrb({i:3,
                                       parent:this,
                                       message:'about',
                                       url:"about.html",
                                       semiMajorConstant:10,
                                       semiMajorAxis:10*geometry.RADIUS,
                                       tab: true});


    this.endGameOrbs[0] = new EndGameOrb({i:2
                                        , theta: Math.PI
                                        , egoi : 0
                                        , m:"arpeggio"
                                        , bpm:85
                                        , tickLength: (8*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch: 0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:2, n:8}).eventList)
                                                , new Part(new NoteEventList({vN:1, duration:2, n:8}).eventList, "2i")
                                                , new Part(new NoteEventList({vN:2, duration:2, n:8}).eventList, "4i")
                                                , new Part(new NoteEventList({vN:3, duration:2, n:8}).eventList, "6i")
                                                  ]});
    this.endGameOrbs[1] = new EndGameOrb({i:3
                                        , theta: 0
                                        , egoi : 1
                                        , m:"pad"
                                        , bpm:85
                                        , tickLength:(8*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch: 0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:8,  n:8}).eventList)
                                                , new Part(new NoteEventList({vN:1, duration:8,  n:8}).eventList)
                                                , new Part(new NoteEventList({vN:2, duration:8,  n:8}).eventList)
                                                , new Part(new NoteEventList({vN:3, duration:8,  n:8}).eventList)
                                              ]});


  //end game chord display requires a list of theory encoded chords
    var trecs  = []; for(var i = TPN; i < composer.turnsPrevious.length; i ++)
    trecs.push(theoretician.theoryEncoding(composer.turnsPrevious[i]));
    this.egcd = new ChordDisplay({x : .5 * windowWidth
                                , y: .5 * windowHeight
                                , trex: trecs
                                , show: false
                                , outlineColor:colors.background
                                , rootsize: 150});
    this.visibles.push(this.egcd);

    this.bpmDisplay = new BPMDisplay();
    this.visibles.push(this.bpmDisplay);
    this.repositionables.push(this.bpmDisplay);

  /* got is the centered game over text which sits in the center of the orbs
     it runs through a protocol: game over. x wins. score. maybe 'enjoy the music or something'
     if the text gets any more complicated, it has to be moved into a transition orb to take advantage
     of the dynamic text size functions there available. got has a show binary that can be referenced
     in the egmgr clickables to delay function until the presentation is complete
  */
    this.got = new LargeText({message:'game over'});
    this.got.updateMessageAtTime(utility.whosWinning().userName + ' wins', 1500);
    this.got.updateMessageAtTime(utility.whosWinning().orb.score + ' to ' + utility.getOtherPlayer(utility.whosWinning()).orb.score, 3000 );
    this.got.updateMessageAtTime('select an arrangement\nand enjoy the music', 4500);
    setTimeout( ()=> {
        for(var i = 0; i < this.endGameOrbs.length; i ++)
          this.visibles.push(this.endGameOrbs[i])}, 4500);

    this.visibles.push(this.got);
    this.repositionables.push(this.got);

  /*extra things to see on endgame: logo, about link, maybe some kind of aggregate key review
    certainly buy the physical board when it's available */
    this.visibles.push(logo);
  }
  reposition(){
    for(var i = 0; i < this.repositionables.length; i ++)
      this.repositionables[i].resize();

    this.egcd.resize(CX, CY);
  }
  display(){

    this.tempoOrb.orbit();

    for(var i = 0; i < this.visibles.length; i ++)
        this.visibles[i].display();

  }
  redirect(url, tab){
    if(tab)
      window.open(window.location+url, '_blank')
    else
      window.location.href = window.location+url;
  }
  dlreq(){
    /* this functions prepares a data packet for midi.js, serverside.  for each end game orb (provided it's on) we go through each of its parts
       and extract a midi note event.  there is some translation involved and all time durations have to be multiplied by 32 to agree with the
       default tick behavior of midi js
    */

    var noteEventListForServer = [];
    var foundHotEndGameOrb = false;
    for(var i = 0; i < this.endGameOrbs.length; i ++)
      if(this.endGameOrbs[i].state == true){
        for(var j = 0; j < this.endGameOrbs[i].parts.length; j ++){
          for(var k = 0; k < this.endGameOrbs[i].parts[j].nel.length; k++){
            noteEventListForServer.push(
                      new MidiNoteEvent({ pitch: this.endGameOrbs[i].parts[j].nel[k].pitch
                                        , duration: parseInt(this.endGameOrbs[i].parts[j].nel[k].duration.slice(0,-1))
                                        , time: parseInt(this.endGameOrbs[i].parts[j].nel[k].time.slice(0,-1))
                                        , offset: parseInt(this.endGameOrbs[i].parts[j].offset.slice(0,-1))
                                        , status : 0x90
                                        , delta : null}))}}
            console.log({key: CURRENT_KEY
                       , bpm: this.endGameOrbs[i].bpm
                       , noteEventListForServer: noteEventListForServer});

            var mw = new MidiWriter(noteEventListForServer);

            foundHotEndGameOrb = true;}

    if(foundHotEndGameOrb == false){
      this.got.message = 'select an arrangement';
      this.visibles.push(this.got)
      setTimeout( ()=> {this.visibles.splice(this.visibles.indexOf(this.got), 1)}, 1500);}
  }
  ping(egoi){
    if(!this.firstClick){
      this.visibles.splice(this.visibles.indexOf(this.got), 1)
      setTimeout( ()=> {this.visibles.push(this.downloadOrb)}, 100)
      setTimeout( ()=> {this.visibles.push(this.playAgainOrb)}, 200)
      setTimeout( ()=> {this.visibles.push(this.contactOrb)}, 300)
      this.firstClick = true;
    }


    for(var i = 0; i < this.endGameOrbs.length; i ++){
      if(i != egoi)
        this.endGameOrbs[i].deactivate();
      }
      this.endGameOrbs[egoi].activate();
      if(!this.visibles.includes(this.tempoOrb))
        this.visibles.push(this.tempoOrb)
  }
}
