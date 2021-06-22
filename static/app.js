//Show modal when clicking recipe search results if user is not logged in
$("#results-container a").click(function () {
    console.log("hello")
    $("#login").modal('show');
})





async function addRecipeToFavorites(evt) {
    if($(evt.target).is('.favorite_button')) {

        const recipeID = $(evt.target).attr('data-id');
        //console.log(recipeID);
    
        await axios.post(`/save_recipe/${recipeID}`)

    }

}


//Event listener Adding recipe to favorites
$("#recipe-container").on("click", addRecipeToFavorites);




