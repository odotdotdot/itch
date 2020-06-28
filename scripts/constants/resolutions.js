const RESOLUTIONS = [
    /* the squences are rootDelta, quality of last, quality of this chord
       we'll multiply coefficient by the resolution constant for points
       we have to add some kind of current degree by scale function to
       grab specific intramodal niceities e.g. #ivdim7 down to V to I

       also, the best version of all of these resolutions is when the
       dissonance is treated as a dominant.  we should modify scale scores
       in place to reward the tonic of resolution

       "m", "o", "+", "", "", "", "m", "o", "\u00F8", "+", "sus2", "sus4"  */
 //type 2 diminished
   { verbal: "viio - I"
   , sequence: [11, 2, 0, 0]
   , coefficient: 1.25 }

 , { verbal: "viio - bIII"
   , sequence: [11, 2, 3, 0]
   , coefficient: 1 }

 , { verbal: "viio - #IV"
   , sequence: [11, 2, 6, 0]
   , coefficient: 1.25 }

 //type 3 augmented
 , { verbal: "V+ - I"
   , sequence: [7, 3, 0, 0]
   , coefficient: 1.2 }

 , { verbal: "I+ - IV"
   , sequence: [0, 3, 5, 0]
   , coefficient: 1.2 }

//type 4 major7. no dissonance.

//type 5 dom7
  , { verbal: "V7 - I"
    , sequence: [7, 5, 0, 0]
    , coefficient: 1.5 }

  , { verbal: "V7 - i"
    , sequence: [7, 5, 0, 1]
    , coefficient: 1.5 }

  , { verbal: "V7 - #IV"
    , sequence: [7, 5, 6, 0]
    , coefficient: .7 }

  , { verbal: "V7 - #iv"
    , sequence: [7, 5, 6, 1]
    , coefficient: .7 }

//type 6 minor 7 . no dissonance.

//type 7 minor major 7 . no function.

//type 8 dim7.  these resolutions are conditioned on the bass voice and need to reflect that
  , { verbal: "viio7 - i"
    , sequence: [11, 8, 0, 1]
    , coefficient: 1.5 }

  , { verbal: "viio7 - vi"
    , sequence: [11, 8, 9, 1]
    , coefficient: 1.5 }

//type 9 half dim7
  , { verbal: "vii\u00F87 - I"
    , sequence: [11, 9, 0, 0]
    , coefficient: 1 }

//type 10 aug7
  , { verbal: "V+7 - I"
    , sequence: [7, 10, 0, 0]
    , coefficient: 1 }
]
