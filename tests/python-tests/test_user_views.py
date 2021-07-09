"""User View tests."""
import os
from unittest import TestCase

from models import db, User, UserRecipes, MealTime, Permissions

os.environ['DATABASE_URL'] = 'postgres:///recipe_app_test'

from app import app, CURR_USER_KEY

app.config['WTF_CSRF_ENABLED'] = False



class UserViewTestCase(TestCase):
    """Test views for users"""

    def setUp(self):
        """Create test client, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        p1 = Permissions(
            permissions="basic"
        )
        db.session.add(p1)


        self.testuser = User.signup(username="tester",
                                    first_name="tester",
                                    password="password",
                                    image_url=None
                                    )

        self.testuser_id = 12345
        self.testuser.id = self.testuser_id 
        
        db.session.add(self.testuser)
        db.session.commit()



    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res



    def test_user_home(self):
        """Test recipe User Home page"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("/home")
            self.assertIn("Saved Recipes", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_no_user_home(self):
        """Test recipe User Home page redirect with no logged in user"""
        with self.client as c:
            resp = c.get("/home", follow_redirects=True)
            self.assertIn("Sign up today!", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_recipe_search(self):
        """Test recipe search with API"""
        with self.client as c:
            resp = c.get("/results?q=chicken")
            
            self.assertIn("Chicken", str(resp.data))
            self.assertIn("Search Results", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_recipe_view(self):
        """Test recipe page view"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("/recipe/656723")
            self.assertIn("Pork Carnitas Tacos", str(resp.data))
            self.assertIn("Ingredients", str(resp.data))
            self.assertIn("Steps", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_recipe_view_no_user_redirct(self):
        """Test redirect of recipe page without user"""
        with self.client as c:

            resp = c.get("/recipe/656723")
            self.assertEqual(resp.status_code, 302)



    def test_recipe_view_with_invalid_recipe_id(self):
        """Test recipe page view"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("/recipe/999999999999999")
            self.assertEqual(resp.status_code, 404)



    def test_save_recipe(self):
        """Test Saving a recipe route"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.post("/save_recipe/656723", follow_redirects=True)

            user_recipe = UserRecipes.query.filter(UserRecipes.recipe_id == "656723").first()

            self.assertEqual(user_recipe.user_id, self.testuser.id)
            self.assertEqual(resp.status_code, 200)



    def test_delete_recipe(self):
        """Test Deleting a user's saved recipe route"""
        saved_recipe = UserRecipes(user_id=self.testuser.id, recipe_id="656723")
        db.session.add(saved_recipe)
        db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.post("/remove_recipe/656723", follow_redirects=True)
            self.assertEqual(resp.status_code, 200)



    def test_recipe_nutrition_view(self):
        """Test Recipe Nutrition view"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("recipe/656723/nutrition")
            self.assertIn("Calories:", str(resp.data))
            self.assertIn("376", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_invalid_recipe_nutrition_view(self):
        """Test Recipe Nutrition route with invalid recipe id"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("/recipe/999999999999999/nutrition")
            self.assertEqual(resp.status_code, 404)



    def test_recipe_pice_view(self):
        """Test Recipe Price view"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("recipe/656723/price")
            self.assertIn("$9.34", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_invalid_recipe_price_view(self):
        """Test Recipe Price route with invalid recipe id"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("/recipe/999999999999999/price")
            self.assertEqual(resp.status_code, 404)



    def test_profile_view(self):
        """Test User Profile view"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            resp = c.get("profile")
            self.assertIn("tester", str(resp.data))
            self.assertEqual(resp.status_code, 200)



    def test_invlaid_profile_view(self):
        """Test User Profile view"""
        with self.client as c:

            resp = c.get("profile", follow_redirects=True)
            self.assertIn("Access unauthorized.", str(resp.data))
            self.assertEqual(resp.status_code, 200)