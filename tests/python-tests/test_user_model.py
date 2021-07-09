"""User model tests."""
import os
from unittest import TestCase
from sqlalchemy import exc
import math

from models import db, User, UserRecipes, MealTime, Permissions

os.environ['DATABASE_URL'] = 'postgres:///recipe_app_test'

from app import app


class UserModelTestCase(TestCase):
    """Test models for user."""

    def setUp(self):
        """Create test client, add sample data."""
        db.drop_all()
        db.create_all()


        p1 = Permissions(
            permissions="basic"
        )

        db.session.add(p1)

        u = User.signup(
            username="tester",
            first_name="tester",
            password="password",
            image_url=None
        )

        uid = 1111
        u.id = uid

        db.session.add(u)
        db.session.commit()

        u = User.query.get(uid)
        self.u = u
        self.uid = uid
        self.client = app.test_client()


    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res


################# User Tests

    def test_user_repr(self):
        """Test User repr method"""
        self.assertEqual(self.u.__repr__(), f"<User #{self.u.id}: Username={self.u.username}, Firstname={self.u.first_name}, Image_URL={self.u.image_url}, Permissions={self.u.permissions}>")
 

    def test_user_default_image(self):
        """Test User image default"""
        self.assertEqual(self.u.image_url, "/static/images/default-pic.png")

    
    def test_user_authenticate(self):
        """Test User authenticate method"""
        user = User.authenticate(username=self.u.username, password="password")
        self.assertEqual(self.u.username, user.username)


# ################# User Recipes

    def test_user_recipes(self):
        """Test User recipes model and user class property"""
        sr1 = UserRecipes(
            id=1,
            user_id=self.uid,
            recipe_id=111
        )

        sr2 = UserRecipes(
            id=2,
            user_id=self.uid,
            recipe_id=222
        )

        db.session.add_all([sr1, sr2])
        db.session.commit()

        user_recipe_1 = UserRecipes.query.get(sr1.id)
        user_recipe_2 = UserRecipes.query.get(sr2.id)

        self.assertEqual(self.u.user_recipe_ids, [sr1.recipe_id, sr2.recipe_id])
        self.assertEqual(self.u.user_recipe_ids, [user_recipe_1.recipe_id, user_recipe_2.recipe_id])


