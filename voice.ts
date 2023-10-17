import * as sound from "./sound.js";

const birdsFSharp = `187	0.184077200146896
366	0.0384591782045353
549	0.0184077200146896
742	0.0114815362149688
925	0.0226464430759306
1109	0.0221309470960564
1297	0.00562341325190349
1480	0.00160324539069004
1671	0.00346736850452532
1858	0.0102329299228075
2044	0.00309029543251359
2218	0.00134896288259165
2417	0.00478630092322639
2605	0.00248313310529557
2798	0.00338844156139203
2970	0.00058884365535559
3171	0.000933254300796991
3369	0.0031988951096914
3557	0.00059566214352901
3709	0.00109647819614319
3945	0.00158489319246111
4144	0.00138038426460288
4327	0.000724435960074991
4454	0.000446683592150963
4724	0.000785235634610072
4932	0.000278612116862977
5199	0.000724435960074991
5398	0.000231739464996848
6327	0.000653130552647472
10792	0.000216271852372702`;

let acousticGuitarTones: number[] = [
    0.184077200146896,
    0.0384591782045353,
    0.0184077200146896,
    0.0114815362149688,
    0.0226464430759306,
    0.0221309470960564,
    0.00562341325190349,
    0.00160324539069004,
    0.00346736850452532,
    0.0102329299228075,
    0.00309029543251359,
    0.00134896288259165,
    0.00478630092322639,
    0.00248313310529557,
    0.00338844156139203,
    0.00058884365535559,
    0.000933254300796991,
    0.0031988951096914,
    0.00059566214352901,
    0.00109647819614319,
    0.00158489319246111,
    0.00138038426460288,
    0.000724435960074991,
    0.000446683592150963,
    0.000785235634610072,   // 25
    0.000278612116862977,   // 26
    0,
    0.000724435960074991,   // 28
    0.000231739464996848,   // 29
    0,
    0,
    0,
    0,
    0.000653130552647472,   // 34
];
acousticGuitarTones[58] = 0.000216271852372702;

export enum Type {
    AcousticGuitar = 1,
}
let typeTone = {};
typeTone[Type.AcousticGuitar] = acousticGuitarTones


export class Voice {
    tones: number[]

    constructor(type: Type) {
        this.tones = typeTone[type];
        if (!this.tones) {
            throw new Error("Can't find tones for: " + type);
        }
    }

    Sound(fundamental: number, dur: number): sound.Sound {
        console.log("JB this is: " + this);
        const harmonics = this.tones.map((ampl: number, overtone: number): sound.Sound => {
            const freq = fundamental * (overtone + 1);
            console.log("freq " + freq + " ampl " + ampl);
            const snd = new sound.Scale(new sound.Sine(freq, dur), ampl);
            return sound.EvenLinearEnvelope(snd, [0.1, 1.0, 1.0, 0.7, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]);

        });
        return new sound.Join(harmonics);
    }
}

export function newVoice(): sound.Sound {
    //    const freq = 440;
    //    const snd = sound.EvenLinearEnvelope(new sound.Sine(freq), [0.1, 1.0, 0.9, 0.9, 0.2, 0.15, 0.1, 0.05, 0]);
    const rows = birdsFSharp.split("\n");
    const dur = 0.25;

    const harmonics = rows.map(row => {
        const bits = row.split("\t");
        const freq = parseFloat(bits[0]);
        const ampl = parseFloat(bits[1]);
        console.log("freq " + freq + " ampl " + ampl);
        const snd = new sound.Scale(new sound.Sine(freq, dur), ampl);
        return sound.EvenLinearEnvelope(snd, [0.1, 1.0, 1.0, 0.7, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]);
        //return new sound.Sine(freq, dur);
    });
    return new sound.Join(harmonics);
    //    return harmonics[0];
}