export enum BirdState {
    ALIVE,
    COLLIDING,
    DEAD
}
export class Bird {
    private static readonly GRAVITY_ACCELERATION = 5;
    private static readonly JUMP_Y_VELOCITY = 1.9;
    private static readonly INITIAL_X_VELOCITY = 1.0;

    private state: BirdState;
    private _y: number;
    private _yVelocity: number;
    private _xVelocity: number;

    /**
     *
     * @param x - center x (center x of bird)
     * @param initialY - the initial y (center y of bird) (relative to the ground)
     * @param velocityScale - multiplied by velocity (basically scales the number of pixels changed)
     */
    constructor(public readonly x, initialY: number, private velocityScale: number, public readonly width, public readonly height) {
        this._y = initialY;
        this._yVelocity = 0;
        this._xVelocity = Bird.INITIAL_X_VELOCITY;
        this.state = BirdState.ALIVE;
    }

    get birdState(): BirdState {
        return this.state;
    }

    get y(): number { // center y (center of bird) relative to the ground
        return this._y;
    }

    get yVelocity(): number {
        return this._yVelocity;
    }

    get xVelocity(): number {
        return this._xVelocity;
    }

    get birdAlive(): boolean {
        return this.birdState === BirdState.ALIVE;
    }

    get birdDead(): boolean {
        return this.birdState === BirdState.DEAD;
    }

    public fallTimeStep(timeSeconds: number): number {
        if (!this.birdDead) {
            this._yVelocity -= Bird.GRAVITY_ACCELERATION * timeSeconds;
            this._y += this._yVelocity * timeSeconds * this.velocityScale;
            if (this._y <= 0) {
                this.birdDied();
            }
        }
        return this._y;

    }

    private birdDied() {
        this._xVelocity = 0;
        this.state = BirdState.DEAD;
    }

    public jump(): number {
        if (this.birdAlive) {
            this._yVelocity = Bird.JUMP_Y_VELOCITY;
            return this._y;
        }
    }

    public birdCollided() {
        if (!this.birdDead) {
            this.state = BirdState.COLLIDING;
            this._xVelocity = 0;
        }
    }
}
