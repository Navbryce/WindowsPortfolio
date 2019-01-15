import { Component } from '@angular/core';
import { ProgramComponent } from '../../program-component.class';

@Component({
    selector: 'file-select',
    styleUrls: ['./file-select.component.scss'],
    templateUrl: './file-select.component.html'
})
export class FileSelectComponent extends ProgramComponent {
    public currentFile: any;
    public currentFileName: string;

    constructor () {
        // generates defaults if not defined, such as id
        super();
    }

    public fileSelect (file: any): void {
        if (!!file && file.isFile) {
            this.currentFile = file;
            this.currentFileName = file.name;
        }
    }

    public windowResize (event: any): void {

    }
}
