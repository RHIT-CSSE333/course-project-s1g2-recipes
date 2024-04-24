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

// Function to make a single Java 




app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});