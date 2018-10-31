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
