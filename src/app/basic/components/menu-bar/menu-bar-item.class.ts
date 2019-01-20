export class MenuBarItem {
    constructor (public name: String, public eventLister: Function,
        public nestedMenu: Array<MenuBarItem> = null) {

    }
}
