import { Component } from '@angular/core';
import { ProgramComponent } from '../../program-component.class';

@Component({
    selector: 'file-select',
    styleUrls: ['./file-select.component.scss'],
    templateUrl: './file-select.component.html'
})
export class FileSelectComponent extends ProgramComponent {
    constructor () {
        // generates defaults if not defined, such as id
        super();
    }
    public windowResize (event: any): void {

    }
}
