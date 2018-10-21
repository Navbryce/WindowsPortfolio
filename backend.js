const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the npmdist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {
    /* Route everything to the index.html */
    res.sendFile(path.join(__dirname+'/dist/index.html')); //_dirname = path to app
});

/* Listen for the app on the Heroku port (if set as an env variable)
or default to 8080 */
app.listen(process.env.PORT || 8080);