DONE - move line + rect drawing over to 0,0 -> 1, 1 coords
    - bottom left origin

DONE - add method to grab new drawcontext as sub-region of parent (but with its own 0,0->1,1 coords)
    DONE - add interface and top-level type
    DONE - implement drawLine for SubScreen
        - consider abstracting the coord transformation?

DONE - have Graph take a drawcontext, which it draws over all of
    - the xlo/xhi are then scaling from (x,y) space to (0,0)->(1,1) space

- have top-level code create a SubScreen for the graph and draw 4 sine tones on 4 graphs

- add Harmonic overlay (with weights)
    - WeightedHarmonic
    - EnvelopeHarmonic (takes a func?)

- EnvelopeAmplitude
    - arb function
    - piecewise linear
    - expo decay

- allow different envelopes for different harmonics
    - how to compose?
