class MidiWriter{
  constructor(song){
    this.header = new ArrayBuffer(14);
    this.track_header = new ArrayBuffer(8);
    this.meta_events = new ArrayBuffer(12);
    this.event = new ArrayBuffer(song.length * 4 * 2);
    this.end = new ArrayBuffer(4);

    this.x = new DataView(this.header);
    this.u = new DataView(this.track_header);
    this.v = new DataView(this.event);
    this.y = new DataView(this.end);

    this.file = [];

    //discard pitch 255s
      song = song.filter( e=> e.pitch != 0xff)
    //add note off events
      var notes_on = song.length;
      for(var i = 0; i < notes_on; i ++)
        song.push( new MidiNoteEvent({
           pitch : song[i].pitch
         , time : (song[i].absolute + song[i].duration)
         , velocity : 0
         , status : 0x80}) );
    //sort song by absolute timestamp
      var index_absolute = song.map( (e, index) => {return {index: index, absolute: e.absolute}} );
      index_absolute.sort( (a,b) => {
        if(a.absolute > b.absolute){
          return 1}
        if(a.absolute < b.absolute){
          return -1}
        return 0} );
      var song_absolute_sort = index_absolute.map( e => song[e.index]);
   //generate delta timestamps from absolutes
      var clickPosition = 0;
      for(var i = 0; i < song_absolute_sort.length; i ++){
        song_absolute_sort[i].delta = song_absolute_sort[i].absolute - clickPosition;
        clickPosition = song_absolute_sort[i].absolute;
       }
    //reassign song to the sorted list
      song = song_absolute_sort;
    //build header
      header.forEach( e  => {
       switch(e.size){
        case(8):
          this.x.setUint8(e.lsb_offset, e.data);
          break;
        case(16):
          this.x.setUint16(e.lsb_offset, e.data);
          break;
        case(32):
          this.x.setUint32(e.lsb_offset, e.data);
          break;}
        });
    //build track header
      this.u.setUint32(0, 0x4d54726B);
    //build meta-events
    //build track
      for(var i = 0; i < song.length; i ++)
        this.v.setUint32(i*4, (song[i].delta << 24) + (song[i].status<<16) + (song[i].pitch << 8) + (song[i].velocity<<0) );
    //record track length
      this.u.setUint32(4, this.event.byteLength);
    //end of track marker
      this.y.setUint32(0, 0x00FF2F00);
    //assemble array buffers into file and download
      this.file.push(this.header, this.track_header, this.event, this.end);
      var f = new File( this.file, "out.mid", {type: "audio/midi"});
      saveAs(f);
  }
}
const header = [
      {  name : "chunk_type"
        ,size : 32
        ,data : 0x4D546864
        ,lsb_offset : 0
      }
      ,
      {
         name: "chunk_length"
        ,size : 32
        ,data : 0x6
        ,lsb_offset : 4
      }
      ,
      {
        name: "format"
       ,size : 16
       ,data : 0x0
       ,lsb_offset : 8
      }
      ,
      {
        name: "tracks"
       ,size : 16
       ,data : 0x1
       ,lsb_offset : 10
      }
      ,
      {
        name: "ppq"
       ,size : 16
       ,data : 0x4
       ,lsb_offset : 12
      }
    ]
