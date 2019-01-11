import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

// non angular components and classes
import { Filesystem } from '../../../basic';

// services
import { HttpClient } from '@angular/common/http';
import { TaskbarService } from '../../../services';
import { ProgramComponent } from '../../program-component.class';

@Component({
  selector: 'file-explorer-core',
  styleUrls: ['./file-explorer-core.component.scss'],
  templateUrl: './file-explorer-core.component.html'
})
export class FileExplorerCore extends ProgramComponent implements OnInit {
  public currentDirectory: string;
  public currentDirectoryPieces: Array<string>;
  public currentFiles: Array<any>;
  public disableSelect = false;
  public fileSystem: Filesystem;
  public readonly fileSelectCooldown: number;
  public selectedFile: any = null;

  @Input() programArgs: any;

  // emits when a file has been double clicked (or clicked twice when selected)
  @Output() fileOpenEmitter: EventEmitter<any> = new EventEmitter<any>();
  // emits when a file has been clicked once and has focus (highlighted)
  @Output() fileSelectEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor (private httpClient: HttpClient, private taskBarService: TaskbarService) {
    super();
  }

  public ngOnInit () {
    this.processProgramArguments(this.programArgs);
  }

  public fileClicked (file: any): void {
    /**
     * Called when a file/folder is double clicked
     * or has been selected and is clicked
     */
    if (!this.disableSelect) {
      // ensure the action isn't called twice for the same action (has to do with double click vs two single clicks)
      this.disableSelect = true;
      setTimeout(() => {
        this.disableSelect = false;
      }, this.fileSelectCooldown);

      // unselect any files that might have been selected
      if (this.selectedFile != null) {
        this.selectedFile.selected = false;
        this.selectedFile = null;
      }
      file.selected = false;

      // actually do something because the file has been double clicked


      // call the appropriate listeners/event handlers
      if (file.isFile) {
        // handle open event'
        this.fileOpenEmitter.next(file);
      } else {
        // it's a directory, so cd
        this.fileSystem.cd('./' + file.name);
      }
    }
  }

  public fileSelect (file: any): void {
    /* NOT THE SAME AS DOUBLE CLICKING. A SINGLE CLICK */
    if (this.selectedFile != null) {
      // the file has been clicked when already selected
      if (file === this.selectedFile) {
        this.fileClicked(file);
      } else {
        // unselect the current file
        this.selectedFile.selected = false;

        // update what is selected
        this.selectedFile = file;
        this.selectedFile.selected = true;
      }
    } else {
      // select the current file
      this.selectedFile = file;
      this.selectedFile.selected = true;
    }
    this.fileSelectEmitter.emit(this.selectedFile);
  }

  public windowResize (event: any): void {

  }

  // BEGIN: Private Functions

  private filesTreeUpdate (files: any): void {
    // called when the file tree is updated (cd'ed up or down)
    if (files != null) {
      this.currentDirectory = files.simpPath;
      this.currentDirectoryPieces = this.fileSystem.getCurrentPieces();
      this.currentFiles = this.fileSystem.getFileArray(files);
    } else {
      this.currentFiles = null;
    }
  }

  private initializeValues (processedArguments: any): void {
    this.fileSystem = new Filesystem(this.httpClient,
      processedArguments.startingDirectory, this.taskBarService.getDefaultProgramsMap());
    this.fileSystem.filesSubject.subscribe((files) => {
      this.filesTreeUpdate(files);
    });
  }

  private processProgramArguments (args: any): void {
    /**
     * Processes program arguments, such as starting directory
     */
    const defaultArguments = {
      startingDirectory: '/'
    };

    // fills in gaps with defaults
    let resultArguments;
    if (args != null) {
      resultArguments = super.compareToDefaultArguments(args, defaultArguments);
    } else {
      resultArguments = defaultArguments;
    }

    // initialize the values for the class
    this.initializeValues(resultArguments);
  }

}
