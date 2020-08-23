const express = require('express');

const ArgumentParser = require('argparse').ArgumentParser;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// parse arguments
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Windows Portfolio Backend'
});

parser.addArgument(
    ['-d', '--dist'],
    {
        help: 'path from app (as root) that points to dist. don\'t include / at start',
        defaultValue: 'dist/'
    }
);
var args = parser.parseArgs();

// turn the dist path into an absolute path (__dirname points to backend.js directory)
const distPath = path.join(__dirname, args.dist);
// the "faux" root directory
const assetsRoot = '/assets/portfolio-documents';
const assetsPath = path.join(distPath, assetsRoot);


// Serve only the static files form the npmdist directory
app.use(express.static(distPath));
// Parse the bodies from all requests
app.use(bodyParser.json());
// CORS
app.use(function (req, res, next) {
    /* Enable CORS requests */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
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
            console.error(error);
            res.json({error: error});
        });
});

app.post("/fileExists", async (req, res) => {
    res.send(await fileExists(req.body.path));
});

/* Listen for the app on the Heroku port (if set as an env variable)
or default to 8080. */
app.listen(process.env.PORT || 8080);


async function fileExists(filePath) {
    /* checks to see if the file exists
        returns true/false if so
    */

    // makes sure the path is valid and simplifies it
    let simpPath = pathCheck(filePath);
    // actually get the file information
    let result = false;
    try {
        const fullPath = path.join(assetsPath, simpPath);
        const containingDir = path.dirname(fullPath);
        return dirContainsFile(containingDir, fullPath);
    } catch (error) {
        result = false;
        console.error(error);
    }
    return result;
}

async function dirContainsFile(dirPath, fullFilePath) {
    // because fs.readfilesync is case insensitive
    try {
        const realFilePath = fs.realpathSync(fullFilePath);
        const matchingPaths = fs.readdirSync(dirPath)
            .map((fileName) => path.join(dirPath, fileName))
            .filter(fullPath => fullPath === realFilePath);

        return matchingPaths.length !== 0 && fs.statSync(matchingPaths[0]).isFile();
    } catch (error) {
        return false;
    }
}

async function getFiles(direcPath) {
    /* Return a promise that returns the files and directories
     within a directory */
    return new Promise((resolve, reject) => {
        let files;
        let simpPath;
        let fullPath;
        try {
            // get the simplified path and checks for restirctions
            simpPath = pathCheck(direcPath);
            // add assetsPath because it's the root
            fullPath = path.join(assetsPath, simpPath);
            files = fs.readdirSync(fullPath);
        } catch (error) {
            reject(error);
        }

        // set the simp path to the user's "relative root"
        let output = {files: [], dirs: [], simpPath: simpPath};
        files.forEach((file) => {
            try {
                let filePath = path.join(fullPath, file);
                let result = fs.lstatSync(filePath);

                /* not all files might be directories or files, so don't just 
                use if else. explicitly check for each one */
                result.name = file;
                result.path = path.join(simpPath, file);
                result.extension = path.extname(result.name);
                result.isDirectory() && output.dirs.push(result);
                result.isFile() && output.files.push(result);
            } catch (error) {
                reject(error);
            }
        });
        resolve(output);
    });
}

function pathCheck(inspectionPath) {
    /* Makes sure the path is within the limited range of directories.
    if not, it sets the path to the root. Returns a simplified version of the 
    path rooted at the assetsPath. */
    let simpPath = path.join(assetsPath, inspectionPath); // just combines the path
    if (path.relative(assetsPath, simpPath).includes('..')) {
        /* the user is trying to access something outside assets.
        prevent them */
        simpPath = assetsPath;
    }
    /* 
    path.relative negates the assets path from the simp path
        because the root is the assets path. It also simplifies it.
    */
    simpPath = '/' + path.relative(assetsPath, simpPath);
    return simpPath;
}
