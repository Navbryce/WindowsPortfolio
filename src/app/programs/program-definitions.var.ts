import { TestProgram } from './test-program/test-program.component';

export var ProgramDefinitions = [ // positionOnLastClose set by window
  {
    component: TestProgram,
    id: "windowOne",
    icon: "./assets/taskbar-assets/images/windows.png",
    name: "Test Program One",
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
