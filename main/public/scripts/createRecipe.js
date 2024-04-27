let btn = document.querySelector("#saveRecipeButton");
btn.addEventListener("click", function () {
    let name = document.getElementById('nameV').value;
    let diff = document.getElementById('diffV').value;
    let serve = document.getElementById('serveV').value;
    let time = document.getElementById('timeV').value;
    let steps = document.getElementById('stepsV').value;
    let image = document.getElementById('imageV').value;
    let obj = { nameV: name, diffV: diff, serveV: serve, timeV: time, stepsV: steps, imageV: image };
    fetch('/addSingleRecipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    });
});