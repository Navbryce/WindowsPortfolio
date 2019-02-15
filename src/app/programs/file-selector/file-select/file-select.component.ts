import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgramComponent } from '../../program-component.class';
import { TaskbarService } from '../../../services';
import { FileExplorerCore } from '../file-explorer-core';

@Component({
    selector: 'file-select',
    styleUrls: ['./file-select.component.scss'],
    templateUrl: './file-select.component.html'
})
export class FileSelectComponent extends ProgramComponent implements OnInit {
    public currentFile: any;
    public currentFileName: string;
    public currentFilter: Array<String> = null;
    public eventHandler: Function;
    public filters: Array<Array<String>>;

    @ViewChild(FileExplorerCore) explorer: FileExplorerCore;

    constructor (private taskbarService: TaskbarService) {
        // generates defaults if not defined, such as id
        super();
    }

    public ngOnInit () {
        this.processArguments(this.programArgs);

        if (this.filters != null) {
            this.currentFilter = this.filters[0];
        }
    }

    /* Called when the open button is clicked */
    public open (): void {
        const fileSystem = this.explorer.fileSystem;
        /* could be different from the current file if the user edited input.
        make sure it exists */
        fileSystem.fileExists(this.currentFileName)
            .then((exists: boolean) => {
                if (exists) {
                    this.close(this.currentFile);
                } else {
                    this.taskbarService.createInfoBox('The file you selected does not exist.',
                    'info', null);
                }
            });
    }

    /* Called when the cancel button is clicked */
    public cancel (): void {
        this.close(null);
    }

    /* Called to close dialogue */
    public close (fileSelected: any): void {
        if (!!fileSelected) {
            this.eventHandler(fileSelected);
        }
        // close the program
        this.taskbarService.closeProgram(this.id);
    }

    public fileSelect (file: any): void {
        if (!!file && file.isFile) {
            this.currentFile = file;
            this.currentFileName = file.name;
        }
    }

    public windowResize (event: any): void {

    }

    // BEGIN: PRIVATE FUNCTIONS

    private processArguments (args: any) {
        const defaultArgs = {
            eventHandler () {
                // do nothing by default
            },
            filters: []
        };
        const processedArgs = args == null ?  defaultArgs
            : super.compareToDefaultArguments(args, defaultArgs);
        this.filters = processedArgs.filters.length === 0 ? null
                        : processedArgs.filters;
        this.eventHandler = processedArgs.eventHandler;

    }
}
