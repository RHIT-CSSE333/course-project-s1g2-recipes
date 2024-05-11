class EditRecipePageController {
    constructor(inputID) {
        console.log("addrecipepagecontroller");

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
        this.catSearch = [];
        this.catRemove = [];
        this.catStrings = [];
        this.catIndex = 0;
        this.catInc = 0;
        this.catDlStrings = [];

        //Add Categories Button
        let addCatBtn = document.querySelector('#addCategoryButton');
        addCatBtn.addEventListener("click", this.addCat);

        //Ingredients
        this.ingSearch = [];
        this.ingRemove = [];
        this.ingDlStrings = [];
        this.ingIngStrings = [];
        this.ingQuantities = [];
        this.ingQuanStrings = [];
        this.ingCosts = [];
        this.ingCoststrings = [];
        this.ingIndex = 0;
        this.ingInc = 0;
        //Add Ingredients Button
        let addIngBtn = document.querySelector('#addIngredientButton');
        this.ingExisting = [];

        addIngBtn.addEventListener("click", this.addIng());

        //Save Recipes Button
        let recipeID;
        let saveBtn = document.querySelector('#saveRecipeButton');
        saveBtn.addEventListener("click", function () {
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
            for (let i = 0; i < this.catSearch.length; i++) {
                catValues[i] = document.querySelector('#' + catStrings[i]).value;
                if (catValues[i] == '') {
                    alert("Please don't leave any Categories blank");
                    return;
                }

            }
            for (let i = 0; i < this.ingIngStrings.length; i++) {
                ingValues[i] = document.querySelector('#' + this.ingIngStrings[i]).value;
                quanValues[i] = document.querySelector('#' + this.ingQuanStrings[i]).value;
                costValues[i] = document.querySelector('#' + this.ingCoststrings[i]).value;

                if (ingValues[i] == '') {
                    alert("Please assign each Ingredient a Name (you don't have to give them a Cost or Quantity)");
                    return;
                }
                if (costValues[i] != '') {
                    costValues[i] = Number.parseFloat(costValues[i]);
                    if ((costValues[i] < 0 || isNaN(costValues[i]))) {
                        alert("The cost of an Ingredient must be greater than or equal to 0");
                        return;
                    }
                }
            }


            let time = hours + ":" + minutes + ":00";
            let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: steps, imageV: image, userV: user };

            fetch('/deleteRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    
                        let ogingIndex = this.ingIndex;
                        for (let i = 0; i < ogthis.ingIndex; i++) {
                            this.ingSearch[0].remove();
                            this.ingQuantities[0].remove();
                            this.ingCosts[0].remove();
                            this.ingRemove[0].remove();
                            this.ingSearch.splice(0, 1);
                            this.ingQuantities.splice(0, 1);
                            this.ingCosts.splice(0, 1);
                            this.ingRemove.splice(0, 1);
                            this.ingIngStrings.splice(0, 1);
                            this.ingQuanStrings.splice(0, 1);
                            this.ingCoststrings.splice(0, 1);
                            this.ingIndex--;
                        }
                    }
                });
            });
        });
        this.populate(inputID)
    }
    addIng(){
        this.ingIngStrings[this.ingIndex] = 'ingBtnV' + this.ingInc;
            this.ingQuanStrings[this.ingIndex] = 'quanBtnV' + this.ingInc;
            this.ingCoststrings[this.ingIndex] = 'costBtnV' + this.ingInc;
            this.ingDlStrings[this.ingIndex] = 'ingDlV' + this.ingInc;

            this.ingInc++;
            this.ingSearch[this.ingIndex] = document.createElement('div');
            this.ingSearch[this.ingIndex].innerHTML = '<input id = ' + this.ingIngStrings[this.ingIndex] + ' type="text" placeholder="Ingredient">';

            this.ingSearch[this.ingIndex].innerHTML = '<input id = ' + this.ingIngStrings[this.ingIndex] + ' list=' + this.ingDlStrings[this.ingIndex] + ' type="text" placeholder="Search..."><datalist id=' + this.ingDlStrings[this.ingIndex] + '>';

            this.ingSearch[this.ingIndex].style = "display:inline";

            this.ingQuantities[this.ingIndex] = document.createElement('div');
            this.ingQuantities[this.ingIndex].innerHTML = '<input id = ' + this.ingQuanStrings[this.ingIndex] + ' type="text" placeholder="Quantity">';
            this.ingQuantities[this.ingIndex].style = "display:inline";

            this.ingCosts[this.ingIndex] = document.createElement('div');
            this.ingCosts[this.ingIndex].innerHTML = '<input id = ' + this.ingCoststrings[this.ingIndex] + ' type="text" placeholder="Cost">';
            this.ingCosts[this.ingIndex].style = "display:inline";

            this.ingRemove[this.ingIndex] = document.createElement('button');
            this.ingRemove[this.ingIndex].innerHTML = 'Remove Ingredient';
            this.ingRemove[this.ingIndex].addEventListener("click", function () {
                let index = this.ingRemove.indexOf(this);
                this.ingSearch[index].remove();
                this.ingQuantities[index].remove();
                this.ingCosts[index].remove();
                this.ingRemove[index].remove();
                this.ingSearch.splice(index, 1);
                this.ingQuantities.splice(index, 1);
                this.ingCosts.splice(index, 1);
                this.ingRemove.splice(index, 1);
                this.ingIngStrings.splice(index, 1);
                this.ingQuanStrings.splice(index, 1);
                this.ingCoststrings.splice(index, 1);
                this.ingIndex--;
            });
            document.querySelector('#ingredientList').append(this.ingSearch[this.ingIndex], this.ingQuantities[this.ingIndex], this.ingCosts[this.ingIndex], this.ingRemove[this.ingIndex], document.createElement('p'));
            this.ingIndex++;

            let iIndex = 1;
    }
    addCat(){
        let catExisting = [];
        console.log(this.catStrings)
            this.catStrings[this.catIndex] = 'catBtnV' + this.catInc;
            this.catDlStrings[this.catIndex] = 'catDlV' + this.catInc;
            this.catInc++;
            this.catSearch[this.catIndex] = document.createElement('div');
            this.catSearch[this.catIndex].innerHTML = '<input id = ' + this.catStrings[this.catIndex] + ' list=' + this.catDlStrings[this.catIndex] + ' type="text" placeholder="Search..."><datalist id=' + this.catDlStrings[this.catIndex] + '>';
            this.catSearch[this.catIndex].style = "display:inline";
            this.catRemove[this.catIndex] = document.createElement('button');
            this.catRemove[this.catIndex].innerHTML = 'Remove Category';
            this.catRemove[this.catIndex].addEventListener("click", function () {
                let index = this.catRemove.indexOf(this);
                this.catSearch[index].remove();
                this.catRemove[index].remove();
                this.catSearch.splice(index, 1);
                this.catRemove.splice(index, 1);
                this.catStrings.splice(index, 1);
                this.catIndex--;
            });
            document.querySelector('#categoryList').append(this.catSearch[this.catIndex], this.catRemove[this.catIndex], document.createElement('p'));
            let cIndex = 1;
            this.catIndex++;
    }
    populate(inputID){
        console.log(inputID);
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
            hoursV.value = data.time;
            minutesV.value = data.time;
            stepsV.value = data.steps;
            imageV.value = data.imageURL;
            calV.value = data.calories;
            proteinV.value = data.protein;
            fatV.value = data.fats;
            carbV.value = data.carbs;

            let ings = data.ings;
            let quans = data.quantities;
            let costs = data.costs;
            let cats = data.cats;
            for(let i = 0; i < cats.length; i++){
                this.addCat();
                let cat = document.querySelector(`#catBtnV${i}`);
                cat.value = cats[i];
            }
            for(let i = 0; i < ings.length; i++){
                this.addIng();
                document.querySelector(`#ingBtnV${i}`).value = ings[i];
                document.querySelector(`#quanBtnV${i}`).value = quans[i];
                document.querySelector(`#costBtnV${i}`).value = costs[i];
            }
        })
    }
}