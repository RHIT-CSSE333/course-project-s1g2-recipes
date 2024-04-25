//Function to add single recipe
app.post('/addSingleRecipe', (req, res) => {
    console.log(req.body.name)
    let request = new Request('AddRecipe', function(err) {
        if(err)
            console.log('Failed with error: ' + err);
    });

});