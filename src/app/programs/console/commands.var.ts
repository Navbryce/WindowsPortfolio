import { ProgramDefinitions } from '..';

// export at bottom

var RawCommands: any = {
  help: {
    output: [
      "Welcome to the help menu",
      "<b>Commands: </b>",
    ]
  },
  github: {
    output: [
      "<a href='https://github.com/navbryce/' target='_blank'>Click here</a>"
    ]
  },
  gitlab: {
    output: [
      "<a href='https://gitlab.com/navbryce/' target='_blank'>Click here</a>"
    ]
  },
  console: {
    launch: [
      "console"
    ]
  }
};

function getCommandsList (commands: any): Array<String> {
  /* gets all the commands as an array of strings.
    does NOT set any instance/global variables */
  var commandList: Array<String> = [];
  var commandsToExclude = ["help"];
  Object.keys(commands).forEach((command) => {
    if (!commandsToExclude.includes(command)) {
      commandList.push(command);
    }
  });
  return commandList;
}

function processCommands (commands: any): any {
  /* processes the commands */

  // get all the commands as an array of strings
  var commandsList = getCommandsList(commands);
  // add all the commands to the help command output
  commands.help.output = commands.help.output.concat(commandsList);

  // return the modified commands object
  return commands;
}

// export the Commands object
export var Commands = processCommands(RawCommands);
