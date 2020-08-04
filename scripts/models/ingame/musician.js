class Musician{
  constructor(){
      this.lastMidiRecord = 0xffffffff;
      this.program = PROGRAM;
      this.collisionArray = [];
      this.feedBackIndex = 0

    //SYNTHS
        this.medieval = new Tone.PolySynth(4, Tone.FMSynth)
        this.kalimba = new Tone.PolySynth(4, Tone.FMSynth);
    //EFFECTS
        this.delay = new Tone.FeedbackDelay(.05, .2);
        this.chorus = new Tone.Chorus();
        this.lightChorus = new Tone.Chorus({depth: .2})
    //PATCHES
        this.kalimba.set(this.program[0]);
        this.medieval.set(this.program[0]);
    //ROUTING
        this.medieval.chain(this.delay, this.chorus, Tone.Master);
        this.kalimba.chain(this.lightChorus, Tone.Master)
}

  makeTone(midiByte){
    return Tone.Frequency(midiByte, "midi");
  }

  makeChord(midiRecord){
    let chord = [];
    for(var i = 0; i < 4; i ++)
      chord.push(this.makeTone(utility.getByte(i,midiRecord)));
    return chord;
  }

  scoreTutorial(message, index){
    var tutorialChords = [
       [61, 63, 66]
      ,[63, 66, 68]
      ,[66, 68, 70]
      ,[68, 70, 73]
      ,[70, 73, 75]
      ,[73, 75, 78]
      ,[75, 78, 80]
      ,[78, 80, 82]
      ,[80, 82 ,85]
    ]
    if(message == 'next'){
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][0]), '64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][1]), '64n', '+64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][2]), '64n', '+32n')}

    if(message == 'prev'){
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][2]), '64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][1]), '64n', '+64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][0]), '64n', '+32n')}

    if(message =='done' || message == 'skip')
      this.kalimba.triggerAttackRelease([66, 68, 70, 73, 75, 78].map(e=>this.makeTone(e)), '16n')
  }

  scoreDuration(bars){
    // 2, 4, 8, 16
    var blackKeys = [54, 56, 58, 61, 63, 66, 68, 70, 73, 75, 78, 80, 82, 85]
    var index = Math.log2(bars) - 1 + Math.floor(bars/4)
    var theseBlackKeys = blackKeys.slice(index, index+5)
      this.kalimba.triggerAttackRelease(theseBlackKeys.map(e=>this.makeTone(e)), '16n')
  }

  scoreFeedback(message){
    var duree = Tone.Time('32n')
    var score = parseInt(message, 10)

    var offset = theoretician.root(THEORY_RECORD) < 8 ? theoretician.root(THEORY_RECORD) : -1*(12 - theoretician.root(THEORY_RECORD))

    var notes =   //major pentatonic
                  [0, 4].includes(theoretician.quality(THEORY_RECORD)) ? [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84].map(e=>this.makeTone(e + offset))
                  //minor pentatonic
                : [1, 6].includes(theoretician.quality(THEORY_RECORD)) ? [60, 63, 65, 67, 70, 72, 75, 75, 79, 82, 84].map(e=>this.makeTone(e + offset))
                  //mixolydian
                : [5].includes(theoretician.quality(THEORY_RECORD)) ?    [60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77].map(e=>this.makeTone(e + offset))
                  //diminished scale
                : [2, 8, 9].includes(theoretician.quality(THEORY_RECORD)) ? [60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90].map(e=>this.makeTone(e + offset))
                  //augmented scale
                : [3, 10].includes(theoretician.quality(THEORY_RECORD)) ? [60, 63, 64, 67, 68, 71, 72, 75, 76, 79, 80, 83, 84].map(e=>this.makeTone(e + offset))
                  //default chromatic
                : [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72].map(e=>this.makeTone(e + offset))
    var chunkSize = score > 150 ? 6 : score > 80 ? 5: score > 25 ? 4: 2;

    var playNotes = notes.slice(this.feedBackIndex, this.feedBackIndex + chunkSize)

    for(var i = 0; i < playNotes.length; i ++)
      this.kalimba.triggerAttackRelease(playNotes[i], duree, '+' +  i*duree)

    this.feedBackIndex ++
  }

  turnSignified(){
      var notes = utility.byteToList(MIDI_RECORD).map(e=>this.makeTone(e))
      this.medieval.triggerAttackRelease(notes, '1n');
  }

  scoreVoiceMovement(activeVoice){
    if(utility.getByte(activeVoice, MIDI_RECORD) != 0xff){
        this.kalimba.triggerAttackRelease(this.makeTone(utility.getByte(activeVoice,MIDI_RECORD)), "8n");
        }
    else
      return false;
  }

  prepareCollisionScore(exCols){
    this.collisionArray = [];
    var direction = 1;
    var byteIndex = 0;

    var goodMidiNotes = [];
    for(var i = 0; i < 4; i ++)
      if( utility.getByte(i,MIDI_RECORD) != 255)
        goodMidiNotes.push(utility.getByte(i,MIDI_RECORD));


    while(this.collisionArray.length < exCols){
        this.collisionArray.push( goodMidiNotes[byteIndex] );
        byteIndex += direction;
        if(byteIndex == goodMidiNotes.length - 1 || byteIndex == 0)
          direction*=-1;
    }
  }

  scoreCollision(n, cols){
    this.kalimba.triggerAttackRelease(this.makeTone(this.collisionArray[cols]), "8n");
  }
}
