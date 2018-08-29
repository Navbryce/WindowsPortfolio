import { Component } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

@Component({
  selector: 'console',
  styleUrls: ['./console.component.scss'],
  templateUrl: './console.component.html'
})
export class ConsoleComponent extends ProgramComponent {
    constructor () {
      super(); // generates defaults if not defined, such as id
    }

    public windowResize (): void {

    }
}
