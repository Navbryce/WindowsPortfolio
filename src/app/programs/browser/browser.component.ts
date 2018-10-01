import { Component } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

@Component({
  selector: "browser",
  templateUrl: "./browser.component.html",
  styleUrls: ["./browser.component.scss"]
})
export class BrowserComponent extends ProgramComponent {
  constructor () {
    super();
  }

  public windowResize (event: any): void {
  }

}
