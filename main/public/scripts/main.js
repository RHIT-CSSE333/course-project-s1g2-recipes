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
            accDrop.innerHTML += '<a href="createRecipe.html">My Recipes</a>';
            accDrop.innerHTML += '<a onclick="rhit.auth.signOut()">Sign Out</a>';
        }
        else{
            accDrop.innerHTML += '<a href="login.html">Log In</a>';
            accDrop.innerHTML += '<a href="register.html">Register</a>';
        }

        accBtn.addEventListener('click', () => {
           accDrop.classList.toggle("show");
        });
    }
}

rhit.HomePageController = class{
    constructor(){
        if(rhit.auth.user.name != null){
            document.querySelector('#accountContainer').innerHTML = '<p id="pfp">'+rhit.auth.user.name.substring(0,1)+'</p>';
        }
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
    }
    if(document.querySelector('#allRecipesPage')){
        console.log("all recipes");
        rhit.AllRecipesPageController = AllRecipesPageController;
        new rhit.AllRecipesPageController();
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