import { Commands } from './commands.var';

export class Console {
  private currentDirectory: String;
  private currentUser: String;
  private outputListener: Function;

  get directory (): String {
    return this.currentDirectory;
  }

  set directory (directory: String) {
    this.currentDirectory = directory;
  }

  get user (): String {
    return this.currentUser;
  }

  set user (user: String) {
    this.currentUser = user;
  }

  constructor (directory: String, user: String, outputListener: Function) {
    this.directory = directory;
    this.user = user;
    this.outputListener = outputListener; // called when trying to output something
  }

  public executeCommand (command: any, args: Array<String>): boolean {
    command.output.forEach((outputLine: String) => {
      this.output(outputLine);
    });
    console.log(args);
    return true;
  }

  public runCommandFromConsole (command: String): boolean {
    /* Runs a command. Returns true if successful */
    var args = this.getArgs(command);
    var commandObject = Commands[args[0]];
    args.splice(0, 1);
    return !!commandObject && this.executeCommand(commandObject, args);
  }

  // BEGIN Private Functions

  private getArgs (command: String): Array<string> {
    /*Breaks command into array of arguments*/

    // get rid of extra spaces
    command = command.replace(/  +/g, ' ');

    return command.split(" ");
  }

  private output (line: String): void {
    /* call when trying to output something */
    this.outputListener(line);
  }

  // END Private Functions
}
