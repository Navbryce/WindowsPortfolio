import { Filesystem } from '../../basic';
import { browserCommand } from '../browser/browser-command.function';

import { environment} from '../../../environments/environment';
// export at bottom

const RawCommands: any = {
  help: {
    output: [
      'Welcome to the help menu',
      '<b>Commands: </b>',
    ]
  },
  cd: {
    genHelp: 'Move between directories',
    async commandFunction (args: Array<string>, fileSystem: Filesystem, output: Function, executeCommand: Function) {
      const result = await fileSystem.cd(args[0]);
      !result && output(`cd: ${args[0]}: No such file or directory`);
    }
  },
  ls: {
    genHelp: 'List files and directories in current directory',
    commandFunction (args: Array<String>, fileSystem: Filesystem, output: Function, executeCommand: Function) {
      fileSystem.directoryContents.files.forEach((file) => {
        output(file.name);
      });
      fileSystem.directoryContents.dirs.forEach((dir) => {
        output(`<span class='directory'>${dir.name}/</span>`);
      });
    }
  },
  pdf: {
    genHelp: 'Open PDFs',
    commandFunction: browserCommand
  },
  github: {
    genHelp: 'Get Bryce\'s GitHub',
    output: [
      '<a href=\'https://github.com/navbryce/\' target=\'_blank\'>Click here for GitHub</a>'
    ]
  },
  gitlab: {
    genHelp: 'Get Bryce\'s GitLab',
    output: [
      '<a href=\'https://gitlab.com/navbryce/\' target=\'_blank\'>Click here for GitLab</a>'
    ]
  },
  git: {
    genHelp: 'Get all of Bryce\'s different Git accounts',
    execute: [
      {
        id: 'github',
        args: [
        ]
      },
      {
        id: 'gitlab',
        args: [
        ]
      }
    ]
  },
  linkedin: {
    genHelp: 'Get Bryce\'s LinkedIn',
    output: [
      '<a href=\'https://www.linkedin.com/in/bryce-plunkett-930b77164\' target=\'_blank\'>Click here for LinkedIn</a>'
    ]
  },
  console: {
    genHelp: 'Open another console',
    launch: [
      {
        id: 'console',
        args: ''
      }
    ]
  },
  resume: {
    genHelp: 'Get a link directly to Bryce\'s resume',
    output: [
      `<a href='/assets/portfolio-documents${environment.resumePath}' target='_blank'>Click here for Resume</a>`
    ]
  }
};

function getCommandsList (commands: any): Array<string> {
  /* gets all the commands as an array of strings.
    does NOT set any instance/global variables */
  const commandList: Array<string> = [];
  const commandsToExclude = ['help'];
  Object.keys(commands).forEach((command) => {
    if (!commandsToExclude.includes(command)) {
      commandList.push(command);
    }
  });
  return commandList;
}

function processCommands (commands: any): any {
  const commandList: Array<string> = getCommandsList(commands);
  /* processes the commands */

  // find the longest command, not the most efficient, but quick to type
  const longestCommand: number = Math.max.apply(null, (commandList.map((commandID) => {
    return commandID.length;
  })));

  // get all the commands as an array of strings and create a new array of strings with the help info
  const distanceToDef = longestCommand + 5;
  const helpList = commandList.map((commandID: string, index: number) => {
    let output = `${index + 1}) ${commandID}`;
    let numberOfPeriods = distanceToDef - commandID.length;
    while (numberOfPeriods > 0) {
      output += '.';
      numberOfPeriods--;
    }
    const command = RawCommands[commandID];
    if (!!command.genHelp) {
      output += command.genHelp;
    }
    return output;
  });

  // add all the commands to the help command output
  commands.help.output = commands.help.output.concat(helpList);

  // return the modified commands object
  return commands;
}

// export the Commands object
export const Commands = processCommands(RawCommands);
