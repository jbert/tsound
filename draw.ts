export interface DrawScreen {
    rect: Rect;

    drawLine(line: Line);
    mouseClick(p: Pt);
    registerChild(child: DrawScreen);
}

export class Context {
    ctx: CanvasRenderingContext2D;
    fg: string;
    bg: string;
    width: number;
    height: number;
    children: DrawScreen[];
    rect: Rect;

    constructor(ctx: CanvasRenderingContext2D, fg: string, bg: string) {
        this.ctx = ctx;
        this.fg = fg;
        this.bg = bg;

        this.width = this.ctx.canvas.clientWidth;
        this.height = this.ctx.canvas.clientHeight;
        this.children = [];
        this.rect = RectUnit;
    }

    registerChild(child: DrawScreen) {
        this.children.push(child);
    }

    mouseClick(screenP: Pt) {
        const x = screenP.x / this.width;
        const y = 1 - screenP.y / this.height;
        const mousePt = new Pt(x, y);
        this.children.forEach((child) => {
            if (child.rect.contains(mousePt)) {
                child.mouseClick(mousePt);
            }
        });
    }

    xToPixels(x: number): number {
        return x * this.width;
    }

    yToPixels(y: number): number {
        return this.height * (1.0 - y);
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
    id: string;
    parent: DrawScreen
    rect: Rect
    children: DrawScreen[]

    constructor(parent: DrawScreen, id: string, rect: Rect) {
        if (!rect.withinUnitSquare()) {
            throw new Error("Rect not within unit square: " + rect.string())
        }
        this.id = id;
        this.parent = parent;
        this.rect = rect;
        this.children = [];
        parent.registerChild(this);
    }

    drawLine(line: Line) {
        if (line.withinUnitSquare()) {
            this.parent.drawLine(line.scaleUnitTo(this.rect));
        }
    }

    mouseClick(parentPt: Pt) {
        console.log(this.id + ": SS click:" + parentPt.string());
        const x = (parentPt.x - this.rect.left()) / (this.rect.right() - this.rect.left());
        const y = (parentPt.y - this.rect.bottom()) / (this.rect.top() - this.rect.bottom());

        const mousePt = new Pt(x, y);
        this.children.forEach((child) => {
            if (child.rect.contains(mousePt)) {
                child.mouseClick(mousePt);
            }
        });
    }

    registerChild(child: DrawScreen) {
        this.children.push(child);
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
        if (from == null) {
            throw new Error("from is null");
        }
        if (to == null) {
            throw new Error("to is null");
        }
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

    withinUnitSquare(): boolean {
        return this.from.withinUnit() && this.to.withinUnit();
    }

    string(): string {
        return "{" + this.from.string() + "," + this.to.string() + "}"
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
        let tl = this.topLeft();
        let br = this.botRight();
        (new Line(bl, tl)).draw(ds);
        (new Line(tl, tr)).draw(ds);
        (new Line(tr, br)).draw(ds);
        (new Line(br, bl)).draw(ds);
    }

    left(): number {
        return this.botLeft.x;
    }
    right(): number {
        return this.topRight.x;
    }
    top(): number {
        return this.topRight.y;
    }
    bottom(): number {
        return this.botLeft.y;
    }

    topLeft(): Pt {
        return new Pt(this.left(), this.top());
    }
    botRight(): Pt {
        return new Pt(this.right(), this.bottom());
    }


    string(): string {
        return "[" + this.botLeft.string() + "," + this.topRight.string() + "]"
    }


    withinUnitSquare(): boolean {
        return this.botLeft.withinUnit() && this.topRight.withinUnit();
    }

    contains(p: Pt): boolean {
        return this.left() <= p.x && p.x <= this.right() && this.bottom() <= p.y && p.y <= this.top();
    }
}

const PtOrigin: Pt = new Pt(0, 0);
const PtUnitXY: Pt = new Pt(1, 1);
const RectUnit: Rect = new Rect(PtOrigin, PtUnitXY);
