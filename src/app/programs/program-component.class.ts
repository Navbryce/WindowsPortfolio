import { ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CustomComponent } from '../basic/components';
import { WindowComponent } from '../window';

// functions
import { generateId } from '../functions'

export abstract class ProgramComponent extends CustomComponent implements OnInit {
  public defaultId: string; // debugging purposes
  public id: string;

  @Input() programDefinition: any;
  @Input() programArgs: any;
  // outputs the ElementRef. tells the parent to delete the component
  @Output() closeWindow: EventEmitter<boolean> = new EventEmitter<boolean> ();
  @ViewChild(WindowComponent) window: WindowComponent;

  constructor () {
    super();
    // set default id if the extended program does not define one
    this.id = this.defaultId = generateId('');
  }
  ngOnInit() {
    this.window.closeWindow.subscribe(() => {
      this.closeWindow.next(true);
    });
  }

  public abstract windowResize (event: any): void;
  protected compareToDefaultArguments (args, defaultArguments): any {
    /*
    Assumes the default arguments contain all the required arguments.
    Will use the args value if it has it, otherwise it will use the default
    argument

    ASSUMES: args and defaultArguments are not null objects.

    Does not work with arrays currently and nested objects
    */
    const resultArguments: any = {};
    Object.keys(defaultArguments).forEach((key, index) => {
      resultArguments[key] = !!args[key] ? args[key] : defaultArguments[key];
    });
    return resultArguments;
  }

}
