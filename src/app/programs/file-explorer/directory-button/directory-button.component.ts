import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// not angular classes
import { Filesystem } from '../../../basic/';

@Component({
    selector: 'directory-button',
    templateUrl: './directory-button.component.html',
    styleUrls: ['./directory-button.component.scss']
})
export class DirectoryButtonComponent implements OnChanges {
    public simplifiedPath = '';

    @Input() path = '';

    ngOnChanges (changes: SimpleChanges) {
        if (this.path === '/') {
            this.simplifiedPath = '/';
        } else if (this.path != null) {
            this.simplifiedPath = Filesystem.getFileName(this.path);
        }
    }
}
