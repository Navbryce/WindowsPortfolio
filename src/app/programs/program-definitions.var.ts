import { BrowserComponent } from './browser';
import { ConsoleComponent } from './console';
import { FileExplorerComponent, FileSelectComponent } from './file-selector/';
import { TestProgram } from './test-program/test-program.component';
import { InfoBoxComponent } from './info-box/info-box.component';

export let ProgramDefinitions = [ // positionOnLastClose set by windodw
  {
    component: ConsoleComponent,
    id: 'console',
    icon: './assets/programs/console/terminal-icon.png',
    name: 'Console',
    openOnStart: true,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false
  },
  {
    component: FileExplorerComponent,
    id: 'file-explorer',
    icon: './assets/programs/file-explorer/folder-icon.png',
    name: 'File Explorer',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false
  },
  {
    component: BrowserComponent,
    id: 'browser',
    icon: './assets/programs/browser/browser.png',
    name: 'Browser',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false,
    openFiles: [
      'pdf'
    ]
  },
  {
    component: InfoBoxComponent,
    id: 'info-box',
    icon: './assets/programs/info-box/info.png',
    name: 'Info Box',
    openOnStart: false,
    pin: {
      desktop: false,
      taskbar: false
    },
    unique: false,
    alwaysUsePreferred: true,
    preferred: {
      width: 400,
      height: 150
    }
  },
  {
    component: FileSelectComponent,
    id: 'file-selector',
    icon: './assets/programs/file-explorer/folder-icon.png',
    name: 'File Selector',
    openOnStart: true, // change to false before production
    pin: {
      desktop: false,
      taskbar: false
    },
    unique: false,
  },
  {
    id: 'github',
    icon: './assets/programs/link-programs/github.png',
    name: 'Github',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: true
    },
    webLink: 'https://github.com/Navbryce'
  },
  {
    id: 'gitlab',
    icon: './assets/programs/link-programs/gitlab.png',
    name: 'Gitlab',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: false
    },
    webLink: 'https://gitlab.com/navbryce/'
  },
  {
    id: 'linkedin',
    icon: './assets/programs/link-programs/linkedin.png',
    name: 'Linkedin',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: false
    },
    webLink: 'https://www.linkedin.com/in/bryce-plunkett-930b77164'
  }
];
