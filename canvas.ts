import * as sound from "./sound.js";
import * as draw from "./draw.js";
import * as graph from "./graph.js";
import * as voice from "./voice.js";
import * as note from "./note.js";

function main() {
    const canvas = document.getElementById('the-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Element is not a canvas: " + (typeof canvas));
    }
    canvas.width = 600;
    canvas.height = 600;

    const audio = document.getElementById('the-audio');
    if (!(audio instanceof HTMLAudioElement)) {
        throw new Error("Element is not a audio: " + (typeof audio));
    }

    let ctx = canvas.getContext('2d');
    if (ctx == null) {
        throw new Error("Can't get 2d context");
    }
    let dctx = new draw.Context(ctx, 'white', 'black');

    canvas.onclick = (ev: MouseEvent) => {
        const br = canvas.getBoundingClientRect();
        const x = ev.clientX - br.left;
        const y = ev.clientY - br.top;

        //        console.log("X: " + x);
        //        console.log("Y: " + y);
        dctx.mouseClick(new draw.Pt(x, y));
    }

    new draw.Rect(new draw.Pt(0, 0), new draw.Pt(1, 1)).draw(dctx);

    /*
    const layout: { id: string, freq: number, l: number, r: number, b: number, t: number }[] = [
        { id: "A", freq: 440, l: 0.1, r: 0.4, b: 0.1, t: 0.4 },
        { id: "B", freq: 110, l: 0.6, r: 0.9, b: 0.1, t: 0.4 },
        { id: "C", freq: 220, l: 0.1, r: 0.4, b: 0.6, t: 0.9 },
        { id: "D", freq: 330, l: 0.6, r: 0.9, b: 0.6, t: 0.9 },
    ]
*/

    const sampleRate = 8000;

    const boundBox = new draw.Rect(new draw.Pt(0, 0), new draw.Pt(1, 1));
    const g = new graph.Graph(0, 1.0, -1, +1);

    const duration = 0.5;

    /*
    layout.forEach((row) => {
        const snd = sound.EvenLinearEnvelope(new sound.Sine(row.freq, duration), [0.1, 1.0, 0.9, 0.9, 0.2, 0.15, 0.1, 0.05, 0]);
        const rect = new draw.Rect(new draw.Pt(row.l, row.b), new draw.Pt(row.r, row.t));
        const ss = new draw.SubScreen(dctx, row.id, rect);

        boundBox.draw(ss);

        ss.onMouse(() => { playSound(audio, snd) });

        g.plot(ss, (x) => snd.sample(x));
    });
    */

    const notes: { name: string, pitch: note.Pitch, octave: number }[] = [
        { name: "C", pitch: note.Pitch.C, octave: 3 },
        { name: "D", pitch: note.Pitch.D, octave: 3 },
        { name: "E", pitch: note.Pitch.E, octave: 3 },
        { name: "F", pitch: note.Pitch.F, octave: 3 },
        { name: "G", pitch: note.Pitch.G, octave: 3 },
        { name: "A", pitch: note.Pitch.A, octave: 4 },
        { name: "B", pitch: note.Pitch.B, octave: 4 },
        { name: "C", pitch: note.Pitch.C, octave: 4 },
    ];

    const xBase = 0.1;
    const yBase = 0.1;
    const dX = 0.1;
    const dY = 0.4;
    const dur = 0.2;
    const octave = 3;
    // const v = new voice.Voice(voice.Type.AcousticGuitar);
    const v = new voice.TwangVoice();

    notes.forEach((row, idx) => {
        //        console.log("row.name is: " + row.name);
        //        console.log("row.pitch is: " + row.pitch);
        const freq = note.noteFreq(row.pitch, row.octave ?? octave);
        const snd = v.Sound(freq, dur);
        const x = xBase + (idx * dX);
        const rect = new draw.Rect(new draw.Pt(x, yBase), new draw.Pt(x + dX, yBase + dY));

        //        console.log("idx: " + idx + " freq " + freq);
        const ss = new draw.SubScreen(dctx, row.name, rect);
        boundBox.draw(ss);
        ss.onMouse(() => { playSound(audio, snd) });
    })

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


function playSound(audio: HTMLAudioElement, snd: sound.Sound) {
    let conv = new sound.converter(snd, 8000);
    const wav = conv.toWAV();
    const dataURL = 'data:audio/wav;base64,' + window.btoa(wav.asString());
    //    console.log(dataURL);
    audio.src = dataURL;
    audio.play();
}


main();

