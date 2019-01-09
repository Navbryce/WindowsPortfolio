import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProgramComponent } from '../../program-component.class';

@Component({
  selector: 'file-explorer',
  styleUrls: ['./file-explorer.component.scss'],
  templateUrl: './file-explorer.component.html'
})
export class FileExplorerComponent extends ProgramComponent implements OnInit {

  constructor () {
    // generates defaults if not defined, such as id
    super();
  }

  public windowResize (event: any): void {

  }
}
