import { Component, ChangeDetectorRef , ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {TaskbarService} from '../services';
@Component({
  selector: 'window-component',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  animations: [
  trigger('minimizeState', [
    state('false', style({
      opacity: 1,
      transform: 'translate({{x}}px, {{y}}px)'
    }), {params: {x: 500, y: 500}}), // default parameters if no parameters are passed
    state('true',   style({
      opacity: 0,
      transform: 'translate({{x}}px, {{y}}px)'
    }), {params: {x: 0, y: 0}}), // default parameters if no parameters are passed
    transition('true => false', animate('200ms ease-in')),
    transition('false => true', animate('200ms ease-out'))
  ])
]
})
export class WindowComponent {
  static acceptableError = 10;
  static skipFrame = 1; // use to make faster

  private frameCounter = 0;
  private minimized: any; // an array with the minimized info and parameters for the animation

  public closed: boolean; // true if closed

  public currentHeight: number;
  public currentWidth: number;

  public currentX: number;
  public currentY: number;

  public expanded: any; // either null (not expanded) or {"previousHeight":..., "previousWidth": ..., "previousX": ..., "previousY": ...}
  public focused: boolean;
  public id: string;

  public minimizedStatus: boolean = false; // true if minimized

  public minHeight: number;
  public minWidth: number;

  public onSideBorder: number; // indicates if the mouse is on the side border
  public onTB: number; // indicates if the mouse is on the top/bottom border

  public resizing = false; // indicates if currently resizing

  public translationX: number;
  public translationY: number;

  public windowHeight: number; // browser height
  public windowWidth: number; // browser width

  @Input() programDefinition: any;
  @Input() inputId: string;

  @Output() closeWindow = new EventEmitter <boolean>(); // a programatic event emitter. accessed by the program-component class
  @Output() minimize = new EventEmitter <boolean>();


  @ViewChild('headerBar') headerBar: ElementRef;
  @ViewChild('windowComponent') windowComponent: ElementRef;


  constructor (private changeDetector: ChangeDetectorRef, private taskbarService: TaskbarService) {

  }

  ngOnInit() {
    this.id = this.inputId;
    this.viewportResized({}); // updated global values like windowWidth and windowHeight (must be called first because other functions in constructor are dependent on the values updated by this ufnction)


    // add listeners
    this.addListeners();
    this.windowResize(250, 250);
    this.setWindowLocation(50, 50);


    this.windowComponent.nativeElement.id = this.id;
    this.initializeTaskbarHandshake();

    this.setMinimize(false); // do this after currentX and currentY have been set
    this.closed = false;
  }
  // PUBLIC FUNCTIONS BEGIN
  public setCursor (cursor: string) {
    var element = <HTMLElement>this.windowComponent.nativeElement;
    element.style.cursor = cursor;
  }

  public setFocus (newStatus: boolean): void {
    // console.log(`from ${this.focused} to ${newStatus}`);
    if (newStatus != this.focused) {
      this.focused = newStatus;
      this.changeDetector.detectChanges(); // for some reason, sometimes a change in focus status is not detected (when the components are first created)
      if (newStatus) {
        this.setZ(2);
        this.setMinimize(false);
      } else {
        this.setZ(1);
      }
    }
  }
  public setMinimizeWithUpdate (newStatus: boolean): void { // sends the update signal after minimizing
    this.setMinimize(newStatus).then((complete) => {
      if (newStatus) {
        this.taskbarService.minimizeProgram(this.id);
      } else {
        this.taskbarService.updateFocus(this.id);
      }
    });
  }

  public async setMinimize (newStatus: boolean): Promise<boolean> { // newStatus: true - minimized, false  - expanded. returns promise when complete. does NOT send the update signal. also used to hide a program before closing
    return new Promise<boolean>((resolve, reject) => {
      var x;
      var y;
      var updateMinimizedFunction = (x, y) => { // a nested function that sets the current minimized status with the appropriate parameters
        this.minimized = {
          value: newStatus,
          params: {
            x: x,
            y: y
          }
        };

      };
      if (!newStatus) {
        this.minimizedStatus = false; // update the status so it appears before the animation
        x = this.currentX;
        y = this.currentY;
        updateMinimizedFunction(x, y);
        resolve(true);
      } else if (!this.closed){ // go into the bottom left corner
        this.setMinimize(false); // forces the initial style to update itself with the current window position . possibly move this to the moveWindow function
        setTimeout(() => { // gives it time to update the values
          var windowHeight = this.windowHeight;
          x = 0;
          y = windowHeight - this.currentHeight;
          updateMinimizedFunction(x, y);
          setTimeout(() => {
            this.minimizedStatus = true;
            resolve(true);
          }, 200); // the duration of the tranisition
        },10);
      }
    });
  }

  public setZ (newZ: number) { // 2 - focused; 1 - not focused
    // console.log(`id: ${this.id} with z ${newZ}`)
    this.windowComponent.nativeElement.style.zIndex = newZ + '';
  }

  public async toggleClose (newStatus: boolean) { // true - closed; false - open
    if (newStatus != this.closed) {
      await this.setMinimize(newStatus); // hide the window
      this.closed = newStatus;
      this.closeWindow.emit(true); // tell the wrapper program to close this instance of the program
    }
  }

  public toggleExpand (newStatus: boolean) { // true - expanded; false - return to previous state
    if (newStatus && this.expanded == null) {
      this.windowComponent.nativeElement.style.transition = "all 100ms"; // I don't feel like using angular animations for this one
      this.expanded = {
        previousHeight: this.currentHeight,
        previousWidth: this.currentWidth,
        previousX: this.currentX,
        previousY: this.currentY
      };
      var windowHeight = this.windowHeight;
      var windowWidth = this.windowWidth;
      this.setWindowLocation(0, 0);
      this.windowResize(windowWidth, windowHeight - 40); // -40 - the width of the taskbar
    } else if (!newStatus && this.expanded != null) {
      this.windowComponent.nativeElement.style.transition = "all 100ms"; // I don't feel like using angular animations for this one
      this.windowResize(this.expanded.previousWidth, this.expanded.previousHeight); // if the resize is done after the window moves back to its original position, the move will be blocked because the window will go past the size of the screen
      this.setWindowLocation(this.expanded.previousX, this.expanded.previousY);
      this.expanded = null;
    }
    setTimeout(() => { // disable transitions after the transition runs
      this.windowComponent.nativeElement.style.transition = "";
    }, 100)
  }

  // PUBLIC FUNCTIONS END

  // PRIVATE FUNCTIONS BEGIN

  // Taskbar functions and listeners
  private initializeTaskbarHandshake(): void { // initializes program status and adds relevant listeners
    if (!this.taskbarService.hasStatus(this.id)) {
      this.taskbarService.createProgramStatus(this.id, "./assets/taskbar-assets/images/windows.png", this.programDefinition, 0);
    }
    this.taskbarService.updateFocus(this.id); // the most recently created window should have focus


    var element = <HTMLElement>this.windowComponent.nativeElement;
    element.addEventListener("mousedown", ($event) => {
        this.taskbarService.updateFocus(this.id); // give the window focus when clicked
    });
    this.taskbarListener = this.taskbarListener.bind(this); // set the context
    this.taskbarService.updateStream.subscribe(this.taskbarListener);
  }

  private taskbarListener (updateId: string) {
    // console.log(`Update id ${updateId} with ${this.taskbarService.getProgramStatus(updateId).status}`)
    if (updateId == this.id) { // it's this window being updated
      let programStatus = this.taskbarService.getProgramStatus(this.id).status;
      switch (programStatus) {
        case -2:
          this.setFocus(false); // it inherently loses focus if it has it
          this.toggleClose(true);
          break;
        case -1:
          this.setFocus(false); // it inherently loses focus if it has it
          this.setMinimize(true);
          break;
        case 0:
          this.setFocus(false);
          break;
        case 1:
          this.setFocus(true);
          break;
      }
    }
  }

  // Resizing/Window Movement Listeners/Actions BEGIN

  private addHeaderListeners(): void {
    this.moveWindowListener = this.moveWindowListener.bind(this); // set the context

    // drag and drop listeners
    var headerBar = <HTMLElement> this.headerBar.nativeElement;
    headerBar.addEventListener("mousedown", ($event) => {
      if (this.expanded == null) {
        this.translationX = $event.x - this.currentX;
        this.translationY = $event.y - this.currentY;
        this.frameCounter = 0; // reset the frame counter
        this.setWindowLocation($event.x - this.translationX, $event.y - this.translationY);
        document.addEventListener("mousemove", this.moveWindowListener);
        var mouseUpFunction =($event) => {
          document.removeEventListener("mousemove", this.moveWindowListener);
          document.removeEventListener("mouseup", mouseUpFunction);
        };
        document.addEventListener("mouseup", mouseUpFunction);
      }
    });
  }

  private addListeners(): void {
    this.addHeaderListeners();
    this.addBorderListeners();
  }

  private addBorderListeners (): void {
    var element = <HTMLElement>this.windowComponent.nativeElement;
    var wasOnSideBorder = false;
    var wasOnTBBorder = false;
    element.addEventListener("mousemove", ($event) => {
      this.onSideBorderCheckUpdate($event, true); // updates this.onSideBorder variable
      this.onTBCheckUpdate($event, true);
      if (this.onSideBorder != 0 && !wasOnSideBorder) { // indicates that resizing is possible
        wasOnSideBorder = true;
        this.resizeSideClickListener = this.resizeSideClickListener.bind(this); // sets the context of this
        element.addEventListener("mousedown", this.resizeSideClickListener);
      } else if (this.onTB != 0 && !wasOnTBBorder) {
        wasOnTBBorder = true;
        this.resizeTBListener = this.resizeTBListener.bind(this); // sets the context of this
        element.addEventListener("mousedown", this.resizeTBListener);
      } else if ((this.onSideBorder == 0 && wasOnSideBorder)) { // indicates that resizing is no longer possible
        wasOnSideBorder = false;
        this.setCursor("default");
        element.removeEventListener("mousedown", this.resizeSideClickListener);
      } else if (this.onTB == 0 && wasOnTBBorder) {
        wasOnTBBorder = false;
        this.setCursor("default");
        element.removeEventListener("mousedown", this.resizeTBListener);
      }
      // make sure the cursor updates no matter what. sometimes it switches state from corner to bottom
      if ((this.onSideBorder == 1 && this.onTB == 1) || (this.onSideBorder == -1 && this.onTB == -1)) {
        this.setCursor("nw-resize");
      } else if ((this.onSideBorder == -1 && this.onTB == 1) || (this.onSideBorder == 1 && this.onTB == -1)) {
        this.setCursor("ne-resize");
      } else if (this.onSideBorder != 0) {
        this.setCursor("ew-resize");
      } else if (this.onTB != 0) {
        this.setCursor("ns-resize");
      }
    });
  }

  private closeListener ($event): void { // called when the close button is pressed
    this.taskbarService.closeProgram(this.id);
  }

  private expandListener ($event): void { // called when the expand button is pressed
    this.toggleExpand(this.expanded == null);
  }

  private minimizeListener ($event): void { // called when the minimize button is pressed
    this.setMinimizeWithUpdate(true);
  }

  private moveWindowListener ($event): void { // called when user's mouse moves while clicking the header bar
    if (!this.resizing) { // deactivate moving the window with the header bar while the window is resizing
      this.frameCounter = (this.frameCounter) % WindowComponent.skipFrame;
      if (this.frameCounter == 0) {
        var mouseX = $event.x;
        var mouseY = $event.y;
        window.requestAnimationFrame(() => {
          this.setWindowLocation(mouseX - this.translationX, mouseY - this.translationY);
        });
      }
      this.frameCounter += 1;
    }
  }

  private onSideBorderCheck ($event, checkExtremes: boolean): number { // checkExtremes as false will disable checking for extremes. AKA if the cursor is 100 pixels from the left and checkExtremes is false, it will still say its on the side border
    var acceptableError = WindowComponent.acceptableError;
    var offsetX = $event.x - this.currentX;

    var onSideBorder = 0;
    if ((offsetX > this.currentWidth - acceptableError && (!checkExtremes || offsetX < this.currentWidth + acceptableError)) && this.expanded == null) {
      onSideBorder = 1;
    } else if (((!checkExtremes ||offsetX > -acceptableError) && (offsetX < acceptableError)) && this.expanded == null) {
      onSideBorder = -1;
    }
    return onSideBorder; // 0 - no; -1 - left side; 1 - right side
  }

  private onSideBorderCheckUpdate ($event, checkExtremes: boolean): void { // updates the onSideBorder global variable
    let onSideBorder = this.onSideBorderCheck($event, checkExtremes);
    if ((onSideBorder != 0 || (onSideBorder == 0 && !this.resizing))) { // don't change the status of on side border if it is resizing and the status goes to not on size border
      this.onSideBorder = onSideBorder;
    }
  }

  private onTBBorderCheck ($event, checkExtremes: boolean): number { // checkExtremes as false will disable checking for extremes. AKA if the cursor is 100 pixels from the top and checkExtremes is false, it will still say its on the stop border
    var acceptableError = WindowComponent.acceptableError;
    var offsetY = $event.y - this.currentY;
    var onTB = 0;
    if ((offsetY > this.currentHeight - acceptableError && (!checkExtremes || offsetY < this.currentHeight + acceptableError)) && this.expanded == null) {
      onTB = 1;
    } else if (((!checkExtremes ||offsetY > -acceptableError) && (offsetY < acceptableError)) && this.expanded == null) {
      onTB = -1;
    }
    return onTB; // 0 - no; 1 - bottom side; -1 - top side
  }

  private onTBCheckUpdate ($event, checkExtremes: boolean): void { // updates the onSideBorder global variable
    let onTB = this.onTBBorderCheck($event, checkExtremes);
    if (onTB != 0 || (onTB == 0 && !this.resizing)) { // don't change the status of on top border if it is resizing and the status goes to not on top border
      this.onTB = onTB;
    }
  }

  private resizeSideClickListener ($event) { // called when the user clicks when resizing is possible
    this.resizing = true; // resizing is currently occurring

    this.resizeSideMovement = this.resizeSideMovement.bind(this); // sets the context of this
    document.addEventListener("mousemove", this.resizeSideMovement);
    var removeListener = ($event) => {
      this.resizing = false;
      document.removeEventListener("mousemove", this.resizeSideMovement); // removes this as a listener
      document.removeEventListener("mouseup", removeListener);
    };
    document.addEventListener("mouseup", removeListener);
  }

  private resizeTBListener ($event) { // called when the user clicks when resizing is possible
    this.resizing = true; // resizing is currently occurring

    this.resizeTBMovement = this.resizeTBMovement.bind(this); // sets the context of this
    document.addEventListener("mousemove", this.resizeTBMovement);
    var removeListener = ($event) => {
      this.resizing = false;
      document.removeEventListener("mousemove", this.resizeTBMovement); // removes this as a listener
      document.removeEventListener("mouseup", removeListener);
    };
    document.addEventListener("mouseup", removeListener);
  }

  private resizeSideMovement ($event) { // called after the user clicks and move their mouse on the side borders

    this.onSideBorderCheckUpdate($event, false); // updates this.onSideBorder variable

    var acceptableError = WindowComponent.acceptableError;
    var x = $event.x;
    var deltaX = x - this.currentX;
    if (this.onSideBorder == -1) { // clicked on the left side
      let actualResizeAmount = -1 * deltaX + this.currentWidth;
      if (actualResizeAmount >= this.minWidth) {
        window.requestAnimationFrame(() => {
          this.setWindowLocation(x, this.currentY); // move the window to the left cause that's where the mouse location is
          this.windowResize(actualResizeAmount, this.currentHeight); // resize to the greater width
        });
      }
    } else {
      window.requestAnimationFrame(() => {
        this.windowResize(deltaX, this.currentHeight);
      });
    }
  }

  private resizeTBMovement ($event) { // called after the user clicks and move their mouse on the TB borders
    if ($event.clientY >= 0) { // make sure the mouse is within the screen
      this.onTBCheckUpdate($event, false); // updates this.onSideBorder variable
      var acceptableError = WindowComponent.acceptableError;
      var y = $event.y;
      var deltaY = y - this.currentY;
      if (this.onTB == -1) { // clicked on the top
        let actualResizeAmount = -1 * deltaY + this.currentHeight;
        if (actualResizeAmount >= this.minHeight) {
          window.requestAnimationFrame(() => {
            this.setWindowLocation(this.currentX, y); // move the window to the left cause that's where the mouse location is
            this.windowResize(this.currentWidth, actualResizeAmount); // resize to the greater width
          });
        }
      } else {
        window.requestAnimationFrame(() => {
          this.windowResize(this.currentWidth, deltaY);
        });
      }
    }
  }

  private windowResize (newWidth: number, newHeight: number) {
    var element = <HTMLElement>this.windowComponent.nativeElement;
    element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;
    this.currentWidth = newWidth;
    this.currentHeight = newHeight;
  }

  private setWindowLocation (x: number, y: number): void { // set the window location
    // NOTE: ENSURE THERE IS NO PADDING/MARGIN in the body/window
    var windowWidth = this.windowWidth;
    var windowHeight = this.windowHeight;

    // Make sure it doesn't go out the window

    x = x + this.currentWidth > this.windowWidth ? this.windowWidth - this.currentWidth : x;
    x = x < 0 ? 0 : x;
    y = y + this.currentHeight > this.windowHeight ? this.windowHeight - this.currentHeight : y;
    y = y < 0 ? 0 : y;

    if (x != this.currentX || y != this.currentY) {
      var element = <HTMLElement>this.windowComponent.nativeElement;

      var transform = `translate(${x}px, ${y}px)`;
      element.style.transform = transform;
      this.currentX = x;
      this.currentY = y;
    }
  }

  @HostListener('window:resize', ['$event'])
  private viewportResized (event) {
    this.windowWidth = document.documentElement.clientWidth;
    this.windowHeight = document.documentElement.clientHeight;
    this.minWidth = parseInt(this.windowComponent.nativeElement.style.minWidth);
    this.minHeight = parseInt(this.windowComponent.nativeElement.style.minHeight);
  }

    // Resizing/Window Movement Listeners/Actions END

  // PRIVATE FUNCTIONS END
}
