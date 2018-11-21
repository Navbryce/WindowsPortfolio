import { Commands } from './commands.var';

// services
import { HttpClient } from '@angular/common/http';
import { TaskbarService } from '../../services';

// classes
import { Filesystem } from '../../basic';

export class Console {
  private currentDirectory: String;
  private currentUser: String;
  private fileSystem: Filesystem;
  private outputListener: Function;
  private taskbarService: TaskbarService;

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

  constructor (directory: string, user: String, httpClient: HttpClient,
    outputListener: Function, taskbarService: TaskbarService) {
    this.directory = directory;
    this.user = user;
    this.fileSystem = new Filesystem(httpClient, directory,
      taskbarService.getDefaultProgramsMap());
    // subscribe to changes in directory
    this.fileSystem.directorySubject.subscribe((newValue: string) => {
      this.directory = newValue;
    });
    // the function called when trying to output something
    this.outputListener = outputListener;
    this.taskbarService = taskbarService;
  }

  public executeCommand (command: any, args: Array<String>): boolean {
    let runCommand;
    if (command != null) {
      // text output
      if (!!command.output) {
        command.output.forEach((outputLine: String) => {
          this.output(this.substituteArgs(outputLine, args));
        });
      }

      // the command wants to run a function
      if (!!command.commandFunction) {
        // bind the this contexts
        this.output = this.output.bind(this); // used to output text
        this.executeCommand = this.executeCommand.bind(this); // used to execute a command object
        command.commandFunction(args, this.fileSystem, this.output,
          this.executeCommand);
      }

      // the command should run any other commands
      if (!!command.execute) {
        runCommand = true;

        command.execute.forEach((subCommand: any) => {
          const commandObject = this.getCommandFromID(subCommand.id, true);
          const subArgs = subCommand.args.map((argIndex) => {
            return argIndex < args.length ? args[argIndex] : null;
          });
          this.executeCommand(commandObject, subArgs);
        });
      }

      // the command should launch any programs (windows)
      if (!!command.launch) {
        command.launch.forEach((programLaunchObject: any) => {
          this.launchProgram(programLaunchObject, args);
        });
      }
    } else {
      runCommand = false;
    }


    return runCommand;
  }

  public runCommandFromConsole (command: String): boolean {
    /* Runs a command. Returns true if successful */
    const args = this.getArgs(command);
    const commandObject = this.getCommandFromID(args[0], true);
    args.splice(0, 1);
    return !!commandObject && this.executeCommand(commandObject, args);
  }

  // BEGIN Private Functions

  private getArgs (command: String): Array<string> {
    /*Breaks command into array of arguments*/

    // get rid of extra spaces
    command = command.replace(/  +/g, ' ');

    return command.split(' ');
  }

  private getCommandFromID (id: string, printError: boolean): any {
    /* Gets the command from the id */
    const command = Commands[id];
    if (!command) {
      this.output(`${id} is not recognized as an internal or external command.` 
      + ` Run "help" for a list of commands.`);
    }
    return command;
  }

  private launchProgram (programLaunch: any, args: Array<String>): Error {
    /* Launches the program with the programID */
    let error: Error = null;
    const map = programLaunch.argsMap;
    let programArgs = null; // null by default
    if (programLaunch.argsMap != null) {
      programArgs = {};
      for (let counter = 0; counter < programLaunch.argsMap.length; counter++) {
        if (counter < args.length) {
          // null signifies not use the argument at that index
          if (map[counter] != null) {
            /*
            the index represents which argument in the array of arguments to use.
            the value at the index represents the key to store that value under
            */
           programArgs[map[counter]] = args[counter];
          }
        } else {
          error = new Error('Not enough arguments supplied');
          break;
        }
      }
    }
    // if there is no error
    if (!error) {
      this.taskbarService.createProgramInstanceFromId(programLaunch.id, programArgs);
    }
    return error;
  }

  private output (line: String): void {
    /* call when trying to output something */
    this.outputListener(line);
  }

  private substituteArgs (line: String, args: Array<String>): String {
    /* Substitutes in the the args into the string following the format
      ${number} where number represents arg index. Nesting not supported */
    let output = '';

    while (line.includes('${')) {
      const index = line.indexOf('${');
      const endIndex = line.indexOf('}');
      if (endIndex !== -1) {
        const argNumber = parseInt(line.substring(index + 2, endIndex), 10);

        let arg;
        if (argNumber !== NaN && argNumber < args.length) {
          arg = args[argNumber];
        } else {
          arg = '';
        }
        // add everything before the arg and the arg to the output
        output += line.substring(0, index) + arg;
        // cut off the end of the line and reduce it
        line = line.substring(endIndex + 1, line.length);
      } else {
        // there's no more close brackets so no more args need to be substituted
        output += line;
        line = '';
      }
    }
    output += line; // the rest of the line

    return output;
  }

  // END Private Functions
}
