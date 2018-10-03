import { Commands } from './commands.var';

export class Console {
  private currentDirectory: String;
  private currentUser: String;

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

  constructor (directory: String, user: String) {
    this.directory = directory;
    this.user = user;
  }
}
