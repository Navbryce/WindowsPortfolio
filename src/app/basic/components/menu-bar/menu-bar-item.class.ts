export class MenuBarItem {
    constructor (public name: String, public eventListener: Function,
        public nestedMenu: Array<MenuBarItem> = null) {

    }
}
