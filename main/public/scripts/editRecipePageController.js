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
        let catDlStrings = [];

        //Categories Display Existing

        // fetch('/showExistingCategories', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(obj),
        // }).then((res) => {
        //     return res.json();
        // }).then((data) => {
        //     catExisting = data;
        //     });

        //Add Categories Button
        let addCatBtn = document.querySelector('#addCategoryButton');
        addCatBtn.addEventListener("click", function () {
            let catExisting = [];
            console.log("Add Category Button");
            catStrings[catIndex] = 'catBtnV' + catInc;
            catDlStrings[catIndex] = 'catDlV' + catInc;
            catInc++;
            catSearch[catIndex] = document.createElement('div');
            catSearch[catIndex].innerHTML = '<input id = ' + catStrings[catIndex] + ' list=' + catDlStrings[catIndex] + ' type="text" placeholder="Search..."><datalist id=' + catDlStrings[catIndex] + '>';
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
            let cIndex = 1;
            let obj = { catExistingV: catExisting, indexV: cIndex};
            catIndex++;

            fetch('/showExistingCategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                catExisting = data.catExistingV;
                console.log("catExisting " + catExisting);
                let stringBuilderCat = '';
                for (let i = 0; i < catExisting.length; i++) {
                    stringBuilderCat += '<option value=' + catExisting[i].name + '>';
                }
                let tempInnerCat = document.querySelector('#' + catDlStrings[catIndex-1]);
                tempInnerCat.innerHTML = stringBuilderCat;
                console.log(catSearch[catIndex]);
            });
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
            //Nutritional Info
            let cal = document.querySelector('#calV').value;
            let protein = document.querySelector('#proteinV').value;
            let fat = document.querySelector('#fatV').value;
            let carb = document.querySelector('#carbV').value;
            let user = rhit.auth.user.username;

            //Validations
            if (name == '' || serve == '' || hours == '' || minutes == '' || steps == '') {
                alert('The following information cannot be left blank: Name, Servings, Hours, Minutes, and Steps');
                return;
            }

            if (user == null) {
                alert('Please sign in');
                return;
            }

            if (hours != '') {
                hours = Number.parseInt(hours);
            }

            if (minutes != '') {
                minutes = Number.parseInt(minutes);
            }

            if (serve != '') {
                serve = Number.parseInt(serve);
            }
            console.log("cal: " + cal);
            console.log("protein: " + protein);
            console.log("fat: " + fat);
            console.log("carb " + carb);

            if (cal != '') {
                cal = Number.parseInt(cal);
            }

            if (protein != '') {
                protein = Number.parseInt(protein);
            }

            if (fat != '') {
                fat = Number.parseInt(fat);
            }

            if (carb != '') {
                carb = Number.parseInt(carb);
            }

            console.log("hours: " + hours);
            console.log("minutes: " + minutes);
            console.log("serve: " + serve);
            console.log("cal: " + cal);
            console.log("protein: " + protein);
            console.log("fat: " + fat);
            console.log("carb " + carb);
            // if (hours == NaN || minutes == NaN || serve == NaN) {
            //     alert('Please make sure that Servings, Hours, and Minutes are numbers');
            //     return;
            // }

            if ((hours != '' && hours % 1 != 0) || (minutes != '' && minutes % 1 != 0) || (serve != '' && serve % 1 != 0) || (cal != '' && cal % 1 != 0) || (protein != '' && protein % 1 != 0) || (fat != '' && fat % 1 != 0) || (carb != '' && carb % 1 != 0)) {
                alert('Hours, Servings, Minutes, Calories, Protein, Fat, and Carbs should be whole numbers (Calories, Protein, Fat, and Carbs are optional)');
                return;
            }

            if ((serve != '' && serve < 0) || (minutes != '' && minutes < 0) || (hours != '' && hours < 0) || (cal != '' && cal < 0) || (protein != '' && protein < 0) || (fat != '' && fat < 0) || (carb != '' && carb < 0)) {
                alert('Please make the Servings, Hours, and Minutes, Calories, Protein, Fat, and Carbs are greater than or equal to 0 (Calories, Protein, Fat, and Carbs are optional)');
                return;
            }

            let catValues = [];
            let ingValues = [];
            let quanValues = [];
            let costValues = [];
            for (let i = 0; i < catSearch.length; i++) {
                catValues[i] = document.querySelector('#' + catStrings[i]).value;
                if (catValues[i] == '') {
                    alert("Please don't leave any Categories blank");
                    return;
                }

            }
            for (let i = 0; i < ingIngStrings.length; i++) {
                ingValues[i] = document.querySelector('#' + ingIngStrings[i]).value;
                quanValues[i] = document.querySelector('#' + ingQuanStrings[i]).value;
                costValues[i] = document.querySelector('#' + ingCostStrings[i]).value;

                if (ingValues[i] == '') {
                    alert("Please assign each Ingredient a Name (you don't have to give them a Cost or Quantity)");
                    return;
                }
                if (costValues[i] != '') {
                    costValues[i] = Number.parseFloat(costValues[i]);
                    console.log("costValues " + costValues[i]);
                    if ((costValues[i] < 0 || isNaN(costValues[i]))) {
                        alert("The cost of an Ingredient must be greater than or equal to 0");
                        return;
                    }
                }
            }


            let time = hours + ":" + minutes + ":00";
            let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: steps, imageV: image, userV: user };


            fetch('/addSingleRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                if (data.value < 0) {
                    alert("This Recipe Name already exists");
                    return;
                }
                else {
                    recipeID = data.value;
                    console.log("recipeId " + recipeID);

                    //Start adding categories and ingredients

                    let obj = { catV: catValues, ingV: ingValues, quanV: quanValues, costV: costValues, recipeIDV: recipeID, calV: cal, proteinV: protein, fatV: fat, carbV: carb };
                    fetch('/addCategoriesAndIngredients', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(obj),
                    });

                    document.querySelector('#nameV').value = '';
                    document.querySelector('#serveV').value = '';
                    document.querySelector('#hoursV').value = '';
                    document.querySelector('#minutesV').value = '';
                    document.querySelector('#stepsV').value = '';
                    document.querySelector('#imageV').value = '';
                    document.querySelector('#calV').value = '';
                    document.querySelector('#proteinV').value = '';
                    document.querySelector('#fatV').value = '';
                    document.querySelector('#carbV').value = '';

                    let ogCatIndex = catIndex;
                    for (let i = 0; i < ogCatIndex; i++) {
                        catSearch[0].remove();
                        catRemove[0].remove();
                        catSearch.splice(0, 1);
                        catRemove.splice(0, 1);
                        catStrings.splice(0, 1);
                        catIndex--;
                    }

                    let ogIngIndex = ingIndex;
                    for (let i = 0; i < ogIngIndex; i++) {
                        ingSearch[0].remove();
                        ingQuantities[0].remove();
                        ingCosts[0].remove();
                        ingRemove[0].remove();
                        ingSearch.splice(0, 1);
                        ingQuantities.splice(0, 1);
                        ingCosts.splice(0, 1);
                        ingRemove.splice(0, 1);
                        ingIngStrings.splice(0, 1);
                        ingQuanStrings.splice(0, 1);
                        ingCostStrings.splice(0, 1);
                        ingIndex--;
                    }
                }
            });
        });
    }
}