let btn = document.querySelector("#confirm");
btn.addEventListener("click", function () {
    let name = document.getElementById('IngredientName').value;
    let cost = document.getElementById('Cost').value;


    console.log(name);
    console.log(cost);

    let obj = { 
        'name': name, 
        'cost': cost 
    }

    fetch('/AddIngredient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    }).then((data)=>{
        console.log("finished");
    })
});