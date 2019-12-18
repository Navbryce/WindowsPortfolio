import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non-angular classes
import { MenuBarItem } from '../../basic';
import { TaskbarService } from '../../services';

// environment
import { environment } from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent extends ProgramComponent implements OnInit {
  private _zoom = 1;
  private fileMenuOpen: boolean;

  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    if (value <= 0) {
      throw new Error('Zoom must be greater than 0');
    }
    this._zoom = value;
  }
  // the default source to use if not specified
  public static readonly ASSETS_ROOT = '/assets/portfolio-documents/';
  public static readonly INITIAL_LOAD = environment.resumePath;
  public static readonly ZOOM_INCREMENT = .2;

  public readonly SCROLLBAR_CONFIG = {

  };

  public fullPathEmitter: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public menu: Array<MenuBarItem>;
  public pdfSource: string;

  constructor (private taskbarService: TaskbarService) {
    super();
    this.fileMenuOpen = false;
    const fileMenu = [
        new MenuBarItem('Open',
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
      }),
      new MenuBarItem('Download', () => {

      }, this.fullPathEmitter.asObservable(), null)
    ];
    this.menu = [new MenuBarItem('File', null, null, fileMenu)];
  }

  ngOnInit() {
    super.ngOnInit();
    this.parseArguments(this.programArgs);
  }

  public openFile (file: any): void {
    /**
      Opens the selected file
    */

    this.openFilePath(file.path);
  }

  public openFilePath (filePath: string): void {
    // only switch files if it's different
    if (this.pdfSource !== filePath) {
      this.pdfSource = filePath;
      this.fullPathEmitter.next(this.getFullpath(this.pdfSource.toString()));
    }
  }

  private getFullpath(partialPath: string): string {
    return BrowserComponent.ASSETS_ROOT + partialPath;
  }

  public windowResize (event: any): void {
  }

  // BEGIN: Private functions
  private parseArguments (args: any): void {
    /* Parses arguments and configures variables accordingly */
    let initialPath: string;
    if (args != null) {
      if (args.file != null) {
        initialPath = args.file.path;
      }
      if (args.src != null) {
        initialPath = args.src;
      }
    }
    if (initialPath == null) {
      initialPath = BrowserComponent.INITIAL_LOAD;
    }
    this.openFilePath(initialPath);
  }

  public windowClose() {
  }

  public increaseZoom() {
    this.zoom += BrowserComponent.ZOOM_INCREMENT;
  }

  public decreaseZoom() {
    if (this.canZoomOut()) {
      this.zoom -= BrowserComponent.ZOOM_INCREMENT;
    }
  }

  public canZoomOut() {
    return Math.round((this.zoom - BrowserComponent.ZOOM_INCREMENT) * 100) > 0;
  }

}
