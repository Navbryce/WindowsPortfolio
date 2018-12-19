# WindowsPortfolio
A portfolio website that emulates Windows 10. This website can be easily configured to work for anybody, even for those with little to node coding experience.

# Major Dependencies
* node.js >= 11.2.0
* npm >= 5.6.0
* angular ^5.0.0 
* express ^4.16.4

# Developing for personal use
Follow [this wiki page](https://github.com/Navbryce/WindowsPortfolio/wiki/Getting-Started-as-a-Developer) if you would like to develop and configure a portfolio for personal use. The wiki also includes instructions for setting up free, Heroku hosting.

# Deploying
Must have node.js and npm with the versions stated above. Must also have angular-cli@1.7.4 installed globally. NOTE: This is *not* how you should deploy the project if you want to develop it and make changes. 

1. Clone the repository and cd into its root directory
2. `npm install`
3. `npm run build`
4. `node ./backend.js`
5. Access portfolio at `localhost:8080` or `localhost:{{PORT}}` if the environment variable PORT is defined


# Demo
http://www.bryceplunkett.com/

# Need help?
Submit a ticket in the [issue tracker](https://github.com/Navbryce/WindowsPortfolio/issues) or shoot me an e-mail at plunkett.bryce.m@gmail.com
