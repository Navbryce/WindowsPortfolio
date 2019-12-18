import {Pipe} from './pipe.class';
import {Bird} from './bird.class';

export interface PipeImageMap {
    pipeHeadImage: any;
    pipeBodyImage: any;
}

export enum PipeStepState {
    NO_CHANGE,
    COLLISION,
    SCORE,
}

export class PipeManager {
    private static MIN_DISTANCE_BETWEEN_PIPES = 270;
    private static MIN_DISTANCE_FROM_CEILING = 50;
    private static MIN_DISTANCE_FROM_GROUND = 90;

    private pipes: Pipe[] = [];
    private readonly greatestPipeY; // closest to ground

    constructor(private readonly pipeImageMap: PipeImageMap, private readonly gameWidth: number, private readonly groundY: number, private readonly pixelScaling: number) {
        this.greatestPipeY = this.groundY - Pipe.STANDARD_GAP_HEIGHT - PipeManager.MIN_DISTANCE_FROM_GROUND;
    }

    public timeStep(timeStepDuration: number, bird: Bird): PipeStepState {
        let output: PipeStepState = PipeStepState.NO_CHANGE;

       this.checkAndGenerateNewPipe();

        const actualBirdX = bird.x - bird.width / 2;

        let stopCheckingForCollisionsAndScore = false;
        for (let pipeCounter = 0; pipeCounter < this.pipes.length; pipeCounter++) {
            const pipe = this.pipes[pipeCounter];
            const oldX = pipe.x;

            pipe.x -= bird.xVelocity * this.pixelScaling * timeStepDuration;
            if (pipe.x + this.pipeImageMap.pipeBodyImage.width <= 0) {
                this.pipes.splice(pipeCounter, 1);
                pipeCounter--;

            } else {
                if (stopCheckingForCollisionsAndScore || pipe.x > actualBirdX + bird.width ) {
                    /*
                     the list moves in ascending order of x, so if the x is already greater,
                     it's impossible for any pipes after this point to collide
                     */
                    stopCheckingForCollisionsAndScore = true;
                } else {
                    if (this.checkForCollision(pipe, bird) && bird.birdAlive) {
                        output = PipeStepState.COLLISION;
                        bird.birdCollided();
                        break;
                    } else if (oldX >= actualBirdX && pipe.x < actualBirdX) {
                        output = PipeStepState.SCORE;
                    }
                }
            }
        }
        return output;
    }

    private checkAndGenerateNewPipe(): boolean {
        const generateNewPipe = this.checkToGenerateNewPipe();
        if (generateNewPipe) {
            this.pipes.push(this.generateNewPipe());
        }
        return generateNewPipe;
    }

    private checkToGenerateNewPipe(): boolean {
        return this.pipes.length === 0 || this.gameWidth - this.pipes[this.pipes.length - 1].x > PipeManager.MIN_DISTANCE_BETWEEN_PIPES;
    }

    private generateNewPipe(): Pipe {
        const minimum = PipeManager.MIN_DISTANCE_FROM_CEILING;
        const maximum = this.greatestPipeY;
        return new Pipe(this.gameWidth, Math.random() * (maximum - minimum) + minimum);
    }

    private checkForCollision(pipe: Pipe, bird: Bird): boolean {
        let collision = false;
        const actualBirdX = bird.x - bird.width / 2;
        const pipeWidth = this.pipeImageMap.pipeHeadImage.width;
        if (actualBirdX < (pipe.x + pipeWidth) && (actualBirdX + bird.width) > pipe.x) {
            let actualBirdY = this.groundY - bird.y; // make relative to the top of the screen
            actualBirdY -= bird.height / 2; // uncenter
            if (actualBirdY + bird.height > pipe.distanceFromCeiling + pipe.gapHeight || actualBirdY  < pipe.distanceFromCeiling) {
                collision = true;
            }
        }

        return collision;
    }

    public drawPipes(canvasContext) {
        this.pipes.forEach((pipe: Pipe) => { this.drawPipe(canvasContext, pipe) });
    }

    private drawPipe(canvasContext, pipe: Pipe) {
        const {pipeHeadImage, pipeBodyImage} = this.pipeImageMap;
        const topHeadY = pipe.distanceFromCeiling - pipeHeadImage.height;
        const bottomHeadY = pipe.distanceFromCeiling + pipe.gapHeight;
        canvasContext.drawImage(pipeHeadImage, pipe.x, topHeadY);
        // above pipe body
        let lastTopBodyY = topHeadY;
        while (lastTopBodyY > 0) {
            lastTopBodyY -= pipeBodyImage.height;
            canvasContext.drawImage(pipeBodyImage, pipe.x, lastTopBodyY);
        }
        canvasContext.drawImage(pipeHeadImage, pipe.x, bottomHeadY);
        // below pipe body
        let lastBottomBodyY = bottomHeadY + pipeHeadImage.height;
        while (lastBottomBodyY < this.groundY) {
            canvasContext.drawImage(pipeBodyImage, pipe.x, lastBottomBodyY);
            lastBottomBodyY += pipeBodyImage.height;
        }


    }
}
