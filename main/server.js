// Importing modules
const express = require('express');
const app = express();
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const userService = require('./userService')
let user = {
    name: null,
    username: null
};

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
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    let name = req.body.nameV;
    let diff = req.body.diffV;
    let serve = req.body.serveV;
    let time = req.body.timeV;
    let steps = req.body.stepsV;
    let image = req.body.imageV;
    let user = req.body.userV;

    request.addParameter('Servings', TYPES.Int, serve);
    request.addParameter('Difficulty', TYPES.SmallInt, diff);
    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('ImageURL', TYPES.VarChar, image);
    request.addParameter('CreatorUsername', TYPES.VarChar, user);
    request.addParameter('Steps', TYPES.Text, steps);
    request.addParameter('Time', TYPES.VarChar, time);
    request.addOutputParameter('RetVal', TYPES.Int);
    request.addOutputParameter('addedID', TYPES.Int);
    let inc = 0;
    request.on('returnValue', function (parameterName, value, metadata) {
        inc++;
        if (inc == 2) {
            console.log(value);
            console.log("pogg");
            res.send({ value });
        }
    });
    connection.callProcedure(request);
});


//Function to add categories
app.post('/addCategory', (req, res) => {
    let catV = req.body.catV;
    let recipeIDV = req.body.recipeIDV;
    catHelper(catV, recipeIDV);
});

function catHelper(catV, recipeIDV) {
    if (catV.length == 0) {
        return;
    }
    let request = new Request('AddCategory', function (err) {
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    let catSingle = catV[catV.length - 1];
    console.log("trying to add category: " + catSingle);
    request.addParameter('Name', TYPES.VarChar, catSingle);
    request.addParameter('RecipeID', TYPES.Int, recipeIDV);
    request.on('requestCompleted', function () {
        // res.send({ value });
        console.log("bruh");
        catV.pop();
        catHelper(catV, recipeIDV);
    });
    connection.callProcedure(request);
}


// Function to add ingredients
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

    connection.callProcedure(request);
});

// Function to add Reviews
app.post('/AddReviews', (req, res) => {
    console.log(req.body.name)
    let request = new Request('AddReviews', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    let stars = 3;
    let text = req.body.text;
    let id = req.body.id;
    let username = req.body.username;

    // store procedure
    request.addParameter('stars', TYPES.SmallInt, stars);
    request.addParameter('Text', TYPES.Text, text);
    request.addParameter('RecipeID', TYPES.Int, id);
    request.addParameter('PostUsername', TYPES.VarChar, username);


    request.on('returnValue', function (parameterName, value, metadata) {
        res.send({ value });
    });

    connection.callProcedure(request);
});

// Function to register a new user
app.post('/register', (req, res) => {
    console.log('registering ' + req.body.username);
    let salt = userService.getSalt();
    let pass = req.body.password + salt;
    let hash = userService.hashPassword(pass);
    let request = new Request('Register', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    let name = req.body.name;
    let username = req.body.username;

    request.addParameter('Name', TYPES.VarChar, name);
    request.addParameter('Username', TYPES.VarChar, username);
    request.addParameter('PasswordSalt', TYPES.VarChar, salt);
    request.addParameter('PasswordHash', TYPES.VarChar, hash);
    request.addOutputParameter('RetVal', TYPES.Int);

    request.on('returnValue', function (parameterName, value, metadata) {
        if (value == 0) {
            user = {
                'name': name,
                'username': username
            }
        }
        res.send({ val: value });
    });

    connection.callProcedure(request);
})

// Function to log in an existing user
app.post('/login', (req, res) => {
    console.log('logging in ' + req.body.username);
    let username = req.body.username;
    let pass = req.body.password;
    let salt = null;
    let hash = null;
    let name = null;
    let request = new Request("select passwordHash, passwordSalt, [name] from [user] where username = '" + username + "'", function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.on('row', function (columns) {
        hash = columns[0].value;
        salt = columns[1].value;
        name = columns[2].value;
    });

    request.on('requestCompleted', function () {
        if (hash == null)
            res.send({ val: 1 });
        else {
            let localHash = userService.hashPassword(pass + salt);
            if (localHash == hash) {
                console.log('Logged In!');
                user = {
                    'name': name,
                    'username': username
                }
                res.send({ val: 0 });
            }
            else {
                console.log('Wrong Password');
                res.send({ val: 2 });
            }
        }
    });

    connection.execSql(request);
})

app.get('/logout', (req, res) => {
    user = { name: null, username: null };
    res.send()
    console.log('Logged Out');
})


// Function to get the connection
app.get('/getUser', (req, res) => {
    res.send(user);
})

// Function to get all recipes
app.get('/getRecipes', (req, res) => {
    let recipes = [];
    let request = new Request("select id, imageURL, [name], difficulty from recipe", function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.on('row', function (columns) {
        let obj = {};
        obj.id = columns[0].value;
        obj.imageURL = columns[1].value;
        obj.name = columns[2].value;
        obj.rating = Math.floor(Math.random() * 5) + 1;
        obj.difficulty = columns[3].value;
        recipes.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({ 'recipes': recipes });
    });
    connection.execSql(request);
})

// Function to get single recipe with an id
app.post('/getRecipe', (req, res) => {
    let id = req.body.id;
    let obj = {};
    let request = new Request(`select servings, difficulty, [name], createDate, imageURL, creatorusername, steps, [time] from recipe where id = ${id}`, function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.on('row', function (columns) {
        obj.servings = columns[0].value;
        obj.difficulty = columns[1].value;
        obj.name = columns[2].value;
        obj.createDate = columns[3].value
        obj.imageURL = columns[4].value;
        obj.creatorusername = columns[5].value;
        let steps = columns[6].value;
        obj.steps = steps.replaceAll("'", "").split(",");;
        obj.time = columns[7].value;
    });
    request.on('requestCompleted', function () {
        res.send(obj);
    });

    connection.execSql(request);
})

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});

