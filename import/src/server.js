// Importing modules
const express = require('express');
const app = express();
const Connection = require('tedious').Connection; 
const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Configure the environment with correct stuff
let config = {  
    server: 'golem.csse.rose-hulman.edu',  
    authentication: {
        type: 'default',
        options: {
            userName: 'anandy', 
            password: 'Sparky@4'
        }
    },
    options: {
        encrypt: false,
        database: 'S1G2_Recipe2'
    }
};

// Make connection
let connection = new Connection(config);  

// When we connect, this will happen
connection.on('connect', function(err) {  
    // If no error, then good to proceed.
    console.log("Connected"); 
});

// Open Connection
connection.connect();

// Function to close the connection
app.get('/close', (req, res) => {
    connection.close();
    console.log("Connection closed");
    process.exit(0);
})

// // Function to add recipe
app.post('/addRecipe', (req, res) => {
    console.log(req.body.name)
    let request = new Request('AddRecipe', function(err) {
        if(err)
            console.log('Failed with error: ' + err);
    });
    let servings = 1;
    let difficulty = 1;
    let name = req.body.name;
    let CreatorUsername = req.body.contributor_id;
    let steps = req.body.steps;
    let mins = req.body.minutes;

    if(Math.floor(mins/60)>23)
        mins = null;    
    request.addParameter('Servings', TYPES.Int, servings);
    request.addParameter('Difficulty', TYPES.SmallInt, difficulty);
    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('ImageURL', TYPES.VarChar, null);
    request.addParameter('CreatorUsername', TYPES.VarChar, CreatorUsername);
    request.addParameter('Steps', TYPES.Text, steps);
    request.addParameter('Time', TYPES.Int, mins);
    request.addOutputParameter('addedID', TYPES.Int);
    request.addOutputParameter('RetVal', TYPES.Int);

    request.on('returnValue', function(parameterName, value, metadata) {
        if(parameterName == 'RetVal')
            res.send({value});
    });

    connection.callProcedure(request) 
});

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});
