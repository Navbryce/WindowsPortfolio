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
    // the "faux" root directory
    public static readonly root: string = '/assets/portfolio-documents';

    get directory (): string {
        return this.currentDirectory;
    }

    public directoryContents: any;
    // subscribe to filesSubject to get file updates pushes
    public filesSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

    private client: HttpClient;
    private currentDirectory: string;

    constructor (client: HttpClient, startingDirectory: string = '/') {
        this.client = client;
        this.cd(startingDirectory);
    }

    public async cd (directory: String) {
        this.currentDirectory = Filesystem.root + directory;
        this.updateFileList();
    }

    private async getFileList (path: String): Promise<any> {
        /* Return a promise that promises a list of all the
        files/directories*/
        return new Promise((resolve, reject) => {
            // define the body of the request
            const body = {
                currentDirectory: this.directory
            };

            this.client.post(Filesystem.backend + '/files', body).subscribe((data: Array<any>) => {
                resolve(data);
            }, (error) => {
                reject([error]);
                console.error('The backend could not be queried');
                // handle the error in a more visual way for the user
            });
        });
    }

    private async updateFileList () {
        try {
            this.directoryContents = await this.getFileList(this.directory);
        } catch (error) {
            console.error(error);
            this.directoryContents = {files: [], dirs: []};
        }
        this.filesSubject.next(this.directoryContents);
    }
}
