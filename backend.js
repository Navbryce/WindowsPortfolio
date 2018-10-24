const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve only the static files form the npmdist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', (req,res) => {
    /* Route everything to the index.html */
    res.sendFile(path.join(__dirname+'/dist/index.html')); //_dirname = path to app
});

app.post("/files", (req, res) => {
    res.send("yes");
});

/* Listen for the app on the Heroku port (if set as an env variable)
or default to 8080. */
app.listen(process.env.PORT || 8080);