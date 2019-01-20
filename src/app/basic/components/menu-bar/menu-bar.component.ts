import { Component, Input } from '@angular/core';

// non-angular classes
import { MenuBarItem } from './menu-bar-item.class';

@Component({
    selector: 'menu-bar',
    styleUrls: ['./menu-bar.component.scss'],
    templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent {
    @Input() menu: Array<MenuBarItem>;
}
