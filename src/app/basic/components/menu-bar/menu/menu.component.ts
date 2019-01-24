import { Component, Input, OnInit} from '@angular/core';
import { MenuBarItem } from '../menu-bar-item.class';

@Component({
    selector: 'menu',
    styleUrls: ['./menu.component.scss'],
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    public menuOpen = false;
    @Input() menu: MenuBarItem;

    private closeListener: any = () => {
        if (this.menuOpen) {
            this.closeMenu();
        }
    }

    ngOnInit() {


    }

    public openMenu(): void {
        this.menuOpen = true;

        // wait a bit so the open event doesn't set off the close event
        setTimeout(() => {
            document.addEventListener('click', this.closeListener);

        }, 1);
    }

    public closeMenu(): void {
        this.menuOpen = false;
        document.removeEventListener('click', this.closeListener);
    }
}
