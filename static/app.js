//Toggle Login/Signup modal styles
$("#modal-login-btn").on("click", toggleModalStyles);
$("#modal-signup-btn").on("click", toggleModalStyles);


function toggleModalStyles() {
    $("#login-message").toggleClass("message-switch");
    $("#signup-message").toggleClass("message-switch");
    $("#login-message-background").toggleClass("move-right");
}



$("#header-login-btn").on("click", function loginToggleModalStyles() {
    if ($("#login-message").hasClass("message-switch")) {
        toggleModalStyles();
    }
});


$("#header-signup-btn").on("click", function signupToggleModalStyles() {
    if ($("#signup-message").hasClass("message-switch")) {
        toggleModalStyles();
    }
});



$(document).ready(function() {
    const signupFormErrors = document.querySelectorAll(".signup-form-error");    
    const signupInputErrors = document.querySelectorAll(".signup-input-error");    

    if (signupFormErrors.length > 0) {
        errors = signupFormErrors[0].innerText;
        signupFormErrors[0].innerHTML = "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
        signupFormErrors[0].innerHTML += errors;
    }


    if (signupFormErrors.length > 0 || signupInputErrors.length > 0) {
        $('#login').modal('show');
        toggleModalStyles();
    }

    const loginFormErrors = document.querySelectorAll(".login-form-error");    
    const loginInputErrors = document.querySelectorAll(".login-input-error");    

    if (loginFormErrors.length > 0 || loginInputErrors.length > 0) {
        $('#login').modal('show');
    }

    if (loginFormErrors.length > 0) {
        errors = loginFormErrors[0].innerText;
        loginFormErrors[0].innerHTML = "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
        loginFormErrors[0].innerHTML += errors;
    }

});


$(document).ready(function() {
    const editFormErrors = document.querySelectorAll(".edit-form-error");    
    const editInputErrors = document.querySelectorAll(".edit-input-error");    

    if (editFormErrors.length > 0 || editInputErrors.length > 0) {
        $('#edit_user').modal('show');
    }
});


//Show modal when clicking recipe search results if user is not logged in
$("#results-container a").click(function () {
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







