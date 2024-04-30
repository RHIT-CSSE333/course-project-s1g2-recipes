class AllRecipesPageController {
    constructor(){
        let container = document.querySelector('#recipesContainer');
        let loader = document.querySelector('#loading');
        let recipes;
        loader.innerHTML = '<img id="loadImg" src="images/loading.gif">';
        fetch('/getRecipes').then((res) => {
            return res.json();
        }).then((data) => {
            container.innerHTML = '';
            loader.innerHTML = '';
            recipes = data.recipes;
            for(let i = 0; i < recipes.length; i++){
                let stars = ``;
                for(let j = 0; j < recipes[i].rating; j++)
                    stars += '<span class="fa fa-star checked"></span>';
                for(let j = 0; j < 5-recipes[i].rating; j++)
                    stars += '<span class="fa fa-star"></span>';
                container.innerHTML += 
                `<div class="recipeCard">
                    <img src="images/placeholder.png">
                    <h3>${recipes[i].name}</h3>
                    <p>Rating: ${stars}</p><br>
                    <p>Difficulty: ${recipes[i].difficulty}</p>
                </div>`;
            }
            const matches = document.querySelectorAll(".recipeCard");
            for(let i = 0; i < matches.length; i++){
                matches[i].onclick = (event) => {
                    window.location.href = `/recipe.html?id=${recipes[i].id}`;
                };
            }
        });
    }
}