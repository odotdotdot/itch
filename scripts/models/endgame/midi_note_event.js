class MidiNoteEvent{
  constructor( { pitch
               , duration
               , velocity = 100
               , time = 0
               , offset = 0
  } = {}){
  this.startTick = (time + offset);
  this.pitch = pitch;
  this.duration = duration;
  this.velocity = velocity;
}
}
