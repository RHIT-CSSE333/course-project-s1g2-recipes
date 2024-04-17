// Load in stuff from the tedious module
const express = require('express');
const path = require('path');
const Connection = require('tedious').Connection; 
const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080')
})

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

// Function to add recipe
app.post('/addRecipe', (req, res) => {
    let request = new Request('AddRecipe', function(err) {
        console.log(err);
    });

    let ID = 98765432;
    let servings = 8;
    let difficulty = 3;
    let name = "chocolate cake";
    let date = new Date();
    let imgURL  = 'https://i1.theportalwiki.net/img/thumb/0/0a/Portal_Cake.png/200px-Portal_Cake.png';
    let CreatorUsername = 'anandy';
    let steps = 'The cake is a lie!'
    let time = '1:00:00';
    
    request.addParameter('ID', TYPES.Int, ID);
    request.addParameter('Servings', TYPES.Int, servings);
    request.addParameter('Difficulty', TYPES.SmallInt, difficulty);
    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('CreateDate', TYPES.Date, date);
    request.addParameter('ImageURL', TYPES.VarChar, imgURL);
    request.addParameter('CreatorUsername', TYPES.VarChar, CreatorUsername);
    request.addParameter('Steps', TYPES.Text, steps);
    request.addParameter('Time', TYPES.VarChar, time);
    request.addOutputParameter('RetVal', TYPES.Int);

    request.on('returnValue', function(parameterName, value, metadata) {
        console.log(parameterName + ' = ' + value);
    });

    connection.callProcedure(request)
})

app.post('/addOne', (req, res) => {
    let request = new Request('AddOne', function(err) {
        console.log(err);
    });

    request.addOutputParameter('val', TYPES.Int);

    request.on('returnValue', function(parameterName, value, metadata){
        console.log(parameterName + ' = ' + value);
    })

    connection.callProcedure(request);
})
