let SERIAL_RECORD, MIDI_RECORD = 0xffffffff, THEORY_RECORD, STARTING_KEY = 10, CURRENT_KEY = 10,
    HOME_KEY = 5, OPPONENT_HOME_KEY = 21, TEMPO_DRAG = false, THROW_ACTION = false, IS_MY_TURN = true,
    GAME_DURATION_IN_TURNS = 2, TOTAL_BARS = 2, VOICE_MOVEMENT = false, END_GAME = false,
    GAME_IS_NOT_YET_OVER = true, TPN = 3;
let W, H, CX, CY;
let fonts;
let hexes = [];
let voix = [];
let blossom;
let composer;

//main
  function preload(){
    fonts = {letters: loadFont('./fonts/Comfortaa-Medium.ttf')
            ,accents: loadFont('./fonts/NotoSansSymbols-Medium.ttf')
            ,leverkuhn:loadFont('./fonts/comfortaa-bold.ttf')
            }
  }
  function setup(){
    let p = createCanvas(windowWidth, windowHeight); p.id('p');
    Tone.Transport.PPQ = 4;

    _init_geometry();
    _init_styling();
    _init_voix();
    _init_hexes();
    _init_players();

    composer = new Composer(STARTING_KEY);
    theoretician = new Theoretician(STARTING_KEY, composer.turnsPrevious);
    musician = new Musician();
    cd = new ChordDisplay();
    sd = new StaffDisplay();
    logo = new Logo(50,50);

    lesserOrbs = [];
    currentKeyOrb = new LesserKeyOrb(CURRENT_KEY, colors.blue, colors.white);
    opponentKeyOrb = new LesserKeyOrb(OPPONENT_HOME_KEY, colors.white, colors.red);
    homeKeyOrb = new HomeKeyOrb(HOME_KEY, colors.pink, colors.bass);
    scoreKeeper = new ScoreKeeper();
    cpu = new ComputerOpponent({homeKey:OPPONENT_HOME_KEY});

    SERIAL_RECORD = serial();
  }
  function draw(){
    if(!END_GAME){
        background(colors.background);

        fill(colors.outline)
        hexes.forEach( e => { e.display(); });

        cd.display();
        sd.display();
        voix.forEach( e => { e.display(); });

        //orbs
            lesserOrbs.forEach( e =>{ e.orbit(); e.display();} )
            currentKeyOrb.orbit();currentKeyOrb.display();
            opponentKeyOrb.orbit();opponentKeyOrb.display();
            if(!THROW_ACTION){
              homeKeyOrb.friction();
              homeKeyOrb.orbit();
            }
            if(THROW_ACTION){
              homeKeyOrb.drag();
            }
            homeKeyOrb.display();

        if(cpu.CPU_MOVING_TOKENS)
          cpu.move_tokens();
        displayHexLabels();
        logo.display();
        me.display();
        opponent.display();
        scoreKeeper.display();
      }


    if(END_GAME){
      background(colors.background);
      egmgr.display();
    }

  }

//events
  function windowResized(){
    _init_geometry();
    resizeCanvas(W, H);
    hexes.forEach( e => e.resize());
    voix.forEach( e => e.resize());
    cd.resize()
    sd.resize()
    lesserOrbs.forEach( e => e.resize());
    currentKeyOrb.resize();
    homeKeyOrb.resize();
    opponentKeyOrb.resize();
    me.resize();
    opponent.resize();
    scoreKeeper.resize();

    if(END_GAME)
      egmgr.reposition();
  }
  function mousePressed(){
    if(!END_GAME){
    //voice movement
    for(var i = 0; i < voix.length; i ++)
      if( voix[i].isInside(mouseX, mouseY) ){
        VOICE_MOVEMENT = true;
        ACTIVE_VOICE = i;}
    //staff wheel chord clicks
    if(sd.isInside(mouseX, mouseY))
      sd.replay(mouseX, mouseY);
    //home key signifiying end of turn
      if(homeKeyOrb.isInside(mouseX, mouseY))
        THROW_ACTION = true;
    }
        //end game orb clicks
    if(END_GAME){
      if(!egmgr.got.show){
        for(var i = 0; i < egmgr.clickables.length; i ++)
          if(egmgr.clickables[i].isInside(mouseX, mouseY))
            egmgr.clickables[i].onClick();
      }
    }

    }

  function mouseDragged(){
    if(VOICE_MOVEMENT){
      voix[ACTIVE_VOICE].move();
      voix[ACTIVE_VOICE].hexCheck();

      SERIAL_RECORD = serial();
      MIDI_RECORD = composer.midiTransfigure(composer.pitchChromify(SERIAL_RECORD));
      THEORY_RECORD = theoretician.theoryEncoding(MIDI_RECORD);

      cd.setChord(THEORY_RECORD, CURRENT_KEY);
    }
   if(TEMPO_DRAG){
      egmgr.tempoOrb.drag();
      }
  }
  function mouseReleased(){
    if(VOICE_MOVEMENT){
      VOICE_MOVEMENT = false;
    }

    if(THROW_ACTION){
      //throw action is over. process the data points and empty the arrays
        THROW_ACTION = false;
        homeKeyOrb.inertia();
        homeKeyOrb.throwX.length = 0;
        homeKeyOrb.throwY.length = 0;
        turnSignified(me);
      }
    blossom.blossom();

    if(END_GAME){
      if(TEMPO_DRAG)
        egmgr.tempoOrb.onClick();
      if(egmgr.downloadOrb.state == true)
        egmgr.downloadOrb.onRelease();
    }

  }

//global scope
  function serial(){
    //returns a 32 bit pitch chromatic record S - A - T - B . e.g. 9 - 1 - 4 - 9
    var serialRecord = 0;
    for(var i = 0; i < voix.length; i ++)
      serialRecord += voix[i].getSerial() << (i*8);
    return serialRecord;
  }
  function diagonal(x){
    return -.5*H/W * x + .75*H;
  }
  function displayHexLabels(){
    push();
    fill(colors.pink)
    textFont(fonts.letters);
    textSize(24);
    hexes.forEach( e => { e.displayHexLetter(); });
    textSize(.6 * 32)
    textFont(fonts.accents)
    hexes.forEach( e => { e.displayHexAccent(); });
    pop();
  }
  function turnSignified(playerWhoTookTurn){
      /* first, the theoretician conducts analysis.  this could result in a modulation
         the results of the analysis are applied to the player's score and all the feed back orbs are prepared
         then, the keywheel reacts. the home key orb expands or contracts.
         lesser orbs is flushed, and the current key is put into it as the first member
         theoretician delivers the three part std_dev list of nascent tonalities
         and each of those nascent tonalities is put into lesser orbs, reconcileNewChord
         should change their semi major axis and diameters accordingly
         then, composer and staff display commit the midi record
         musician sounds the chord
         and turn booleans are flipped

      */
      var score = theoretician.analyze(MIDI_RECORD, THEORY_RECORD, playerWhoTookTurn);
      scoreKeeper.scoreTurn(score, playerWhoTookTurn);
      if(score.modulation > 0){
        hexes.forEach( e =>{ e.hexSpelling()} );
        currentKeyOrb = new LesserKeyOrb(CURRENT_KEY, colors.blue, colors.white);
        currentKeyOrb.setRadius(.7*geometry.ORB_MAX_RADIUS);
      }
      var loi = score.loi;
      lesserOrbs = [];
      var radiusOptions = [.5, .7, 1];
      var current_key_init = ( (CURRENT_KEY*7)%12)*2*PI/12 - PI/2 - (PI/2)*Math.floor(CURRENT_KEY/12);
      var rotation_from_init = currentKeyOrb.theta - current_key_init;

      for(var i = 0; i < loi.length; i ++)
        for(var j = 0; j < loi[i].length; j ++){
          lesserOrbs.push( new LesserKeyOrb(loi[i][j], colors.pink, colors.bass, .667) );
          lesserOrbs[lesserOrbs.length - 1].setRadius(radiusOptions[i]*geometry.ORB_MAX_RADIUS);
          lesserOrbs[lesserOrbs.length - 1].theta += rotation_from_init;

        }
      lesserOrbs.forEach( (e)=>{
        if( loi.flat().includes(theoretician.relative(e.id)) && e.id < 12){
          e.semiMajorConstant = 11/12;
          e.resize();}
      });
      composer.commit(MIDI_RECORD);
      sd.commit(MIDI_RECORD);
      for(var i = 0; i < musician.synth.length; i ++)
        musician.synth[i].triggerAttackRelease(musician.makeTone(utility.getByte(i, MIDI_RECORD)), "1n");

      me.isMyTurn = !me.isMyTurn;
      opponent.isMyTurn = !opponent.isMyTurn;
      /*//log turn to database
      socket.emit('logTurn', {mR: MIDI_RECORD, gameId: GAME_ID});
*/



}
  function checkIfGameIsOver(){
    if(composer.turnsPrevious.length == 3+GAME_DURATION_IN_TURNS && GAME_IS_NOT_YET_OVER){
      GAME_IS_NOT_YET_OVER = false;
      egmgr = new EndGameMgmt();
      END_GAME = true;
      }

    else{
      if(opponent.isMyTurn && !cpu.CPU_MOVING_TOKENS){
        //computer does its thing
        var cpuTurn = cpu.takeTurn(MIDI_RECORD, THEORY_RECORD)
        cpu.init_move_tokens(cpuTurn.decision);
      }
    }
  }

//initialization functions
  function _init_styling(){
    textFont(fonts.letters);
    textAlign(CENTER, CENTER);
    noStroke();
  }
  function _init_voix(){
    voix.push(new Token({id:0
                        , x:.5*W +  5.5*geometry.APOTHEM
                        , y: H - geometry.RADIUS
                        , color:colors.bass
                        , message:'bass'}));
    voix.push(new Token({id:1
                        , x:.5*W +  7.5*geometry.APOTHEM
                        , y: H - geometry.RADIUS
                        , color:colors.tenor
                        , message:'tenor'}));
    voix.push(new Token({id:2
                        , x:.5*W +  9.5*geometry.APOTHEM
                        , y: H - geometry.RADIUS
                        , color:colors.alto
                        , message:'alto'}));
    voix.push(new Token({id:3
                        , x:.5*W +  11.5*geometry.APOTHEM
                        , y: H - geometry.RADIUS
                        , color:colors.soprano
                        , message:'soprano'}));
  }
  function _init_hexes(){
    blossom = new Blossom();
    blossom.helics.forEach( (e,index) => {hexes.push(new Hex( {index: index, x:e[0], y:e[1]} ) );} );
  }
  function _init_geometry(){
    W = windowWidth;
    H = windowHeight;
    CX = W * .5;
    CY = H * .5;
    geometry.SCALE = Math.min(W/1400, H/700, 1);
    geometry.RADIUS = 60 * geometry.SCALE;
    geometry.APOTHEM = .5 * geometry.RADIUS * 3**.5;
    geometry.OFFSET = Math.atan((.25*H)/(.5*W));
    geometry.KEYWHEEL_X = .8 * W;
    geometry.KEYWHEEL_Y = diagonal(geometry.KEYWHEEL_X);
    geometry.STAFF_X = .2 * W;
    geometry.STAFF_Y = diagonal(geometry.STAFF_X);
    geometry.KEYWHEEL_DIAMETER = 6*geometry.RADIUS;
    geometry.STAFFSPACING = .2667*geometry.RADIUS;
    geometry.STAFFLENGTH = 5.25*geometry.RADIUS;
    geometry.ORB_MAX_RADIUS = .625 * geometry.RADIUS;
  }
  function _init_players(){
    me = new Player(
         "peter"
        ,HOME_KEY
        ,IS_MY_TURN*Math.PI
        ,colors.pink
        ,colors.bass
        ,IS_MY_TURN);
    opponent = new Player(
         "cpu"
        ,OPPONENT_HOME_KEY
        ,!IS_MY_TURN*Math.PI
        ,colors.white
        ,colors.red
        ,!IS_MY_TURN);
    me.orb.setTwin(opponent.orb);
    opponent.orb.setTwin(me.orb);
  }
