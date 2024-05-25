export interface Sound {
    duration(): number;
    sample(t: number): number;
}

function sum(ns: number[]): number {
    return ns.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
}

export function Harmonics(baseFreq: number, argWeights: number[], duration: number = 1.0): Sound {
    const total = sum(argWeights);
    let sounds: Sound[] = [];

    // Normalise so total weight = 1
    let weights = argWeights.map((w) => w / total);
    let mult = 1;
    weights.forEach((w) => {
        const sine = new Sine(baseFreq * mult, duration);
        const scaledSine = new Scale(sine, w);
        sounds.push(scaledSine);
        mult++;
    });
    return new Join(sounds);
}


export class Scale {
    sound: Sound;
    factor: number;

    constructor(sound: Sound, factor: number) {
        this.sound = sound;
        this.factor = factor;
    }
    duration(): number {
        return this.sound.duration();
    }
    sample(t: number): number {
        return this.factor * this.sound.sample(t);
    }
}


export class Square {
    dur: number;
    freq: number;

    constructor(freq: number, dur: number = 1) {
        this.dur = dur;
        this.freq = freq;
    }

    duration(): number {
        return this.dur;
    }

    sample(t: number): number {
        let theta = t * 2 * Math.PI;
        return Math.sign(Math.sin(theta * this.freq)); // There are probably more efficient ways of doing this :-)
    }
}

export class Sine {
    dur: number;
    freq: number;

    constructor(freq: number, dur: number = 1) {
        this.dur = dur;
        this.freq = freq;
    }

    duration(): number {
        return this.dur;
    }

    sample(t: number): number {
        let theta = t * 2 * Math.PI;
        return Math.sin(theta * this.freq);
    }
}

export class Join {
    sounds: Sound[]
    dur: number

    constructor(sounds: Sound[]) {
        this.sounds = sounds;
        this.dur = Math.min(...sounds.map((snd) => snd.duration()));
    }
    duration(): number {
        return this.dur
    }
    sample(t: number): number {
        return sum(this.sounds.map((s) => s.sample(t)));
    }
}

export class Envelope {
    sound: Sound;
    env: (number) => number;

    constructor(sound: Sound, env: (e) => number) {
        this.sound = sound;
        this.env = env;
    }
    duration(): number {
        return this.sound.duration()
    }
    sample(t: number): number {
        return this.env(t) * this.sound.sample(t);
    }
}

export function EvenLinearEnvelope(sound: Sound, pts: number[]): Envelope {
    // pts[0] is starting env, pts[-1] is end env, so we have (length-1) regions
    const tStep = sound.duration() / (pts.length - 1);
    let linearEnv = function (t: number) {
        const index = Math.floor(t / tStep);
        // Linear between pts[index] and pts[index+1]
        const dt = (t / tStep) - index;
        const a = pts[index];
        const b = pts[index + 1]
        // console.log("t " + t + " tstep " + tStep + " dt " + dt);
        return a + dt * (b - a);
    }
    return new Envelope(sound, linearEnv);
}

export function EnvelopeExp(sound: Sound, decreaseTo = 0.1): Envelope {
    let expEnv = function (t: number) {
        const k = Math.log(decreaseTo) / sound.duration()
        // console.log("k is: " + k);
        // console.log("Math.log(0.1) is: " + Math.log(decreaseTo));
        // Decay from 1 to 0.1 over tenthAt seconds
        return Math.exp(t * k);
    }
    return new Envelope(sound, expEnv);
}

export function to32BitLE(n: number): string {
    let s = "";
    s += String.fromCharCode((n >> 0) & 0xff);
    s += String.fromCharCode((n >> 8) & 0xff);
    s += String.fromCharCode((n >> 16) & 0xff);
    s += String.fromCharCode((n >> 24) & 0xff);
    return s;
}

export function to16BitLE(n: number): string {
    let s = "";
    s += String.fromCharCode((n >> 0) & 0xff);
    s += String.fromCharCode((n >> 8) & 0xff);
    return s;
}



export class wav {
    numChannels: number;
    format: number;
    bitsPerSample: number;
    sampleRate: number;

    samples: Int16Array;

    // https://isip.piconepress.com/projects/speech/software/tutorials/production/fundamentals/v1.0/section_02/s02_01_p05.html
    asString(): string {
        const headerSize = 4 + 4;
        const wavSectionSize = 2 + 2 + 4 + 4 + 2 + 2;
        const dataHeaderSize = 4 + 4;

        // 4-byte fileSize excludes itself and 4 bytes RIFF prefix
        const dataSize = this.bitsPerSample * this.samples.length / 8;
        const fileSize = headerSize + wavSectionSize + dataHeaderSize + dataSize;

        // RIFF header
        let str = "RIFF";
        str += to32BitLE(fileSize);

        // WAVE header
        const PCM_FORMAT = 0x01;
        str += "WAVE";
        str += "fmt ";
        str += to32BitLE(wavSectionSize);
        str += to16BitLE(PCM_FORMAT);
        str += to16BitLE(this.numChannels);
        str += to32BitLE(this.sampleRate);
        const bytesPerSec = this.bitsPerSample * this.sampleRate / 8;
        str += to32BitLE(bytesPerSec);
        const blockAlignment = 0x02;
        str += to16BitLE(blockAlignment);
        str += to16BitLE(this.bitsPerSample);

        // Data header
        str += "data";
        str += to32BitLE(dataSize);

        this.samples.forEach((sample) => {
            str += to16BitLE(sample);
        })

        return str;
    }


    constructor(numChannels: number, sampleRate: number, bitsPerSample: number, samples: Int16Array) {
        if (numChannels != 1) {
            throw new Error("Only one channel supported");
        }
        if (bitsPerSample != 16) {
            throw new Error("Only 16bit sample supported");
        }
        if (sampleRate != 8000) {
            // TODO - which are legal/common rates?
            throw new Error("Only 8k sample rate supported");
        }

        this.numChannels = numChannels;
        this.sampleRate = sampleRate;
        this.samples = samples;
        this.bitsPerSample = bitsPerSample;
    }
}

export class converter {
    snd: Sound;
    sampleRate: number;

    constructor(snd: Sound, sampleRate: number) {
        this.snd = snd;
        this.sampleRate = sampleRate;
    }

    toSamplesS16LE(): Int16Array {
        const numSamples = this.snd.duration() * this.sampleRate;
        let samples = new Int16Array(numSamples);

        let t = 0;
        let dt = 1 / this.sampleRate;
        for (let i = 0; i < numSamples; i++) {
            samples[i] = this.snd.sample(t) * 32767;
            t += dt;
        }
        return samples;
    }

    toWAV(): wav {
        return new wav(1, this.sampleRate, 16, this.toSamplesS16LE());
    }
}