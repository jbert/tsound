NEXT
----

- new page, using web audio
    - DONE play a pure tone
    - DONE create an interface which is a sound src, sink or connector
        - sine 440
        - play in browser
        - gain
    - expose parameters in UI
        - update on change
        - htmx!? (no?)

- DONE remove audio element
    - DONE init code:
        - DONE finds buttons
        - DONE sets up nodes
        - DONE attaches handlers
    - DONE hook 'start' and 'stop' code into button on-click
        https://nextjournal.com/avidrucker/web-audio-api-first-practice
        - DONE maybe we can't do setup outside of button click?

- hook up multiple inputs
    - feed to a gain node to mix
    - add final gain node before destination to bring to [-1,+1] range

- display audio chain
    - start with simple chain

- then add some buttons (or editable controls with onchange) to modify the audio chain
    - change parameters (e.g. gain)
    - and some 'add node' buttons (add additional sine gen at freq X)
    - show current nodes in a UI
    - add 'X' to remove them
    - have the "show node" also provide editable params
        - with onchange

- add 'grouping' to node list
    - select a bunch
    - 'create group' takes a name

- how to represent topology in UI?
    - select A and B and 'connect' / 'disconnect'?

- custom nodes
    - howto: https://github.com/g200kg/webaudio-customnode
    - also "worklet"
    - also look for libraries of existing

- streaming audio
    - audiocontext + audionode

- build a UI element for each 'Sound'
    - "level" for everything
    - duration, frequency
    - envelope
    - harmonic powers
    - everything

- build a Sound chooser

- build an additive timeline ("channel")

- support multiple, synchronised channels
    - use case of gating a sound on the levels in another channel

- add tempo, bpm and time signature
    - add a concept of 'bar + beats'
    - swing/offset

-------

- NO monadic sound?
    - Provide composabilit

- DONE draw white and black notes?
    - keyboard shortcuts
    - numbers?
    - letter names?
    - 

- add HTML UI for choosing voice
    - and altering parameters
    - single graph (choose sine or square, choose freq and/or note+octave)
    - try using react!?

- how to combine chords here?
    - pitch -> multiple pitches?
    - voice -> voice?

- api cleanup:
    - should 'voice' take a note or a freq?
    - should we have an easier way to get freq for a note?
    - sort out note/pitch

- abbreviate notes...
    - rename to pitch?
        - pitch.C()
        - pitch.C(4)
        - allows "note" to take a key:
            - k = key.Minor(C) // default octave? no octave?
            - maybe just have default arg for 'key' in 'note.C()'?
            - can we have kwargs in typescript?
    - note.C(4);
    - note.C()  // Default octave
    - can we have # in identifiers?
        - note.C#
        - note.CS
        - note.CF
        - note.C♭

    - chord.Major(note.C)
    - chord.Major3(note.C)
    - chord.Minor(note.C)

- chords:
    - new chord.Major(note.note(note.C,4))


- define 'note.Note'
    - have 

- define scale, key and mode
    - every key is a scale
    - a scale with N notes has N modes
    - lydian, mixo etc are modes of the major key (which is a scale)

- try to replicate guitar timbre
    - Load harmonic spectra from CSV
    - playback
    - convert to relative harmonic power
    - try to play different notes

- examine harmonic spectral decay
    - ??? try using sox over small increments of time?
    - can sox output CSV spectrum?
    - drive an FFT from code to analyse and save as "Relative Harmonic Power"

SOON
----

- add SplineEnvelope?

- allow different envelopes for different harmonics
    - how to compose?

- add Harmonic overlay (with weights)
    DONE - WeightedHarmonic
    DONE - EnvelopeHarmonic (takes a func per harmonic)

- Look up some timbres for common instruments
    - try and replicate some from first principles

- add Gates
    - takes one sound as the control plane
    - envelopes the other sound using the gate

DONE
----

DONE - move line + rect drawing over to 0,0 -> 1, 1 coords
    - bottom left origin

DONE - add method to grab new drawcontext as sub-region of parent (but with its own 0,0->1,1 coords)
    DONE - add interface and top-level type
    DONE - implement drawLine for SubScreen
        - consider abstracting the coord transformation?

DONE - have Graph take a drawcontext, which it draws over all of
    DONE - the xlo/xhi are then scaling from (x,y) space to (0,0)->(1,1) space

DONE - have top-level code create a SubScreen for the graph and draw 4 sine tones on 4 graphs

DONE - register click in canvas and forward to subscreen
    DONE - register click in drawscreen coords
    DONE - have parent track child screens
    DONE - forward click to any overlapping subscreens (recursively)
    DONE - add id to subscreen
    DONE - console log the subscreen id

DONE - play sound from JS
    - need to play wav....render it serverside?
    - could have PUT /foo.wav <wavdata> and then use the URL?
    - data:// url?

NO - create sound sink abstraction

NO - play sines to sound sink

DONE - add scale

DONE - add join

DONE - add Envelope (takes a func)

DONE - add PiecewiseEnvelope (create envelope func)

DONE - ExpEnvelope
    ln(0.1) = -2.30258509299
    0.1 = exp(k * x). x = duration (i.e. d), the kd = ln(0.1), k = ln(0.1)/d

DONE - add an attack

DONE - EnvelopeAmplitude
    - arb function
    - piecewise linear
    - expo decay

