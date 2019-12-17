export class Bird {
    public static readonly X_VELOCITY = 1.0;
    private static readonly GRAVITY_ACCELERATION = 4.25;
    private static readonly JUMP_Y_VELOCITY = 1.9;

    private _y: number;
    private _yVelocity: number;
    constructor(initialY: number, private velocityScale: number) {
        this._y = initialY;
        this._yVelocity = 0;
    }

    get y(): number {
        return this._y;
    }

    get yVelocity(): number {
        return this._yVelocity;
    }

    public fallTimeStep(timeSeconds: number): number {
         this._yVelocity -= Bird.GRAVITY_ACCELERATION * timeSeconds;
        this._y += this._yVelocity * timeSeconds * this.velocityScale;

        return this._y;
    }

    public jump(): number {
        this._yVelocity = Bird.JUMP_Y_VELOCITY;
        return this._y;
    }
}
