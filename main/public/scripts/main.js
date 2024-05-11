let rhit = {};
rhit.auth = null;
rhit.recipeManager = null;

rhit.AuthManager = class {
    constructor(){
        this.user = {name:null, username:null};
        fetch('/getUser').then((res) => {
            return res.json();
        }).then((data) => {
            this.user = data;
            rhit.initializePage();
        })
    }
    signIn(){
        location.href = 'index.html';
    }
    signOut(){
        fetch('/logout').then(() => {
            this.user = {name: null, username: null};
            location.href = 'index.html';
        });
    }
}

rhit.NavController = class{
    constructor(){
        let searchBtn = document.querySelector('#searchButton');
        let accBtn = document.querySelector('#accountContainer');
        let accDrop = document.querySelector('#accountDropdown');
        if(rhit.auth.user.name){
            accDrop.innerHTML += '<a href="myRecipes.html">My Recipes</a>';
            accDrop.innerHTML += '<a onclick="rhit.auth.signOut()">Sign Out</a>';
            accBtn.innerHTML = '<p id="pfp">'+rhit.auth.user.name.substring(0,1).toUpperCase()+'</p>';
        }
        else{
            accDrop.innerHTML += '<a href="login.html">Log In</a>';
            accDrop.innerHTML += '<a href="register.html">Register</a>';
        }

        accBtn.addEventListener('click', () => {
           accDrop.classList.toggle("show");
        });
        searchBtn.addEventListener('click', () => {
            location.href = `allRecipes.html?query=${navSearch.value}`;
        })
    }
}

rhit.HomePageController = class{
    constructor(){
    }
}

rhit.initializePage = function() {
	console.log("initializing");
    if(document.querySelector("#top")) {
        console.log("home");
        new rhit.HomePageController();
        new rhit.NavController();
    }
    if(document.querySelector("#registerPage")) {
        console.log("register");
        rhit.RegisterPageController = RegisterPageController;
        new rhit.RegisterPageController();
    }
    if(document.querySelector("#createRecipePage")) {
        console.log("addRecipe");
        rhit.AddRecipePageController = AddRecipePageController;
        new rhit.AddRecipePageController();
        new rhit.NavController();
    }
    if(document.querySelector("#editRecipePage")) {
        console.log("editRecipe");
        const urlParams = new URLSearchParams(window.location.search);
        rhit.EditRecipePageController = EditRecipePageController;
        new rhit.EditRecipePageController(urlParams.get("id"));
        new rhit.NavController();
    }
    if(document.querySelector('#allRecipesPage')){
        console.log("all recipes");
        rhit.AllRecipesPageController = AllRecipesPageController;
        new rhit.AllRecipesPageController();
        new rhit.NavController();
    }
    if(document.querySelector('#myRecipesPage')){
        console.log("my recipes");
        rhit.MyRecipesPageController = MyRecipesPageController;
        new rhit.MyRecipesPageController();
        new rhit.NavController();
    }
    if(document.querySelector('#recipePage')){
        console.log("recipe");
        const urlParams = new URLSearchParams(window.location.search);
        rhit.SingleRecipePageController = SingleRecipePageController;
        new rhit.SingleRecipePageController(urlParams.get("id"));
        new rhit.NavController();
    }
}

rhit.main = function () {
	rhit.auth = new rhit.AuthManager();
}

rhit.main();