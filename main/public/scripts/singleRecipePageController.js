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
            this.updateView(data,id);

        })
    }
    

    updateView(recipe,id){
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
            <button ID = 'moodle'type="button">Reviews</button>
        `;
        let ingList = document.querySelector('#ingList');
        let stepList = document.querySelector('#steps');

        for(let i = 0; i < recipe.steps.length; i++){
            stepList.innerHTML += `
            <p class="stepHeader">Step ${i+1}</p>
            <p>${recipe.steps[i]}</p>
            `
        }
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        var post = document.querySelector("#post");
        let Mbutton = document.querySelector('#moodle').addEventListener('click',()=>{
            modal.style.display = "block";
        })
        span.onclick = function() {
            modal.style.display = "none";
          }
        post.onclick = function(){
           
            let username = rhit.auth.user.username
            let text = document.querySelector('#text').value;
            let obj = {
                'text' : text,
                'username' : username,
                'id' : id,
            }
            fetch('/AddReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((data)=>{
                console.log("finished");
            })
        }  
    }
}