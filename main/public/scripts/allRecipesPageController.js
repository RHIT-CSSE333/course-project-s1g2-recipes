class AllRecipesPageController {
    constructor(){
        let container = document.querySelector('#recipesContainer');
        let loader = document.querySelector('#loading');
        let recipes;
        fetch('/getRecipes').then((res) => {
            return res.json();
        }).then((data) => {
            const urlParams = new URLSearchParams(window.location.search);
            let query = urlParams.get("query") || '';
            container.innerHTML = '';
            loader.innerHTML = '';
            recipes = data.recipes;
            for(let i = 0; i < recipes.length; i++){
                if(recipes[i].name.includes(query)){
                    let stars = ``;
                    for(let j = 0; j < recipes[i].rating; j++)
                        stars += '<span class="fa fa-star checked"></span>';
                    for(let j = 0; j < 5-recipes[i].rating; j++)
                        stars += '<span class="fa fa-star"></span>';
                    container.innerHTML += 
                    `<div id="${recipes[i].id}" class="recipeCard">
                        <img src="images/placeholder.png">
                        <h3>${recipes[i].name}</h3>
                        <p>Rating: ${stars}</p><br>
                        <p>Difficulty: ${recipes[i].difficulty}</p>
                    </div>`;
                }
            }
            const matches = document.querySelectorAll(".recipeCard");
            for(let i = 0; i < matches.length; i++){
                matches[i].onclick = (event) => {
                    window.location.href = `/recipe.html?id=${matches[i].id}`;
                };
            }
        });
    }
}