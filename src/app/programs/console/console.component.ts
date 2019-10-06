import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProgramComponent } from '../program-component.class';

// non angular components and classes
import { Console } from './console.class';

// services
import { HttpClient } from '@angular/common/http';
import { TaskbarService } from '../../services';

@Component({
  selector: 'console',
  styleUrls: ['./console.component.scss'],
  templateUrl: './console.component.html'
})
export class ConsoleComponent extends ProgramComponent {
  private history: Array<String> = [];

  public console: Console;
  public fontSize = 12;
  public lines: Array<String> = [];
  public set text (text: String) {
    this.inputArea.nativeElement.text = text;
  }

  @ViewChild('consoleWrapper') consoleWrapper: ElementRef;
  @ViewChild('inputArea') inputArea: ElementRef;

  constructor (private httpClient: HttpClient, private taskBarService: TaskbarService) {
    // generates defaults if not defined, such as id
    super();

    // bind the "this" context of addLine
    this.addLine = this.addLine.bind(this);
    this.console = new Console('/', 'navbryce', httpClient, this.addLine, taskBarService);
  }

  public addLine (line: String): boolean {
    this.lines.push(line);
    const consoleWrapper = this.consoleWrapper.nativeElement;
    // keep scrolled at bottom (give it 10ms to render the line)
    setTimeout(() => {
      consoleWrapper.scrollTop = consoleWrapper.scrollHeight;
    }, 10);
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
    this.history.push(command);
    this.addLine(this.console.user + '@' + this.console.directory + ' $ ' + command);
    return this.console.runCommandFromConsole(command);
  }

  public windowResize (event: any): void {

  }

  public windowClose() {
  }

  // BEGIN: Private Functions

}
