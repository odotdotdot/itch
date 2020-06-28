class NoteEventList{
  constructor( { vN
               , duration = 4
               , n = 0 //every n ticks
  } = {}){
  this.vN = vN;
  var pitchList = this.midiNoteListByVoiceNumber(vN);
  this.eventList = [];
  for(var i = 0; i < pitchList.length; i ++)
    this.eventList.push(new NoteEvent({time: i * n, pitch: pitchList[i], duration: duration, vN: this.vN}));

}
 midiNoteListByVoiceNumber(vN){
  var s = [];
  for(var i = TPN; i < composer.turnsPrevious.length; i ++)
    s.push(utility.getByte(vN, composer.turnsPrevious[i]));
  return s;
}

}
