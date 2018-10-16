import { Commands } from './commands.var';

// services
import { TaskbarService } from '../../services';

export class Console {
  private currentDirectory: String;
  private currentUser: String;
  private outputListener: Function;
  private taskbarService: TaskbarService

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

  constructor (directory: String, user: String, outputListener: Function,
  taskbarService: TaskbarService) {
    this.directory = directory;
    this.user = user;
    this.outputListener = outputListener; // called when trying to output something
    this.taskbarService = taskbarService;
  }

  public executeCommand (command: any, args: Array<String>): boolean {
    // text output
    if (!!command.output) {
      command.output.forEach((outputLine: String) => {
        this.output(outputLine);
      });
    }

    if (!!command.launch) {
      command.launch.forEach((programID: string) => {
        this.launchProgram(programID);
      });
    }
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

  private launchProgram (programID: string) {
    /* Launches the program with the programID */
    this.taskbarService.createProgramInstanceFromId(programID);
  }

  private output (line: String): void {
    /* call when trying to output something */
    this.outputListener(line);
  }

  // END Private Functions
}
