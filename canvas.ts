import { Sound, Sine } from "./sound.js";

function main() {
    let canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);


    let ctx = canvas.getContext('2d');
    let dctx = new DrawContext(ctx, 'white', 'black');

    let a440 = new Sine(1.0, 440);
    console.log("First 3 samples are: " + a440.sample(0.0) + ", " + a440.sample(0.01) + ", " + a440.sample(0.02));

    new Line(new Pt(10, 10), new Pt(500, 40)).draw(dctx);
    new Rect(new Pt(20, 20), 40, 30).draw(dctx);
}

class DrawContext {
    ctx: CanvasRenderingContext2D;
    fg: string;
    bg: string;

    constructor(ctx: CanvasRenderingContext2D, fg: string, bg: string) {
        this.ctx = ctx;
        this.fg = fg;
        this.bg = bg;
    }
}

class Pt {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(b: Pt): Pt {
        return new Pt(this.x + b.x, this.y + b.y);
    };
}

class Line {
    from: Pt;
    to: Pt;

    constructor(from: Pt, to: Pt) {
        this.from = from;
        this.to = to;
    }

    draw(dctx) {
        dctx.ctx.beginPath();

        dctx.ctx.strokeStyle = dctx.fg;
        dctx.ctx.lineWidth = 1;

        dctx.ctx.moveTo(this.from.x, this.from.y);
        dctx.ctx.lineTo(this.to.x, this.to.y);

        dctx.ctx.stroke();
    }
}

class Rect {
    botLeft: Pt;
    width: number;
    height: number;

    constructor(bl: Pt, w: number, h: number) {
        this.botLeft = bl;
        this.width = w;
        this.height = h;
    }

    draw(dctx) {
        let bl = this.botLeft;
        let tl = bl.add(new Pt(0, this.height));
        let br = bl.add(new Pt(this.width, 0));
        let tr = bl.add(new Pt(this.width, this.height));
        (new Line(bl, tl)).draw(dctx);
        (new Line(tl, tr)).draw(dctx);
        (new Line(tr, br)).draw(dctx);
        (new Line(br, bl)).draw(dctx);
    }
}

main();

