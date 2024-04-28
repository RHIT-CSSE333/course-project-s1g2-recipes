class AddRecipePageController {
    constructor() {
        let btn = document.querySelector("#saveRecipeButton");
        console.log("addrecipepagecontroller");
        btn.addEventListener("click", function () {
            console.log("button");
            let name = document.getElementById('nameV').value;
            let diff = document.getElementById('diffV').value;
            let serve = document.getElementById('serveV').value;
            let hours = document.getElementById('hoursV').value;
            let minutes = document.getElementById('minutesV').value;
            let steps = document.getElementById('stepsV').value;
            let image = document.getElementById('imageV').value;
            let time = hours + ":" + minutes + ":00";
            console.log(rhit.auth.user);
            let user = rhit.auth.user.username;

            let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: steps, imageV: image, userV: user };
            fetch('/addSingleRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });
        });
    }
}