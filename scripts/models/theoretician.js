class Theoretician{
          /*
            extends the pitch counting model to track whole chords and thus anticipate key changes
            we adopt an encoding procedure we'll call theory_encoding, distinguishing it from roman and midi varieties
            a 16 bit representation is returned, of which
              4 LSB give bass chromatic
              4 NXT give inversions (0) Root Position (1) 6 (2) 6/4 (3) 6/5 (4) 4/3 (5) 4/2
              4 NXT give quality (0)  Major
                                 (1)  Minor
                                 (2)  Diminished
                                 (3)  Augmented
                                 (4)  Major 7
                                 (5)  Dominant 7
                                 (6)  Minor 7
                                 (7)  Minor-major 7
                                 (8)  Diminished 7
                                 (9)  Half diminished 7
                                 (10) Augmented 7
                                 (11) sus2/add9 (12) sus4/add11
              4 MSB give root chromatic
            a decoding function is also provided to make sense of the analysis
            the idea is to store theory encoded 32bit integers in a secondary turn array,
            which can be queried and transformed into a roman numeral analysis.
            the theoretician can then ask questions, like have we seen any secondary dominants lately?
            to anticipate key changes and award points for musically elegant chord changes.

            to do: add sus chords and make a decision for other code 15s.  Toggling sus2 chords currently interferes with 42 inversions
          */
          constructor(startingKey, turnsPrevious){
            this.currentKey = startingKey;
            this.bassFactor = 1.5;
            this.RUNNING_AVERAGE_WINDOW = 4;
            this.WINDOW_FACTOR = 2.0;
            this.GROWTH_FACTOR = 70;
            this.TURNWISE_DIMINISH = .67;
            this.DIATONICITY_FACTOR = 7.4;
            this.RESOLUTION_FACTOR = 7.4;
            this.SCALE_SCORES = new Array(24).fill(0);
            this.RUNNING_AVERAGE_SCALE_GROWTH = new Array(24).fill(0);
            this.GROWTH_BONUS = new Array(24).fill(0);
            this.TEMPERLEY_MAJOR = [50,20,35,20,45,40,20,45,20,35,15,40];
            this.TEMPERLEY_MINOR = [50,20,35,45,20,40,20,45,35,20,15,40];


            for(var i = 0; i < turnsPrevious.length; i ++)
              this.keystats(turnsPrevious[i]);

            }
            analyze(mR, tR, player){
              /*analysis protocol.  modulation works in the following manner: we check if leading key is different from current key
                if so, run diatonicity again to set a slightly higher bar. we check again if the
                leading key beats the current key, and if so trigger modulation. meanwhile score is kept and returned as an object for
                subsequent interpretation*/
                  //score components
                    let DIATONIC_COMPONENT = 0; let COMMON_COMPONENT = 0; let PREPARATION_COMPONENT = 0; let RESOLUTION_COMPONENT = 0; let MODULATION_COMPONENT = 0;

                this.keystats(mR);
                DIATONIC_COMPONENT = this.diatonicity(this.currentKey, mR);
                COMMON_COMPONENT = this.commonality([this.currentKey, player.homeKey], mR);
                PREPARATION_COMPONENT = this.preparations(tR, composer.turnsPrevious[composer.turnsPrevious.length-1]);
                RESOLUTION_COMPONENT = this.resolutions(tR, this.theoryEncoding(composer.turnsPrevious[composer.turnsPrevious.length-1]));

                if(this.leadingKey()!=this.currentKey
                   && [0,1,4,6].includes(this.quality(tR))
                   && this.leadingKey() == this.root(tR) + this.quality(tR)*12 ){
                      this.updateCurrentKey( this.leadingKey() );
                      MODULATION_COMPONENT = 1;
                      if( (me.isMyTurn && this.currentKey == me.homeKey) || (opponent.isMyTurn && this.currentKey == opponent.homeKey ) )
                        MODULATION_COMPONENT++;
                }
                var LOI_COMPONENT = this.getLesserOrbIndices();


            return { diatonic: DIATONIC_COMPONENT
                   , common: COMMON_COMPONENT
                   , preparation: PREPARATION_COMPONENT
                   , resolution: RESOLUTION_COMPONENT
                   , modulation: MODULATION_COMPONENT
                   , loi: LOI_COMPONENT
                   , emergent: LOI_COMPONENT.flat().length};

            }
            theoryEncoding(midiRecord){
                  let chord_models = [0x91, 0x89 , 0x49, 0x111, 0x891, 0x491, 0x489, 0x889, 0x249, 0x449, 0x911];
                  //0x85 sus2 0x91 sus4 but enharmonic equivalency complicates inclusion
                //obtain the 16 bit representation described above
                  var r = 0;
                //the bass chromatic is the least signficant byte of the input provided that voice is present
                  var fvp = null;
                  for(var i = 0; i < 4; i ++){
                    if(utility.getByte(i, midiRecord)!=255){
                      fvp = i;
                      break;
                    }
                  }
                  if(fvp == null)
                    return 0xffff;

                  r+=utility.getByte(fvp,midiRecord)%12;

                //load the next two bytes of r with pitch presence bits by shift + cast + modulo on the input
                //make accomodations for the 4 bits already stored on r's lsb side by extra shifing
                  for(var n = 0; n < 4; n++)
                    if(utility.getByte(n, midiRecord)!=255)
                      r|=1<< utility.getByte(n, midiRecord) %12 + 4;
                //compare pitch presence to models
                  var enharmonicPossibles = [];
                  for(var i = 0; i < chord_models.length; i++){
                    for(var j = 0; j < 12; j++){
                      var s = ((chord_models[i] << j) & 0x0fff) + (chord_models[i] >>> (12-j));
                //when we get a match store i (the chord type indice) and j (the root indice) in the appropriate slots
                //and add the match to enharmonic possibles
                      if((r >>> 4) == s){
                        var tmp = (r & 0x000f) + (j<<12) + (i<<8);
                        tmp&=0xff0f;
                        enharmonicPossibles.push(tmp);
                        }}}

                //a few possiblities then, after matching
                  if(enharmonicPossibles.length == 0)
                      return 0xffff;
                  if(enharmonicPossibles.length == 1)
                      r = enharmonicPossibles[0];

                  if(enharmonicPossibles.length > 1){
                    //isolate the chord type
                    var chordType = (enharmonicPossibles[0] & 0x0f00)>>>8;
                      //for augmented triads, choose the one where the note matches the bass note
                        if(chordType == 3){
                          for(var i = 0; i < enharmonicPossibles.length; i ++)
                            if( (enharmonicPossibles[i]>>>12) == (enharmonicPossibles[i]&0x00f) )
                              r = enharmonicPossibles[i];
                        }
                      //for dim7s, choose the one where the note matches the bass note
                        if(chordType == 8 && this.currentKey < 12){
                          for(var i = 0; i < enharmonicPossibles.length; i ++){
                            if( (enharmonicPossibles[i]>>>12) == (enharmonicPossibles[i]&0x00f) )
                              r = enharmonicPossibles[i];}
                        }
                      //and the IInd degree in minor
                        if(chordType == 8 && this.currentKey > 12){
                          for(var i = 0; i < enharmonicPossibles.length; i ++)
                            if( (enharmonicPossibles[i]>>>12) == (enharmonicPossibles[i]&0x00f) )
                              r = enharmonicPossibles[i];
                        }

                        if(chordType != 3 && chordType != 8)
                          r = enharmonicPossibles[0];
                  }

                //if the bass note and the root are not the same, figure the bass
                  if( (r>>>12) != (r & 0x000f) ){
                //alpha is the interval distance root to bass. beta are the bounds at which different alphas emerge.
                    var alpha = (( (r & 0x000f) + 12) - ( (r & 0xf000) >>> 12)) % 12;
                    var beta = [0, 5, 9, 12];
                //if the chord is a 7th flip alpha's msb
                    if( ((r & 0x0f00) >>> 8) > 3) alpha |= 0x80;
                //if alpha is between two betas, store the inversion
                    for( var i = 0; i < 3; i++){
                      if(beta[i] <= (alpha & 0x0f) && (alpha & 0x0f) < beta[i+1]){
                        var delta = i + 1 + ((alpha & 0x80) >>> 6);
                        r = (r & 0xff0f) | (delta<<4);}}}
                  return r;
              }
            root(m){return (m&0xf000)>>>12;}
            quality(m){return (m&0x0f00)>>>8;}
            inversion(m){return (m&0x00f0)>>>4;}
            theoryDecoding(theoryRecord){
              console.log(theoryRecord);
              console.log(this.root(theoryRecord));
              console.log(this.quality(theoryRecord));
              console.log(this.inversion(theoryRecord));
            }
            updateCurrentKey(newCurrentKey){
              this.currentKey = newCurrentKey;
              CURRENT_KEY = this.currentKey;
          }
            true_mod(a, b){
            return (a%b + b)%b;
          }
            log2(x){
              return Math.floor(Math.log(x) / Math.log(2) + 1e-10);
          }
            keystats(m){
            let bF = this.bassFactor;
            //build scale accretion (unnecessary stricly speaking) & diminish scale scores
            let SCALE_ACCRETION = new Array(24).fill(0);
            for(var i = 0; i < 24; i++)
              this.SCALE_SCORES[i]*=this.TURNWISE_DIMINISH;
            let
              major_prototype = 0xAB5,
              minor_prototype = 0xAAD, //natural minor 0x5ad
              note;
          //for each note in the chord m
            //set an increase coefficient. here only the bass coefficient factors, passed as bF
            for(var v = 0; v < 4; v++){
              if(v > 0) bF = 1;
              //reduce it the note to a pitch chromatic binary. e.g. C = 0b000000000001
                note = 1 << utility.getByte(v, m)%12;
              //move the major prototype array around for every key and & the result with note
                for(var n = 0; n < 12; n++){
                    let major_comp = note & (((major_prototype << n) & 0x0fff) + (major_prototype >>> (12-n)));
                    let minor_comp = note & (((minor_prototype << n) & 0x0fff) + (minor_prototype >>> (12-n)));
              //augment scaleScores by voice coefficient*temperley weight and scale accretion by 25 for each note in key
                    if(major_comp > 0){
                      this.SCALE_SCORES[n]+=this.TEMPERLEY_MAJOR[this.true_mod(this.log2(note)-n,12)]*bF;
                      SCALE_ACCRETION[n] += this.TEMPERLEY_MAJOR[this.true_mod(this.log2(note)-n,12)]*bF;}
                    if(minor_comp > 0){
                      this.SCALE_SCORES[n+12]+=this.TEMPERLEY_MINOR[this.true_mod(this.log2(note)-n,12)]*bF;
                      SCALE_ACCRETION[n+12] += this.TEMPERLEY_MINOR[this.true_mod(this.log2(note)-n,12)]*bF;}}}
            //growth considerations, measuring the growth of a scale relative to median growth of a chord over RUNNING_AVERAGE_WINDOW chords, here set to 4
              let SCALE_ACCRETION_SORTED = SCALE_ACCRETION.slice(0).sort(function(a, b){return a - b});
              let MEDIAN = (SCALE_ACCRETION_SORTED[11] + SCALE_ACCRETION_SORTED[12])/2;
              for(var i = 0; i < 24; i ++){
                this.RUNNING_AVERAGE_SCALE_GROWTH[i]*=this.WINDOW_FACTOR;
                this.RUNNING_AVERAGE_SCALE_GROWTH[i]+=Math.floor(100*(SCALE_ACCRETION[i] - MEDIAN) / MEDIAN);
                this.RUNNING_AVERAGE_SCALE_GROWTH[i]/=this.RUNNING_AVERAGE_WINDOW;
                this.GROWTH_BONUS[i] = Math.floor(this.GROWTH_FACTOR*(1 + this.RUNNING_AVERAGE_SCALE_GROWTH[i]/100));}
          }
            diatonicity(current_key, m){
              /* determines whether each voice of m is diatonic to the current key.
                 composes r, a count of diatonic voices in the least 4 bits and a
                 non diatonic interval representation in the next 12 bits.
                 i.e. B-A#-A-G#-G-F#-F-E-D#-D-C#-C-0-0-0-0.

                 the current key scale score is reduced for each nondiatonic note present
                 then those diatonic notes are considered leading tones to the roots of new tonics,
                 whose scale scores are increased.

                 pending, is the treatment of the b7 in major or b2 in minor and perhaps
                 all adiatonic flattening in general.

                 from a certain point of view, what we are seeking to do here, is treat all
                 adiatonic intrusions as pointers to modulation. accordingly, we should have a plan
                 for every note (5 in major)

                 returns the last 4 bits of r, a simple count of how many chord notes are diatonic to key
              */


              /* initialize locals. resolution depends on the mode of the current key
                 the prototypes employ the major scale: 1010 1011 0101 and the natural minor scale: 0101 1010 1101
                 the latter may be an issue in that the raised 6th of minor will point to the VIIth degree
                 the raised 7th on the other hand, will simply point back to itself, which is exactly what alteration does.
              */
              let r = 0;
              let tm = this.theoryEncoding(m);
              let prototype = current_key < 12 ? 0xAB5 : 0xAAD;
              let major_chromatic_degrees = current_key < 12 ? [0, 5, 7] : [3, 8, 10];
              let minor_chromatic_degrees = current_key < 12 ? [2, 4, 9] : [0, 5, 7];

              var shiftKey = current_key % 12;
              for(var n = 0; n < 4; n ++){
                let comp = (1<<(getByte(n, m)%12)) & (((prototype << shiftKey) & 0x0fff) + (prototype >>> (12-shiftKey)));
                if(comp > 0)
                  //if comp > 0 then the note is diatonic and the 4lsb of r is augmented
                  r+=1;
                else
                  //if not then the pitch chromatic bit is written high
                  r|= (1 << (getByte(n, m)%12)) << 4;}


              /* if the current chord is nondiatonic, reduce the current key score by 1/Diatonicity Factor for each nondiatonic note
              */

                this.SCALE_SCORES[current_key] -= (4-(r & 0x000f)) * (this.SCALE_SCORES[current_key]/this.DIATONICITY_FACTOR);

              /* scroll through the adiatonic sequence.  when we have a match see what kind of alteration
                 is involved. that is, is it a flattening or a sharpening of the current diatonic scale.
                 that information is returned by tertial spelling.  */
                for(var i = 4; i < 16; i++){
                  if( (r & (1<<i)) > 0 ){

                    switch(this.tertialSpelling(i-4, m)){

                      /* if the dissonance is a sharpening of some note in the scale, it should be resolved
                         upward, acting like the leading tone to a new key.  the quality of that key is decided
                         by the natural quality of the degree to which we're leading, e.g. in C Major,
                         d# leads to E minor, f# leads to G Major */
                      case 1:
                          var i_as_leading_tone_to_index = ((i-4) + 1) % 12;
                            if( major_chromatic_degrees.includes(this.degreeOfCurrentKey(i_as_leading_tone_to_index)) ){
                              this.SCALE_SCORES[i_as_leading_tone_to_index]*= 1 + 1/this.DIATONICITY_FACTOR;
                            }
                            if( minor_chromatic_degrees.includes(this.degreeOfCurrentKey(i_as_leading_tone_to_index)) ){
                              i_as_leading_tone_to_index+=12;
                              this.SCALE_SCORES[i_as_leading_tone_to_index]*= 1 + 1/this.DIATONICITY_FACTOR;
                            }
                        //console.log('that dissonance', i-4, 'is sharp. augmenting', i_as_leading_tone_to_index);
                        break;


                      /* a flattened dissonance is more complex.  in the first place, we will proceed by a survey of
                         the different chord types and see afterwards if we might come up with something more universal

                         new notes from the church modes: bb, c#, d#, f#

                         chords derived from the church modes w/ a flattened member:
                         1) IIIdim => ii or IV
                         2) v => ii or IV
                         3) bVII

                         according to schoenberg (191) all the artifical chords are to be treated like their naturally occuring
                         paragons. so,

                         1) a diminished chord functions like a vii in major or a ii in minor, refering -2 or +1 from root
                         2) ibid for the dom 7 (which has a dimished triad in its upper three voices)
                         3) v refers to the subdominant, F & Dm
                         4) iv (ab) is not given in the church modes and shall be passed over for now
                         5) I7 refers to the subdominant, F & Dm. especially F?
                         6) */
                      case 0:
                          //dimished and dom7s function like a vii in major or a ii in minor
                          switch(this.quality(tm)){

                            case 3: //diminished
                              var major_resolution = (this.root(tm) + 1) % 12;
                              this.adiatonicAugment(major_resolution);
                              this.adiatonicAugment(this.relative(major_resolution));
                              //console.log('diminished. that dissonance',i-4, 'is flat. augmenting', major_resolution, '&', this.relative(major_resolution));
                              break;

                            case 5: //dom7
                              var major_resolution = (this.root(tm) + 5) % 12;
                              this.adiatonicAugment(major_resolution);
                              this.adiatonicAugment(this.parallel(major_resolution));
                              //console.log('dom7. that dissonance',i-4, 'is flat. augmenting',  major_resolution, '&', this.parallel(major_resolution));
                              break;

                            case 1: //v
                              if(this.degreeOfCurrentKey(this.root(tm)) == 7){
                                var major_resolution = (this.root(tm) + 10) % 12;
                                this.adiatonicAugment(major_resolution);
                                this.adiatonicAugment(this.relative(major_resolution));
                                //console.log('minor. that dissonance',i-4, 'is flat. augmenting',  major_resolution, '&', this.relative(major_resolution));}
                              }
                                break;

                            case 9: //hdim7
                              var major_resolution = (this.root(tm) + 1) % 12;
                              this.adiatonicAugment(major_resolution);
                              this.adiatonicAugment(this.relative(major_resolution));
                              //console.log('hdim7. that dissonance',i-4, 'is flat. augmenting',  major_resolution, '&', this.relative(major_resolution));
                              break;

                            case 8:
                              /*the dim7 can lead all over the place, since each of its components offers
                                a resolution +1 Major or -2 minor.  Let's see what happens if we just augement
                                those resolutions that surround adiatonic components...we probably need to add
                                support for the root resolutions regardless of diatonicity
                              */
                              var major_resolution = ((i-4) + 1) % 12;
                              this.adiatonicAugment(major_resolution);
                              this.adiatonicAugment(this.relative(major_resolution));
                              //console.log('dim7. that dissonance',i-4, 'is flat. augmenting',  major_resolution, '&', this.relative(major_resolution));
                              break;
                            }
                        break;


                      case null:
                            //console.log('that dissonance',i-4,'is on the root');
                        break;
}


                }
              }

                return (r & 0xf);

        }
            adiatonicAugment(n){
              this.SCALE_SCORES[n]*= 1 + 1/this.DIATONICITY_FACTOR;
            }
            parallel(n){
              var p = n < 12 ? n + 12 : n - 12;
              return p;
            }
            relative(n){
              var r = n < 12 ? ((n + 9 ) % 12) + 12 : ((n%12) + 3) % 12;
              return r;
            }
            tertialSpelling(dissonantIndex, m){
            /* function subserviant to diatonicity.  the idea is to pass the dissonance pitch cardinal index
               e.g. 5 and then we know this is either a c# or a db. we resolve this discrepancy by consulting the
               MIDI record and attempting to force tertial spelling...

               we could write three functions isFlat() isSharp() isUndecidable()
               or we could return 1 for sharp, 0 for flat, null for undecidable

               the latter is probably preferable, since each check entails the same operations.

               step 0) don't waste time on code 15s.  return null... also head this off earlier in diatonicity
               step 1) reduce the pitches and arrange them in root position
               step 2) identify which one is the dissonance under consideration

            */
                var root = this.root(this.theoryEncoding(m));
                    if(root == 15)
                      return null;

                var m = this.midiRecordToArray(m)
                        .map( e => e%12)
                        .map( e => {var r = e < root ? e+12 : e; return r;})
                        .sort((a, b) => a - b);
                 m = m.filter( (item, index) => m.indexOf(item) === index);

                 //if the dissonance is on the root we need another procedure to evaluate
                    if(m[0] == dissonantIndex || m[0] == dissonantIndex + 12){
                      return null;}
                //otherwise the dissonance is in the upper voices and we can look at 3rds
                    else{
                      for(var i = 1; i < m.length; i ++){
                        if(m[i] == dissonantIndex || m[i] == dissonantIndex + 12){
                          var delta = m[i] - m[i-1] >=4 ? 1 : 0;
                          return delta;
                        }
                      }
               }

            }

            commonality(keysToTest, mR){
               /*determines whether each voice of m is diatonic, both to the current key
                 and the player's home key.  if yes, returns true if no, returns false*/
                let r = 0;
                for(var i = 0; i < keysToTest.length; i ++){
                  var prototype = keysToTest[i] < 12 ? 0xAB5 : 0xAAD;
                  keysToTest[i] %= 12;
                      for(var n = 0; n < 4; n ++){
                        let comp = (1<<(getByte(n, mR)%12)) & (((prototype << keysToTest[i]) & 0x0fff) + (prototype >>> (12-keysToTest[i])));
                        if(comp > 0)
                          r++;
                      }
                }
                return r;
          }
            degreeOfCurrentKey(root, cK = this.currentKey){
              /* root is a pitch cardinal, return the degree relative to currentKey complement */
                return (root + 12 - (cK % 12)) % 12;
            }
            theoryToRoman(tR){
              var romans = ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
              let qualities = ["", "m", "o", "+", "", "", "", "m", "o", "\u00F8", "+", "sus2", "sus4"];
              var r = romans[this.degreeOfCurrentKey(this.root(tR))];
              switch ( this.quality(tR) ) {
                case 0:
                  break;
                case 1:
                  r = r.toLowerCase();
                  break;
                case 2:
                  r = r.toLowerCase();
                  r += 'o';
                  break;
                case 3:
                  r+= '+';
                  break;
                case 4:
                  r+='M7';
                  break;
                case 5:
                  r+='7';
                  break;
                case 6:
                  r+='m7';
                  break;
                case 7:
                  r+='mM7'
                  break;
                case 8:
                  r+='o7';
                  break;
                case 9:
                  r+='\u00F8' + '7';
                  break;
                case 10:
                  r+='+7';
                  break;

              }
              return r;
            }
            resolutions(m, n){
              /* this function will handle specific musicality bonuses that are not directly related to diatonicity
                 m is this chord, n is last chord in theory encoding
                 the function also returns r, an object for scoring.

                 TO DO: MODIFY SCALE SCORES IN PLACE BASED ON THE RETURN. E.G. V7 BOOSTS I AND i */
              var r = null;
              var rm = this.degreeOfCurrentKey(this.root(m))
                , rn = this.degreeOfCurrentKey(this.root(n))
                , qm = this.quality(m)
                , qn = this.quality(n);


              for(var i = 0; i < RESOLUTIONS.length; i ++)
                if( rn == RESOLUTIONS[i].sequence[0] && qn == RESOLUTIONS[i].sequence[1]
                    && rm == RESOLUTIONS[i].sequence[2] && qm == RESOLUTIONS[i].sequence[3] )
                      r = {verbal: RESOLUTIONS[i].verbal, coefficient: RESOLUTIONS[i].coefficient};
                return r;
        }
            preparations(m, n){
              /* same thing but for an opportune preparation spotted...
                 following schoenberg, a dissonance is well prepared when it
                 appears as a consonnance in the preceding chord

                 the functional question then is a) how do we recognize a dissonance in m
                 and b) how do we recognize that same note as a consonance in n?

                 to think merely vertically, a dissonance is relational and occasioned the following intervals FROM THE ROOT:
                 m2, tritone, m6. 7ths are debatable, but I think we can ignore them for our purposes. Obviously those
                 same intervals can occur inverted without issue, e.g.Cm7 4/2.

                 none of the chords in this game contain a m2 in root position. diminished chords contain the tritone.
                 augmented chords contain the m6. their extensions in the realm of 7ths may contain both...

                 so, we should look for and process chord types 2, 3, 8, 9 & 10.
                 on each specific condition we will make sure the previous chord was of a consonant tyep
                 also we must handle secondary dominants seperately.
              */

              var p = null;
              var consonantChordTypes = [0, 1, 4, 6];
              if( consonantChordTypes.includes(this.quality(this.theoryEncoding(n))) ){

                switch(this.quality(m)){

                  case 2:
                  // diminished, the root must be present in n
                      if( this.midiRecordToArray(n).map(this.pitchCardinalReduction).includes(this.root(m)) ){
                        p = { verbal :this.theoryToRoman(this.theoryEncoding(n)) + ' - '  + this.theoryToRoman(m)
                            , coefficient: 1};
                        break;}

                  case 3:
                  //in the case of 3, augmented, the one or two pitches in m must have been approached chromatically
                    var chroma = [4, 6, 11];
                    for(var i = 0; i < chroma.length; i ++)
                      if( this.midiRecordToArray(n).map(this.pitchCardinalReduction).includes((this.root(m) + chroma[i])%12) ){
                        p = { verbal:this.theoryToRoman(this.theoryEncoding(n)) + ' - '  + this.theoryToRoman(m)
                            , coefficient: 1};
                        break;}
                }
            }
              return p;

            }
            leadingKey(){
            //return a key chromatic binary marking the leading key(s)
              let max = 0, hk = 0;
            //determine the max value of scale scores + growth bonus
              for(var i = 0 ; i < 24; i ++){
                if(this.SCALE_SCORES[i] + this.GROWTH_BONUS[i] > max)
                  max = this.SCALE_SCORES[i] + this.GROWTH_BONUS[i];}
            /* if that sore is at an index, return the index as the leading key.
               effectively then, ties just defer to the lower chromatic. maybe grab both
               and flip a coin? */
              for(var i = 0; i < 24; i ++)
                if(this.SCALE_SCORES[i] + this.GROWTH_BONUS[i] == max)
                  hk = i;
              return hk;
            }
            getLesserOrbIndices(){
              /* this function is called after every turn to present the player with nascent tonalities,
                 likely candidates for modulation.

                 we find them by:
                  1) creating an array of objects containing (key index, summed score)
                  2) sorting that array and slicing off everything below the current key
                  3) tiering these candidates wrt standard deviation
              */
              let lesserOrbIndices = [];
                var sums = new Array(24).fill(0);
                for(var i = 0; i < 24; i ++)
                  sums[i] = {index: i, sum: this.SCALE_SCORES[i] + this.GROWTH_BONUS[i]};

                sums.sort( (a,b)=>{
                  return b.sum - a.sum;
                });


                var prospective_tonalities = sums.slice(0, sums.findIndex( e => e.index == this.currentKey));
                var prospective_tonalities_mean = this.mean(prospective_tonalities.map(e=>e.sum));
                var prospective_tonalities_sigma = this.std_deviation(prospective_tonalities.map(e=>e.sum));
                var prospective_tonalities_first_std_dev = prospective_tonalities.filter(e =>
                                            e.sum >= prospective_tonalities_mean
                                            && e.sum < prospective_tonalities_mean + prospective_tonalities_sigma);
                var prospective_tonalities_second_std_dev = prospective_tonalities.filter(e =>
                                            e.sum >= prospective_tonalities_mean + prospective_tonalities_sigma
                                            && e.sum < prospective_tonalities_mean + 2*prospective_tonalities_sigma);
                var prospective_tonalities_third_std_dev = prospective_tonalities.filter(e =>
                                            e.sum >= prospective_tonalities_mean + 2*prospective_tonalities_sigma
                                            );


                return [
                  prospective_tonalities_first_std_dev.map(e=>e.index)
                  ,prospective_tonalities_second_std_dev.map(e=>e.index)
                  ,prospective_tonalities_third_std_dev.map(e=>e.index)
                ];
            }
            std_deviation(data){
              var mean = this.mean(data);
              var accu = 0; data.forEach( e => accu += (e-mean)**2);
              var sigma = (accu / data.length) ** .5;

              return sigma;
            }
            mean(data){
              var mean = 0; data.forEach( e => mean += e); mean /= data.length;
              return mean;

            }
            midiRecordToArray(m){
              var a = [];
              for(var i = 0; i < 4; i ++)
                a.push(getByte(i,m));
              return a;
            }
            pitchCardinalReduction(n){
              return n%12;
            }
        }
