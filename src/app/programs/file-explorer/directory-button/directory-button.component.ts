import { Component, Input } from '@angular/core';

@Component({
    selector: 'directory-button',
    templateUrl: './directory-button.component.html',
    styleUrls: ['./directory-button.component.scss']
})
export class DirectoryButtonComponent {
    @Input() path = '';
}
