class MidiWriter{
  constructor(song){
    this.header = new ArrayBuffer(14);
    this.track_header = new ArrayBuffer(8);
    this.x = new DataView(this.header);
    this.u = new DataView(this.track_header);
    this.end = new ArrayBuffer(4);
    this.p = new DataView(this.end);


    this.file = [];

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
    //events
      song = song.sort( (a,b) => (a.startTick > b.startTick) ? 1 : -1);
      this.event = new ArrayBuffer(song.length * 4);
      this.v = new DataView(this.event);

      var clickPosition = 0;

      for(var i = 0; i < song.length; i ++){
        if(i > 0 ){
          clickPosition = song[i].startTick - song[i-1].startTick;
          }
        this.v.setUint32(i*4, (clickPosition << 24) + (0x90<<16) + (song[i].pitch << 8) + (song[i].velocity<<0) );
        //find out if the stream has to be delta time ordered (probably). add note off events to song earlier and process here
      }

      this.u.setUint32(4, this.event.byteLength);

    this.p.setUint32(0, 0x10FF2F00);

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
