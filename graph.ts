import * as draw from "./draw.js";

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

    plot(ds: draw.DrawScreen, f) {
        let dx = this.xhi - this.xlo;
        let last: draw.Pt;
        let current: draw.Pt;
        //        console.log("steps " + this.steps);
        for (let i = 0; i < this.steps; i++) {
            // console.log("loop i: " + i + " last " + JSON.stringify(last));
            let x = this.xlo + ((dx / this.steps) * i);
            let y = f(x);
            current = new draw.Pt(x, y);
            if (last != null) {
                new draw.Line(last, current).draw(ds);
                //                console.log("Drawing i " + i);
                //                console.log("Drawing current " + current.string());
            }
            last = current;
        }
        //        console.log("loop done");
    }
}
