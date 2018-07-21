import { Component } from '@angular/core';
import { ProgramComponent } from '../program-component.class';
@Component({
  selector: 'test-program',
  templateUrl: './test-program.component.html',
  styleUrls: ['./test-program.component.scss']
})
export class TestProgram extends ProgramComponent{

  constructor () {
    super(); // generates defaults if not defined, such as id
  }

  // @Input() programDefinition: any see /programs for more info (comes from extended class);

  // BEGIN Private Functions

  // End Private Functions

}
