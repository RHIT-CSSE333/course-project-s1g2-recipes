class MyRecipesPageController {
    constructor(){
        let container = document.querySelector('#recipesContainer');
        let meme = document.querySelector('#meme');
        let loader = document.querySelector('#loading');
        let recipes;
        fetch('/getMyRecipes').then((res) => {
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
                    <a href="editRecipe.html?id=${recipes[i].id}" class="recipeBtn"><p>Edit Recipe</p></a>
                    <a id="${recipes[i].id}" class="recipeBtn deleteBtn"><p>Delete Recipe</p></a>
                </div>`;
            }
            const matches = document.querySelectorAll(".recipeCard");
            for(let i = 0; i < matches.length; i++){
                matches[i].onclick = (event) => {
                    if(event.target.innerHTML != 'Delete Recipe')
                        window.location.href = `/recipe.html?id=${recipes[i].id}`;
                    else{
                        console.log(recipes[i].id)
                        fetch('/deleteRecipe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({'id': recipes[i].id}),
                        }).then((res) => {
                            return res.json();
                        }).then((data) => {
                            alert("Recipe Deleted");
                            location.reload();
                        });
                    }
                };
            }
            if(recipes.length == 0){
                meme.style.display = 'block';
            }
        });
    }
}