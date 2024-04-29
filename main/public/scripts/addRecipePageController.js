class AddRecipePageController {
    constructor() {
        let diffControl = document.querySelector('#diffValue');

        //Create array of options to be added
        let diffArray = [1, 2, 3, 4, 5];

        //Create and append select list
        let diffList = document.createElement('select');
        diffList.setAttribute("id", "mySelect");
        diffControl.appendChild(diffList);

        //Create and append the options
        for (let i = 0; i < diffArray.length; i++) {
            let diffOption = document.createElement('option');
            diffOption.setAttribute("value", diffArray[i]);
            diffOption.text = diffArray[i];
            diffList.appendChild(diffOption);
        }
        let btn = document.querySelector('#saveRecipeButton');
        console.log("addrecipepagecontroller");
        btn.addEventListener("click", function () {
            console.log("button");
            let name = document.querySelector('#nameV').value;
            let diff = diffList.value;
            let serve = document.querySelector('#serveV').value;
            let hours = document.querySelector('#hoursV').value;
            let minutes = document.querySelector('#minutesV').value;
            let steps = document.querySelector('#stepsV').value;
            let image = document.querySelector('#imageV').value;
            let time = hours + ":" + minutes + ":00";
            let user = rhit.auth.user.username;

            let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: steps, imageV: image, userV: user };
            document.querySelector('#nameV').value = '';
            document.querySelector('#serveV').value = '';
            document.querySelector('#hoursV').value = '';
            document.querySelector('#minutesV').value = '';
            document.querySelector('#stepsV').value = '';
            document.querySelector('#imageV').value = '';
            console.log(name + ' bruh');
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