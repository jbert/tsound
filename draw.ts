export class DrawContext {
    ctx: CanvasRenderingContext2D;
    fg: string;
    bg: string;

    constructor(ctx: CanvasRenderingContext2D, fg: string, bg: string) {
        this.ctx = ctx;
        this.fg = fg;
        this.bg = bg;

    }

    xToPixels(x: number): number {
        return x * this.ctx.canvas.clientWidth;
    }

    yToPixels(y: number): number {
        return this.ctx.canvas.clientHeight * (1.0 - y);
    }
}

export class Pt {
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

export class Line {
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

        dctx.ctx.moveTo(dctx.xToPixels(this.from.x), dctx.yToPixels(this.from.y));
        dctx.ctx.lineTo(dctx.xToPixels(this.to.x), dctx.yToPixels(this.to.y));

        dctx.ctx.stroke();
    }

}

export class Rect {
    botLeft: Pt;
    topRight: Pt;

    constructor(bl: Pt, tr: Pt) {
        this.botLeft = bl;
        this.topRight = tr;
    }

    draw(dctx) {
        let bl = this.botLeft;
        let tr = this.topRight;
        let tl = new Pt(bl.x, tr.y);
        let br = new Pt(tr.x, bl.y);
        (new Line(bl, tl)).draw(dctx);
        (new Line(tl, tr)).draw(dctx);
        (new Line(tr, br)).draw(dctx);
        (new Line(br, bl)).draw(dctx);
    }
}

export class Graph {
    xlo: number;
    xhi: number;
    ylo: number;
    yhi: number;
    steps: number;

    constructor(xlo: number, xhi: number, ylo: number, yhi: number, steps: number = 100) {
        this.xlo = xlo;
        this.xhi = xhi;
        this.ylo = ylo;
        this.yhi = yhi;
        this.steps = steps;
    }

    /*
    plot(dxtx, f) {
        let dx = this.xhi - this.xlo;
        let last: Pt;
        let current: Pt;
        for (let i = 0; i < this.steps; i++) {
            let x = this.xlo + ((dx / this.steps) * i);
            let y = f(x);
            if (i > 0) {
                current = Pt(x, y);
                new Line(last, current).draw(dctx);
            }
            last = current;
        }
    }
    */
}