import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  public readonly ICON_WIDTH: number = 60;
  public readonly ICON_HEIGHT: number = 90;

  public height: number;
  public programDefinitions: Array<any>;
  public selected: ShortcutComponent = null;
  public width: number;

  private iconGrid: Array<Array<any>>;

  @ViewChild('wrapper') wrapper: ElementRef;

  constructor (private taskbarService: TaskbarService) {
    super();
  }

  ngOnInit () {
    var background = <HTMLElement> this.wrapper.nativeElement;
    background.addEventListener("mousedown", ($event) => {
      this.taskbarService.updateFocus(null);
    });
    this.forceUpdatedDesktop(); // get program definitions
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
    return {column: Math.floor(x / this.ICON_WIDTH), row: Math.floor(y / this.ICON_HEIGHT)};
  }

  public iconMoveListener (event: any): void {
    /* called when an icon has been moved */
    var newPosition = this.getCorresponding(event.x, event.y);
    console.log(newPosition);
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
    component.selected = true;
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
    var numberOfColumns = Math.floor(this.width / this.ICON_WIDTH);
    var numberOfRows = Math.floor(this.height / this.ICON_HEIGHT);

    if (this.iconGrid == null ||
      (numberOfRows != this.iconGrid.length || numberOfColumns != this.iconGrid[0].length)) {
      var newIconGrid: Array<Array<any>> = new Array<Array<any>>(numberOfRows);
      newIconGrid.map((array) => {
        return new Array<any>(numberOfColumns);
      });
      this.iconGrid = newIconGrid;
      console.log(`Number of columns ${numberOfColumns} and number of rows ${numberOfRows}`);
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
  private moveIcon (element: HTMLElement, positionObject: any) {
    /*
    Used to move the shortcut icons
    element - the shortcut's HTML Element
    positionObject - an object with a 'column' and 'row' keys
    */
  }
  /* END Private Functions */

}
