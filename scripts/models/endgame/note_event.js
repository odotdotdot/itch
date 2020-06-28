class NoteEvent{
  constructor( { pitch = 64
               , duration = 4
               , velocity = 100
               , time = 0
               , vN
  } = {}){
  this.time = time.toString() + "i";
  this.pitch = pitch;
  this.duration = duration.toString() + "i";
  this.velocity = velocity;
  this.vN = vN;
}
}
