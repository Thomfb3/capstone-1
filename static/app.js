
//Show modal when clicking recipe search results if user is not logged in
$("#results-container a").click(function () {
    console.log("hello")
    $("#login").modal('show');
})


async function addRecipeToFavorites(evt) {
    if ($(evt.target).is('.make_favorite_button')) {

        const recipeID = $(evt.target).attr('data-id');
        //console.log(recipeID);
        await axios.post(`/save_recipe/${recipeID}`);

        handleSavedRecipeUiToggle($(evt.target));


    } else if ($(evt.target).is('.remove_favorite_button')) {
        const recipeID = $(evt.target).attr('data-id');
        //console.log(recipeID);
        await axios.post(`/remove_recipe/${recipeID}`);

        handleSavedRecipeUiToggle($(evt.target));
    }


}

function handleSavedRecipeUiToggle(target) {
    target.toggleClass("make_favorite_button");
    target.toggleClass("remove_favorite_button");
    target.toggleClass("fas");
    target.toggleClass("far");
}



//Event listener Adding recipe to favorites
$("#recipe-container").on("click", addRecipeToFavorites);


//Bootstrap Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})



const numberToFraction = function (amount) {
    // This is a whole number and doesn't need modification.
    if (parseFloat(amount) === parseInt(amount)) {
        return parseInt(amount);
    }
    // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
    var gcd = function (a, b) {
        if (b < 0.0000001) {
            return a;
        }
        return gcd(b, Math.floor(a % b));
    };
    var len = amount.toString().length - 2;
    var denominator = Math.pow(10, len);
    var numerator = amount * denominator;
    var divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    var base = 0;
    // In a scenario like 3/2, convert to 1 1/2
    // by pulling out the base number and reducing the numerator.
    if (numerator > denominator) {
        base = Math.floor(numerator / denominator);
        numerator -= base * denominator;
    }
    amount = Math.floor(numerator) + '/' + Math.floor(denominator);
    if (base) {
        amount = base + ' ' + amount;
    }
    return amount;
};


$(document).ready(function () {

    let decimals = document.querySelectorAll(".ingredient-decimal");

    for (d of decimals) {
        number = d.textContent;
        d.innerText = numberToFraction(number)
    }


});






let analyzedInstructions = [{'name': '', 'steps':[{'number': 1,'step': 'Whisk oil, garlic, basil, salt together in large bowl.','ingredients': [{'id': 11215, 'name': 'garlic', 'localizedName': 'garlic', 'image': 'garlic.png'}, {'id': 2044, 'name': 'basil', 'localizedName': 'basil', 'image': 'basil.jpg'}, {'id': 2047, 'name': 'salt', 'localizedName': 'salt', 'image': 'salt.jpg'}, {'id': 4582, 'name': 'cooking oil', 'localizedName': 'cooking oil', 'image': 'vegetable-oil.jpg'}], 'equipment': [{'id': 404661, 'name': 'whisk', 'localizedName': 'whisk', 'image': 'whisk.png'}, {'id': 404783, 'name': 'bowl', 'localizedName': 'bowl', 'image': 'bowl.jpg'}]},{'number': 2, 'step': 'Add tomatoes and mozzarella then gently toss to combine; set aside.Cook pasta according to package directions for al dente.', 'ingredients': [{'id': 1026, 'name': 'mozzarella', 'localizedName': 'mozzarella', 'image': 'mozzarella.png'}, {'id': 11529, 'name': 'tomato', 'localizedName': 'tomato', 'image': 'tomato.png'}, {'id': 20420, 'name': 'pasta', 'localizedName': 'pasta', 'image': 'fusilli.jpg'}], 'equipment': []},{'number': 3, 'step': 'Drain well.', 'ingredients': [], 'equipment': []},{'number': 4, 'step': 'Add pasta to tomato mixture and gently toss to combine.', 'ingredients': [{'id': 11529, 'name': 'tomato', 'localizedName': 'tomato', 'image': 'tomato.png'}, {'id': 20420, 'name': 'pasta', 'localizedName': 'pasta', 'image': 'fusilli.jpg'}], 'equipment': []},{'number': 5, 'step': 'Serve immediately.', 'ingredients': [], 'equipment': []}]}];

let ingredients = [{ 'id': 2044, 'aisle': 'Produce', 'image': 'fresh-basil.jpg', 'consistency': 'solid', 'name': 'fresh basil', 'nameClean': 'fresh basil', 'original': '¼ cup fresh basil, thinly sliced', 'originalString': '¼ cup fresh basil, thinly sliced', 'originalName': 'fresh basil, thinly sliced', 'amount': 0.25, 'unit': 'cup', 'meta': ['fresh', 'thinly sliced'], 'metaInformation': ['fresh', 'thinly sliced'], 'measures': { 'us': { 'amount': 0.25, 'unitShort': 'cups', 'unitLong': 'cups' }, 'metric': { 'amount': 59.147, 'unitShort': 'ml', 'unitLong': 'milliliters' } } }, { 'id': 1026, 'aisle': 'Cheese', 'image': 'mozzarella.png', 'consistency': 'solid', 'name': 'fresh mozzarella cheese', 'nameClean': 'mozzarella', 'original': '12 ounces fresh mozzarella cheese, cut into ½-inch cubes', 'originalString': '12 ounces fresh mozzarella cheese, cut into ½-inch cubes', 'originalName': 'fresh mozzarella cheese, cut into ½-inch cubes', 'amount': 12.0, 'unit': 'ounces', 'meta': ['fresh', 'cut into ½-inch cubes'], 'metaInformation': ['fresh', 'cut into ½-inch cubes'], 'measures': { 'us': { 'amount': 12.0, 'unitShort': 'oz', 'unitLong': 'ounces' }, 'metric': { 'amount': 340.194, 'unitShort': 'g', 'unitLong': 'grams' } } }, { 'id': 11215, 'aisle': 'Produce', 'image': 'garlic.png', 'consistency': 'solid', 'name': 'garlic clove', 'nameClean': 'garlic', 'original': '1 garlic clove, pressed', 'originalString': '1 garlic clove, pressed', 'originalName': 'garlic clove, pressed', 'amount': 1.0, 'unit': '', 'meta': ['pressed'], 'metaInformation': ['pressed'], 'measures': { 'us': { 'amount': 1.0, 'unitShort': '', 'unitLong': '' }, 'metric': { 'amount': 1.0, 'unitShort': '', 'unitLong': '' } } }, { 'id': 10111529, 'aisle': 'Produce', 'image': 'cherry-tomatoes.png', 'consistency': 'solid', 'name': 'grape tomatoes', 'nameClean': 'grape tomato', 'original': '10 oz grape tomatoes, cut in half lengthwise', 'originalString': '10 oz grape tomatoes, cut in half lengthwise', 'originalName': 'grape tomatoes, cut in half lengthwise', 'amount': 10.0, 'unit': 'oz', 'meta': ['cut in half lengthwise'], 'metaInformation': ['cut in half lengthwise'], 'measures': { 'us': { 'amount': 10.0, 'unitShort': 'oz', 'unitLong': 'ounces' }, 'metric': { 'amount': 283.495, 'unitShort': 'g', 'unitLong': 'grams' } } }, { 'id': 1082047, 'aisle': 'Spices and Seasonings', 'image': 'salt.jpg', 'consistency': 'solid', 'name': 'kosher salt', 'nameClean': 'kosher salt', 'original': '½ tsp kosher salt', 'originalString': '½ tsp kosher salt', 'originalName': 'kosher salt', 'amount': 0.5, 'unit': 'tsp', 'meta': [], 'metaInformation': [], 'measures': { 'us': { 'amount': 0.5, 'unitShort': 'tsps', 'unitLong': 'teaspoons' }, 'metric': { 'amount': 0.5, 'unitShort': 'tsps', 'unitLong': 'teaspoons' } } }, { 'id': 4053, 'aisle': 'Oil, Vinegar, Salad Dressing', 'image': 'olive-oil.jpg', 'consistency': 'liquid', 'name': 'olive oil', 'nameClean': 'olive oil', 'original': '¼ cup extra-virgin olive oil', 'originalString': '¼ cup extra-virgin olive oil', 'originalName': 'extra-virgin olive oil', 'amount': 0.25, 'unit': 'cup', 'meta': ['extra-virgin'], 'metaInformation': ['extra-virgin'], 'measures': { 'us': { 'amount': 0.25, 'unitShort': 'cups', 'unitLong': 'cups' }, 'metric': { 'amount': 59.147, 'unitShort': 'ml', 'unitLong': 'milliliters' } } }, { 'id': 20420, 'aisle': 'Pasta and Rice', 'image': 'fusilli.jpg', 'consistency': 'solid', 'name': 'pasta', 'nameClean': 'pasta', 'original': '1 pound linguine pasta', 'originalString': '1 pound linguine pasta', 'originalName': 'linguine pasta', 'amount': 1.0, 'unit': 'pound', 'meta': [], 'metaInformation': [], 'measures': { 'us': { 'amount': 1.0, 'unitShort': 'lb', 'unitLong': 'pound' }, 'metric': { 'amount': 453.592, 'unitShort': 'g', 'unitLong': 'grams' } } }]

let False = false;
let True = true;

let nutrition = { 'calories': '809k', 'carbs': '89g', 'fat': '34g', 'protein': '34g', 'bad': [{ 'title': 'Calories', 'amount': '809k', 'indented': False, 'percentOfDailyNeeds': 40.47 }, { 'title': 'Fat', 'amount': '34g', 'indented': False, 'percentOfDailyNeeds': 52.89 }, { 'title': 'Saturated Fat', 'amount': '13g', 'indented': True, 'percentOfDailyNeeds': 83.66 }, { 'title': 'Carbohydrates', 'amount': '89g', 'indented': False, 'percentOfDailyNeeds': 29.86 }, { 'title': 'Sugar', 'amount': '5g', 'indented': True, 'percentOfDailyNeeds': 6.42 }, { 'title': 'Cholesterol', 'amount': '67mg', 'indented': False, 'percentOfDailyNeeds': 22.4 }, { 'title': 'Sodium', 'amount': '834mg', 'indented': False, 'percentOfDailyNeeds': 36.29 }], 'good': [{ 'title': 'Protein', 'amount': '34g', 'indented': False, 'percentOfDailyNeeds': 68.72 }, { 'title': 'Selenium', 'amount': '86µg', 'indented': False, 'percentOfDailyNeeds': 123.2 }, { 'title': 'Manganese', 'amount': '1mg', 'indented': False, 'percentOfDailyNeeds': 58.83 }, { 'title': 'Phosphorus', 'amount': '534mg', 'indented': False, 'percentOfDailyNeeds': 53.44 }, { 'title': 'Calcium', 'amount': '464mg', 'indented': False, 'percentOfDailyNeeds': 46.47 }, { 'title': 'Vitamin B12', 'amount': '1µg', 'indented': False, 'percentOfDailyNeeds': 32.32 }, { 'title': 'Zinc', 'amount': '4mg', 'indented': False, 'percentOfDailyNeeds': 28.16 }, { 'title': 'Vitamin A', 'amount': '1244IU', 'indented': False, 'percentOfDailyNeeds': 24.89 }, { 'title': 'Magnesium', 'amount': '86mg', 'indented': False, 'percentOfDailyNeeds': 21.52 }, { 'title': 'Vitamin K', 'amount': '22µg', 'indented': False, 'percentOfDailyNeeds': 20.98 }, { 'title': 'Copper', 'amount': '0.39mg', 'indented': False, 'percentOfDailyNeeds': 19.36 }, { 'title': 'Vitamin B2', 'amount': '0.32mg', 'indented': False, 'percentOfDailyNeeds': 19.07 }, { 'title': 'Fiber', 'amount': '4g', 'indented': False, 'percentOfDailyNeeds': 18.08 }, { 'title': 'Vitamin E', 'amount': '2mg', 'indented': False, 'percentOfDailyNeeds': 17.46 }, { 'title': 'Potassium', 'amount': '493mg', 'indented': False, 'percentOfDailyNeeds': 14.09 }, { 'title': 'Vitamin B6', 'amount': '0.26mg', 'indented': False, 'percentOfDailyNeeds': 13.04 }, { 'title': 'Vitamin C', 'amount': '10mg', 'indented': False, 'percentOfDailyNeeds': 12.38 }, { 'title': 'Vitamin B3', 'amount': '2mg', 'indented': False, 'percentOfDailyNeeds': 12.28 }, { 'title': 'Iron', 'amount': '2mg', 'indented': False, 'percentOfDailyNeeds': 12.1 }, { 'title': 'Vitamin B1', 'amount': '0.16mg', 'indented': False, 'percentOfDailyNeeds': 10.39 }, { 'title': 'Folate', 'amount': '38µg', 'indented': False, 'percentOfDailyNeeds': 9.51 }, { 'title': 'Vitamin B5', 'amount': '0.68mg', 'indented': False, 'percentOfDailyNeeds': 6.79 }, { 'title': 'Vitamin D', 'amount': '0.34µg', 'indented': False, 'percentOfDailyNeeds': 2.27 }], 'expires': 1620590372296, 'isStale': True }



let price = {'ingredients': [{'name': 'lean ground beef', 'image': 'fresh-ground-beef.jpg', 'price': 654.18, 'amount': {'metric': {'value': 453.592, 'unit': 'g'}, 'us': {'value': 1.0, 'unit': 'pound'}}}, {'name': 'diced yellow onions', 'image': 'brown-onion.png', 'price': 17.6, 'amount': {'metric': {'value': 80.0, 'unit': 'g'}, 'us': {'value': 0.5, 'unit': 'cup'}}}, {'name': 'diced celery', 'image': 'celery.jpg', 'price': 18.97, 'amount': {'metric': {'value': 50.5, 'unit': 'g'}, 'us': {'value': 0.5, 'unit': 'cup'}}}, {'name': 'garlic', 'image': 'garlic.png', 'price': 17.78, 'amount': {'metric': {'value': 1.0, 'unit': 'Tbsp'}, 'us': {'value': 1.0, 'unit': 'Tbsp'}}}, {'name': 'fresh thyme', 'image': 'thyme.jpg', 'price': 10.71, 'amount': {'metric': {'value': 1.0, 'unit': 'tsp'}, 'us': {'value': 1.0, 'unit': 'tsp'}}}, {'name': 'worcestershire sauce', 'image': 'dark-sauce.jpg', 'price': 19.59, 'amount': {'metric': {'value': 2.0, 'unit': 'Tbsps'}, 'us': {'value': 2.0, 'unit': 'Tbsps'}}}, {'name': 'vegetable oil', 'image': 'vegetable-oil.jpg', 'price': 5.59, 'amount': {'metric': {'value': 1.0, 'unit': 'Tbsp'}, 'us': {'value': 1.0, 'unit': 'Tbsp'}}}, {'name': 'frozen root vegetables', 'image': 'root-vegetables.png', 'price': 53.79, 'amount': {'metric': {'value': 133.0, 'unit': 'g'}, 'us': {'value': 1.0, 'unit': 'cup'}}}, {'name': 'beef gravy', 'image': 'gravy.jpg', 'price': 134.86, 'amount': {'metric': {'value': 236.0, 'unit': 'ml'}, 'us': {'value': 1.0, 'unit': 'cup'}}}, {'name': 'potatoes', 'image': 'potatoes-yukon-gold.png', 'price': 84.0, 'amount': {'metric': {'value': 630.0, 'unit': 'ml'}, 'us': {'value': 3.0, 'unit': 'cups'}}}, {'name': 'parmesan cheese', 'image': 'parmesan.jpg', 'price': 31.61, 'amount': {'metric': {'value': 3.0, 'unit': 'Tbsps'}, 'us': {'value': 3.0, 'unit': 'Tbsps'}}}], 'totalCost': 1048.68, 'totalCostPerServing': 131.09}
