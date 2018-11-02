import { Filesystem } from '../../basic';

/**
 * The command execute when 'pdf' is called in the console
 * @param args  - the command arguments
 * @param fileSystem  - the file system object
 * @param output - the function that can be used to output text
 * @param executeCommand  - pass a command to this function to execute it
 */
export async function browserCommand (args: Array<string>, fileSystem: Filesystem,
    output: Function, executeCommand: Function) {
    const fileName = args[0];
    if (Filesystem.getExtension(fileName) === 'pdf') {
        if (await fileSystem.fileExists(fileName)) {
            /*
            launch the actual pdf component. do it through the console instead
            of directly
            */
            const command = {
                launch: [
                    {
                        argsMap: [
                            'src'
                        ],
                        id: 'browser'
                    }
                ]
            };
            executeCommand(command, [fileSystem.directory + '/' + fileName]);
        } else {
            output(`The file ${fileName} does not exist`);
        }
    } else {
        output(`The file ${fileName} is not of type pdf`);
    }
}
