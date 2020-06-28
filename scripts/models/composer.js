class Composer{

  constructor(startingKey){
    var I = 48+this.nearestNeighbor(startingKey%12, 0);
        I += ((I&0xff)+12) << 8;
        I += ((I&0xff) + 16 - Math.floor(startingKey/12)) << 16;
        I += ((I&0xff) + 19) << 24;
    var V7 = (I & 0xff) + 7;
        V7 += (I & 0xff00) - (1<<8);
        V7 += (I & 0xff0000) - ((2 - Math.floor(startingKey/12)) <<16);
        V7 += (I & 0xff000000) - (2<<24);
    this.turnsPrevious = [I, V7, I];
  }
  pitchChromify(serialRecord){
      let pC = 0;
      for(var n = 0; n < 4; n ++){
        var s = utility.getByte(n,serialRecord)!=0xff ? s = hexes.find( h => h.serial == utility.getByte(n, serialRecord)).pitchChromatic : 0xff;
        pC += s<<8*n;
      }
    return pC;
    }
  crossVoiceCheck(thisVoiceMidi, lowerVoiceMidi){
    if(lowerVoiceMidi != 255){
      if(thisVoiceMidi > lowerVoiceMidi)
        return thisVoiceMidi;
      else
        return thisVoiceMidi+12;
    }
    else {
      return thisVoiceMidi;
    }
  }
  trueMod(a, b){
        return (a%b + b)%b;
  }
  nearestNeighbor(x, y){
      var a = this.trueMod(x - y,12);
      var b = -1*this.trueMod(y - x,12);
      if(Math.abs(a) < Math.abs(b))
        return a;
      else
        return b;
  }
  midiTransfigure(pitchChromatic){
    let thisMidiRecord = 0;
    let indexOfLastMidi = this.turnsPrevious.length - 1;
    let lastMidiRecord = this.turnsPrevious[indexOfLastMidi];

    for(var i = 0; i < 4; i ++){
        var thisPitch = utility.getByte(i, pitchChromatic);
        var lastMidi = utility.getByte(i, lastMidiRecord);
        var indexOfThisLastMidi = indexOfLastMidi;
          if(thisPitch == 255)thisMidiRecord+=255<<i*8;
          else{
            //look for non 255 to compare to
              while(lastMidi == 255){indexOfThisLastMidi--;lastMidi = utility.getByte(i, this.turnsPrevious[indexOfThisLastMidi]);}
              if(i>0)var thisVoiceMidi = this.crossVoiceCheck(this.nearestNeighbor(thisPitch, lastMidi%12) + lastMidi, utility.getByte(i-1,thisMidiRecord));
              else{var thisVoiceMidi = lastMidi + this.nearestNeighbor(thisPitch, lastMidi%12);
              while(thisVoiceMidi<36)thisVoiceMidi+=12;
              while(thisVoiceMidi>71)thisVoiceMidi-=12;}
          thisMidiRecord+=thisVoiceMidi<<i*8;
          }
        }

    return thisMidiRecord;
  }
  commit(midiRecord){
        this.turnsPrevious.push(midiRecord);
      }
  rawMidi(){
    //returns a buffer of all player initiated turns
      var ui32 = new Uint32Array(this.turnsPrevious.slice(3,this.turnsPrevious.length));
      return ui32.buffer;
  }
}
