import { BrowserComponent } from './browser';
import { ConsoleComponent } from './console'
import { TestProgram } from './test-program/test-program.component';

export var ProgramDefinitions = [ // positionOnLastClose set by windodw
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
    component: BrowserComponent,
    id: 'browser',
    icon: './assets/programs/browser/browser.png',
    name: 'Browser',
    openOnStart: true,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false
  }
];
