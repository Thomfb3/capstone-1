import os
import requests
import math

from flask import Flask, render_template, request, flash, redirect, session, g, abort
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, or_, not_

from forms import UserSignupForm, UserEditForm, UserLoginForm
from models import db, connect_db, User, UserRecipes, MealTime, Permissions

#Global variable for current user
CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (os.environ.get('DATABASE_URL', 'postgres:///recipe_app')).replace("://", "ql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "local.secret.key")
toolbar = DebugToolbarExtension(app)
#Connect DB
connect_db(app)

##Spoonacular API key 
API_KEY = "12345"
#API Search url base
API_SEARCH_BASE = "https://api.spoonacular.com/recipes/complexSearch"
#Search results number
SEARCH_RESULTS = "12"

CUISINES = ["American", "Korean", "Mexican", "Chinese", "Indian", "Italian"]

##############################################################################
# User signup/login/logout 

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None

def do_login(user):
    """Log in user."""
    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.
    Create new user and add to DB. Redirect to home page.
    If form not valid, present form.
    If the there already is a user with that username: flash message
    and re-present form.
    """
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    # Signup form validation
    if signup_form.validate_on_submit():
        try:
            user = User.signup(
                username=signup_form.username.data,
                first_name=signup_form.first_name.data,
                password=signup_form.password.data,
                image_url=signup_form.image_url.data or User.image_url.default.arg,
            )
            db.session.commit()

        except IntegrityError as e:
            # Flash errors and reload page
            flash("Username already taken", 'danger signup-form-error')
            return render_template('no_user/no_user_home.html', signup_form=signup_form, login_form=login_form)
        # If it worked -> do login and say hello
        do_login(user)
        flash(f"Hello, {user.first_name}!", "success")
        # Go to User Home
        return redirect("/home")
    else:
        #If form not valid
        fields=[field for field in signup_form]
        errors = {}
        #Capture errors in dict
        for field in fields:
            if field.errors:
                errors[field.name] = field.errors

        #Create error message string to display errors on redirect
        error_message = "<i class='far fa-frown-open error-sad-icon'></i><span class='error-sad-title'>Dang it! It didn't work...</span>"
        
        for name, error in errors.items():
            error_message += f"<p><b>*</b> {name} : {error[0]}</p>"

        flash(f"{error_message}", 'danger signup-form-error')
      
        return redirect('/')



@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""
    login_form = UserLoginForm()

    if login_form.validate_on_submit():
        #User authenticate class method
        user = User.authenticate(username=login_form.username.data, password=login_form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.first_name}!", "success")
            return redirect("/home")

    #Create error message string to display errors on redirect  
    error_message = "<i class='far fa-grimace error-sad-icon'></i><span class='error-sad-title'>Invalid credentials!</span><p>Username or Password is incorrect."
    flash(f"{error_message}", 'danger login-form-error')
    return redirect("/") 



@app.route('/logout')
def logout():
    """Handle logout of user."""
    do_logout()

    flash("You have successfully logged out.", 'success')
    return redirect("/")



##############################################################################
# General routes

@app.route('/')
def homepage():
    """Homepage view with simple search bar and login/signup forms"""
    if g.user:
        return redirect("/home")

    #Apply forms to homepage view
    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    return render_template('no_user/no_user_home.html', signup_form=signup_form, login_form=login_form, cuisines=CUISINES)



@app.route('/results')
def homepage_search_results():
    """Show List of search results from recipe search"""
    #Need forms here too
    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    #collect query term from args
    search = request.args.get('q')
    offset_number = request.args.get('offset') or SEARCH_RESULTS

    offset = int(offset_number) + int(SEARCH_RESULTS)

    #set params for API, capture response, set response to JSON
    params={"apiKey": API_KEY, "query" : search, "number": SEARCH_RESULTS, "offset" : offset}
    response = requests.get(API_SEARCH_BASE,  params=params)
    res = response.json()['results']

    if g.user:
        #If the user is logged in go to user search results page
        return render_template('user/search_results.html', results=res, offset=offset, search=search)
    #No user search results page
    return render_template('no_user/no_user_search_results.html', results=res, offset=offset, search=search, signup_form=signup_form, login_form=login_form)



@app.route('/results_by_ingredient/<ingredient>')
def search_by_ingredient_results(ingredient):
    """Show List of search results from recipe search"""
    #Should be able to do this only when user is logged in
    if not g.user:
        return redirect("/")

    #set params for API, capture response, set response to JSON
    params={"apiKey": API_KEY, "ingredients" : ingredient, "number": SEARCH_RESULTS}
    response = requests.get("https://api.spoonacular.com/recipes/findByIngredients",  params=params)
    res = response.json()

    return render_template('user/search_by_ingredients_results.html', results=res, ingredient=ingredient)



@app.route('/home')
def home_logged_om():
    """Homepage view for logged-in user"""
    if not g.user:
        return redirect("/")
    
    #If the user has saved recipes when to call the recipes from the API to list saved recipes
    if len(g.user.user_recipe_ids) > 0:
        #First create list of User.recipe_ids
        converted_user_recipes_list = [str(recipe_id) for recipe_id in g.user.user_recipe_ids]
        #Convert that list into a comma seperated string for the API params
        user_recipe_ids_string = ",".join(converted_user_recipes_list)

        #set params for API, capture response, set response to JSON
        params={"apiKey": API_KEY, "ids": user_recipe_ids_string, "includeNutrition" : "false"}
        response = requests.get(f"https://api.spoonacular.com/recipes/informationBulk",  params=params)
        recipes = response.json()
        
        return render_template('user/home.html', recipes=recipes, cuisines=CUISINES)

    else:
        #Else leave recipes empty
        recipes = [];
        return render_template('user/home.html', recipes=recipes, cuisines=CUISINES)




@app.route('/recipe/<int:recipe_id>')
def show_recipe_information(recipe_id):
    """Show recipe information"""
    if not g.user:
        return redirect("/")

    #set params for API, capture response, set response to JSON
    params={"apiKey": API_KEY, "includeNutrition" : "false"}
    response = requests.get(f"https://api.spoonacular.com/recipes/{recipe_id}/information",  params=params)
    recipe = response.json()

    #If that recipe is not in API db, handle 404
    if "status" in recipe.keys():
        if recipe['status'] == 404:
            return redirect("/no_recipe_found", 404)

    #Set user_recipes so we can add or subtract this recipe from the list
    user_recipes = g.user.recipes

    return render_template('user/recipe_details.html', recipe=recipe, user_recipes=user_recipes)




@app.route('/save_recipe/<int:recipe_id>', methods=["POST"])
def save_user_recipe(recipe_id):
    """Save recipe to user recipes"""
    if recipe_id in g.user.user_recipe_ids:
        #Just in case front end fails to update ui
        flash("That's weird, you have that recipe saved already.", "warning")
        return redirect(f"/recipe/{recipe_id}")

    #Save recipe to DB
    saved_recipe = UserRecipes(user_id=g.user.id, recipe_id=recipe_id)
    db.session.add(saved_recipe)
    db.session.commit()

    #Stay on same page
    return redirect(f"/recipe/{recipe_id}")



@app.route('/remove_recipe/<int:recipe_id>', methods=["POST"])
def remove_user_recipe(recipe_id):
    """Delete recipe from user recipes"""
    #If the recipe is in user_recipes, collect it
    recipe_to_remove = [recipe for recipe in g.user.recipes if recipe.recipe_id == recipe_id]

    #If the recipe ID was no in user recipes, flash a working
    if len(recipe_to_remove) > 1:
        flash("Something went wrong.", "danger")
        return redirect(f"/recipe/{recipe_id}")

    #Delete recipe from DB
    UserRecipes.query.filter(UserRecipes.id == recipe_to_remove[0].id).delete()
    db.session.commit()

    #Stay on recipe page
    return redirect(f"/recipe/{recipe_id}")




@app.route('/recipe/<int:recipe_id>/nutrition')
def show_recipe_nutrition(recipe_id):
    """Show recipe nutrition"""
    if not g.user:
        return redirect("/")

    #set params for API, capture response, set response to JSON
    params={"apiKey": API_KEY}
    response = requests.get(f"https://api.spoonacular.com/recipes/{recipe_id}/nutritionWidget.json",  params=params)
    nutrition = response.json()

     #If that recipe is not in API db, handle 404
    if "status" in nutrition.keys():
        if nutrition['status'] == 404:
            return redirect("/no_recipe_found", 404)

    return render_template('user/recipe_nutrition.html', nutrition=nutrition, recipe_id=recipe_id)



@app.route('/recipe/<int:recipe_id>/price')
def show_recipe_price(recipe_id):
    """Show recipe price breakdown"""
    if not g.user:
        return redirect("/")

    #set params for API, capture response, set response to JSON
    params={"apiKey": API_KEY}
    response = requests.get(f"https://api.spoonacular.com/recipes/{recipe_id}/priceBreakdownWidget.json",  params=params)
    price = response.json()

    #If that recipe is not in API db, handle 404
    if "status" in price.keys():
        if price['status'] == 404:
            return redirect("/no_recipe_found", 404)

    #Format price to represent dollars
    price_format = "{dollar:.2f}"
    
    return render_template('user/recipe_price.html', recipe_id=recipe_id, price=price, round=round, price_format=price_format)



@app.route('/profile', methods=["GET", "POST"])
def user_profile():
    """Show User profile information""" 
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    #User user info to set form object
    user = User.query.get_or_404(g.user.id)
    edit_user_form = UserEditForm(obj=user)

    if edit_user_form.image_url.data == "":
        image_url = User.image_url.default.arg
    else:
        image_url = edit_user_form.image_url.data

    if edit_user_form.validate_on_submit():
        # authenticate will return a user or False
        if User.authenticate(user.username, edit_user_form.password.data):
        
            try:
                user.username = edit_user_form.username.data
                user.first_name = edit_user_form.first_name.data
                user.image_url = image_url
                password = edit_user_form.password.data
                db.session.add(user)
                db.session.commit()

            except IntegrityError as e:
                db.session.rollback()
                flash("Username already taken", 'danger edit-form-error')
                #Flash Integrity Error message and return to the same form
                return render_template('user/profile.html', edit_user_form=edit_user_form, user=user)

            #Flash success message over proflie page
            flash("Profile Updated.", "success")
            return redirect('/profile')
        
        #Flash wrong password message if user authenticate returns false
        flash("Incorrect Password.", 'danger edit-form-error')
        return redirect('/profile')

    return render_template('user/profile.html', edit_user_form=edit_user_form, user=user)



@app.errorhandler(404)
def page_not_found(e):
    """404 NOT FOUND page."""
    return render_template('misc/404.html'), 404








