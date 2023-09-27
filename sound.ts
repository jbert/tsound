export interface Sound {
    duration(): number;
    sample(t: number): number;
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
