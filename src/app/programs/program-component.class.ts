import { ElementRef, EventEmitter, Input, Output,ViewChild, ViewContainerRef } from '@angular/core';
import { CustomComponent } from '../basic/components';
import { WindowComponent } from '../window';

// functions
import { generateId } from '../functions'

export abstract class ProgramComponent extends CustomComponent {
  public defaultId: string; // debugging purposes
  public id: string;

  @Input() programDefinition: any;
  @Input() programArgs: any;
  @Output() closeWindow: EventEmitter<boolean> = new EventEmitter<boolean> (); // outputs the ElementRef. tells the parent to delete the component

  @ViewChild(WindowComponent) window: WindowComponent;
  constructor () {
    super();
    // set default id if the extended program does not define one
    this.id = this.defaultId = generateId("");
  }
  ngOnInit() {
    this.window.closeWindow.subscribe(() => {
      this.closeWindow.next(true);
    });
  }

  public abstract windowResize(event: any): void;


}
