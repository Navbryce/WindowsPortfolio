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

    constructor (client: HttpClient, startingDirectory: string = '/') {
        this.client = client;
        this.directory = startingDirectory;
    }

    private getFileList (path: String): Array<String> {
        // define the body of the request
        const body = {
            currentDirectory: this.directory
        };

        this.client.post(Filesystem.backend + '/files', body).subscribe((data) => {
            console.log(data);
        }, (error) => {
            console.error(error);
            console.error('The backend could not be queried');
            // handle the error in a more visual way for the user
        });
        return [];
    }

    private updateFileList (): Array<String> {
        return this.getFileList(this.directory);
    }
}
