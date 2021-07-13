///////On window load -> show loading spinner
$(window).on('load', function () {
    //loading spinner
    $('#loading-spinner').hide();

    //Timing the load spinners
    setTimeout(function () { $('#loader').addClass("hide-loader"); }, 200);
    setTimeout(function () { $('#loader').hide(""); }, 400);

});




$(document).ready(function () {

    ///////Functions to toggle classes between login and sign modals
    function toggleModalStyles() {
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
    $("#header-login-btn").on("click", function loginToggleModalStyles() {
        if ($("#login-message").hasClass("message-switch")) {
            toggleModalStyles();
        };
    });
    //login button
    $("#header-signup-btn").on("click", function signupToggleModalStyles() {
        if ($("#signup-message").hasClass("message-switch")) {
            toggleModalStyles();
        };
    });

    //Toggle MOBILE Login/Signup modal styles
    $("#modal-login-btn-mobile").on("click", toggleModalStylesMobile);
    $("#modal-signup-btn-mobile").on("click", toggleModalStylesMobile);



    ///////MOBILE - Functions to toggle classes between login and sign modals
    function toggleModalStylesMobile() {
        $("#login-form").toggleClass("message-switch-mobile");
        $("#signup-form").toggleClass("message-switch-mobile");
    };

    //MOBILE - Toggle Login/Signup modal styles from modal button
    //login button
    $("#header-login-btn").on("click", function loginToggleModalStyles() {
        if ($("#login-form").hasClass("message-switch-mobile")) {
            toggleModalStylesMobile();
        };
    });

    //SIGNUP - Toggle Login/Signup modal styles from modal button
    //login button
    $("#header-signup-btn").on("click", function signupToggleModalStyles() {
        if ($("#signup-form").hasClass("message-switch-mobile")) {
            toggleModalStylesMobile();
        };
    });




    ///////Functions to show errors after reload after invalid SIGNUP form submission
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




    ///////Functions to show errors after reload after invalid SIGNUP form submission
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




    //////////Convert plain text into HTML for recipe summary
    let summary = document.getElementById('summary');
    if (summary) {
        summary.innerHTML = summary.innerText;
    };

    if (summary) {
        //////////////Edit Summary so links got our web app and not to API Website with broken links
        //Collect RecipeIds in summary to create URLs to our routes 
        let summaryLinks = summary.querySelectorAll("a");
        //Empty array to collect recipe ids from summary links
        let summaryLinkIds = [];

        //Loop through summary a tag nodelist
        for (let i = 0; i < summaryLinks.length; i++) {
            //Collect href attribute value
            let pathArray = summaryLinks[i].href.split("");

            //Loop through href value to collect recipe ID
            for (let j = pathArray.length - 1; j > 0; j--) {
                //Based on Summary url format, every link ends with "-"and Id number
                if (pathArray[j] != "-") {
                    summaryLinkIds.push(pathArray[j]);
                } else {
                    //Set j=0 to break loop;
                    j = 0;
                }
            }

            //Set link element's href to new route
            summaryLinks[i].href = `/recipe/${summaryLinkIds.reverse().join("")}`;
            //empty link array for the next link
            summaryLinkIds = [];
        };

    };


    ///////Show modal when clicking recipe search results if user is not logged in
    $("#results-container a").click(function () {
        $("#login").modal('show');
    });



    ///////Edit user form reload
    const editFormErrors = document.querySelectorAll(".edit-form-error");
    const editInputErrors = document.querySelectorAll(".edit-input-error");
    //if page loads with errors display form modal
    if (editFormErrors.length > 0 || editInputErrors.length > 0) {
        $('#edit_user').modal('show');
    };





    //////////Event listener Adding recipe to favorites
    $("#recipe-container").on("click", addRecipeToFavorites);
    let waitingForAxios = false;
    let miniLoader = document.getElementById("mini-loader");

    ///////Save recipes functions
    async function addRecipeToFavorites(evt) {
        if ($(evt.target).is('.make_favorite_button') && !waitingForAxios) {
            //show loader
            miniLoader.style.display = "inline-block";
        
            //Set to true prevent duplicate requests before response
            waitingForAxios = true;

            //Collect recipe ID, push it database for user, update UI
            const recipeID = $(evt.target).attr('data-id');
            await axios.post(`/save_recipe/${recipeID}`).then(response => {
                //Update UI function
                handleSavedRecipeUiToggle($(evt.target));

                //fade out loader
                miniLoader.style.opacity = "0";
                setTimeout(function () {
                    miniLoader.style.display = "none";
                    miniLoader.style.opacity = "1";
                }, 2000);

                //Allow for 3 seconds before icon works again
                setTimeout(function () {
                    waitingForAxios = false;
                }, 3000);
            });

        } else if ($(evt.target).is('.remove_favorite_button') && !waitingForAxios) {
            //show loader
            miniLoader.style.display = "inline-block";

            //Set to true prevent duplicate requests before response
            waitingForAxios = true;

            //Collect recipe ID, remove it database for user, update UI
            const recipeID = $(evt.target).attr('data-id');
            await axios.post(`/remove_recipe/${recipeID}`).then(response => {
                //Update UI function
                handleSavedRecipeUiToggle($(evt.target));

                //fade out loader
                miniLoader.style.opacity = "0";
                setTimeout(function () {
                    miniLoader.style.display = "none";
                    miniLoader.style.opacity = "1";
                }, 2000);

                //Allow for 3 seconds before
                setTimeout(function () {
                    waitingForAxios = false;
                }, 3000);
            });
        };
    };


    //Update UI with class toggle
    function handleSavedRecipeUiToggle(target) {
        //Alert elements for favorite toggle
        const addFavSuccess = $("#add-favorite-success");
        const addFavSuccessMessage = $("#add-favorite-success-message");
        const removeFavSuccess = $("#remove-favorite-success");
        const removeFavSuccessMessage = $("#remove-favorite-success-message");
        //Alerts text for favorite toggles
        const addedMessage = `This recipe has been <b>added</b> to your favorites.`;
        const removedMessage = `This recipe has been <b>removed</b> to your favorites`;

        //If it has the "Make" classes,then we switch it to "Remove" classes, removing the favorite classes
        if (target.hasClass("make_favorite_button")) {
            //Set classes and attributes to switch Make and Remove buttons
            remove_fav_title = "Remove from Favorite"
            target.removeClass("far make_favorite_button");
            target.addClass("fas remove_favorite_button");
            target.attr("title", remove_fav_title)
            target.attr("data-bs-original-title", remove_fav_title)
            target.attr("aria-label", remove_fav_title)

            //Animate height in
            addFavSuccess.css("height", "40px");

            //Set timeout to add text after height animation
            setTimeout(function () {
                addFavSuccessMessage.html(addedMessage);
            }, 300);

            //Set timeout allow alert to dismiss
            setTimeout(function () {
                addFavSuccess.css("height", "0px");
                addFavSuccessMessage.text("");
            }, 4000);

        } else {
            //Set classes and attributes to switch Make and Remove buttons
            add_fav_title = "Save to Favorite"
            target.removeClass("fas remove_favorite_button");
            target.addClass("far make_favorite_button");
            target.attr("title", add_fav_title)
            target.attr("data-bs-original-title", add_fav_title)
            target.attr("aria-label", add_fav_title)

            //Animate height in
            removeFavSuccess.css("height", "40px");

            //Set timeout to add text after height animation
            setTimeout(function () {
                removeFavSuccessMessage.html(removedMessage);
            }, 300);

            //Set timeout allow alert to dismiss
            setTimeout(function () {
                removeFavSuccess.css("height", "0px");
                removeFavSuccessMessage.text("");
            }, 4000);
        }

    };




    ////////Dismiss alerts after a few seconds
    let alerts = document.querySelectorAll(".alert");
    if (alerts.length > 0) {
        //fade out 
        setTimeout(function () {
            $(alerts[0]).addClass('no-opacity');
        }, 3000);
        //remove element
        setTimeout(function () {
            alerts[0].remove();
        }, 3300);
    }


    //Bootstrap Tooltips to label icons that save recipes
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

});




///////Converts decimals into fractions for ingredient measurements example: 0.5 cups -> 1/2 cups
////This functions was sourced: https://danielbachhuber.com/2019/02/04/javascript-number-fraction/
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

//Apply numberToFraction to all "ingredient-decimal" elements
let decimals = document.querySelectorAll(".ingredient-decimal");
for (d of decimals) {
    number = d.textContent;
    d.innerText = numberToFraction(number)
};








