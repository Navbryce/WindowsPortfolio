// event
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// environment
import { environment } from '../../environments/environment';

// services
import { HttpClient } from '@angular/common/http';

export class Filesystem {
    // backend url
    public static readonly backend: string = environment.backend.ip +
    (environment.backend.port.length > 0 ? (':' + environment.backend.port) : '');

    /**
     * returns the file's extension or null if there is no extension
     * @param filePath - the path to the file
     */
    public static getExtension (filePath: string): string {

        // it has a period to mark the file extension
        let extension = null;
        let indexCounter = filePath.length - 1;

        // search from the end to the start
        while (indexCounter >= 0) {
            if (filePath.substring(indexCounter, indexCounter + 1) === '.') {
                extension = filePath.substring(indexCounter + 1, filePath.length);
                // the extension has been found, stop the counter
                indexCounter = 0;
            }
            indexCounter--;
        }
        return extension;
    }
    /**
     * returns the file name
     * @param filePath the path of the file
     */
    public static getFileName (filePath: string): string {
        const removeCharacters = ['/', '\\'];
        removeCharacters.forEach((character) => {
            while (filePath.indexOf(character) >= 0) {
                const index = filePath.indexOf(character);
                filePath = filePath.substring(0, index + 1);
            }
        });
        return filePath;
    }

    set directory (newDirec: string) {
        // DO NOT USE TO CD
        this.currentDirectory = newDirec;
        this.directorySubject.next(newDirec);
    }
    get directory (): string {
        return this.currentDirectory;
    }

    public directoryContents: any;
    // subscribe to directory changes
    public directorySubject: BehaviorSubject<String> = new BehaviorSubject<String>('/');
    // subscribe to filesSubject to get file updates pushes
    public filesSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

    private client: HttpClient;
    private currentDirectory: string;

    constructor (client: HttpClient, startingDirectory: string = '/') {
        this.client = client;
        this.directory = startingDirectory;
        this.cd(startingDirectory);
    }

    public async cd (newDirec: string): Promise<Boolean> {
        return await this.updateFileList(this.directory + newDirec);
    }

    public async fileExists (filePath: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve) => {
            this.client.post(Filesystem.backend + '/fileExists', {path: filePath})
            .subscribe((success) => {
                resolve(<Boolean>success);
            }, (error) => {
                console.error(error);
                resolve(false);
            });
        });

    }

    // BEGIN: PRIVATE FUNCTIONS

    private checkFiles (files: any, name: string): any {
        /* Checks the inputed files for a file or directory with that name.
            returns null if it can't be found
        */
       const inspectList: Array<any> = files.files + files.dirs;

       let needle;
       inspectList.forEach(element => {
           if (element.name === name) {
                needle = element;
           }
       });

       return needle;
    }

    private async getFileList (path: String): Promise<any> {
        /* Return a promise that promises a list of all the
        files/directories*/
        return new Promise((resolve, reject) => {
            // define the body of the request
            const body = {
                currentDirectory: path
            };

            this.client.post(Filesystem.backend + '/files', body).subscribe((data: any) => {
                if (data.error != null) {
                    reject (data);
                } else {
                    resolve(data);
                }
            }, (error) => {
                reject([error]);
                console.error('The backend could not be queried');
                // handle the error in a more visual way for the user
            });
        });
    }

    /**
     * Updates the file list instance variable
     * @param path the paath to the directory
     */
    private async updateFileList (path: string): Promise<Boolean> {
        return new Promise<Boolean>(async (resolve, reject) => {
            try {
                this.directoryContents = await this.getFileList(path);
                // get the simplified path
                this.directory = this.directoryContents.simpPath;
                this.filesSubject.next(this.directoryContents);
                resolve(true);
                // console.log(this.directoryContents);
            } catch (error) {
                console.error(error);
                resolve(false);
            }
        });
    }
}
