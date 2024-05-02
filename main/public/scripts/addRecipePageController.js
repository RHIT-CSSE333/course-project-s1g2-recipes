class AddRecipePageController {
    constructor() {
        console.log("addrecipepagecontroller");
        // let addRecipeManager = new AddRecipeManager();
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

        //Categories
        let catSearch = [];
        let catRemove = [];
        let catStrings = [];
        let catIndex = 0;
        let catInc = 0;
        //Add Categories Button
        let addCatBtn = document.querySelector('#addCategoryButton');
        addCatBtn.addEventListener("click", function () {
            console.log("Add Category Button");
            catStrings[catIndex] = 'catBtnV' + catInc;
            catInc++;
            catSearch[catIndex] = document.createElement('div');
            catSearch[catIndex].innerHTML = '<input id = ' + catStrings[catIndex] + ' type="text" placeholder="Search...">';
            catSearch[catIndex].style = "display:inline";
            catRemove[catIndex] = document.createElement('button');
            catRemove[catIndex].innerHTML = 'Remove Category';
            catRemove[catIndex].addEventListener("click", function () {
                console.log("Remove button");
                console.log(catRemove.indexOf(this))
                let index = catRemove.indexOf(this);
                catSearch[index].remove();
                catRemove[index].remove();
                catSearch.splice(index, 1);
                catRemove.splice(index, 1);
                catStrings.splice(index, 1);
                catIndex--;
            });
            document.querySelector('#categoryList').append(catSearch[catIndex], catRemove[catIndex], document.createElement('p'));
            // document.querySelector('#categoryList').append(catRemove[catIndex]);
            catIndex++;
        });

        //Ingredients
        let ingSearch = [];
        let ingRemove = [];
        let ingIngStrings = [];
        let ingQuantities = [];
        let ingQuanStrings = [];
        let ingCosts = [];
        let ingCostStrings = [];
        let ingIndex = 0;
        let ingInc = 0;
        //Add Ingredients Button
        let addIngBtn = document.querySelector('#addIngredientButton');
        addIngBtn.addEventListener("click", function () {
            console.log("Add Ingredient Button");
            ingIngStrings[ingIndex] = 'ingBtnV' + ingInc;
            ingQuanStrings[ingIndex] = 'quanBtnV' + ingInc;
            ingCostStrings[ingIndex] = 'costBtnV' + ingInc;
            ingInc++;
            ingSearch[ingIndex] = document.createElement('div');
            ingSearch[ingIndex].innerHTML = '<input id = ' + ingIngStrings[ingIndex] + ' type="text" placeholder="Ingredient">';
            ingSearch[ingIndex].style = "display:inline";

            ingQuantities[ingIndex] = document.createElement('div');
            ingQuantities[ingIndex].innerHTML = '<input id = ' + ingQuanStrings[ingIndex] + ' type="text" placeholder="Quantity">';
            ingQuantities[ingIndex].style = "display:inline";

            ingCosts[ingIndex] = document.createElement('div');
            ingCosts[ingIndex].innerHTML = '<input id = ' + ingCostStrings[ingIndex] + ' type="text" placeholder="Cost">';
            ingCosts[ingIndex].style = "display:inline";

            ingRemove[ingIndex] = document.createElement('button');
            ingRemove[ingIndex].innerHTML = 'Remove Ingredient';
            ingRemove[ingIndex].addEventListener("click", function () {
                console.log("Remove button");
                console.log(ingRemove.indexOf(this))
                let index = ingRemove.indexOf(this);
                ingSearch[index].remove();
                ingQuantities[index].remove();
                ingCosts[index].remove();
                ingRemove[index].remove();
                ingSearch.splice(index, 1);
                ingQuantities.splice(index, 1);
                ingCosts.splice(index, 1);
                ingRemove.splice(index, 1);
                ingIngStrings.splice(index, 1);
                ingQuanStrings.splice(index, 1);
                ingCostStrings.splice(index, 1);
                ingIndex--;
            });
            document.querySelector('#ingredientList').append(ingSearch[ingIndex], ingQuantities[ingIndex], ingCosts[ingIndex], ingRemove[ingIndex], document.createElement('p'));
            ingIndex++;
        });

        //Save Recipes Button
        let recipeID;
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


            fetch('/addSingleRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((res) => {
                return res.json();
            }).then((data) => {

                recipeID = data.value;
                console.log("recipeId " + recipeID);

                //Start adding categories and ingredients
                let catValues = [];
                let ingValues = [];
                let quanValues = [];
                let costValues = [];
                for (let i = 0; i < catSearch.length; i++) {
                    catValues[i] = document.querySelector('#' + catStrings[i]).value;
                }
                for (let i = 0; i < ingIngStrings.length; i++) {
                    ingValues[i] = document.querySelector('#' + ingIngStrings[i]).value;
                    quanValues[i] = document.querySelector('#' + ingQuanStrings[i]).value;
                    costValues[i] = document.querySelector('#' + ingCostStrings[i]).value;
                }
                let obj = { catV: catValues, ingV: ingValues, quanV: quanValues, costV: costValues, recipeIDV: recipeID };
                fetch('/addCategoriesAndIngredients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj),
                });
            });
        });
    }
}