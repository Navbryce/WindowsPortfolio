import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non-angular classes
import { MenuBarItem } from '../../basic';

@Component({
  selector: 'browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent extends ProgramComponent implements OnInit {
  // the default source to use if not specified
  public readonly assetsRoot = '/assets/portfolio-documents/';
  public menu: Array<MenuBarItem>;
  public pdfSource: String = '/SoftwareResume.pdf';

  constructor () {
    super();
    const fileMenu = [new MenuBarItem('Open', null)];
    this.menu = [new MenuBarItem('File', null, fileMenu)];
  }

  ngOnInit() {
    this.parseArguments(this.programArgs);
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
