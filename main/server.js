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
    request.addParameter('Time', TYPES.Int, time);
    request.addOutputParameter('RetVal', TYPES.Int);
    request.addOutputParameter('addedID', TYPES.Int);
    let inc = 0;
    request.on('returnValue', function (parameterName, value, metadata) {
        inc++;
        if (inc == 1 && value == -1) {
            console.log('Name exists');
            res.send({ value });
        }
        if (inc == 2) {
            res.send({ value });
        }
    });
    connection.callProcedure(request);
});

//Function to show existing categories
app.post('/showExistingCategories', (req, res) => {
    let catExistingV = [];
    let request = new Request('GetCategoryName', function (err) {
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    request.on('row', function (columns) {
        let obj = {};
        obj.name = columns[0].value;
        catExistingV.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({ 'catExistingV': catExistingV});
    });
    connection.callProcedure(request);
});

//Function to show existing Ingredient
app.post('/showExistingIngredient', (req, res) => {
    let ingExistingV = [];
    let request = new Request('GetIngredientName', function (err) {
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    request.on('row', function (columns) {
        let obj = {};
        obj.name = columns[0].value;
        ingExistingV.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({ 'ingExistingV': ingExistingV});
    });
    connection.callProcedure(request);
});



//Function to add categories
app.post('/addCategoriesAndIngredients', (req, res) => {
    let catV = req.body.catV;
    let recipeIDV = req.body.recipeIDV;
    let ingV = req.body.ingV;
    let quanV = req.body.quanV;
    let costV = req.body.costV;
    let calV = req.body.calV;
    let proteinV = req.body.proteinV;
    let fatV = req.body.fatV;
    let carbV = req.body.carbV;
    catHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV);
});

function catHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV) {
    if (catV.length == 0) {
        ingHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV);
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
        catV.pop();
        catHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV);
    });
    connection.callProcedure(request);
}

function ingHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV) {
    if (ingV.length == 0) {
        nutrtionHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV);
        return;
    }
    let request = new Request('AddIngredient', function (err) {
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    let ingSingle = ingV[ingV.length - 1];
    let quanSingle = quanV[quanV.length - 1];
    let costSingle = costV[costV.length - 1];
    console.log("trying to add ingredient: " + ingSingle + " with quan: " + quanSingle + " with cost: " + costSingle);
    request.addParameter('Name', TYPES.VarChar, ingSingle);
    request.addParameter('RecipeID', TYPES.Int, recipeIDV);

    request.addParameter('Quantity', TYPES.VarChar, quanSingle==''?null:quanSingle);

    if (costSingle == '') {
        request.addParameter('Cost', TYPES.Money, null);
    }
    else {
        request.addParameter('Cost', TYPES.Money, costSingle);
    }
    request.on('requestCompleted', function () {
        ingV.pop();
        quanV.pop();
        costV.pop();
        ingHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV);
    });
    connection.callProcedure(request);
}

function nutrtionHelper(catV, recipeIDV, ingV, quanV, costV, calV, proteinV, fatV, carbV) {
    let request = new Request('AddNutritionalInfo', function (err) {
        if (err) {
            console.log('Failed with error: ' + err);
        }
    });
    console.log("trying to add nutritionalinfo: cal " + calV + "protein "  + proteinV + "fat: " + fatV + "carb " + carbV);
    request.addParameter('RecipeID', TYPES.Int, recipeIDV);
    if (calV == '') {
        request.addParameter('Calories', TYPES.Int, null);
    }
    else {
        request.addParameter('Calories', TYPES.Int, calV);
    }
    if (proteinV == '') {
        request.addParameter('Protein', TYPES.Int, null);
    }
    else {
        request.addParameter('Protein', TYPES.Int, proteinV);
    }
    if (fatV == '') {
        request.addParameter('Fats', TYPES.Int, null);
    }
    else {
        request.addParameter('Fats', TYPES.Int, fatV);
    }
    if (carbV == '') {
        request.addParameter('Carbs', TYPES.Int, null);
    }
    else {
        request.addParameter('Carbs', TYPES.Int, carbV);
    }
    request.on('requestCompleted', function () {
        return;
    });
    connection.callProcedure(request);
}

// Function to add Reviews
app.post('/AddReviews', (req, res) => {
    let request = new Request('AddReviews', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    let stars = req.body.stars;
    let text = req.body.text;
    let id = req.body.id;
    let username = req.body.username;

    // store procedure
    request.addParameter('stars', TYPES.SmallInt, stars);
    request.addParameter('Text', TYPES.Text, text);
    request.addParameter('RecipeID', TYPES.Int, id);
    request.addParameter('PostUsername', TYPES.VarChar, username);

    request.on('requestCompleted', function () {
        res.send({ val: 0 });
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
    let request = new Request('GetUser', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.addParameter('Username', TYPES.VarChar, username);
    request.addOutputParameter('RetVal', TYPES.Int);

    request.on('row', function (columns) {
        hash = columns[0].value;
        salt = columns[1].value;
        name = columns[2].value;
    });

    request.on('returnValue', function (parameterName, value, metadata) {
        if (hash != null){
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
        else
            res.send({ val: 1 });
    });

    connection.callProcedure(request);
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
    let request = new Request("GetRecipes", function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.on('row', function (columns) {
        let obj = {};
        obj.id = columns[0].value;
        obj.imageURL = columns[1].value;
        obj.name = columns[2].value;
        obj.difficulty = columns[3].value;
        obj.rating = columns[4].value;
        recipes.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({ 'recipes': recipes });
    });
    connection.callProcedure(request);
})

// Function to get recipes for the logged in user
app.get('/getMyRecipes', (req, res) => {
    let recipes = [];
    let request = new Request("GetMyRecipes", function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });
    request.addParameter('username', TYPES.VarChar, user.username);
    request.on('row', function (columns) {
        let obj = {};
        obj.id = columns[0].value;
        obj.imageURL = columns[1].value;
        obj.name = columns[2].value;
        obj.difficulty = columns[3].value;
        obj.rating = columns[4].value;
        recipes.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({ 'recipes': recipes });
    });
    connection.callProcedure(request);
})

// Function to get single recipe with an id
app.post('/getRecipe', (req, res) => {
    let id = req.body.id;
    let obj = {};
    let ingList = [];
    let costList = [];
    let quantityList = [];
    let catList = [];
    let stars = [];
    let request = new Request('GetSingleRecipe', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    request.addParameter('id', TYPES.VarChar, id);

    request.on('row', function (columns) {
        if(!obj.servings){
            obj.servings = columns[0].value;
            obj.difficulty = columns[1].value;
            obj.name = columns[2].value;
            obj.createDate = columns[3].value
            obj.imageURL = columns[4].value;
            obj.creatorname = columns[5].value;
            let steps = columns[6].value;
            obj.steps = steps.substring(1, steps.length-1).split("', '");
            obj.time = columns[7].value;
            obj.calories = columns[12].value;
            obj.protein = columns[13].value;
            obj.fats = columns[14].value;
            obj.carbs = columns[15].value;
        }
        if(ingList.indexOf(columns[9].value) == -1){
            quantityList.push(columns[8].value);
            ingList.push(columns[9].value);
            costList.push(columns[10].value);
        }
        if(catList.indexOf(columns[16] == -1))
            catList.push(columns[16].value);
        stars.push(columns[11].value);
    });
    request.on('requestCompleted', function () {
        obj.quantities = quantityList;
        obj.ings = ingList;
        obj.costs = costList;
        obj.stars = stars;
        obj.cats = catList;
        res.send(obj);
    });

    connection.callProcedure(request);
})

// Function to get single recipe with an id
app.post('/deleteRecipe', (req, res) => {
    let id = req.body.id;
    let request = new Request('DeleteRecipe', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    request.addParameter('id', TYPES.Int, id);
    request.on('requestCompleted', function () {
        res.send({val:0});
    });

    connection.callProcedure(request);
})

// Function to get single recipe with an id
app.post('/getReviews', (req, res) => {
    let id = req.body.id;
    let reviews = [];
    let request = new Request('GetReviews', function (err) {
        if (err)
            console.log('Failed with error: ' + err);
    });

    request.addParameter('id', TYPES.VarChar, id);

    request.on('row', function (columns) {
        let obj = {}
        obj.stars = columns[0].value;
        obj.timePosted = columns[1].value;
        obj.text = columns[2].value;
        obj.name = columns[3].value ? columns[3].value:'Anonymous';
        reviews.push(obj);
    });
    request.on('requestCompleted', function () {
        res.send({'reviews': reviews});
    });

    connection.callProcedure(request);
})

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});

