import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non-angular classes
import { MenuBarItem } from '../../basic';
import { TaskbarService } from '../../services';

@Component({
  selector: 'browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent extends ProgramComponent implements OnInit {
  // the default source to use if not specified
  public readonly assetsRoot = '/assets/portfolio-documents/';
  public menu: Array<MenuBarItem>;
  public pdfSource: String = '/resume.pdf';

  private fileMenuOpen: boolean;

  constructor (private taskbarService: TaskbarService) {
    super();
    this.fileMenuOpen = false;
    const fileMenu = [new MenuBarItem('Open',
    () => {
      if (!this.fileMenuOpen) {
        this.fileMenuOpen = true;
        const programArgs = {
          filters: ['pdf'],
          eventHandler(file: any) {
            this.openFile(file);
          },
          closeListener() {
            this.fileMenuOpen = false;
          }
        };
        // set thte this context
        programArgs.eventHandler = programArgs.eventHandler.bind(this);
        programArgs.closeListener = programArgs.closeListener.bind(this);

        // open the file selector menu with the program args
        this.taskbarService.createProgramInstanceFromId('file-selector',
            programArgs);
      }
    })];
    this.menu = [new MenuBarItem('File', null, fileMenu)];
  }

  ngOnInit() {
    this.parseArguments(this.programArgs);
  }

  public openFile (file: any): void {
    /**
      Opens the selected file
    */

    // only switch files if it's different
    if (this.pdfSource != file.path) {
      this.pdfSource = file.path;
    }
  }

  public windowResize (event: any): void {
  }

  // BEGIN: Private functions
  private parseArguments (args: any): void {
    /* Parses arguments and configures variables accordingly */
    if (args != null) {
      if (args.file != null) {
        this.pdfSource = args.file.path;
      }
    }
  }

}
