export interface DrawScreen {
    drawLine(line: Line);
}

export class Context {
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

    drawLine(line: Line) {
        this.ctx.beginPath();

        this.ctx.strokeStyle = this.fg;
        this.ctx.lineWidth = 1;

        this.ctx.moveTo(this.xToPixels(line.from.x), this.yToPixels(line.from.y));
        this.ctx.lineTo(this.xToPixels(line.to.x), this.yToPixels(line.to.y));

        this.ctx.stroke();
    }
}

export class SubScreen {
    parent: DrawScreen
    rect: Rect

    constructor(parent: DrawScreen, rect: Rect) {
        if (!rect.withinUnitSquare()) {
            throw new Error("Rect not within unit square: " + rect.string())
        }
        this.parent = parent;
        this.rect = rect;
    }

    drawLine(line: Line) {
        this.parent.drawLine(line.scaleUnitTo(this.rect));
    }
}

export class Pt {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    string(): string {
        return "(" + this.x + "," + this.y + ")"
    }

    withinUnit(): boolean {
        return 0 <= this.x && this.x <= 1 && 0 <= this.y && this.y <= 1;
    }

    scaleUnitTo(rect: Rect): Pt {
        let dx = rect.topRight.x - rect.botLeft.x;
        let x = rect.botLeft.x + (dx * this.x);
        let dy = rect.topRight.y - rect.botLeft.y;
        let y = rect.botLeft.y + (dy * this.y);
        return new Pt(x, y);
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

    draw(ds: DrawScreen) {
        ds.drawLine(this);
    }

    scaleUnitTo(rect: Rect): Line {
        let from = this.from.scaleUnitTo(rect);
        let to = this.to.scaleUnitTo(rect);
        return new Line(from, to);
    }
}

export class Rect {
    botLeft: Pt;
    topRight: Pt;

    constructor(bl: Pt, tr: Pt) {
        this.botLeft = bl;
        this.topRight = tr;
    }

    draw(ds: DrawScreen) {
        let bl = this.botLeft;
        let tr = this.topRight;
        let tl = new Pt(bl.x, tr.y);
        let br = new Pt(tr.x, bl.y);
        (new Line(bl, tl)).draw(ds);
        (new Line(tl, tr)).draw(ds);
        (new Line(tr, br)).draw(ds);
        (new Line(br, bl)).draw(ds);
    }

    string(): string {
        return "[" + this.botLeft + "," + this.topRight + "]"
    }


    withinUnitSquare(): boolean {
        return this.botLeft.withinUnit() && this.topRight.withinUnit();
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