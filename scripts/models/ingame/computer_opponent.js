class ComputerOpponent{
  constructor({homeKey}){

  this.homeKey = homeKey;
  this.major_prototype = 0xAB5;
  this.minor_prototype = 0xAAD;
  this.chord_models = [0x91, 0x89 , 0x49, 0x111, 0x891, 0x491, 0x489, 0x889, 0x249, 0x449, 0x911];
  this.tokenMovementSpeed = .05;
  this.targetSerials = [];
  this.targetSerialsReached = 0;
  this.targetSerialNumbers = [];
  this.CPU_MOVING_TOKENS = false;
  this.seive_constant = 1;
  this.N_MIN = 5;
  this.PATHS = {
    //up 0 major
       "u0M": [0xf00]
    //up 0 minor
      ,"u0m": [0xf01]
    //up 1 major
      ,"u1M": [0xf10, 0xf11]
    //up 1 minor
      ,"u1m": [0xf11, 0xf10]
    //down 1 major
      ,"d1M": [0x010, 0x011]
    //down 1 minor
      ,"d1m": [0x011, 0x010]
    //up 2 major
      ,"u2M": [0xf20, 0xf21, 0xf11, 0xf10]
    //up 2 minor
      ,"u2m": [0xf21, 0xf20, 0xf10, 0xf11]
    //down 2 major
      ,"d2M": [0x020, 0x021, 0x011, 0x010]
    //down 2 minor
      ,"d2m": [0x021, 0x020, 0x010, 0x011]
    //up 3 major
      ,"u3M": [0xf30, 0xf01]
    //up 3 minor
      ,"u3m": [0xf31, 0xf30, 0xf01]
    //down 3 major
      ,"d3M": [0x030, 0x031, 0xf00]
    //down 3 minor
      ,"d3m": [0x031, 0xf00]
    //down 4 major
      ,"d4M": [0x040, 0x041, 0x010]
    //down 4 minor
      ,"d4m": [0x041, 0x010]
    //up 4 major
      ,"u4M": [0xf40, 0xf11, 0xf10]
    //up 4 minor
      ,"u4m": [0xf41, 0xf40, 0xf11, 0xf10]
    //up 5 major
      ,"u5M": [0xf50, 0xf51, 0xf40, 0xf11, 0xf10]
    //up 5 minor
      ,"u5m": [0xf51, 0xf50, 0xf41, 0xf40, 0xf11, 0xf10]
    //down 5 major
      ,"d5M": [0x050, 0x051, 0x040, 0x041, 0x010]
    //down 5 minor
      ,"d5m": [0x051, 0x050, 0x041, 0x010]
    //up 6 major
      ,"u6M": [0xf60, 0xf31, 0xf30, 0xf01]
    //up 6 minor
      ,"u6m": [0xf61, 0x030, 0x031, 0xf00]
  }
}

  init_move_tokens(decision){
    this.targetSerials = [];
    this.targetSerialNumbers = [];
    var taken_hexes = [];
    decision.forEach( (e,index) => {
      for(var i = 0; i < hexes.length; i ++)
        if( e == hexes[i].pitchChromatic && !taken_hexes.includes(hexes[i].serial) ){
          this.targetSerials.push( [hexes[i].center.x, hexes[i].center.y] );
          taken_hexes.push(hexes[i].serial);
          this.targetSerialNumbers.push(hexes[i].serial)
          SERIAL_RECORD = this.generate_serial_from_taken();
          blossom.blossom();
          break;
        }
    });
    this.CPU_MOVING_TOKENS = true;
  }
  generate_serial_from_taken(){
    //returns a 32 bit pitch chromatic record S - A - T - B . e.g. 9 - 1 - 4 - 9
    var serialRecord = 0;
    for(var i = 0; i < 4; i ++)
      if(i < this.targetSerialNumbers.length)
        serialRecord += this.targetSerialNumbers[i] << (i*8);
      else
        serialRecord += voix[i].getSerial() << (i*8);
    return serialRecord;

  }
  move_tokens(){
    for(var i = 0; i < 4; i++){
      var deltaX = (this.targetSerials[i][0] - voix[i].x);
      var deltaY = (this.targetSerials[i][1] - voix[i].y);
          voix[i].x += this.tokenMovementSpeed * deltaX;
          voix[i].y += this.tokenMovementSpeed * deltaY;
          voix[i].hexCheck();

      if(deltaX < 5 && deltaY < 5){
        this.targetSerialsReached|= 1<<i;}

      MIDI_RECORD = composer.midiTransfigure(composer.pitchChromify(SERIAL_RECORD));
      THEORY_RECORD = theoretician.theoryEncoding(MIDI_RECORD);
      cd.setChord(THEORY_RECORD, CURRENT_KEY)

    }

    if(this.targetSerialsReached == 0xf){
      this.CPU_MOVING_TOKENS = false;
      SERIAL_RECORD = serial();
      blossom.blossom();
      MIDI_RECORD = composer.midiTransfigure(composer.pitchChromify(SERIAL_RECORD));
      THEORY_RECORD = theoretician.theoryEncoding(MIDI_RECORD);
      cd.setChord(THEORY_RECORD, CURRENT_KEY)
      turnSignified(opponent);
      this.targetSerialsReached = 0;
    }

  }

  takeTurn(mR, tR){
    /* 1) make_theoretical_decision delivers a list of chords endemic to the current key
       2) require_tie winnows the options to those containing at least 1 repeated note
       3) key circle distance is invoked for strategy
       4) we make a decision
       5) we decide what permutation is most acceptable from a voice leading pov
    */
     var incoming_cardinal_repr = this.midiRecordReduction(mR);
     var incoming_cardinal_list = this.mrrToList(incoming_cardinal_repr);

     var options = this.make_theoretical_decision(mR);
     var tied_options = options.filter( e => this.has_union(this.cardinal_list(e), incoming_cardinal_list) );
     var key_filtered_options = this.make_informed_choice_from_list(tied_options);
     /* now we make our theoretical decision */
     var theoretical_decision = null;
     /* if a lesser orb is an easy target, take the modulation
        otherwise make a random choice from the key filtered options
        right now logic is only built for the third std ie easy_targets[2]
        and we have to make sure that move is advantageous */
     var easy_targets = theoretician.getLesserOrbIndices();
     for(var i = 0; i < easy_targets[2].length; i ++){
        var r = easy_targets[2][i] % 12;
        var q = easy_targets[2][i] > 11 ? 1 : 0;
        var would_be_tonic = this.zip_theory(r,q)
          if(options.includes(would_be_tonic) ){
            console.log('preparing easy target');
            theoretical_decision = would_be_tonic;
            break;}
        }
      /* if there were no matching easy targets */
    if(!theoretical_decision){
     theoretical_decision = this.make_random_choice_from_list(key_filtered_options);}
     console.log('cpu taking turn from ', pr.midiNotes(mR), pr.theoryDecoding(tR));
     console.log('game is currently in ', CURRENT_KEY);
     console.log('options', options.map(e=> pr.theoryDecoding(e)));
     console.log('tied options', tied_options.map(e=> pr.theoryDecoding(e)));
     console.log('key filtered options', key_filtered_options.map(e=> pr.theoryDecoding(e)));
     console.log('cpu chooses ', pr.theoryDecoding(theoretical_decision));

     var outgoing_cardinal_list = this.cardinal_list(theoretical_decision);
    /* rearrange the outgoing cardinal to create sensible voice movement
       first find all possible permutations of the outgoing chord */
      var perms = this.permutations(outgoing_cardinal_list);
      if(perms.length == 6) perms = this.doubler(perms);
      /* discard permutations where octaves lie between alto and soprano */
      perms = perms.filter(e=>e[2]!=e[3]);

      /* then filter that list down based on real considerations
         such as, we want the root to be in the base
         or we want the soprano voice to ascend.
         possibly, we can make these decisions with set theory unions
         also it would be better to compare actual midi records rather than cardinal lists */
      perms.forEach( (e) => {
        var temp_midi_record = composer.midiTransfigure(composer.pitchChromify(this.cardinal_list_to_serial_record(e)));
        var steps_list = this.aggSteps(temp_midi_record, mR);
        e.push(steps_list);
        e.push(steps_list.map(e=> Math.abs(e)));
        //console.log(e, pr.midiNotes(mR), pr.midiNotes(temp_midi_record));
      });

      //most economic
      var economic = perms.filter(e =>
        //upper voices move less than a major third
           e[5][1] < 5
        && e[5][2] < 5
        && e[5][3] < 5
        //bass moves up to a fifth if in root position
        && ((e[5][0] < 8 && e[0] == this.root(theoretical_decision))
           || e[5][0] < 5) );

      var decision = this.make_random_choice_from_list(economic);
      if(!decision) decision = this.make_random_choice_from_list(perms);
      console.log('decision', decision)

    return {  td: theoretical_decision
            , mrr: incoming_cardinal_repr
            , options: options
            , decision: decision};
  }

  cardinal_list_to_serial_record(cardinal_list){
    var taken_hexes = [];
    var serial_list = [];
    cardinal_list.forEach( e => {
      for(var i = 0; i < hexes.length; i ++)
        if( e == hexes[i].pitchChromatic && !taken_hexes.includes(hexes[i].serial) ){
          serial_list.push( hexes[i].serial );
          taken_hexes.push( hexes[i].serial );
          break;
        }
      });
      var serial_record_returned = 0;
      for(var i = serial_list.length - 1; i >=0 ; i --){
        serial_record_returned <<=8;
        serial_record_returned += serial_list[i];
      }
    return serial_record_returned;
    }
  has_union(A, B){
    var result = false;
    for(var i = 0; i < A.length; i ++)
      for(var j = 0; j < B.length; j ++)
        if(A[i] == B[j]){
          result = true;
          break;}
    return result;
  }
  cardinal_list(tR){
    /* now bend the passed midi record to the theoretical decision*/
      var outgoing_pitch_vector = this.chord_models[this.quality(tR)] << this.root(tR);
          outgoing_pitch_vector += outgoing_pitch_vector >>> 12;
          outgoing_pitch_vector &= 0xfff;

    /*  first, create the outgoing_pitch_vector of the theoretical decision */
      var outgoing_cardinal_repr = this.pitchVectorToCardinal(outgoing_pitch_vector);
      var outgoing_cardinal_list = this.cardinalToList(outgoing_cardinal_repr);
    return outgoing_cardinal_list;
  }
  plot_circle_of_fifths(){
    /* return the direction, number and mode of the change from the current key to the home key
       3 nibbles. 0x_ DIRECTION _ FIFTHS _ MODE
       e.g. 0xf30 means 3 fifths up major
            0x021 means 2 fifths down minor
       because up is default
            0xf01 means move up 0 fifths into the minor key
            0xf60 means move up 6 fifths into the major key (0x060 would be identical)*/

    var home_key_on_circle = this.homeKey < 12 ? this.homeKey : (this.homeKey + 3) % 12;
    var current_key_on_circle = CURRENT_KEY < 12? CURRENT_KEY : (CURRENT_KEY + 3) % 12;
    var mode = this.homeKey > 11 ? 1 : 0;

    var fifths_upward, fifths_downward;

    for(var i = 0; i < 12; i ++)
      if( (current_key_on_circle + i*7) % 12 == home_key_on_circle )
        fifths_upward = i;

    fifths_downward = (12 - fifths_upward)*-1;

    var goal = Math.abs(fifths_upward) <= Math.abs(fifths_downward) ? (0xf<<8) + (fifths_upward<<4) + mode
             : (Math.abs(fifths_downward)<<4) + mode;
    return goal;

  }
  goalToString(goal){
    //0xf31
    var dir = (goal>>>8) > 0 ? "u" : "d";
    var num = ((goal& 0xf0)>>>4).toString();
    var mode = (goal & 0xf) == 0 ? "M" : "m";
    return dir+num+mode;
  }
  rint(max){
    return Math.floor((Math.random() * max));
  }
  halfsteps(degree, scale){
    var n = 0;
    var degrees_encountered = 0;

    while(degrees_encountered < degree){
      n++;
      if( (1<<n) & scale )
        degrees_encountered++;

      }

    return n;
  }
  midiRecordReduction(mR){
    var new_mR = 0;
    //returns a midiRecord with the octaves taken out e.g. 0-7-4-0 for machine comparison
    for(var i = 0; i < 4; i++){
      var toAdd = utility.getByte(i,mR)!=255 ? utility.getByte(i,mR) %12 : 255;
      new_mR += toAdd << i*8;
    }

    return new_mR
  }
  circularSubtraction(a,b){
    /* taking a as the former cardinal and b as the proposed ensuant, determine how many halfsteps away b is */
    if (a > b){
        var down = a-b;
        var up = 12 - down;
        return up <= down ? up : down;}
    if (b > a){
        var up = b-a;
        var down = 12 - up;
        return up <= down ? up : down;}
    if (a == b)
        return 0;
  }
  doubler(arr){
    var r = []
    for(var i = 0; i < arr.length; i ++)
      for(var j = 0; j < arr[0].length; j++){
        var k = arr[i].concat(arr[i][j]);
        r.push(k);
      }
    return r;

  }
  pitchVectorToCardinal(pV){
    //returns a 5 nibble cardinal where the 0xf is the siz e.g. Em7 2 - 4 - 7 - 11 - 4
    var r = 0;
    var count = 0;
    for(var i = 0; i  < 12; i ++){
      if( (1<<i) & pV ){
        r<<=4;
        r+=i;
        count++;
      }
    }
    r<<=4;
    r+=count;
    return r;
  }
  permutations(arr){
      if (arr.length <= 2)
        return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
      return arr.reduce(
        (acc, item, i) =>
          acc.concat(
            this.permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])
          ),
        []
      );
    }
  aggSteps(tempMidiRecord, previousMidiRecord){
    var r = [];
    for(var i = 0; i < 4; i ++){
      var lastMidiNoteNumber = utility.getByte(i, previousMidiRecord);
      var nextMidiNoteNumber = utility.getByte(i, tempMidiRecord);
      if(lastMidiNoteNumber !=255)
        var dif = nextMidiNoteNumber - lastMidiNoteNumber;
      else
        var dif = 0;
      r.push(dif);
      //console.log(lastMidiNoteNumber, nextMidiNoteNumber, dif);
    }
    return r;
  }
  cardinalToList(cV){
    var r = [];
    var size = cV & 0xf;
    cV>>=4;
    for(var i = 0; i < size; i ++){
      r.push(cV & 0xf);
      cV>>=4;
    }
    return r;
  }
  mrrToList(mrr){
    var r = [];
    for(var i = 0; i < 4; i ++){
      r.push(mrr & 0xff)
      mrr>>=8;}
    return r;
  }
  reverseHalfSteps(root, cK){
    /* root is a pitch cardinal, return the degree relative to currentKey complement */
      return (root + 12 - (cK % 12)) % 12;
  }
  commonality(keyToTest, cardinal_list){
     /*determines whether each voice of m is diatonic, both to the current key
       and the player's home key.  if yes, returns true if no, returns false*/
      let r = 0;
      var prototype = keyToTest < 12 ? this.major_prototype : this.minor_prototype;
      keyToTest %= 12;
      for(var n = 0; n < cardinal_list.length; n ++){
        let comp = (1 << cardinal_list[n]) & ( ( (prototype << keyToTest) & 0x0fff) + (prototype >>> (12-keyToTest) ) );
        if(comp > 0)
          r++;
      }
      var g = r/cardinal_list.length;
      return g;
}
  make_theoretical_decision(mR, tR){
    switch(this.quality(tR)){

      /* dissonant chords are opportunities to stabilize in a favorable direction
         or push the dissonance even further toward what would be a favorable resolution */

      //dimished chord => resolve up a halfstep for any constituent, e.g. Bdim to C
        case 2:
          var possible_roots = this.mrrToList(this.midiRecordReduction(mR)).map(e => (e+1) % 12 );
          //let's assume it could be both major and minor, even though this must depend on circumstance
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

      //augmented chord => resolve up a P4, e.g. G+ to C
        case 3:
          var possible_roots = [(this.root(tR) + 5) % 12];
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

      //dominant 7 => resolve up a P4 or down a m2, e.g. G7 to C, G7 to F#
        case 5:
          var possible_roots = [ (this.root(tR) + 5) % 12, (this.root(tR) + 11) % 12];
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

      //dim 7 => resolves up a half step from any constituent, e.g. Cdim7 to Db
        case 8:
          var possible_roots = this.mrrToList(this.midiRecordReduction(mR)).map(e => (e+1) % 12 );
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

      //half dim7 => functions as dom, predom or passing dim (here excluded)
        case 9:
          var possible_roots = [ (this.root(tR) + 1) % 12, (this.root(tR) + 8) %12];
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

      //aug7 => resolves up a P4
        case 10:
          var possible_roots = [(this.root(tR) + 5) % 12];
          var possible_qualities = [0,1,4,6];
          var possible_choices = []
              possible_roots.forEach( e => {
                for(var i = 0; i < possible_qualities.length; i ++)
                  possible_choices.push( e + (0<<4) + (possible_qualities[i]<<8) + (e<<12))
              });
          return possible_choices
          break;

        default:
        /* default behavior considers all degrees of the current key. then we figure out how many
           halfsteps away from current key those degrees are, based on whatever scale we pass
           that scale should be dynamically determined. this gives us the a bunch of possible root chromatics
           for each root chromatic we create as many theory records as are natural to the key and scale
           so, in C Major, for example, degree IV is represented by F, F7 and Fmaj7
           obviously, some circumstantial winnowing should occur at this step too.
           all those records are returned as possible choices.

           a consonant chord is an invitation to dissonance, when a leading tone is available
           we should begin by identifying the incoming_degree_of_current_key and make maps from there */

          var possible_choices = [];

          var incoming_cardinal_of_current_key = this.reverseHalfSteps(this.root(tR), CURRENT_KEY);

          var outgoing_degrees_of_currentKey = [0, 1, 2, 3, 4, 5, 6];

          var previous_notes = this.mrrToList(this.midiRecordReduction(mR));
          var previous_quality = this.quality(tR);

      /* we prepare all permissible chords, proceeding by degree of the current key
         the cpu always plays in the current key, at least rootwise
         the cpu is schoenberg and will attempt to follow all of his rules

         exclusions follow hexnibble protocol lsb quality_to_exclude - on_whichever_cardinal_1.
         e.g. 0x27 means when the last turn included a P5 exclude quality 2, dimished, for this degree */
         var scale_prototype = CURRENT_KEY < 12 ? this.major_prototype : this.minor_prototype;
          outgoing_degrees_of_currentKey.forEach( e => {
                var root = (CURRENT_KEY + this.halfsteps(e, scale_prototype)) % 12;
                var quality = 1<<7;
                var exclusions = [];
                  switch(e){
                    /* Degree I look out for C#, G#, Bb + Mm3 */
                          case 0:
                            exclusions = [ 0x01, 0x03, 0x08,
                                           0x11, 0x14, 0x18,
                                           0x21, 0x24, 0x27,
                                           0x31, 0x33, 0x37,
                                           0x41, 0x43, 0x48, 0x4A,
                                           0x51, 0x53, 0x58, 0x5B,
                                           0x61, 0x64, 0x68, 0x6B,
                                           0x81, 0x84, 0x87, 0x8A,
                                           0x91, 0x94, 0x97, 0x9B,
                                           0xA1, 0xA3, 0xA7, 0xAB
                                         ]
                            break;
                    /* Degree ii look out for Mm3 and C# */
                          case 1:
                            exclusions = [ 0x05,
                                           0x16,
                                           0x26, 0x29,
                                           0x35, 0x39,
                                           0x45, 0x40,
                                           0x55, 0x51,
                                           0x66, 0x61,
                                           0x86, 0x89, 0x8A,
                                           0x96, 0x99, 0x91,
                                           0xA5, 0xA9, 0xA1
                                         ]
                            break;
                    /* Degree iii look out for Mm3 + Bb*/
                          case 2:
                            exclusions = [ 0x07, 0x0A,
                                           0x18, 0x1A,
                                           0x28, 0x2B,
                                           0x37, 0x3B,
                                           0x47, 0x4A, 0x42,
                                           0x57, 0x5A,
                                           0x68, 0x6A,
                                           0x88, 0x8B,
                                           0x98, 0x9B,
                                           0xA7, 0xAB
                                         ]
                            break;

                          case 3:
                      /* Degree IV look out for F#, C#, mM3, put Mm7 back in */
                            exclusions = [ 0x06, 0x08, 0x01,
                                           0x16, 0x19, 0x01,
                                           0x26, 0x29, 0x20,
                                           0x36, 0x38, 0x30,
                                           0x46, 0x48, 0x41, 0x42,
                                           0x56, 0x58, 0x51, 0x54,
                                           0x66, 0x69, 0x60, 0x64,
                                           0x86, 0x89, 0x80, 0x84,
                                           0x96, 0x99, 0x90, 0x84,
                                           0xA6, 0xA8, 0xA0, 0x84
                                         ]
                           break;

                            case 4:
                        /* Degree V look out for G#, mM3 */
                              exclusions = [ 0x08, 0x0A,
                                             0x18, 0x1B,
                                             0x28, 0x2B, 0x22,
                                             0x38, 0x3A, 0x32,
                                             0x48, 0x4A, 0x45,
                                             0x58, 0x5A, 0x56,
                                             0x68, 0x6B, 0x66,
                                             0x88, 0x8B, 0x82, 0x86,
                                             0x98, 0x9B, 0x92, 0x96,
                                             0xA8, 0xAA, 0xA2, 0x86
                                            ]
                           break;
                            case 5:
                        /* Degree vi look out for mM3 and Eb */
                              exclusions = [ 0x00,
                                             0x11,
                                             0x21, 0x24,
                                             0x30, 0x34,
                                             0x40, 0x47,
                                             0x50, 0x58,
                                             0x61, 0x68,
                                             0x81, 0x84, 0x88,
                                             0x91, 0x94, 0x98,
                                             0xA0, 0xA4, 0x88
                                            ]
                           break;
                            case 6:
                        /* Degree vii look out for everything */
                              exclusions = [ 0x0A, 0x02, 0x05,
                                             0x1A, 0x15,
                                             0x2A, 0x26,
                                             0x3A, 0x32, 0x35,
                                             0x4A, 0x42, 0x45, 0x49,
                                             0x5A, 0x52, 0x55,
                                             0x6A, 0x65,
                                             0x8A, 0x86,
                                             0x9A, 0x96,
                                             0xAA, 0xA5,
                                           ]
                           break;

                  }

                  for(var i = 0; i < exclusions.length; i ++){
                    var quality_to_exclude = (exclusions[i] & 0xf0) >>> 4;
                    var given_this_cardinal = (CURRENT_KEY + (exclusions[i] & 0xf)) % 12;
                      if( previous_notes.includes(given_this_cardinal) ){
                        quality |= 1 << quality_to_exclude;
                      }
                    }
                  for(var i = 0; i < 10; i ++){
                    if( !(quality & 1) )
                      possible_choices.push( root + (0<<4) + (i<<8) + (root<<12));
                      quality >>>= 1;
                    }
            });
          }
          //exclude the incoming theory record to guard against repetition
          possible_choices = possible_choices.filter( e => e!=( this.root(tR) + (0<<4) + (this.quality(tR)<<8) + (this.root(tR)<<12) ) );

      return possible_choices;
    }
  make_random_choice_from_list(list){
    var a = this.rint(list.length);
    return list[a];
  }
  memory(){
    //returns a copy of turns previous mapped to theory encoding
    return composer.turnsPrevious.map( e => theoretician.theoryEncoding(e) );
  }
  zip_theory(r,q){
    return r + (0<<4) + (q<<8) + (r<<12) ;
  }
  seive(code,arr){
    //filter the expanded array ( theory record, [cadinal list] ) to 100% commonality with the circle of fifths key code 0xdnm
    var n = (code>>8) > 0 ? (code & 0xf0)>>>4 : 12 - ((code & 0xf0)>>>4);
    var mode = code & 0xf
    var key_serial = ((CURRENT_KEY + 7*n) % 12);

    if(mode){
      key_serial +=21;
      key_serial %=12;
      key_serial +=12;
    }

    return arr.filter( e=> this.commonality( key_serial, e[1]) >= this.seive_constant);
  }

  make_informed_choice_from_list(list){
    /* given a list of theoreticlly plausible chords, choose the chord that leads to the home key
       first, add a cardinal representation to each incoming theory record

       it's a little restrictive. feel like commonality should be >= 667, give more freedom */

    var filtered_options = [];
    var expanded_options = list.map( e => [e, this.cardinal_list(e)] );
    var goal = this.goalToString(this.plot_circle_of_fifths());
    var key_filters = this.PATHS[goal];

    for(var i = 0; i < key_filters.length; i ++){
      filtered_options = this.seive(key_filters[i], expanded_options);
      if(filtered_options.length >= this.N_MIN){
        console.log('running on ', (key_filters[i]&0xf00)>>>8, (key_filters[i]&0xf0)>>>4, (key_filters[i]&0xf) )
        break;
      }
    }
    if(filtered_options.length == 0){
      console.log('running on default')
      filtered_options = expanded_options;}

    /* here we make a modal adjustment. e.g. if we're trying to get to d minor take the -1 filter and look for a c# */
    //remove the cardinal stuff from the filtered options
      filtered_options = filtered_options.map(e=> e[0]);
    /* console info */
    return filtered_options;

      }
  //theory record composite get methods
      root(m){return (m&0xf000)>>>12;}
      quality(m){return (m&0x0f00)>>>8;}
      inversion(m){return (m&0x00f0)>>>4;}


}
