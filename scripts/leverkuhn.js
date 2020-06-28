let SERIAL_RECORD, MIDI_RECORD = 0xffffffff, THEORY_RECORD, STARTING_KEY = 10, CURRENT_KEY = 10, TEMPO_DRAG = false;
let W, H, CX, CY;
let fonts;
let VOICE_MOVEMENT = false;
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
    let p = createCanvas(windowWidth, windowHeight); p.id('p')

    _init_geometry();
    _init_styling();
    _init_voix();
    _init_hexes();
    composer = new Composer(STARTING_KEY);
    theoretician = new Theoretician(STARTING_KEY, composer.turnsPrevious);
    musician = new Musician();
    cd = new ChordDisplay();
    sd = new StaffDisplay();
    logo = new Logo(50,50);



    SERIAL_RECORD = serial();
  }
  function draw(){

    background(colors.background);

    fill(colors.outline)
    hexes.forEach( e => { e.display(); });

    cd.display();
    sd.displayStaff();
    sd.displayMeasure(MIDI_RECORD);

    voix.forEach( e => { e.display(); });
    displayHexLabels();
    logo.display();


  }

//events
  function windowResized(){
    _init_geometry();
    resizeCanvas(W, H);
    hexes.forEach( e => e.resize());
    voix.forEach( e => e.resize());
    cd.resize()
    sd.resize()
  }
  function mousePressed(){
    for(var i = 0; i < voix.length; i ++)
      if( voix[i].isInside(mouseX, mouseY) ){
        VOICE_MOVEMENT = true;
        ACTIVE_VOICE = i;}
    if(sd.isInside(mouseX, mouseY))
      sd.replay(mouseX, mouseY);


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
  }
  function mouseReleased(){
    if(VOICE_MOVEMENT){
      VOICE_MOVEMENT = false;
    }
    blossom.blossom();

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
    geometry.KEYWHEEL_X = .75 * W;
    geometry.KEYWHEEL_Y = diagonal(geometry.KEYWHEEL_X);
    geometry.STAFF_X = .25 * W;
    geometry.STAFF_Y = diagonal(geometry.STAFF_X);
    geometry.KEYWHEEL_DIAMETER = 5*geometry.RADIUS;
    geometry.STAFFSPACING = .2667*geometry.RADIUS;
    geometry.STAFFLENGTH = 5.25*geometry.RADIUS;
  }
