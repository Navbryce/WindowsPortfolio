import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShortcutComponent } from './shortcut';

// services
import { TaskbarService } from '../services';

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  /*
  PURPOSE: Desktop shortcuts, background image, changing focus from program to desktop when clicked
  */
  public programDefinitions: Array<any>;
  public selected: ShortcutComponent = null;

  @ViewChild('wrapper') wrapper: ElementRef;

  constructor (private taskbarService: TaskbarService) {

  }

  ngOnInit () {
    var background = <HTMLElement> this.wrapper.nativeElement;
    background.addEventListener("mousedown", ($event) => {
      this.taskbarService.updateFocus(null);
    });
    this.forceUpdatedDesktop();
  }

  public forceUpdatedDesktop (): void {
    /* completely re-renders the desktop. it will repull the icons from the taskbar service and redraw them */
    this.programDefinitions = this.taskbarService.pinProgramsDesktop;

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
}
