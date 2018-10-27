// environment
import { environment } from '../../environments/environment';

// services
import { HttpClient } from '@angular/common/http';

export class Filesystem {
    // backend url
    public static readonly backend: string = environment.backend.ip +
    ':' + environment.backend.port;
    // the "faux" root directory
    public static readonly root: string = '/assets/portfolio-documents';

    get directory (): string {
        return this.currentDirectory;
    }
    set directory (directory: string) {
        this.currentDirectory = Filesystem.root + directory;
        this.updateFileList();
    }

    private client: HttpClient;
    private currentDirectory: string;
    private directoryContents: Array<any>;

    constructor (client: HttpClient, startingDirectory: string = '/') {
        this.client = client;
        this.directory = startingDirectory;
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
        this.directoryContents = await this.getFileList(this.directory);
    }
}
