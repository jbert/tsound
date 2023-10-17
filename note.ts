

// Can subtract to get semitones
export enum Pitch {
    A = 1,
    AS,
    B,
    C,
    CS,
    D,
    DS,
    E,
    F,
    FS,
    G,
    GS,
}

export function noteFreq(pitch: Pitch, octave: number): number {
    const A4 = 440;
    const semiTonesUp = pitch - Pitch.A;
    //console.log("semis up: " + semiTonesUp);
    const oneSemiFreqMult = 1.0594631; // Twelth root of two
    const semisFactor = Math.pow(oneSemiFreqMult, semiTonesUp);
    //console.log("semisFactor: " + semisFactor);
    const pitchInFourthOctave = A4 * semisFactor;
    //console.log("A4 " + A4 + " pitchIn4: " + pitchInFourthOctave);

    const octavesUp = octave - 4;
    //console.log("octavesUp: " + octavesUp);
    const pitchInOctave = pitchInFourthOctave * Math.pow(2, octavesUp);
    return pitchInOctave;
}