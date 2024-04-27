let rhit = {};
rhit.auth = null;

rhit.AuthManager = class {
    constructor(){
        this.user = null;
    }
    signIn(){
        location.href = 'index.html';
        rhit.initializePage();
    }
    signOut(){
        this.user = null;
    }
}

rhit.HomePageController = class{
    constructor(){
        if(rhit.auth.user.name != null){
            document.querySelector('#accountContainer').innerHTML = '<p id="pfp">'+rhit.auth.user.name.substring(0,1)+'</p>';
            console.log('change');
        }
    }
}

rhit.initializePage = function() {
	console.log("initializing");
    fetch('/getUser').then((res) => {
        return res.json();
    }).then((data) => {
        rhit.auth.user = data;
        console.log(rhit.auth.user);
        if (document.querySelector("#top")) {
            console.log("home");
            new rhit.HomePageController();
        }
        if (document.querySelector("#registerPage")) {
            console.log("register");
            rhit.RegisterPageController = RegisterPageController;
            new rhit.RegisterPageController();
        }
    })
}

rhit.main = function () {
	rhit.auth = new rhit.AuthManager();
	rhit.initializePage();
};

rhit.main();