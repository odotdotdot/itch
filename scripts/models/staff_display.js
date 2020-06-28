class StaffDisplay{
  //members
    constructor(){
      this.figuredNotes = new Array(12).fill(null);
      this.fNC = new Array(16).fill(null);
      this.x = geometry.STAFF_X + 6*geometry.RADIUS*.5*cos(Math.PI-asin(-6*geometry.STAFFSPACING/geometry.KEYWHEEL_DIAMETER*.5));
      this.y = geometry.STAFF_Y - 6*geometry.STAFFSPACING;
    }
    figureNote(midiByte, voice_id, currentFlag = false){
      /* returns a coded representation of the staff notation for a given note:
         0xfffffff
         0xf << 0  is octave
         0xf << 4  is the natural letter
         0xf << 8  is the applied accent if necessary
         0xf << 12 is how many lines
         0xf << 16 is direction : 1 below i.e. add, 0 above i.e. subtract
         0xf << 20 is the staff to start from where 0 = f5 atop the g clef
         0xf << 24 is the voice id 0 being bass
         0xf << 28 is the turn number on which it was played */

      if(midiByte == 255)
        return null;
      else {
          let r = 0, letter = 0;
            //octave
              r+=Math.floor(midiByte/12);
            //letter
              var spellingRule =  (spelling.spelling[CURRENT_KEY - (Math.floor(CURRENT_KEY/12)*(CURRENT_KEY - ((CURRENT_KEY-9)%12)))] >>> (2*(midiByte%12))) & 0x03;
              switch(spellingRule){
                //natural
                  case 0: letter = midiByte%12; break;
                //sharp
                  case 1: letter = ((midiByte%12) - 1 + 12) %12; break;
                //flat
                  case 2: letter = (midiByte%12+1) %12; break;
                //out of key
                  case 3: letter = ((midiByte%12) - 1 + 12) %12; break;}
          r+=utility.naturalReduction(letter)<<4;
          r+=spellingRule<<8;
            let yPos = this.staffY(r);
            if(yPos < this.y){
              r|= (0x0<<20)
              r+= (0x0<<16)
              r+= (Math.floor((this.y - yPos)/geometry.STAFFSPACING + .1)<<12);}
            if(yPos > this.y + 12*geometry.STAFFSPACING){
              r|= (0xC<<20);
              r+= (0x1<<16);
              r+=(Math.floor( (yPos - this.y)/geometry.STAFFSPACING +.1)-12)<<12;}
            if(yPos > (this.y + 4.5*geometry.STAFFSPACING) && yPos < (this.y + 7.5*geometry.STAFFSPACING)){
              r|= (0x4)<<20;
              r+= (0x1<<16);
              r+=(Math.floor( (yPos - this.y)/geometry.STAFFSPACING +.1 ) - 4 ) << 12;}
          //add voice id
            r+=voice_id<<24;
          //add measure number
            var tN = (composer.turnsPrevious.length - 3);
            if(currentFlag)
              tN++;
            r+=tN<<28;
       return r;
     }
    }
    staffY(fN){
          var r = this.y - 2*geometry.STAFFSPACING + (7-(fN & 0xf))*3.5*geometry.STAFFSPACING - ((fN & 0xf0)>>>4)*.5*geometry.STAFFSPACING;
          //if r > B4, figure it in the bass clef
            if(r > this.y + 5.5*geometry.STAFFSPACING)
              r+=2*geometry.STAFFSPACING;
          return r;}
    resize(){
      this.x = geometry.STAFF_X + 6*geometry.RADIUS*.5*cos(Math.PI-asin(-6*geometry.STAFFSPACING/geometry.KEYWHEEL_DIAMETER*.5));
      this.y = geometry.STAFF_Y - 6*geometry.STAFFSPACING;
    }
    displayNote(fN, cnt, col){
      if(fN!=null){
        fill(col);
        //x position bits
        var j = cnt;
          //extra staff lines
            push();
            if( ( ( (fN & 0xf000) >>> 12 ) & 0xf) > 0){
              stroke(155);
              var dBit = ((fN&0xf0000) >>> 16) & 0xf;
              if(dBit == 0)dBit-=1;
              for(var t = 0; t < ( ( (fN & 0xf000) >>> 12 ) & 0xf); t++){
                line(this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j - .75*geometry.STAFFSPACING, this.y + ((((fN & 0xf00000)>>> 20 )& 0xf )*geometry.STAFFSPACING) + dBit*(t+1)*geometry.STAFFSPACING,
                     this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j + .75*geometry.STAFFSPACING, this.y + ((((fN & 0xf00000)>>> 20 )& 0xf )*geometry.STAFFSPACING) + dBit*(t+1)*geometry.STAFFSPACING);
              }
            }
          //note
            noStroke();
            ellipse(this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j, this.staffY(fN), 1*geometry.STAFFSPACING,.7*geometry.STAFFSPACING);
            this.fNC.shift();
            this.fNC.push([j, this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j, this.staffY(fN)]);
          //accent
            textAlign(CENTER, CENTER);
            textFont(fonts.accents);
            text(spelling.accents[ ((fN&0xf00) >>> 8)&0xf],
              this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j - geometry.STAFFSPACING,
              this.staffY(fN) - textDescent());
          pop();
          }
          //measure #
            //if the turn the note was played on was a multiple of four
          if( ( (fN >>> 28 ) & 0xf ) % 4 == 1 ){
              var turnNumber = (fN>>>28)&0xf;
              var measureNumber = Math.floor(turnNumber/4) + 1;
              var ySurplus = 0;
              if(this.y - this.staffY(fN) > 0)
                ySurplus = this.y - this.staffY(fN);
              /*textFont(fonts.letters)
              textSize(14);
              text(measureNumber
                  ,this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*j
                  ,this.y - 1*geometry.STAFFSPACING - ySurplus);*/
          //bar
          if(measureNumber > 1){
            push();
            strokeWeight(1);
            stroke(colors.outline);
            line(
               this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*(j-.5), this.y
              ,this.x + 8*geometry.STAFFSPACING + (geometry.STAFFLENGTH-8*geometry.STAFFSPACING)/4*(j-.5), this.y + 12*geometry.STAFFSPACING);
            pop();}}

      }
    commit(midiRecord){
      for(var i = 0; i < 4; i ++){
        this.figuredNotes.shift();
        this.figuredNotes.push(this.figureNote(utility.getByte(i,midiRecord), i));
      }
    }
    displayMeasure(midiRecord){
      //display last three commited chords, and be mindful of null values and x postions
      let toSend = 0;
        for(var n = 0; n < 3; n++){
          let nullCnt = 0;
          //loop through each of the last three chords and display figures, if they're not all null augment the x position
          for(var i = n*4; i < n*4+4 ; i++){
              if(this.figuredNotes[i] == null){
                nullCnt ++;
              }
              if(nullCnt < 4 && this.figuredNotes[i] != null){
                this.displayNote(this.figuredNotes[i], toSend, colors.white);
              }

            }
            if(nullCnt!=4)
              toSend++;
      }
      //display current voices
      for(var i = 0; i < 4; i ++){
          var currentFlag = true;
          this.displayNote(this.figureNote(utility.getByte(i, midiRecord), i, currentFlag), toSend, colors.pink);
      }
    }
    displayStaff(){
      push();
        translate(geometry.STAFF_X, geometry.STAFF_Y)
        //OUTLINE
          stroke(colors.outline);
          strokeWeight(2);
          fill(colors.background);
          circle(0,0,6*geometry.RADIUS);
          noFill();
          //STAFF LINES
            var r = .5*6*geometry.RADIUS;
            for(var i = 6; i >= -6; i--){
              if(i > 1 || i < -1){
                var theta = asin(i*geometry.STAFFSPACING/r);
                line(r*cos(theta), r*Math.sin(theta), r*Math.cos(Math.PI-theta),r*Math.sin(Math.PI-theta) );
              }
            }
          //CLEFS
          stroke(colors.pink);
          strokeWeight(2)
          var position = createVector(r*cos(PI-asin(-6*geometry.STAFFSPACING/r)), r*sin(PI-asin(-6*geometry.STAFFSPACING/r)));
          line(position.x + 2*geometry.STAFFSPACING, position.y - .913*geometry.STAFFSPACING, position.x + 2*geometry.STAFFSPACING, position.y + 4*geometry.STAFFSPACING);
          arc(position.x + 2*geometry.STAFFSPACING, position.y - .1405*geometry.STAFFSPACING, 2.5*.618*geometry.STAFFSPACING, 2.5*.618*geometry.STAFFSPACING, -PI/2, PI/2, OPEN );
          arc(position.x + 2*geometry.STAFFSPACING, position.y + 2.25*geometry.STAFFSPACING, 1.618*2*geometry.STAFFSPACING, 1.618*2*geometry.STAFFSPACING, 3*PI/16, 7*PI/4, OPEN);
          arc(position.x + (2-.618)*geometry.STAFFSPACING, position.y + 9.75*geometry.STAFFSPACING, 1.618*2*geometry.STAFFSPACING, 1.618*2*geometry.STAFFSPACING, 5*PI/4, 5*PI/2, OPEN);
          fill(colors.pink);
          ellipse(position.x + 3.618*geometry.STAFFSPACING, position.y + 8.5*geometry.STAFFSPACING, .45*geometry.STAFFSPACING, .45*geometry.STAFFSPACING);
          ellipse(position.x + 3.618*geometry.STAFFSPACING, position.y + 9.5*geometry.STAFFSPACING, .45*geometry.STAFFSPACING, .45*geometry.STAFFSPACING);
        pop();

    }
    noteClicked(mX, mY){
      for(var i = 0; i < this.fNC.length; i ++)
        if(this.fNC[i]!=null)
          if( (mX - this.fNC[i][1])**2 / (.5*geometry.STAFFSPACING)**2 + (mY - this.fNC[i][2])**2 / (.35*geometry.STAFFSPACING)**2 <= 1)
            return this.fNC[i][0];
    }
    isInside(mX, mY){
      if( (mX - geometry.STAFF_X)**2 + (mY - geometry.STAFF_Y)**2 < (.5*geometry.KEYWHEEL_DIAMETER)**2)
        return true
      else
        return false;
    }
    replay(mX, mY){
      var i = this.noteClicked(mX, mY);
      if(i != undefined){
          if(composer.turnsPrevious.length < 7)
            i+=3;
          else
            i = composer.turnsPrevious.length - (3-i);
          var mR;
            if(i < composer.turnsPrevious.length) mR = composer.turnsPrevious[i];
            else mR = MIDI_RECORD;

          musician.recall.triggerAttackRelease(musician.makeChord(mR), "4n");
    }
  }
    display(){
      this.displayStaff();
      this.displayMeasure(MIDI_RECORD);
  }
}
