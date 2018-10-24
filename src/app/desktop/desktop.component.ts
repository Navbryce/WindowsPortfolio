import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ShortcutComponent } from './shortcut';

// custom components
import { CustomComponent } from '../basic';

// services
import { TaskbarService } from '../services';

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent extends CustomComponent implements OnInit {
  /*
  PURPOSE: Desktop shortcuts, background image, changing focus from program to desktop when clicked
  */
  public static readonly ICON_WIDTH: number = 80;
  public static readonly ICON_HEIGHT: number = 150;

  private shortCutReferences: Array<any> = []; // all the shortcut component references

  public height: number;
  public programDefinitions: Array<any>;
  public selected: ShortcutComponent = null;
  public width: number;

  private iconGrid: Array<Array<any>>;

  @ViewChild('shortCutWrapper', {read: ViewContainerRef}) shortCutWrapper: ViewContainerRef;
  @ViewChild('wrapper') wrapper: ElementRef;


  constructor (private componentFactoryResolver: ComponentFactoryResolver, private taskbarService: TaskbarService) {
    super();
  }

  ngOnInit () {
    var background = <HTMLElement> this.wrapper.nativeElement;
    background.addEventListener("mousedown", ($event) => {
      this.taskbarService.updateFocus(null);
    });
    this.forceUpdatedDesktop(); // get program definitions
    this.windowResize = this.windowResize.bind(this);
    this.windowResize();
  }

  public forceUpdatedDesktop (): void {
    /* completely re-renders the desktop. it will repull the icons from the taskbar service and redraw them */
    this.programDefinitions = this.taskbarService.pinProgramsDesktop;

  }

  public getCorresponding (x: number, y: number): any {
    /*
    x - pixel value that describes x position
    y - pixel value that describes y position
    returns {column: {{number}}, row: {{number}}}
    */
    return {column: Math.floor(x / DesktopComponent.ICON_WIDTH), row: Math.floor(y / DesktopComponent.ICON_HEIGHT)};
  }

  public iconMoveListener (event: any): void {
    /* called when an icon has been moved */
    var newPosition = this.getCorresponding(event.x, event.y);
    this.moveIcon(event.element, newPosition);
  }

  public launchProgram (programDefinition: any): void {
    /* call to launch a program */
    this.taskbarService.createProgramInstanceFromDef(programDefinition);
  }

  public selectShortcut (component: ShortcutComponent): ShortcutComponent {
    /* call to select a shortcut
    returns the new selected component
    */
    if (this.selected != null) {
      this.selected.selected = false;
    }
    if (!!component) {
      component.selected = true;
    }
    this.selected = component;
    return this.selected;
  }

  public selectListener (component: ShortcutComponent): void {
    /* called when a user clicks on an icon */
    this.selectShortcut(component);
  }

  public shortcutEventListener (event: any): void {
    /* the listener for any shortcut events (that aren't related to selecting the shortcut)
        examples: double clicking
    */
    switch (event.event) {
      case 'dblclick':
        this.launchProgram(event.program);
        break;
    }
  }

  public refreshIconGrid (): void {
    /*
    Refreshes the icon grid based on the desktop size
    */
    this.shortCutReferences.forEach((shortCutReference: any) => {
        shortCutReference.destroy(); // destroy all the old shortcuts references
    });
    this.shortCutReferences = []; // all the old shortcuts have been deleted

    var calculation = this.getCorresponding(this.width, this.height);
    var numberOfColumns = calculation.column;
    var numberOfRows = calculation.row;

    if (this.iconGrid == null ||
      (numberOfRows != this.iconGrid.length || numberOfColumns != this.iconGrid[0].length)) {
      var newIconGrid: Array<Array<any>> = Array.apply(null, Array(numberOfRows));
      newIconGrid = newIconGrid.map((array) => {
        return Array.apply(null, Array(numberOfColumns));
      });
      this.iconGrid = newIconGrid;
      // console.log(`Number of columns ${numberOfColumns} and number of rows ${numberOfRows}`);

      // create and  place the shortcuts
      let rowCounter: number = 0;
      let columnCounter: number = 0;
      this.programDefinitions.forEach((programDefinition) => {
        this.createShortcut(programDefinition, {row: rowCounter, column: columnCounter});
        rowCounter = (rowCounter + 1) % numberOfRows;
        if (rowCounter == 0) {
          columnCounter += 1;
        }
      });
    }
  }

  public windowResize (): void {
    /* called when the window resizes
      program definitions already need to be set
     */
    this.width = this.wrapper.nativeElement.offsetWidth;
    this.height = this.wrapper.nativeElement.offsetHeight;
    this.refreshIconGrid();
  }

  /* BEGIN Private Functions */
  private createShortcut (programDefinition: any, positionObject: any) {
    /* creates and inserts a shortcut component
      programDefinition - standard programDefinition
      positionObject - standard position object (row, column)
    */
    var programComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ShortcutComponent);
    var programReference: any = this.shortCutWrapper.createComponent(programComponentFactory);
    var componentInstance: ShortcutComponent = <ShortcutComponent>(programReference.instance)
    componentInstance.initialPosition = DesktopComponent.convertToPosition(positionObject);
    componentInstance.programDefinition = programDefinition;

    // bind the event listeners
    this.selectListener = this.selectListener.bind(this);
    this.iconMoveListener = this.iconMoveListener.bind(this);
    this.shortcutEventListener = this.shortcutEventListener.bind(this);
    componentInstance.wrapper.nativeElement.addEventListener('click', () => {
      this.selectListener(componentInstance);
    });
    componentInstance.wrapper.nativeElement.addEventListener('dragstart', (event) => {
      // sets the default mouse cursor to a normal cursor
      event.dataTransfer.effectAllowed = "move";
    });
    this.wrapper.nativeElement.addEventListener('dragover', (event) => {
      // sets the default mouse cursor to a normal cursor
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    componentInstance.wrapper.nativeElement.addEventListener('dragend', (event) => {
      // call the move listener
      event.element = componentInstance.wrapper.nativeElement;
      this.iconMoveListener(event);
    });
    componentInstance.event.subscribe(this.shortcutEventListener);

    // add the program reference to the array so it can be destroyed if needed
    this.shortCutReferences.push(programReference);

    // update the icon grid
    setTimeout(() => {
      this.iconGrid[positionObject.row][positionObject.column] = this.wrapper.nativeElement;
    }, 500);
  }

  private moveIcon (element: HTMLElement, positionObject: any) {
    /*
    Used to move the shortcut icons
    element - the shortcut's HTML Element
    positionObject - an object with a 'column' and 'row' keys
    */

    let previousPosition = this.getCorresponding(DesktopComponent.getValue(element.style.left),
    DesktopComponent.getValue(element.style.top));
    if (positionObject.row >= 0 && positionObject.column >= 0
        && positionObject.row < this.iconGrid.length
        && positionObject.column < this.iconGrid[0].length) {
      let existingElement = this.iconGrid[positionObject.row][positionObject.column];
      if (existingElement == null || existingElement == undefined) {


        this.iconGrid[positionObject.row][positionObject.column] = element;
        let position = DesktopComponent.convertToPosition(positionObject);
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';

        // update the previous position as empty
        this.iconGrid[previousPosition.row][previousPosition.column] = null;
      } else {

      }
    }
  }
  /* END Private Functions */

  /* BEGIN Static Functions */
  public static convertToPosition (positionObject: any) {
    /* takes standard position object and returns object with x and y keys */
    return {x: positionObject.column * this.ICON_WIDTH, y: positionObject.row * this.ICON_HEIGHT}
  }

  public static getValue (valueString: string) {
    /* value string containing 'px' */
    return parseInt(valueString, 10);
  }
  /* END Static Functions */

}
