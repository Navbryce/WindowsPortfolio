import { ConsoleComponent } from './console'
import { TestProgram } from './test-program/test-program.component';

export var ProgramDefinitions = [ // positionOnLastClose set by windodw
  {
    component: ConsoleComponent,
    id: 'console',
    icon: './assets/programs/console/terminal-icon.png',
    name: 'Console',
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false
  },
  {
    component: TestProgram,
    id: "windowOne",
    icon: "./assets/taskbar-assets/images/windows.png",
    name: "Settings",
    openOnStart: false,
    pin: {
      desktop: true,
      taskbar: true
    },
    unique: false
  },
  {
    component: TestProgram,
    id: "windowTwo",
    icon: "./assets/taskbar-assets/images/windows.png",
    name: "Geforce Experience",
    openOnStart: true,
    pin: {
      desktop: true,
      taskbar: false
    },
    unique: false
  }
]
