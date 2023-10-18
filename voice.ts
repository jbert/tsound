import * as sound from "./sound.js";

export interface Voice {
    Sound(fundamental: number, duration: number): sound.Sound;
}

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
        this.tones = this.tones.map((n) => (n == undefined) ? 0 : n);
    }

    Sound(fundamental: number, dur: number): sound.Sound {
        const harmonics = this.tones.map((ampl: number, overtone: number): sound.Sound => {
            const freq = fundamental * (overtone + 1);
            const snd = new sound.Scale(new sound.Sine(freq, dur), ampl);
            //            console.log("freq " + freq + " ampl " + ampl + " dur " + snd.duration() + " snd " + snd);
            return sound.EvenLinearEnvelope(snd, [0.1, 1.0, 1.0, 0.7, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]);
        });

        const voice = new sound.Join(harmonics.filter((s) => s != undefined));
        return voice
    }
}

function upTo(n: number): number[] {
    let nums = []
    for (let i = 1; i <= n; i++) {
        nums.push(i);
    }
    return nums;
}

export class TwangVoice {
    harmonicPower: number
    decayPower: number
    decreaseToBase: number

    constructor(harmonicPower: number = 2, decayPower: number = 2, decreaseToBase: number = 0.05) {
        this.harmonicPower = harmonicPower;
        this.decayPower = decayPower;
        this.decreaseToBase = decreaseToBase;
    }

    Sound(fundamental: number, dur: number): sound.Sound {
        const numOvertones = 20;
        let nums = upTo(numOvertones);
        const baseAmpl = 0.5;

        const harmonics = nums.map((idx: number): sound.Sound => {
            const freq = fundamental * idx;
            const ampl = baseAmpl / Math.pow(idx, this.harmonicPower);
            const snd = new sound.Scale(new sound.Sine(freq, dur), ampl);
            //            console.log("freq " + freq + " ampl " + ampl + " dur " + snd.duration() + " snd " + snd);
            //            return sound.EvenLinearEnvelope(snd, [0.1, 1.0, 1.0, 0.7, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]);

            const decreaseTo = this.decreaseToBase / Math.pow(idx, this.decayPower);
            return sound.EnvelopeExp(snd, decreaseTo);
        });

        const voice = new sound.Join(harmonics.filter((s) => s != undefined));
        return voice
    }

}
