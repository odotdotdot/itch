class Part{
  constructor(noteEventList, offset = "0i"){
    this.part = new Tone.Part( (time, value) =>
                 { musician.kalimba.triggerAttackRelease(musician.makeTone(value.pitch), value.duration);}
                 , noteEventList ).start(offset);
    this.offset = offset;
    this.vN = noteEventList.vN;
    this.nel = noteEventList;
    this.part.mute = true;
  }
}
