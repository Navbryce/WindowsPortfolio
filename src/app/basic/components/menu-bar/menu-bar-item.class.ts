import {Observable} from 'rxjs';

export class MenuBarItem {
    constructor (public name: String, public eventListener: Function, public link: Observable<string> = null,
        public nestedMenu: Array<MenuBarItem> = null) {

    }
}
