////////Predetermined chart RGB colors
const COLORS = [ "54, 162, 236", "255, 99, 132", "186, 75, 192", "255, 205, 87", "0, 172, 126", "75, 192, 192", "75, 108, 192", "134, 75, 192", "82, 46, 189", "239, 192, 40", "239, 76, 40", "239, 40, 143", "239, 40, 40", "34, 16, 235", "170, 232, 63", "240, 130, 209", "15, 105, 106"]

////Collect elements value 'nutrients'
let proteinEl = document.getElementById("protein");
let carbsEl = document.getElementById("carbs");
let fatEl = document.getElementById("fat");

//If the elements are there, drop the "g"(grams) to get numerical value
if (proteinEl) {
    let fat = parseFloat(fatEl.innerText.slice(0, -1));
    let carbs = parseFloat(carbsEl.innerText.slice(0, -1));
    let protein = parseFloat(proteinEl.innerText.slice(0, -1));

    ///Create chart with Chart JS, with three colors for 3 macro nutrients
    var ctx = document.getElementById("nutritionChart").getContext('2d');
    var nutritionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Carbs", "Protein", "Fat"],
            datasets: [{
                label: '# of Votes',
                data: [carbs, protein, fat],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
    });
};


////Collect elements value from ingredients name and ingredients price
let ingredientNames = document.querySelectorAll(".ingredient-name");
let ingredientPrices = document.querySelectorAll(".ingredient-price");

//If the elements for ingredients are there, produce arrays with chart data
if (ingredientNames.length > 0) {

    //array for ingredients names
    let ingredientNamesArr = [];
    //array for ingredients price
    let ingredientPricesArr = [];
    //array for chart slice colors
    let colorsArr = [];
    //array for chart slice border colors
    let borderColorsArr = [];

    //Add names to name array from ingredient elements
    for (ingredient of ingredientNames) {
        ingredientNamesArr.push(ingredient.innerText);
    };
    //Add prices to prices array from ingredient elements
    for (ingredient of ingredientPrices) {
        ingredientPricesArr.push(parseFloat(ingredient.innerText).toFixed(2));
    };

    //Produce colors for chart slices
    for(let i=0; i < ingredientNamesArr.length; i++) {
        //If there are more ingredients than colors, produce random colors
        if(i > COLORS.length) {
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
            //push colors to colors / border colors array
            colorsArr.push(`rgba(${r},${g},${b}, 0.2)`);
            borderColorsArr.push(`rgba(${r},${g},${b}, 1)`);
        };
        //push colors to colors / border colors array
        colorsArr.push(`rgba(${COLORS[i]}, 0.2)`);
        borderColorsArr.push(`rgba(${COLORS[i]}, 1)`);
    };

    ///Create chart with Chart JS
    var ctx = document.getElementById("priceChart").getContext('2d');
    var priceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ingredientNamesArr,
            datasets: [{
                label: '# of Votes',
                data: ingredientPricesArr,
                backgroundColor: colorsArr,
                borderColor: borderColorsArr,
                borderWidth: 1
            }]
        },
    });
};