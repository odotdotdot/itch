class Musician{
  constructor(){
      this.lastMidiRecord = 0xffffffff;
      this.program = PROGRAM;
      this.collisionArray = [];

    //SYNTHS: synth is an array of FM synths for banging chords. recall is a poly synth to be used for replay
    //to do just have one poly fm synth
        this.synth = [];
          this.bass = new Tone.FMSynth(); this.synth.push(this.bass);
          this.tenor = new Tone.FMSynth(); this.synth.push(this.tenor);
          this.alto = new Tone.FMSynth(); this.synth.push(this.alto);
          this.soprano = new Tone.FMSynth(); this.synth.push(this.soprano);

        this.EndSynth = [];
            this.b = new Tone.FMSynth(); this.EndSynth.push(this.b);
            this.t = new Tone.FMSynth(); this.EndSynth.push(this.t);
            this.a = new Tone.FMSynth(); this.EndSynth.push(this.a);
            this.s = new Tone.FMSynth(); this.EndSynth.push(this.s);

        for(var i = 0; i < this.EndSynth.length; i ++)
          this.EndSynth[i].toMaster();

        this.recall = new Tone.PolySynth(4, Tone.FMSynth).toMaster();
        this.vibeSynth = new Tone.FMSynth().toMaster();


    //EFFECTS
        this.pan = [];
        this.delay = [];
        var delaySet = [.25, .29, .21, .27];
        var panSet = [0, -1, 1, 0]
        for(var i = 0; i < 4; i ++){
          this.pan.push(new Tone.PanVol(panSet[i], -10));
          this.delay.push(new Tone.FeedbackDelay(delaySet[i], .85));
        }

    //SYNTH SETTINGS
        this.vibeSynth.set(this.program[0]);

        this.recall.set(this.program[1]);

        for(var i = 0; i < this.synth.length; i ++)
          this.synth[i].set(this.program[2]);

        for(var i = 0; i < this.EndSynth.length; i ++)
          this.EndSynth[i].set(this.program[0]);

  //ROUTING
        for(var i = 0; i < this.synth.length; i ++)
          this.synth[i].chain(this.delay[i], this.pan[i], Tone.Master);
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
  scoreVoiceMovement(midiRecord){
    if(midiRecord != this.lastMidiRecord){
      for(var i = 0; i < 4; i ++){
        if(utility.getByte(i,midiRecord)!=utility.getByte(i,this.lastMidiRecord) && utility.getByte(i,midiRecord)!=255)
          this.vibeSynth.triggerAttackRelease(this.makeTone(utility.getByte(i,midiRecord)), "8n");}
      this.lastMidiRecord = midiRecord;}
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
    this.vibeSynth.triggerAttackRelease(this.makeTone(this.collisionArray[cols]), "8n");
  }
}
