///////LOADING SPINNER: On window load -> show loading spinner
$(window).on('load', function () {
    //loading spinner
    $('#loading-spinner').hide();

    //Timing the load spinners
    setTimeout(() => { $('#loader').addClass("hide-loader"); }, 200);
    setTimeout(() => { $('#loader').hide(""); }, 400);
});


$(document).ready(function () {

    ///////MODAL UI: Functions to toggle classes between login and sign modals
    const toggleModalStyles = () => {
        $("#login-message").toggleClass("message-switch");
        $("#signup-message").toggleClass("message-switch");
        $("#login-message-background").toggleClass("move-right");
        $("#login-message-background").toggleClass("login-message-background-2");
    };

    //Toggle Login/Signup modal styles from modal button
    //login button
    $("#modal-login-btn").on("click", toggleModalStyles);
    //signup button
    $("#modal-signup-btn").on("click", toggleModalStyles);

    //Toggle Login/Signup modal styles from header buttons
    //signup button
    $("#header-login-btn").on("click", () => {
        if ($("#login-message").hasClass("message-switch")) {
            toggleModalStyles();
        };
    });
    //login button
    $("#header-signup-btn").on("click", () => {
        if ($("#signup-message").hasClass("message-switch")) {
            toggleModalStyles();
        };
    });


    ///////MOBILE MODAL UI: Functions to toggle classes between login and sign modals
    const toggleModalStylesMobile = () => {
        $("#login-form").toggleClass("message-switch-mobile");
        $("#signup-form").toggleClass("message-switch-mobile");
    };
    //Toggle Login/Signup modal styles from modal button
    //LOGIN button
    $("#header-login-btn").on("click", () => {
        if ($("#login-form").hasClass("message-switch-mobile")) {
            toggleModalStylesMobile();
        };
    });
    //SIGNUP button
    $("#header-signup-btn").on("click", () => {
        if ($("#signup-form").hasClass("message-switch-mobile")) {
            toggleModalStylesMobile();
        };
    });
    //Toggle MOBILE Login/Signup modal styles
    $("#modal-login-btn-mobile").on("click", toggleModalStylesMobile);
    $("#modal-signup-btn-mobile").on("click", toggleModalStylesMobile);




    /////////FORM ERRORS: 
    ///Functions to show errors after reload after invalid SIGNUP form submission
    const signupFormErrors = document.querySelectorAll(".signup-form-error");
    const signupInputErrors = document.querySelectorAll(".signup-input-error");
    //If Errors update UI
    if (signupFormErrors.length > 0) {
        errors = signupFormErrors[0].innerText;
        signupFormErrors[0].innerHTML = "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
        signupFormErrors[0].innerHTML += errors;
    };

    if (signupFormErrors.length > 0 || signupInputErrors.length > 0) {
        $('#login').modal('show');
        toggleModalStyles();
    };

    ///Functions to show errors after reload after invalid SIGNUP form submission
    const loginFormErrors = document.querySelectorAll(".login-form-error");
    const loginInputErrors = document.querySelectorAll(".login-input-error");
    //If Errors update UI
    if (loginFormErrors.length > 0 || loginInputErrors.length > 0) {
        $('#login').modal('show');
    };

    if (loginFormErrors.length > 0) {
        errors = loginFormErrors[0].innerText;
        loginFormErrors[0].innerHTML = "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
        loginFormErrors[0].innerHTML += errors;
    };

    /////Edit user form reload
    const editFormErrors = document.querySelectorAll(".edit-form-error");
    const editInputErrors = document.querySelectorAll(".edit-input-error");
    //if page loads with errors display form modal
    if (editFormErrors.length > 0 || editInputErrors.length > 0) {
        $('#edit_user').modal('show');
    };


    ////////DEFAULT MODAL: show modal when clicking recipe search results if user is not logged in
    $("#results-container a").click(() => {
        $("#login").modal('show');
    });



    //////////RECIPE SUMMARY: convert text to HTML and update all links to our routes
    let summary = document.getElementById('summary');

    if (summary) {
        //Convert plain text into HTML for recipe summary
        summary.innerHTML = summary.innerText;

        ///Edit summary so all links refer to this app and not API Website's broken links
        let summaryLinks = summary.querySelectorAll("a");
        //Collect id from DOM node.href and reassign node.href
        for (let a of summaryLinks) {
            a.href = `/recipe/${a.href.split("-")[a.href.split("-").length - 1]}`;
        };
    };



    //////////SAVE RECIPES:
    //save recipe icon elements
    //container
    const recipeStarContainer = document.getElementById("recipe-star-container");
    //Favorite star classes refer to "removing" the recipe from saved recipes
    const favoriteStar = `<i class="fav fas fa-star remove-favorite-button" id="remove-favorite-button" data-id="" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove From Favorites" data-bs-original-title="Remove from Favorites" aria-label="Remove from Favorites"></i>`;
    //Not Favorite star classes refer to "making" the recipe a saved recipe
    const notFavoriteStar = `<i class="fav fa-star far make-favorite-button" id="make-favorite-button" data-id="" data-bs-toggle="tooltip" data-bs-placement="top" title="Save to Favorite" data-bs-original-title="Save to Favorite" aria-label="Save to Favorite"></i>`;
    //Mini loading wheel to prevent duplicate actions
    const favLoader = `<div id="mini-loader">
                            <div id="mini-loading-spinner" class="mini-loader"></div>
                        </div>`;


    //////////Event listener Adding recipe to favorites
    $("#recipe-container").on("click", addRecipeToFavorites);

    ///////Save recipes functions
    async function addRecipeToFavorites(evt) {
        //Check if the is a make
        if ($(evt.target).is('.make-favorite-button')) {
            //hide tooltip
            $('.tooltip').tooltip('hide');
            //Capture recipe ID
            let recipeID = $(evt.target).attr('data-id');
            //show loader
            recipeStarContainer.innerHTML = favLoader;

            //Save to database
            await axios.post(`/save_recipe/${recipeID}`).then(response => {
                //show success message
                handleSavedRecipeMessages($(evt.target));
                //add Favorite UI element
                recipeStarContainer.innerHTML = favoriteStar;
                //Add recipe ID to new element
                $("#remove-favorite-button").attr('data-id', recipeID);
                //update tooltip
                updateToolTips();
            });
            //Check if the is a remove
        } else if ($(evt.target).is('.remove-favorite-button')) {
            $('.tooltip').tooltip('hide');
            //Capture recipe ID
            let recipeID = $(evt.target).attr('data-id');
            //show loader
            recipeStarContainer.innerHTML = favLoader;

            //Save to database
            await axios.post(`/remove_recipe/${recipeID}`).then(response => {
                //show success message
                handleSavedRecipeMessages($(evt.target));
                //add NotFavorite UI element
                recipeStarContainer.innerHTML = notFavoriteStar;
                //Add recipe ID to new element
                $("#make-favorite-button").attr('data-id', recipeID);
                //update tooltip
                updateToolTips();
            });
        };
    };


    //Update UI with class toggle
    const handleSavedRecipeMessages = (target) => {
        //Alert elements for favorite toggle
        const addFavSuccess = $("#add-favorite-success");
        const addFavSuccessMessage = $("#add-favorite-success-message");
        const removeFavSuccess = $("#remove-favorite-success");
        const removeFavSuccessMessage = $("#remove-favorite-success-message");
        //Alerts text for favorite toggles
        const addedMessage = `This recipe has been <b>added</b> to your favorites.`;
        const removedMessage = `This recipe has been <b>removed</b> to your favorites`;

        //If it has the "Make" classes,then we switch it to "Remove" classes, removing the favorite classes
        if (target.hasClass("make-favorite-button")) {
            //Animate height in
            addFavSuccess.css("height", "40px");
            //Set timeout to add text after height animation
            setTimeout(() => {
                addFavSuccessMessage.html(addedMessage);
            }, 300);
            //Set timeout allow alert to dismiss
            setTimeout(() => {
                addFavSuccess.css("height", "0px");
                addFavSuccessMessage.text("");
            }, 4000);

        } else {
            //Animate height in
            removeFavSuccess.css("height", "40px");
            //Set timeout to add text after height animation
            setTimeout(() => {
                removeFavSuccessMessage.html(removedMessage);
            }, 300);
            //Set timeout allow alert to dismiss
            setTimeout(() => {
                removeFavSuccess.css("height", "0px");
                removeFavSuccessMessage.text("");
            }, 4000);
        }

    };



    ////////DISMISS ALERTS after a few seconds
    let alerts = document.querySelectorAll(".alert");
    if (alerts.length > 0) {
        //fade out 
        setTimeout(() => {
            $(alerts[0]).addClass('no-opacity');
        }, 3000);
        //remove element
        setTimeout(() => {
            alerts[0].remove();
        }, 3300);
    }


    //BOOTSTRAP TOOLTIPS to label icons that save recipes
    const updateToolTips = () => {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    //run tooltips on page load
    updateToolTips();

});
///END of document.ready

///////CONVERT DECIMALS into fractions for ingredient measurements example: 0.5 cups -> 1/2 cups
////This functions was sourced: https://danielbachhuber.com/2019/02/04/javascript-number-fraction/
const numberToFraction = (amount) => {
    // This is a whole number and doesn't need modification.
    if (parseFloat(amount) === parseInt(amount)) {
        return parseInt(amount);
    }
    // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
    const gcd = (a, b) => {
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

//Apply numberToFraction to all "ingredient-decimal" elements
let decimals = document.querySelectorAll(".ingredient-decimal");
for (d of decimals) {
    number = d.textContent;
    d.innerText = numberToFraction(number)
};








