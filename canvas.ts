import * as sound from "./sound.js";
import * as draw from "./draw.js";
import * as graph from "./graph.js";

function main() {
    const canvas = document.getElementById('the-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Element is not a canvas: " + (typeof canvas));
    }
    canvas.width = 600;
    canvas.height = 600;

    let ctx = canvas.getContext('2d');
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

    const layout: { id: string, freq: number, l: number, r: number, b: number, t: number }[] = [
        { id: "A", freq: 40, l: 0.1, r: 0.4, b: 0.1, t: 0.4 },
        { id: "B", freq: 10, l: 0.6, r: 0.9, b: 0.1, t: 0.4 },
        { id: "C", freq: 20, l: 0.1, r: 0.4, b: 0.6, t: 0.9 },
        { id: "D", freq: 30, l: 0.6, r: 0.9, b: 0.6, t: 0.9 },
    ]


    layout.forEach((row) => {
        const snd = new sound.Sine(row.freq);
        const rect = new draw.Rect(new draw.Pt(row.l, row.b), new draw.Pt(row.r, row.t));
        const ss = new draw.SubScreen(dctx, row.id, rect);
        const box = new draw.Rect(new draw.Pt(0, 0), new draw.Pt(1, 1));
        box.draw(ss);
        const g = new graph.Graph(0, 0.1, -1, +1);
        g.plot(ss, (x) => snd.sample(x));
    });
}

main();

