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
            this.showReviews(id);
        })
    }

    updateView(recipe,id){
        console.log(recipe)
        const average = array => array.reduce((a, b) => a + b) / array.length;
        document.querySelector('#recipePage').innerHTML = `
            <h1 id="recipeTitle">${recipe.name}</h1>
            <p>By: ${recipe.creatorname}</p>
            <p>${recipe.createDate.substring(0, 10)}</p>
            <p id="stars">Rating: </p>
            <p>Difficulty: ${recipe.difficulty}</p>
            <img id="recipeImg" src="${recipe.imageURL}">
            <div id="recipeInfo">
                <p>Time to make: <br> <span>${Math.floor(recipe.time/60)} hours ${recipe.time%60} mins</span></p>
                <p>Servings: <br> <span>${recipe.servings}</span></p>
            </div>
            <div id="ingredients">
                <h1 class="header">Ingredients</h1>
                <ul id="ingList"></ul>
            </div>
            <div id="steps">
                <h1 class="header">Directions</h1>
            </div>
            <div id="nutInfo">
                <h1 class="header">Nutritional Info</h1>
                <div class="row">
                    <p>Calories: ${recipe.calories||'--'}</p>
                    <p>Carbs: ${recipe.carbs||'--'}</p>
                </div>
                <div class="row">
                    <p>Protein: ${recipe.protein||'--'}</p>
                    <p>Fats: ${recipe.fats||'--'}</p>
                </div>
            </div>
            <button id='modalBtn' type="button">Write a Review</button>
            
            <div id="reviewContainer"></div>
        `;
        let img = document.querySelector('#recipeImg');
        img.addEventListener("error", function(event) {
            event.target.src = "images/placeholder.png"
            event.onerror = null
        });
        let starDiv = document.querySelector('#stars');
        let avg = Math.floor(average(recipe.stars));
        for(let j = 0; j < avg; j++)
            starDiv.innerHTML += '<span class="fa fa-star checked"></span>';
        for(let j = 0; j < 5-avg; j++)
            starDiv.innerHTML += '<span class="fa fa-star"></span>';
        let list = document.querySelector('#ingList');
        for(let i = 0; i < recipe.ings.length; i++){
            if(!recipe.ings[i])
                list.innerHTML += `Ingredients not provided`;
            else
                list.innerHTML += `<li>${recipe.quantities[i]} ${recipe.ings[i]}</li>`;
        }
        let stepList = document.querySelector('#steps');

        for(let i = 0; i < recipe.steps.length; i++){
            stepList.innerHTML += `
            <p class="stepHeader">Step ${i+1}</p>
            <p>${recipe.steps[i]}</p>
            `
        }
        let modal = document.getElementById("myModal");
        let span = document.getElementsByClassName("close")[0];
        let post = document.querySelector("#post");
        let stars = document.querySelectorAll('.starbtn');
        let rating = 0;
        document.querySelector('#modalBtn').addEventListener('click',()=>{
            modal.style.display = "block";
        })
        span.onclick = function() {
            modal.style.display = "none";
        }
        for(let i = 0; i < stars.length; i++){
            stars[i].addEventListener('click', () => {
                rating = stars[i].id;
                for(let j = 0; j < stars.length; j++){
                    stars[j].classList.remove('checked');
                    if(j < rating)
                        stars[j].classList.toggle('checked');
                }
            })
        }
        post.onclick = function(){
            let username = rhit.auth.user.username
            let text = document.querySelector('#text').value;
            if(rating == 0 || text == ''){
                alert('Please provide a rating and review.')
                return;
            }
            let obj = {
                'text': text,
                'username': username,
                'id': id,
                'stars': rating,
            }
            fetch('/AddReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((data)=>{
                modal.style.display = "none";
            })
        }
    }
    showReviews(id){
        fetch('/getReviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'id':id}),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            let revs = data.reviews;
            let reviewContainer = document.querySelector('#reviewContainer');
            reviewContainer.innerHTML += `<h3>${revs.length} Reviews</h3><hr>`;
            for(let i = 0; i < revs.length; i++){
                reviewContainer.innerHTML += `
                <div class="reviewCard">
                    <div class="reviewHead"><p id="pfp">${revs[i].name.substring(0,1)}</p><p class='revName'>${revs[i].name}</p></div>
                    <div class="reviewStars">
                        <p id='revStar${i}'></p>
                        <p class="revDate">${revs[i].timePosted.substring(0, 10)}</p>
                    </div>
                    <p class="reviewText">${revs[i].text}</p>
                </div>
                `;
                let starCont = document.querySelector(`#revStar${i}`);
                for(let j = 0; j < revs[i].stars; j++)
                    starCont.innerHTML += '<span class="fa fa-star checked"></span>';
                for(let j = 0; j < 5-revs[i].stars; j++)
                    starCont.innerHTML += '<span class="fa fa-star"></span>';
            }
        });
    }
}