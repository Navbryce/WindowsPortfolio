import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non angular components and classes
import { Console } from './console.class';

@Component({
  selector: 'console',
  styleUrls: ['./console.component.scss'],
  templateUrl: './console.component.html'
})
export class ConsoleComponent extends ProgramComponent {
  public console: Console;
  public fontSize: number = 12;
  public lines: Array<String> = [];

  @ViewChild('consoleWrapper') consoleWrapper: ElementRef;
  @ViewChild('inputArea') inputArea: ElementRef;

  constructor () {
    super(); // generates defaults if not defined, such as id
    this.console = new Console("/home/", "navbryce");
  }

  public consoleKeyListener (event: any): void {
    var command = event.srcElement.value;
    this.inputArea.nativeElement.value = '';

    // prevent enter from making a space
    event.preventDefault();

    this.runCommand(command);
  }

  public runCommand (command: String): boolean {
    // add the command
    this.addLine(this.console.user + '@' + this.console.directory + ' $ ' + command);
    return true;
  }

  public windowResize (event: any): void {

  }

  // BEGIN: Private Functions
  private addLine (line: String): boolean {
    this.lines.push(line);
    let consoleWrapper = this.consoleWrapper.nativeElement;
    consoleWrapper.scrollTop = consoleWrapper.scrollHeight;
    return !!line;
  }
}
