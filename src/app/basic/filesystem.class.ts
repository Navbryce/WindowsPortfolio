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
        this.client.get(Filesystem.backend + '/files').subscribe((data) => {
            console.log(data);
        });
        return [];
    }

    private updateFileList (): Array<String> {
        return this.getFileList(this.directory);
    }
}
