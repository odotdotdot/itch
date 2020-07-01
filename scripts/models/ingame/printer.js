class Printer{
  constructor(){
    this.rootName = "C C# D Eb E F F# G Ab A Bb B".split(" ");
    this.qualityName = "M m dim aug M7 7 m7 mM7 dim7 hdim7 aug7 sus2 sus4".split(" ");
    this.inversionName = "r 6 6/4 6/5 4/3 4/2".split(" ");
  }

  //take in scale scores(collection) and growth(collection2) and return verbose collection of n highest scoring objects
  verbose(n, collection, collection2){
    var keys = [];
    for(var i = 0; i < collection.length; i ++){
      var name = (i < 12) ? this.rootName[i] : this.rootName[i%12] + "m";
      keys.push({
        name: name
      , score: Math.round(collection[i])
      , growth: Math.round(collection2[i])
      , sum: Math.round(collection[i]) + Math.round(collection2[i]) });
    }
    return keys.sort( (a,b) => a.sum > b.sum ? -1 : 1 ).slice(0,n);
  }

  numeralToKey(keyNumber){
    return keyNumber < 12 ? this.rootName[keyNumber%12] + ' MAJ' : this.rootName[keyNumber%12] + ' MIN';
  }

  //return midi notes 32 48 53 57
  midiNotes(mR){
      var n = [];
      var mask = 0xff;
      for(var i = 0; i < 4; i ++){
        n.push( (mR & (mask<<i*8))>>>i*8 );
      }
      return n.toString();

  }
  //return letters D F# A D
  actualNotes(mR){
    var n = [];
    var mask = 0xff;
    for(var i = 0; i < 4; i ++){
      n.push( (mR & (mask<<i*8))>>>i*8 );
    }
    var l = [];
    n.forEach((element) => {
      l.push(this.rootName[element%12]);
    });
    return l.toString();

  }
  //return computer generated cardinal vector S-A-T-B
  computerGeneratedCardinal(cgc){
    var size = cgc & 0xf;
    var n = [];
    var mask = 0xf;
    for(var i = 0; i < size; i ++){
      cgc>>>=4
      n.push( cgc & mask);
    }
    return n.toString();

  }

  theoryNumeric(tR){
    var mask = 0xf;
    var r = "";
    for(var i = 0 ; i < 4; i ++){
      r+= (tR&0xf).toString() + " - ";
      tR>>>=4;
    }
    return r;
  }
  //return theory record string Em7 4/2
  theoryDecoding(tR){
    var root = this.rootName[(tR&0xf000)>>>12];
    var quality = this.qualityName[(tR&0x0f00)>>>8];
    var inv = this.inversionName[(tR&0x00f0)>>>4];
    var string = root;
    if( quality!= "M")
      string+=quality;
    if(inv != "r")
      string+= " "+inv;
    return string;
  }
  //zip three attibutes above into an object and print as table
  chordInfo(mR, tR){
    var t = this.theoryDecoding(tR);
    var m = this.midiNotes(mR);
    var l = this.actualNotes(mR);

    var chord = {theory: t, letter: l, numeral: m};

    console.table(chord);
  }

  sequence(a){
    var s = "";
    for(var i = 0; i < a.length-1; i ++)
      s+=a[i] + " - ";
    s+=a[a.length - 1];
    console.log(s);
  }

}
