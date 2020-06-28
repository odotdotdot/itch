class MidiNoteEvent{
  constructor( { pitch
               , duration
               , velocity = 100
               , time = 0
               , offset = 0
  } = {}){
  this.startTick = 32 * (time + offset);
  this.pitch = pitch;
  this.duration = "T" + duration.toString();
  this.velocity = velocity;
}
}
