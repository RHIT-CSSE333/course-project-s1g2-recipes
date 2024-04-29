class AddRecipePageController {
    constructor() {
        console.log("addrecipepagecontroller");
        //difficulty dropdown menu
        let diffControl = document.querySelector('#diffValue');
        let diffArray = [1, 2, 3, 4, 5];
        let diffList = document.createElement('select');
        diffList.setAttribute("id", "mySelect");
        diffControl.appendChild(diffList);
        for (let i = 0; i < diffArray.length; i++) {
            let diffOption = document.createElement('option');
            diffOption.setAttribute("value", diffArray[i]);
            diffOption.text = diffArray[i];
            diffList.appendChild(diffOption);
        }

        let catArray = [];

        //Add Categories Button
        let addCatBtn = document.querySelector('#addCategoryButton');
        addCatBtn.addEventListener("click", function () {
            console.log("Add Category Button");
            let index = catArray.length;
            catArray[index] = document.createElement('div');
            catArray[index].innerHTML = '<input id="categoryV" class="navSearch2" type="text" placeholder="Search...">';
            document.querySelector('#categoryList').append(catArray[index]);
        });

        //Remove Categories Button
        let remCatBtn = document.querySelector('#removeCategoryButton');
        remCatBtn.addEventListener("click", function () {
            console.log("Remove button");
            let index = catArray.length - 1;
            catArray[index].remove();
            catArray.pop();
        });

        //Save Recipes Button
        let saveBtn = document.querySelector('#saveRecipeButton');
        saveBtn.addEventListener("click", function () {
            console.log("Save button");
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