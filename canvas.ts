import * as sound from "./sound.js";
import * as draw from "./draw.js";
import * as graph from "./graph.js";
import * as voice from "./voice.js";
import * as note from "./note.js";

function main() {
    const canvas = document.getElementById("the-canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Element is not a canvas: " + typeof canvas);
    }
    canvas.width = 600;
    canvas.height = 600;

    const audio = document.getElementById("the-audio");
    if (!(audio instanceof HTMLAudioElement)) {
        throw new Error("Element is not a audio: " + typeof audio);
    }

    let ctx = canvas.getContext("2d");
    if (ctx == null) {
        throw new Error("Can't get 2d context");
    }
    let dctx = new draw.Context(ctx, "white", "black");

    canvas.onclick = (ev: MouseEvent) => {
        const br = canvas.getBoundingClientRect();
        const x = ev.clientX - br.left;
        const y = ev.clientY - br.top;

        //        console.log("X: " + x);
        //        console.log("Y: " + y);
        dctx.mouseClick(new draw.Pt(x, y));
    };

    new draw.Rect(new draw.Pt(0, 0), new draw.Pt(1, 1)).draw(dctx);

    const sampleRate = 8000;

    const boundBox = new draw.Rect(new draw.Pt(0, 0), new draw.Pt(1, 1));
    const duration = 0.5;

    const g = new graph.Graph(0, 1.0, -1, +1);

    const layout: {
        id: string;
        freq: number;
        src: string;
        l: number;
        r: number;
        b: number;
        t: number;
    }[] = [
        { id: "A", src: "sine", freq: 440, l: 0.1, r: 0.25, b: 0.6, t: 0.75 },
        { id: "B", src: "sine", freq: 110, l: 0.25, r: 0.45, b: 0.6, t: 0.75 },
        { id: "C", src: "sine", freq: 220, l: 0.1, r: 0.25, b: 0.75, t: 0.9 },
        { id: "D", src: "sine", freq: 330, l: 0.25, r: 0.45, b: 0.75, t: 0.9 },

        { id: "A", src: "square", freq: 440, l: 0.6, r: 0.75, b: 0.6, t: 0.75 },
        { id: "B", src: "square", freq: 110, l: 0.75, r: 0.9, b: 0.6, t: 0.75 },
        { id: "C", src: "square", freq: 220, l: 0.6, r: 0.75, b: 0.75, t: 0.9 },
        { id: "D", src: "square", freq: 330, l: 0.75, r: 0.9, b: 0.75, t: 0.9 },
    ];

    layout.forEach((row) => {
        const sndSrc = row.src == "sine" ? sound.Sine : sound.Square;
        const snd = sound.EvenLinearEnvelope(
            new sndSrc(row.freq, duration),
            [0.1, 1.0, 0.9, 0.9, 0.2, 0.15, 0.1, 0.05, 0]
        );
        // const snd = sound.EvenLinearEnvelope(new sound.Square(row.freq, duration), [0.1, 1.0, 0.9, 0.9, 0.2, 0.15, 0.1, 0.05, 0]);
        const rect = new draw.Rect(
            new draw.Pt(row.l, row.b),
            new draw.Pt(row.r, row.t)
        );
        const ss = new draw.SubScreen(dctx, row.id, rect);

        boundBox.draw(ss);

        ss.onMouse(() => {
            playSound(audio, snd, sampleRate);
        });

        g.plot(ss, (x) => snd.sample(x));
    });

    const notes: {
        idx: number;
        name: string;
        pitch: note.Pitch;
        octave: number;
        blackKey: boolean;
    }[] = [
        { idx: 0, name: "C", pitch: note.Pitch.C, octave: 3, blackKey: false },
        { idx: 0, name: "C#", pitch: note.Pitch.CS, octave: 3, blackKey: true },
        { idx: 1, name: "D", pitch: note.Pitch.D, octave: 3, blackKey: false },
        { idx: 1, name: "D#", pitch: note.Pitch.DS, octave: 3, blackKey: true },
        { idx: 2, name: "E", pitch: note.Pitch.E, octave: 3, blackKey: false },
        { idx: 3, name: "F", pitch: note.Pitch.F, octave: 3, blackKey: false },
        { idx: 3, name: "F#", pitch: note.Pitch.FS, octave: 3, blackKey: true },
        { idx: 4, name: "G", pitch: note.Pitch.G, octave: 3, blackKey: false },
        { idx: 4, name: "G#", pitch: note.Pitch.GS, octave: 3, blackKey: true },
        { idx: 5, name: "A", pitch: note.Pitch.A, octave: 4, blackKey: false },
        { idx: 5, name: "A#", pitch: note.Pitch.AS, octave: 4, blackKey: true },
        { idx: 6, name: "B", pitch: note.Pitch.B, octave: 4, blackKey: false },
        { idx: 7, name: "C", pitch: note.Pitch.C, octave: 4, blackKey: false },
    ];

    const xBase = 0.1;
    const yBase = 0.1;
    const dX = 0.1;
    const dY = 0.2;
    const dur = 0.2;
    const v = new voice.Voice(voice.Type.AcousticGuitar);
    //const v = new voice.TwangVoice();

    notes.forEach((row) => {
        //        console.log("row.name is: " + row.name);
        //        console.log("row.pitch is: " + row.pitch);
        const freq = note.noteFreq(row.pitch, row.octave);
        const snd = v.Sound(freq, dur);
        let x = xBase + row.idx * dX;
        let y = yBase;
        if (row.blackKey) {
            x += dX / 2;
            y += dY;
        }
        const rect = new draw.Rect(
            new draw.Pt(x, y),
            new draw.Pt(x + dX, y + dY)
        );

        //        console.log("idx: " + idx + " freq " + freq);
        const ss = new draw.SubScreen(dctx, row.name, rect);
        boundBox.draw(ss);
        ss.onMouse(() => {
            playSound(audio, snd, sampleRate);
        });
    });

    /*
    let soundSpec: { sound: sound.Sound, loudness: number }[] = [
        { sound: new sound.Sine(220), loudness: 0.5 },
        { sound: new sound.Sine(440), loudness: 0.2 },
        { sound: new sound.Sine(660), loudness: 0.2 },
        { sound: new sound.Sine(880), loudness: 0.1 },
    ]
    let blendedSounds: sound.Sound[] = soundSpec.map((row) => {
        return new sound.Scale(row.sound, row.loudness);
    })
    
     const snd = new sound.Join(blendedSounds);
    */

    //    const snd = sound.Harmonics(220, [0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0.05]);
    /*
    const v = new voice.Voice(voice.Type.AcousticGuitar);
    const snd = v.Sound(110, 0.2);
    const rect = new draw.Rect(new draw.Pt(0.4, 0.4), new draw.Pt(0.6, 0.6));
    const ss = new draw.SubScreen(dctx, "Blend", rect);

    boundBox.draw(ss);
    ss.onMouse(() => { playSound(audio, snd) });
    g.plot(ss, (x) => snd.sample(x));
    */
}

function playSound(
    audio: HTMLAudioElement,
    snd: sound.Sound,
    sampleRate: number
) {
    let conv = new sound.converter(snd, sampleRate);
    const wav = conv.toWAV();
    const dataURL = "data:audio/wav;base64," + window.btoa(wav.asString());
    //    console.log(dataURL);
    audio.src = dataURL;
    audio.play();
}

main();
