import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

@Component({
  selector: 'console',
  styleUrls: ['./console.component.scss'],
  templateUrl: './console.component.html'
})
export class ConsoleComponent extends ProgramComponent {
  public currentDirectory: String = "c:/users/"
  public fontSize: number = 12;
  public lines: Array<String> = [];
  public user: String = "navbryce"

  @ViewChild('consoleWrapper') consoleWrapper: ElementRef;
  @ViewChild('inputArea') inputArea: ElementRef;

  constructor () {
    super(); // generates defaults if not defined, such as id
  }

  public consoleKeyListener (event: any): void {
    var command = event.srcElement.value;
    this.inputArea.nativeElement.value = '';

    // prevent enter from making a space
    event.preventDefault();

    this.runCommand(command, this.currentDirectory, this.user);
  }

  public runCommand (command: String, currentDirectory: String, user: String): boolean {
    // add the command
    this.addLine(user + '@' + currentDirectory + ' $ ' + command);
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
