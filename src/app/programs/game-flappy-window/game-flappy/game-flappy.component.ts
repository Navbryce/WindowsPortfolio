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
  private static readonly FLAPS_A_SECOND = 2;
  private static readonly BACKGROUND_RELATIVE_VELOCITY_FACTOR = .1;
  private static readonly SCALING = 250;


  private static readonly BACKGROUND_VELOCITY = Bird.X_VELOCITY * GameFlappyComponent.BACKGROUND_RELATIVE_VELOCITY_FACTOR;
  private static readonly CHANGE_FLAP_ON_COUNT = Math.floor((1 / GameFlappyComponent.FRAME_INTERVAL_SECONDS) / (GameFlappyComponent.FLAPS_A_SECOND * GameFlappyComponent.NUMBER_OF_BIRD_SPRITES));

  private static readonly FLOOR_COLOR = '#ded895';
  private static readonly GAME_ASSETS_ROOT = './assets/programs/game-flappy-window';

  private backgroundImage;
  private backgroundX: number;
  private bird: Bird;
  private birdSpriteCounter: number = null; // indicates the sprite the bird is currently on
  private readonly birdImages = [];
  private canvasContext: CanvasRenderingContext2D;
  private floorImage;
  private floorX: number;
  private frameCounter: number;
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
    const imagePromises: Promise<boolean>[] = [this.initializeBirdImages(), this.initializeBackgroundImage(), this.initializeFloorImage()];
    return Promise.all(imagePromises)
        .then((result: boolean[]) => true);
  }

  private initializeBirdImages(): Promise<boolean> {
    const birdPromises: Promise<boolean>[] = [];
    for (let counter = 0; counter < GameFlappyComponent.NUMBER_OF_BIRD_SPRITES; counter++) {
      const image = new Image();
      image.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/sprites/${counter}.png`;

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

  private initializeBackgroundImage(): Promise<boolean> {
    const image = new Image();
    image.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/background.png`;
    this.backgroundImage = image;
    return new Promise((resolve) => {
      image.onload = () => resolve(true);
    });
  }

  private initializeFloorImage(): Promise<boolean> {
    const image = new Image();
    image.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/floor.png`;
    this.floorImage = image;
    return new Promise((resolve) => {
      image.onload = () => resolve(true);
    });
  }

  private startGame() {
    if (this.bird == null && this.gameInterval == null) {
      this.bird = new Bird(this.height / 2, GameFlappyComponent.SCALING);
      // initialize the bird sprite counter
      this.birdSpriteCounter = 0;

      // initialize the frame number
      this.frameCounter = 0;
      this.backgroundX = 0;
      this.floorX = 0;

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

    this.updateAndDrawFloor();
    this.updateAndDrawBackground();

    this.bird.fallTimeStep(GameFlappyComponent.FRAME_INTERVAL_SECONDS);

    if (this.bird.y < this.height - this.backgroundImage.height) {
      this.birdDied();
    } else {
      this.drawBird();
      if (this.frameCounter % GameFlappyComponent.CHANGE_FLAP_ON_COUNT === 0) {
        this.birdSpriteCounter = (this.birdSpriteCounter + 1) % this.birdImages.length;
      }
      this.frameCounter++;
    }


  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.width, this.height); // clear the canvas
  }

  private updateAndDrawBackground() {
    this.backgroundX -= GameFlappyComponent.FRAME_INTERVAL_SECONDS * GameFlappyComponent.BACKGROUND_VELOCITY * GameFlappyComponent.SCALING;
    if (this.backgroundX <= -this.backgroundImage.width) {
      this.backgroundX = 0;
    }
    this.drawBackground();
  }
  private drawBackground() {
    let afterMainBackground = this.backgroundX;
    while (afterMainBackground < this.width) {
      this.canvasContext.drawImage(this.backgroundImage, afterMainBackground, 0);
      afterMainBackground += this.backgroundImage.width;
    }
  }

  private updateAndDrawFloor() {
    this.floorX -= GameFlappyComponent.FRAME_INTERVAL_SECONDS * Bird.X_VELOCITY * GameFlappyComponent.SCALING;
    if (this.floorX <= -this.floorImage.width) {
      this.floorX = 0;
    }
    this.drawFloor();
  }
  private drawFloor() {
    // draw the background color of the floor
    this.canvasContext.fillStyle = GameFlappyComponent.FLOOR_COLOR;
    this.canvasContext.fillRect(0, this.backgroundImage.height, this.width, this.height);

    // draw the moving part of the floor
    let afterMainFloor = this.floorX;
    while (afterMainFloor < this.width) {
      this.canvasContext.drawImage(this.floorImage, afterMainFloor, this.backgroundImage.height);
      afterMainFloor += this.floorImage.width;
    }
  }

  private drawBird() {
    this.canvasContext.save();
    const birdImage = this.birdImages[this.birdSpriteCounter];
    const actualY = (this.height - this.bird.y) + birdImage.height / 2;
    const actualX =  (this.width / 2) - birdImage.width / 2;
    const angle = Math.atan(-this.bird.yVelocity / Bird.X_VELOCITY); // calculate the angle the bird should point
    this.canvasContext.translate(actualX, actualY); // translate coordinate system to the bird's center point
    this.canvasContext.rotate(angle);
    this.canvasContext.drawImage(birdImage, -birdImage.width / 2, -birdImage.height / 2);
    this.canvasContext.restore();
  }

  private birdDied() {
    clearInterval(this.gameInterval);
    this.restartGame();
  }

  private restartGame() {
    this.bird = null;
    this.gameInterval = null;
    this.startGame();
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
