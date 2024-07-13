import * as draw from "./draw.js";

export class Graph {
    xlo: number;
    xhi: number;
    ylo: number;
    yhi: number;
    steps: number;

    constructor(
        xlo: number,
        xhi: number,
        ylo: number,
        yhi: number,
        steps: number = 100
    ) {
        this.xlo = xlo;
        this.xhi = xhi;
        this.ylo = ylo;
        this.yhi = yhi;
        this.steps = steps;
    }

    plot(ds: draw.DrawScreen, f) {
        let last: draw.Pt | undefined;
        let current: draw.Pt;
        //        console.log("steps " + this.steps);
        let dx = this.xhi - this.xlo;
        let dy = this.yhi - this.ylo;
        for (let drawX = 0; drawX <= 1; drawX += 1 / this.steps) {
            let x = this.xlo + dx * drawX;
            let y = f(x);
            let drawY = (y - this.ylo) / dy;

            //            console.log("loop x " + x + " y " + y);
            //            console.log("loop drawX " + drawX + " drawY " + drawY);

            current = new draw.Pt(drawX, drawY);
            if (last != null) {
                new draw.Line(last, current).draw(ds);
                //                console.log("Drawing current " + current.string());
            }
            last = current;
        }
        //        console.log("loop done");
    }
}
