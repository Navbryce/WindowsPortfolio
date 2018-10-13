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
    // generates defaults if not defined, such as id
    super();

    // bind the "this" context of addLine
    this.addLine = this.addLine.bind(this);

    this.console = new Console("/home/", "navbryce", this.addLine);
  }

  public addLine (line: String): boolean {
    this.lines.push(line);
    let consoleWrapper = this.consoleWrapper.nativeElement;
    // keep scrolled at bottom
    consoleWrapper.scrollTop = consoleWrapper.scrollHeight;
    return !!line;
  }

  public consoleKeyListener (event: any): void {
    /* event listener for enter key for console input */
    var command = event.srcElement.value;
    this.inputArea.nativeElement.value = '';

    // prevent enter from making a space
    event.preventDefault();

    this.runCommand(command);
  }


  public focusChanged (event: boolean): void {
    /* Called when the focus changes */
    this.giveFocus = this.giveFocus.bind(this); // set this context
    // if true, wait so the clicked div doesn't steal the focus
    event && setTimeout(this.giveFocus, 50);
  }

  public giveFocus (): void {
    /* Call to give focus to the input area of the console */
    this.inputArea.nativeElement.focus();
  }

  public runCommand (command: String): boolean {
    // run the command

    // add the line to the console history
    this.addLine(this.console.user + '@' + this.console.directory + ' $ ' + command);
    return this.console.runCommand(command);
  }

  public windowResize (event: any): void {

  }

  // BEGIN: Private Functions

}
