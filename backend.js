const express = require('express');

const ArgumentParser = require('argparse').ArgumentParser;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// parse arguments
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Windows Portfolio Backend'
});

parser.addArgument(
  [ '-d', '--dist' ],
  {
    help: 'path from app (as root) that points to dist. don\'t include / at start',
    defaultValue: 'dist/'
  }
);
var args = parser.parseArgs();
const distPath = path.join(__dirname, args.dist);

// Serve only the static files form the npmdist directory
app.use(express.static(distPath));
// Parse the bodies from all requests
app.use(bodyParser.json());
// CORS
app.use(function(req, res, next) {
    /* Enable CORS requests */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.get('/', (req,res) => {
    /* Route to the angular app */
    res.sendFile(distPath + '/index.html'); //_dirname = path to app
});

/* POST Requests */

app.post("/files", (req, res) => {
    /* Let the angular app know the files in a directory */
    getFiles(req.body.currentDirectory).then((success) => {
        res.json(success);
    })
    .catch((error) => {
        res.json({error: error});
    });
});


/* Listen for the app on the Heroku port (if set as an env variable)
or default to 8080. */
app.listen(process.env.PORT || 8080);

/* Helper Functions */

async function getFiles (direcPath) {
    /* Return a promise that returns the files and directories
     within a directory */
    return new Promise((resolve, reject) => {
        let files;
        try {
            files = fs.readdirSync(distPath + direcPath);  
        } catch (error) {
            reject(error);
        }
        let output = {files: [], dirs: []};
        files.forEach((file) => {
            try {
                let result = fs.lstatSync(distPath + direcPath + file);

                /* not all files might be directories or files, so don't just 
                use if else. explicitly check for each one */
                result.name = file;
                result.isDirectory() && output.dirs.push(result);
                result.isFile() && output.files.push(result);
            } catch (error) {
                reject(error);
            }
        });
        resolve(output);
    });
}