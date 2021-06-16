import os
import requests

from flask import Flask, render_template, request, flash, redirect, session, g, abort
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import UserSignupForm, UserEditForm, UserLoginForm
from models import db, connect_db, User, UserRecipes, MealTime, Permissions


CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///recipe_app'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
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
            return render_template('home.html', signup_form=signup_form, login_form=login_form)

        do_login(user)
        flash(f"Hello, {user.first_name}!", "success")

        return redirect("/user_home")

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
            return redirect("/user_home")
    
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
def homepage_search():
    """Show homepage """
    if g.user:
        return redirect("/user_home")

    return render_template('home.html')



@app.route('/login_signup')
def show_login_signup_forms():
    if g.user:
        return redirect("/user_home")

    signup_form = UserSignupForm()
    login_form = UserLoginForm()

    return render_template('login_signup.html', signup_form=signup_form, login_form=login_form)


@app.route('/results')
def homepage_search_results():
    """Show homepage """

    # if g.user:
    #     return redirect("/user_home")

    search = request.args.get('q')

    params={"apiKey": API_KEY, "query" : search, "number": SEARCH_RESULTS}

    response = requests.get(API_SEARCH_BASE,  params=params)

    res = response.json()['results']

    return render_template('results.html', results=res)



@app.route('/user_home')
def user_homepage_search():
    if g.user:
        return render_template('user_home.html')

    return redirect('/')