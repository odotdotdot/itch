class MidiNoteEvent{
  constructor( { pitch
               , duration = 0
               , velocity = 100
               , time = 0
               , offset = 0
               , status = 0
               , delta = null
  } = {}){
  this.absolute = (time + offset);
  this.delta = delta;
  this.pitch = pitch;
  this.duration = duration;
  this.velocity = velocity;
  this.status = status;
}
}
