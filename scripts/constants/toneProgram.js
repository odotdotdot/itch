const PROGRAM =
[
  { // 0 : KALIMBA
  "harmonicity":8,
  "modulationIndex": 2,
  "oscillator" : {
      "type": "sine"
  },
  "envelope": {
      "attack": 0.001,
      "decay": 2,
      "sustain": 0.1,
      "release": 2
  },
  "modulation" : {
      "type" : "square"
  },
  "modulationEnvelope" : {
      "attack": 0.002,
      "decay": 0.2,
      "sustain": 0,
      "release": 0.2
  }
}

, { // 1: RECALL
  "oscillator":{
    "type":"triangle"
  },
  "envelope": {
    "attack": 1.618,
    "decay": .382,
    "sustain":.5,
    "release": 10,
    "attackCurve": "exponential",
    "decayCurve": "linear"
  },
  "harmonicity": .5,
  "modulationIndex":10,
  "modulation" :{
    "type": "sawtooth"
  },
  "modulationEnvelope": {
    "attack" : 1.618 ,
    "decay" : .382 ,
    "sustain" : 1 ,
    "release" : 10
  },
  "volume" : -10
}

, { // 2: LUSH PAD
  "oscillator":{
    "type":"triangle"
  },
  "envelope": {
    "attack": 1.618,
    "decay": .382,
    "sustain":.5,
    "release": 10,
    "attackCurve": "exponential",
    "decayCurve": "linear"
  },
  "harmonicity": .5,
  "modulationIndex":10,
  "modulation" :{
    "type": "sawtooth"
  },
  "modulationEnvelope": {
    "attack" : 1.618 ,
    "decay" : .382 ,
    "sustain" : 1 ,
    "release" : 10
  }
}

, { // 3: CELLO
      "harmonicity": 3,
      "modulationIndex": 14,
      "oscillator": {
          "type": "triangle"
      },
      "envelope": {
          "attack": 0.2,
          "decay": 0.3,
          "sustain": 0.1,
          "release": 1.2
      },
      "modulation" : {
          "type": "square"
      },
      "modulationEnvelope" : {
          "attack": 0.01,
          "decay": 0.5,
          "sustain": 0.2,
          "release": 0.1
      }
  }

, { // 4: BASS
    "oscillator": {
        "type": "fmsquare5",

		"modulationType" : "triangle",
      	"modulationIndex" : 2,
      	"harmonicity" : 0.501
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.4,
        "release": 2
    },
    "modulationEnvelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.8,
        "release": 1.5,
    }
}
]
