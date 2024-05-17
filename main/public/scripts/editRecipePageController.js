class EditRecipePageController {
    constructor(inputID) {
        console.log("editrecipepagecontroller");
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
            let obj = { catExistingV: catExisting, indexV: cIndex };
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
                let tempInnerCat = document.querySelector('#' + catDlStrings[catIndex - 1]);
                tempInnerCat.innerHTML = stringBuilderCat;
                console.log(catSearch[catIndex]);
            });
        });

        //Steps
        let stepSearch = [];
        let stepRemove = [];
        let stepStrings = [];
        let stepIndex = 0;
        let stepInc = 0;
        let stepDlStrings = [];

        //Add Steps Button
        let addStepBtn = document.querySelector('#addStepButton');
        addStepBtn.addEventListener("click", function () {
            let stepExisting = [];
            console.log("Add Step Button");
            stepStrings[stepIndex] = 'stepBtnV' + stepInc;
            stepDlStrings[stepIndex] = 'stepDlV' + stepInc;
            stepInc++;
            stepSearch[stepIndex] = document.createElement('div');
            stepSearch[stepIndex].innerHTML = '<input id = ' + stepStrings[stepIndex] + ' list=' + stepDlStrings[stepIndex] + ' type="text" placeholder="Search..."><datalist id=' + stepDlStrings[stepIndex] + '>';
            stepSearch[stepIndex].style = "display:inline";
            stepRemove[stepIndex] = document.createElement('button');
            stepRemove[stepIndex].innerHTML = 'Remove Step';
            stepRemove[stepIndex].addEventListener("click", function () {
                console.log("Remove button");
                console.log(stepRemove.indexOf(this))
                let index = stepRemove.indexOf(this);
                stepSearch[index].remove();
                stepRemove[index].remove();
                stepSearch.splice(index, 1);
                stepRemove.splice(index, 1);
                stepStrings.splice(index, 1);
                stepIndex--;
            });
            document.querySelector('#stepList').append(stepSearch[stepIndex], stepRemove[stepIndex], document.createElement('p'));
            stepIndex++;
        });

        //Ingredients
        let ingSearch = [];
        let ingRemove = [];
        let ingDlStrings = [];
        let ingIngStrings = [];
        let ingQuantities = [];
        let ingQuanStrings = [];
        let ingCosts = [];
        let ingCostStrings = [];
        let ingIndex = 0;
        let ingInc = 0;
        //Add Ingredients Button
        let addIngBtn = document.querySelector('#addIngredientButton');
        let ingExisting = [];

        addIngBtn.addEventListener("click", function () {
            console.log("Add Ingredient Button");
            ingIngStrings[ingIndex] = 'ingBtnV' + ingInc;
            ingQuanStrings[ingIndex] = 'quanBtnV' + ingInc;
            ingCostStrings[ingIndex] = 'costBtnV' + ingInc;
            ingDlStrings[ingIndex] = 'ingDlV' + ingInc;

            ingInc++;
            ingSearch[ingIndex] = document.createElement('div');
            ingSearch[ingIndex].innerHTML = '<input id = ' + ingIngStrings[ingIndex] + ' type="text" placeholder="Ingredient">';

            ingSearch[ingIndex].innerHTML = '<input id = ' + ingIngStrings[ingIndex] + ' list=' + ingDlStrings[ingIndex] + ' type="text" placeholder="Search..."><datalist id=' + ingDlStrings[ingIndex] + '>';

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

            let iIndex = 1;
            let obj = { ingExistingV: ingExisting, indexV: iIndex };
            // ingIndex++;

            fetch('/showExistingIngredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                ingExisting = data.ingExistingV;
                console.log("ingExisting " + ingExisting);
                let stringBuildering = '';
                for (let i = 0; i < ingExisting.length; i++) {
                    stringBuildering += '<option value=' + ingExisting[i].name + '>';
                }
                let tempInnering = document.querySelector('#' + ingDlStrings[ingIndex - 1]);
                tempInnering.innerHTML = stringBuildering;
                console.log(ingSearch[ingIndex]);
            });
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
            let image = document.querySelector('#imageV').value;
            //Nutritional Info
            let cal = document.querySelector('#calV').value;
            let protein = document.querySelector('#proteinV').value;
            let fat = document.querySelector('#fatV').value;
            let carb = document.querySelector('#carbV').value;
            let user = rhit.auth.user.username;

            //Steps
            let stepValue = '';
            for (let i = 0; i < stepSearch.length; i++) {
                console.log("step " + i + ": " + document.querySelector('#' + stepStrings[i]).value);
                stepValue += "'" + document.querySelector('#' + stepStrings[i]).value + "'";
                if (i != stepSearch.length - 1) {
                    stepValue += ', ';
                }
            }

            //Validations
            if (name == '' || serve == '' || hours == '' || minutes == '' || stepSearch.length == 0) {
                alert('The following information cannot be left blank: Name, Servings, Hours, Minutes, and Steps');
                return;
            }

            if (user == null) {
                alert('Please sign in');
                return;
            }

            if (stepValue == '') {
                stepValue = null;
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
            console.log("steps: " + stepValue);

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


            let time = hours*60 + minutes;
            let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: stepValue, imageV: image, userV: user };

            fetch('/deleteRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
                body: JSON.stringify({'id': inputID}),
            }).then((res) => {
                return res.json();
            }).then((data) => {
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
            })
        });
        //Populate
        fetch('/getRecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'id': inputID}),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            nameV.value = data.name;
            mySelect.value = data.difficulty;
            serveV.value = data.servings;
            hoursV.value = Math.floor(data.time/60);
            minutesV.value = data.time%60;
            imageV.value = data.imageURL;
            calV.value = data.calories;
            proteinV.value = data.protein;
            fatV.value = data.fats;
            carbV.value = data.carbs;

            // Ingredients
            for(let i = 0; i < data.ings.length; i++){
                console.log("Add Ingredient Button");
                if(!data.ings[i])
                    continue;
                ingIngStrings[ingIndex] = 'ingBtnV' + ingInc;
                ingQuanStrings[ingIndex] = 'quanBtnV' + ingInc;
                ingCostStrings[ingIndex] = 'costBtnV' + ingInc;
                ingDlStrings[ingIndex] = 'ingDlV' + ingInc;
    
                ingInc++;
                ingSearch[ingIndex] = document.createElement('div');
                ingSearch[ingIndex].innerHTML = '<input id = ' + ingIngStrings[ingIndex] + ' type="text" placeholder="Ingredient">';
    
                ingSearch[ingIndex].innerHTML = '<input id = ' + ingIngStrings[ingIndex] + ' list=' + ingDlStrings[ingIndex] + ' type="text" value="'+data.ings[i]+'" placeholder="Search..."><datalist id=' + ingDlStrings[ingIndex] + '>';
    
                ingSearch[ingIndex].style = "display:inline";
    
                ingQuantities[ingIndex] = document.createElement('div');
                ingQuantities[ingIndex].innerHTML = '<input id = ' + ingQuanStrings[ingIndex] + ' type="text" value="'+data.quantities[i]+'" placeholder="Quantity">';
                ingQuantities[ingIndex].style = "display:inline";
    
                ingCosts[ingIndex] = document.createElement('div');
                ingCosts[ingIndex].innerHTML = '<input id = ' + ingCostStrings[ingIndex] + ' type="text" value="'+data.costs[i]+'" placeholder="Cost">';
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
    
                let iIndex = 1;
                let obj = { ingExistingV: ingExisting, indexV: iIndex };
            }

            // Steps
            for(let i = 0; i < data.steps.length; i++){
                console.log("Add Step Button");
                stepStrings[stepIndex] = 'stepBtnV' + stepInc;
                stepDlStrings[stepIndex] = 'stepDlV' + stepInc;
                stepInc++;
                stepSearch[stepIndex] = document.createElement('div');
                stepSearch[stepIndex].innerHTML = '<input id = ' + stepStrings[stepIndex] + ' list=' + stepDlStrings[stepIndex] + ' type="text" value="'+data.steps[i]+'" placeholder="Search..."><datalist id=' + stepDlStrings[stepIndex] + '>';
                stepSearch[stepIndex].style = "display:inline";
                stepRemove[stepIndex] = document.createElement('button');
                stepRemove[stepIndex].innerHTML = 'Remove Step';
                stepRemove[stepIndex].addEventListener("click", function () {
                console.log("Remove button");
                console.log(stepRemove.indexOf(this))
                let index = stepRemove.indexOf(this);
                stepSearch[index].remove();
                stepRemove[index].remove();
                stepSearch.splice(index, 1);
                stepRemove.splice(index, 1);
                stepStrings.splice(index, 1);
                stepIndex--;
            });
            document.querySelector('#stepList').append(stepSearch[stepIndex], stepRemove[stepIndex], document.createElement('p'));
            stepIndex++;
            }

            // Categories
            for(let i = 0; i < data.cats.length; i++){
                if(!data.cats[i])
                    continue;
                let catExisting = [];
                console.log("Add Category Button");
                catStrings[catIndex] = 'catBtnV' + catInc;
                catDlStrings[catIndex] = 'catDlV' + catInc;
                catInc++;
                catSearch[catIndex] = document.createElement('div');
                catSearch[catIndex].innerHTML = '<input id = ' + catStrings[catIndex] + ' list=' + catDlStrings[catIndex] + ' type="text" value="'+data.cats[i]+'" placeholder="Search..."><datalist id=' + catDlStrings[catIndex] + '>';
                catSearch[catIndex].style = "display:inline";
                catSearch[catIndex].value = data.cats[i];
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
                let obj = { catExistingV: catExisting, indexV: cIndex };
                catIndex++;
            }
        })
        
    }
}