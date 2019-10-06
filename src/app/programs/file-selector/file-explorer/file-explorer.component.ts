import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../../program-component.class';
import { TaskbarService } from '../../../services';

@Component({
  selector: 'file-explorer',
  styleUrls: ['./file-explorer.component.scss'],
  templateUrl: './file-explorer.component.html'
})
export class FileExplorerComponent extends ProgramComponent implements OnInit {

  constructor (private taskBarService: TaskbarService) {
    // generates defaults if not defined, such as id
    super();
  }

  public openFile (file: any): void {
    // try opening the file
    this.taskBarService.openFile(file);
  }

  public windowResize (event: any): void {

  }

  public windowClose() {
  }
}
