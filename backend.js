const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const distPath = path.join(__dirname, '/dist');

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
    console.log(getFiles(req.body.currentDirectory));
    res.json(req.body);
});


/* Listen for the app on the Heroku port (if set as an env variable)
or default to 8080. */
app.listen(process.env.PORT || 8080);


function getFiles (direcPath) {
    /* Return the files within a directory */
    return fs.readdirSync(distPath + direcPath);
}