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

    this.tempoOrb = new TempoOrb(0, this);
    this.orbs.push(this.tempoOrb);
    this.visibles.push(this.tempoOrb);
    this.clickables.push(this.tempoOrb);
    this.repositionables.push(this.tempoOrb);

    this.downloadOrb = new DownloadOrb(1, this);
    this.orbs.push(this.downloadOrb);
    this.visibles.push(this.downloadOrb);
    this.clickables.push(this.downloadOrb);
    this.repositionables.push(this.downloadOrb);

    this.playAgainOrb = new PlayAgainOrb(2, this);
    this.orbs.push(this.playAgainOrb);
    this.visibles.push(this.playAgainOrb);
    this.clickables.push(this.playAgainOrb);
    this.repositionables.push(this.playAgainOrb);

    this.endGameOrbs[0] = new EndGameOrb({i:3
                                        , egoi : 0
                                        , m:"16th"
                                        , bpm:70
                                        , tickLength: (4*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch: 0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:1, n:4}).eventList)
                                                , new Part(new NoteEventList({vN:1, duration:1, n:4}).eventList, "1i")
                                                , new Part(new NoteEventList({vN:2, duration:1, n:4}).eventList, "2i")
                                                , new Part(new NoteEventList({vN:3, duration:1, n:4}).eventList, "3i")
                                                  ]});
    this.endGameOrbs[1] = new EndGameOrb({i:4
                                        , m:"qtr"
                                        , egoi : 1
                                        , bpm:120
                                        , tickLength:(16*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch: 0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:4, n:16}).eventList)
                                                , new Part(new NoteEventList({vN:1, duration:4, n:16}).eventList, "4i")
                                                , new Part(new NoteEventList({vN:2, duration:4, n:16}).eventList, "8i")
                                                , new Part(new NoteEventList({vN:3, duration:4, n:16}).eventList, "12i")
                                                  ]});
    this.endGameOrbs[2] = new EndGameOrb({i:5
                                        , m:"alberti"
                                        , egoi : 2
                                        , bpm:110
                                        , tickLength:(16*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch:0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:4,  n:16}).eventList)
                                                , new Part(new NoteEventList({vN:2, duration:4,  n:16}).eventList, "4i")
                                                , new Part(new NoteEventList({vN:1, duration:4,  n:16}).eventList, "8i")
                                                , new Part(new NoteEventList({vN:2, duration:4,  n:16}).eventList, "12i")

                                                , new Part(new NoteEventList({vN:3, duration:8,  n:16}).eventList, "4i")
                                                , new Part(new NoteEventList({vN:3, duration:8,  n:16}).eventList, "8i")
                                                , new Part(new NoteEventList({vN:2, duration:8,  n:16}).eventList, "6i")
                                                , new Part(new NoteEventList({vN:1, duration:8,  n:16}).eventList, "12i")
                                                  ]});
    this.endGameOrbs[3] = new EndGameOrb({i:6
                                        , egoi : 3
                                        , m:"pad"
                                        , bpm:120
                                        , tickLength:(16*GAME_DURATION_IN_TURNS).toString() + "i"
                                        , parent: this
                                        , patch: 0
                                        , parts:[ new Part(new NoteEventList({vN:0, duration:16,  n:16}).eventList)
                                                , new Part(new NoteEventList({vN:1, duration:16,  n:16}).eventList)
                                                , new Part(new NoteEventList({vN:2, duration:16,  n:16}).eventList)
                                                , new Part(new NoteEventList({vN:3, duration:16,  n:16}).eventList)
                                              ]});
    for(var i = 0; i < this.endGameOrbs.length; i ++){
      this.orbs.push(this.endGameOrbs[i]);
      this.visibles.push(this.endGameOrbs[i]);
      this.clickables.push(this.endGameOrbs[i]);
      this.repositionables.push(this.endGameOrbs[i]);}

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
    this.got.turnOffDisplayAtTime(6000);
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

    for(var i = 0; i < this.orbs.length; i ++)
      this.orbs[i].orbit();

    for(var i = 0; i < this.visibles.length; i ++)
        this.visibles[i].display();

  }
  playAgain(){
    var url = "https://leverkuhn.app/";
    window.location.href = url;
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
    this.got.updateMessageAtTime('select an arrangement', 0);
    this.got.turnOffDisplayAtTime(1500);}


  }
  ping(egoi){
    for(var i = 0; i < this.endGameOrbs.length; i ++){
      if(i != egoi)
        this.endGameOrbs[i].deactivate();
      }
      this.endGameOrbs[egoi].activate();
  }
}
