import os
import requests

from flask import Flask, render_template, request, flash, redirect, session, g, abort
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, or_, not_

from forms import UserSignupForm, UserEditForm, UserLoginForm
from models import db, connect_db, User, UserRecipes, MealTime, Permissions


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

connect_db(app)


API_KEY = "ac7991b98f02431da8a378c8d61af292"

API_SEARCH_BASE = "https://api.spoonacular.com/recipes/complexSearch"

SEARCH_RESULTS = "10"

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
            flash("Username already taken", 'danger')
            return render_template('no_user/no_user_home.html', signup_form=signup_form, login_form=login_form)

        do_login(user)
        flash(f"Hello, {user.first_name}!", "success")

        return redirect("/home")

    else:
        return redirect('/')



@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""
    login_form = UserLoginForm()

    if login_form.validate_on_submit():
        user = User.authenticate(username=login_form.username.data, password=login_form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.first_name}!", "success")
            return redirect("/home")
    
    flash("Invalid credentials.", 'danger')
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

    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    return render_template('no_user/no_user_home.html', signup_form=signup_form, login_form=login_form)



@app.route('/results')
def homepage_search_results():
    """Show List of search results from recipe search"""

    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    search = request.args.get('q')

    params={"apiKey": API_KEY, "query" : search, "number": SEARCH_RESULTS}

    response = requests.get(API_SEARCH_BASE,  params=params)

    res = response.json()['results']

    if g.user:
        return render_template('user/search_results.html', results=res)

    return render_template('no_user/no_user_search_results.html', results=res, signup_form=signup_form, login_form=login_form)



@app.route('/home')
def home_logged_om():
    """Homepage view for logged-in user"""
    if not g.user:
        return redirect("/")

    converted_user_recipes_list = [str(recipe_id) for recipe_id in g.user.user_recipe_ids]
    user_recipe_ids_string = ",".join(converted_user_recipes_list)


    
    params={"apiKey": API_KEY, "ids": user_recipe_ids_string, "includeNutrition" : "false"}

    response = requests.get(f"https://api.spoonacular.com/recipes/informationBulk",  params=params)

    recipes = response.json()
    
    return render_template('user/home.html', recipes=recipes)




@app.route('/recipe/<int:recipe_id>')
def show_recipe_information(recipe_id):
    """Show recipe information"""
    if not g.user:
        return redirect("/")

    params={"apiKey": API_KEY, "includeNutrition" : "false"}

    response = requests.get(f"https://api.spoonacular.com/recipes/{recipe_id}/information",  params=params)

    recipe = response.json()

    return render_template('user/recipe_details.html', recipe=recipe)




@app.route('/save_recipe/<int:recipe_id>', methods=["POST"])
def save_user_recipe(recipe_id):
    """Save recipe to user recipes"""
    save_recipe = UserRecipes(user_id=g.user.id, recipe_id=recipe_id)

    db.session.add(save_recipe)
    db.session.commit()

    return redirect(f"/recipe/{recipe_id}")



@app.route('/profile', methods=["GET", "POST"])
def user_profile():
    """Show User profile information"""
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(g.user.id)
    edit_user_form = UserEditForm(obj=user)

    if edit_user_form.validate_on_submit():
        user.username = edit_user_form.username.data
        user.first_name = edit_user_form.first_name.data
        user.image_url = edit_user_form.image_url.data
        password = edit_user_form.password.data

        # authenticate will return a user or False
        user = User.authenticate(user.username, password)

        if not user: 
            flash("Password Incorrect.", "danger")
            return redirect('/profile')
        else:
            
            db.session.add(user)
            db.session.commit()

            flash("Profile Updated.", "success")
            return redirect('/home')

    return render_template('user/profile.html', edit_user_form=edit_user_form, user=user)


