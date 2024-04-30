class SingleRecipePageController{
    constructor(id){
        fetch('/getRecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'id': id}),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.updateView(data);
        })
    }
    updateView(recipe){
        document.querySelector('#recipePage').innerHTML = `
            <h1 id="recipeTitle">${recipe.name}</h1>
            <p>By: ${recipe.creatorusername}</p>
            <p>${recipe.createDate}</p>
            <p>Rating: 
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span></p>
            <p>Difficulty: ${recipe.difficulty}</p>
            <img id="recipeImg" src="${recipe.imageURL}">
            <div id="recipeInfo">
                <p>Time to make: <br> <span>${recipe.time} mins</span></p>
                <p>Servings: <br> <span>${recipe.servings}</span></p>
            </div>
            <div id="ingredients">
                <h1 class="header">Ingredients</h1>
                <ul id="ingList"><li>1 pound lean ground beef</li></ul>
            </div>
            <div id="steps">
                <h1 class="header">Directions</h1>
            </div>
        `;
        let ingList = document.querySelector('#ingList');
        let stepList = document.querySelector('#steps');

        for(let i = 0; i < recipe.steps.length; i++){
            stepList.innerHTML += `
            <p class="stepHeader">Step ${i+1}</p>
            <p>${recipe.steps[i]}</p>
            `
        }
    }
}