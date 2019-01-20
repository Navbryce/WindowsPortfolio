import { Component, Input} from '@angular/core';
import { MenuBarItem } from '../menu-bar-item.class';

@Component({
    selector: 'menu',
    styleUrls: ['./menu.component.scss'],
    templateUrl: './menu.component.html'
})
export class MenuComponent {
    @Input() menu: MenuBarItem;
}
