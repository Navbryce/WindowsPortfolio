import { Filesystem } from '../../basic';

/**
 * The command execute when 'pdf' is called in the console
 * @param args  - the command arguments
 * @param fileSystem  - the file system object
 * @param output - the function that can be used to output text
 * @param executeCommand  - pass a command to this function to execute it
 */
export function browserCommand (args: Array<string>, fileSystem: Filesystem,
    output: Function, executeCommand: Function) {
    let fileName = args[0];
    console.log(Filesystem.getExtension(fileName));
}
