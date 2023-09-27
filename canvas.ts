import * as sound from "./sound.js";
import * as draw from "./draw.js";

function main() {
    let canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);


    let ctx = canvas.getContext('2d');
    let dctx = new draw.DrawContext(ctx, 'white', 'black');

    let a440 = new sound.Sine(1.0, 440);
    console.log("First 3 samples are: " + a440.sample(0.0) + ", " + a440.sample(0.01) + ", " + a440.sample(0.02));

    new draw.Line(new draw.Pt(10, 10), new draw.Pt(500, 40)).draw(dctx);
    new draw.Rect(new draw.Pt(20, 20), 40, 30).draw(dctx);
}

main();

