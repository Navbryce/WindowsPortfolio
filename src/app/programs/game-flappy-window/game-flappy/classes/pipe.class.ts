export class Pipe {
    private static readonly STANDARD_GAP_HEIGHT = 175;
    private _x: number;

    constructor(initialX: number, public readonly distanceFromCeiling: number, public readonly gapHeight: number = Pipe.STANDARD_GAP_HEIGHT) {
        this._x = initialX;
    }

    get x(): number {
        return this._x;
    }

    set x(newX: number) {
        this._x = newX;
    }
}
