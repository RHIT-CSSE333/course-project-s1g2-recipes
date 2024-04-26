// Importing modules
const express = require('express');
const app = express();
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
        database: 'S1G2_Recipe'
    }
};

// Make connection
let connection = new Connection(config);

// When we connect, this will happen
connection.on('connect', function (err) {
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

//Function to add single recipe
app.post('/addSingleRecipe', (req, res) => {
    console.log(req.body.nameV)
    let request = new Request('AddRecipe', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    let name = req.body.nameV;
    let diff = req.body.diffV;
    let serve = req.body.serveV;
    let time = req.body.timeV;
    let steps = req.body.stepsV;
    let image = req.body.imageV;
    // request.addParameter('ID', TYPES.Int, 1);
    request.addParameter('Servings', TYPES.Int, serve);
    request.addParameter('Difficulty', TYPES.SmallInt, diff);
    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('CreateDate', TYPES.Date, new Date());
    request.addParameter('ImageURL', TYPES.VarChar, image);
    request.addParameter('CreatorUsername', TYPES.VarChar, 'anandy');
    request.addParameter('Steps', TYPES.Text, steps);
    request.addParameter('Time', TYPES.VarChar, time);
    request.addOutputParameter('RetVal', TYPES.Int);

    request.on('returnValue', function (parameterName, value, metadata) {
        console.log(value)
        res.send({ value });
    });
    connection.callProcedure(request)
});


// Function to add a 
app.post('/AddIngredient', (req, res) => {
    console.log(req.body.name)
    let request = new Request('AddIngredient', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    let name = req.body.name;
    let cost = req.body.cost;

    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('Cost', TYPES.Money, cost);

    request.on('returnValue', function (parameterName, value, metadata) {
        res.send({ value });
    });

    connection.callProcedure(request)
});



app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});