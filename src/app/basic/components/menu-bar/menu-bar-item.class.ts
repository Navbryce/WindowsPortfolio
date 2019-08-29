import {Observable} from 'rxjs/Observable';

export class MenuBarItem {
    constructor (public name: String, public eventListener: Function, public link: Observable<string> = null,
        public nestedMenu: Array<MenuBarItem> = null) {

    }
}
