import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Bird, BirdState, PipeImageMap, PipeManager, PipeStepState} from './classes';

@Component({
  selector: 'game-flappy',
  templateUrl: './game-flappy.component.html',
  styleUrls: ['./game-flappy.component.scss']
})
export class GameFlappyComponent implements OnInit {
  public restartScreen = false;
  
  private static readonly BACKGROUND_RELATIVE_VELOCITY_FACTOR = .1;
  private static readonly FLAPS_A_SECOND = 2;
  private static readonly TAPS_A_SECOND = 1;

  private static readonly FRAME_INTERVAL_SECONDS = .01;
  private static readonly NUMBER_OF_BIRD_SPRITES = 3;
  private static readonly NUMBER_OF_TAP_SPRITES = 2;
  private static readonly SCALING = 250;


  private static readonly CHANGE_FLAP_ON_COUNT = Math.floor((1 / GameFlappyComponent.FRAME_INTERVAL_SECONDS) / (GameFlappyComponent.FLAPS_A_SECOND * GameFlappyComponent.NUMBER_OF_BIRD_SPRITES));
  private static readonly CHANGE_TAP_ON_COUNT = Math.floor((1 / GameFlappyComponent.FRAME_INTERVAL_SECONDS) / (GameFlappyComponent.TAPS_A_SECOND * GameFlappyComponent.NUMBER_OF_TAP_SPRITES));

  private static readonly FLOOR_COLOR = '#ded895';
  private static readonly GAME_ASSETS_ROOT = './assets/programs/game-flappy-window';

  private backgroundImage;
  private backgroundX: number;
  private bestScore = 0;
  private bird: Bird;
  private birdSpriteCounter: number = null; // indicates the sprite the bird is currently on
  private readonly birdImages = [];
  private canvasContext: CanvasRenderingContext2D;
  private floorImage;
  private floorX: number;
  private frameCounter: number;
  private gameInterval;
  private height: number;
  private clickListener;
  private imagesInitialized = false;
  private pipeImageMap: PipeImageMap;
  private pipeManager: PipeManager;
  private tapImages = [];
  private tapImageSpriteCounter;
  private score: number;
  private startMoving: boolean;
  private width: number;

  @ViewChild('wrapper') gameWrapper: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;


  constructor() { }

  async ngOnInit() {
    await this.initializeImages();
    this.imagesInitialized = true;
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.dimensionsUpdateCheck();
    this.startGame();
  }

  private initializeImages(): Promise<boolean> {
    const imagePromises: Promise<boolean>[] = [this.initializeBirdImages(), this.initializeBackgroundImage(), this.initializeFloorImage(),
      this.initializePipeImages(), this.initializeTapImages()];
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


  private initializeTapImages(): Promise<boolean> {
    const tapPromises: Promise<boolean>[] = [];
    for (let counter = 0; counter < GameFlappyComponent.NUMBER_OF_TAP_SPRITES; counter++) {
      const image = new Image();
      image.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/tap-image/${counter}.png`;

      // push to bird image array
      this.tapImages.push(image);

      // image load promises
      const imageLoaded = new Promise<boolean>((resolve) => {
        image.onload = () => resolve(true);
      });
      tapPromises.push(imageLoaded);
    }

    return Promise.all(tapPromises)
        .then((result: boolean[]) => true);

  }
  
  private initializePipeImages(): Promise<boolean> {
    const pipeHeadImage = new Image();
    pipeHeadImage.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/pipe-head.png`;

    const pipeHeadPromise = new Promise((resolve) => {
      pipeHeadImage.onload = () => resolve(true);
    });
    const pipeBodyImage = new Image();
    pipeBodyImage.src = `${GameFlappyComponent.GAME_ASSETS_ROOT}/pipe-body.png`;
    const pipeBodyPromise = new Promise((resolve) => {
      pipeBodyImage.onload = () => resolve(true);
    });

    this.pipeImageMap = {pipeHeadImage, pipeBodyImage};

    return Promise.all([pipeHeadPromise, pipeBodyPromise])
        .then((result) => true);
  }


  private startGame() {
    if (this.bird == null && this.gameInterval == null) {
      this.bird = new Bird(this.width / 2, this.backgroundImage.height / 2, GameFlappyComponent.SCALING,
          this.birdImages[0].width, this.birdImages[0].height);
      // initialize the bird sprite counter
      this.birdSpriteCounter = 0;
      // initialize tap image sprite counter
      this.tapImageSpriteCounter = 0;

      // initialize the frame number
      this.frameCounter = 0;
      this.backgroundX = 0;
      this.floorX = 0;
      this.startMoving = false; // the game initially starts in a "wait" mode
      this.score = 0;
      this.pipeManager = new PipeManager(this.pipeImageMap,
          this.width, this.backgroundImage.height,
          GameFlappyComponent.SCALING);
      this.clickListener = () => this.jumpListener();
      // initialize jump listener
      this.canvas.nativeElement.addEventListener('click', this.clickListener);

      // start the game interval
      this.gameInterval = setInterval(() => {
        this.renderLoop();
      }, GameFlappyComponent.FRAME_INTERVAL_SECONDS * 1000);
    } else {
      throw new Error('Trying to start the game when either the bird or game interval is not null');
    }
  }

  private jumpListener() {
    this.startMoving = this.startMoving || !this.startMoving;
    this.bird.jump();
  }

  private renderLoop() {
    this.clearCanvas();
    if (this.startMoving) {
      this.bird.fallTimeStep(GameFlappyComponent.FRAME_INTERVAL_SECONDS);
      const newState: PipeStepState = this.pipeManager.timeStep(GameFlappyComponent.FRAME_INTERVAL_SECONDS, this.bird);
      if (newState === PipeStepState.SCORE) {
        this.score++;
      }
    }

    this.updateAndDrawBackground();
    // tell the user to tap if they're not moving yet
    if (!this.startMoving) {
      this.drawTapImage();
      // update tap sprite
      if (this.frameCounter % GameFlappyComponent.CHANGE_TAP_ON_COUNT === 0) {
        this.tapImageSpriteCounter = (this.tapImageSpriteCounter + 1) % this.tapImages.length;
      }
    }

    this.pipeManager.drawPipes(this.canvasContext);
    this.updateAndDrawFloor();
    if (this.bird.birdDead) {
      this.birdDied();
    }
    this.drawBird();

    // update the bird sprite image
    if (this.frameCounter % GameFlappyComponent.CHANGE_FLAP_ON_COUNT === 0 && !this.bird.birdDead) {
      this.birdSpriteCounter = (this.birdSpriteCounter + 1) % this.birdImages.length;
    }
    this.frameCounter++;


  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.width, this.height); // clear the canvas
  }

  private updateAndDrawBackground() {
    const backgroundVelocity = this.bird.xVelocity * GameFlappyComponent.BACKGROUND_RELATIVE_VELOCITY_FACTOR;
    this.backgroundX -= GameFlappyComponent.FRAME_INTERVAL_SECONDS * backgroundVelocity * GameFlappyComponent.SCALING;
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
    this.floorX -= GameFlappyComponent.FRAME_INTERVAL_SECONDS * this.bird.xVelocity * GameFlappyComponent.SCALING;
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
    const actualY = (this.backgroundImage.height - this.bird.y)
    const actualX =  (this.bird.x);
    const angle = Math.atan(-this.bird.yVelocity / this.bird.xVelocity); // calculate the angle the bird should point
    this.canvasContext.translate(actualX, actualY); // translate coordinate system to the bird's center point
    this.canvasContext.rotate(angle);
    this.canvasContext.drawImage(birdImage, -this.bird.width / 2, -this.bird.height / 2);
    this.canvasContext.restore();
  }

  private drawTapImage() {
    const tapImage = this.tapImages[this.tapImageSpriteCounter];
    const imageWidth = tapImage.width;
    const imageHeight = tapImage.height;
    const x = this.width / 2 - imageWidth / 2;
    const y = this.bird.y + this.bird.height / 2 + 50;
    this.canvasContext.drawImage(tapImage, x, y);
  }



  private birdDied() {
    this.bestScore = Math.max(this.score, this.bestScore);
    this.restartScreen = true;
  }

  private restartGame() {
    clearInterval(this.gameInterval);
    this.bird = null;
    this.gameInterval = null;
    this.restartScreen = false;
    this.canvas.nativeElement.removeEventListener('click', this.clickListener);
    this.clickListener = null;
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
    if (this.dimensionsUpdateCheck() && this.imagesInitialized) {
      this.restartGame();
    }
  }





}
