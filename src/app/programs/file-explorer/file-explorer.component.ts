import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non angular components and classes
import { Filesystem } from '../../basic';

// services
import { HttpClient } from '@angular/common/http';
import { TaskbarService } from '../../services';

@Component({
  selector: 'file-explorer',
  styleUrls: ['./file-explorer.component.scss'],
  templateUrl: './file-explorer.component.html'
})
export class FileExplorerComponent extends ProgramComponent implements OnInit {
  public currentDirectory: string;
  public currentFiles: Array<any>;
  public disableSelect = false;
  public fileSystem: Filesystem;
  public readonly fileSelectCooldown: number;
  public selectedFile: any = null;

  constructor (private httpClient: HttpClient, private taskBarService: TaskbarService) {
    // generates defaults if not defined, such as id
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
        // try opening the file
        this.taskBarService.openFile(file);
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
  }

  public windowResize (event: any): void {

  }

  // BEGIN: Private Functions

  private filesTreeUpdate (files: any): void {
    // called when the file tree is updated (cd'ed up or down)
    if (files != null) {
      this.currentDirectory = files.simpPath;
      this.currentFiles = Filesystem.getFileArray(files);
    } else {
      this.currentFiles = null;
    }
  }

  private initializeValues (processedArguments: any): void {
    this.fileSystem = new Filesystem(this.httpClient,
      processedArguments.startingDirectory);
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
