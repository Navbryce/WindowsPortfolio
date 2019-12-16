import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Bird} from './classes';

@Component({
  selector: 'game-flappy',
  templateUrl: './game-flappy.component.html',
  styleUrls: ['./game-flappy.component.scss']
})
export class GameFlappyComponent implements OnInit {
  private static readonly FRAME_INTERVAL_SECONDS = .01;
  private static readonly NUMBER_OF_BIRD_SPRITES = 3;

  private bird: Bird;
  private birdSpriteCounter: number = null;
  private readonly birdImages = [];
  private canvasContext: CanvasRenderingContext2D;
  private gameInterval;
  private height: number;
  private width: number;

  @ViewChild('wrapper') gameWrapper: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;


  constructor() { }

  async ngOnInit() {
    await this.initializeImages();
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.dimensionsUpdateCheck();
    this.startGame();
  }

  private initializeImages(): Promise<boolean> {
    const imagePromises: Promise<boolean>[] = [this.initializeBirdImages()];
    return Promise.all(imagePromises)
        .then((result: boolean[]) => true);
  }

  private initializeBirdImages(): Promise<boolean> {
    const birdPromises: Promise<boolean>[] = [];
    for (let counter = 0; counter < GameFlappyComponent.NUMBER_OF_BIRD_SPRITES; counter++) {
      const image = new Image();
      image.src = `./assets/programs/game-flappy-window/sprites/${counter}.png`;

      // push to bird image array
      this.birdImages.push(image);

      // image load promises
      const imageLoaded = new Promise<boolean>((resolve) => {
        image.onload = () => resolve(true);
      });
      birdPromises.push(imageLoaded);
    }

    return Promise.all(birdPromises)
        .then((result: boolean[]) => true);

  }

  private startGame() {
    if (this.bird == null && this.gameInterval == null) {
      this.bird = new Bird(this.height / 2);
      // initialize the bird sprite counter
      this.birdSpriteCounter = 0;

      // initialize jump listener
      this.canvas.nativeElement.addEventListener('click', () => this.jumpListener());

      // start the game interval
      this.gameInterval = setInterval(() => {
        this.renderLoop();
      }, GameFlappyComponent.FRAME_INTERVAL_SECONDS * 1000);
    } else {
      throw new Error('Trying to start the game when either the bird or game interval is not null');
    }
  }

  private jumpListener() {
    this.bird.jump();
  }

  private renderLoop() {
    this.clearCanvas();

    this.bird.fallTimeStep(GameFlappyComponent.FRAME_INTERVAL_SECONDS);
    this.drawBird();
    this.birdSpriteCounter = (this.birdSpriteCounter + 1) % this.birdImages.length;
  }

  private drawBird() {
    this.canvasContext.save();
    const birdImage = this.birdImages[this.birdSpriteCounter];
    const actualY = (this.height - this.bird.y) + Bird.BIRD_HEIGHT / 2;
    const actualX = (this.width / 2) + Bird.BIRD_WIDTH / 2;
    const angle = Math.atan(-this.bird.yVelocity / Bird.X_VELOCITY); // calculate the angle the bird should point
    this.canvasContext.translate(actualX, actualY); // translate coordinate system to the bird's center point
    this.canvasContext.rotate(angle);
    this.canvasContext.drawImage(birdImage, -Bird.BIRD_WIDTH / 2, -Bird.BIRD_HEIGHT / 2);
    this.canvasContext.restore();
  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.width, this.height); // clear the canvas
  }

  public dimensionsUpdateCheck(): boolean {
    const gameWrapperElement: HTMLElement = this.gameWrapper.nativeElement;
    const height = gameWrapperElement.offsetHeight;
    const width = gameWrapperElement.offsetWidth;
    let dimensionsUpdated = false;
    if (height !== this.height || width !== this.width) {
      dimensionsUpdated = true;
      this.updateDimensions(height, width);
    }
    return dimensionsUpdated;
  }

  private updateDimensions(newHeight: number, newWidth: number) {
    const canvasElement = this.canvas.nativeElement;
    canvasElement.width = newWidth;
    canvasElement.height = newHeight;

    this.width = newWidth;
    this.height = newHeight;
  }



  public windowResize (event: any): void {
  }





}
