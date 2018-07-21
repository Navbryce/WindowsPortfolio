import { TestProgram } from './test-program/test-program.component';

export var ProgramDefinitions = [ // positionOnLastClose set by window
  {
    component: TestProgram,
    id: "windowOne",
    icon: "./assets/taskbar-assets/images/windows.png",
    openOnStart: false,
    pin: {
      desktop: false,
      taskbar: true
    },
    unique: true
  },
  {
    component: TestProgram,
    id: "windowTwo",
    icon: "./assets/taskbar-assets/images/windows.png",
    openOnStart: true,
    pin: {
      desktop: false,
      taskbar: false
    },
    unique: true
  }
]
