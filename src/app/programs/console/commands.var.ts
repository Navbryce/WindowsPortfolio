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
      "<a href='https://github.com/navbryce/' target='_blank'>Click here for GitHub</a>"
    ]
  },
  gitlab: {
    output: [
      "<a href='https://gitlab.com/navbryce/' target='_blank'>Click here for GitLab</a>"
    ]
  },
  git: {
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
  console: {
    launch: [
      {
        id: 'console',
        args: ''
      }
    ]
  },
  resume: {
    output: [
      "<a href='/assets/portfolio-documents/SoftwareResume.pdf' target='_blank'>Click here for Resume</a>"
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
