"""SQLAlchemy models for Warbler."""

from datetime import datetime

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy


bcrypt = Bcrypt()
db = SQLAlchemy()


class User(db.Model):
    """User Model"""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    first_name = db.Column(
        db.Text,
        nullable=False,
    )

    image_url = db.Column(
        db.Text,
        default="/static/images/default-pic.png",
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    permissions = db.Column(
        db.Integer,
        db.ForeignKey('permissions.id'),
        default=1,
    )




    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.first_name}. {self.permissions}>"


    @classmethod
    def signup(cls, username, first_name, password, image_url):
        """Sign up user.
           Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            first_name=first_name,
            password=hashed_pwd,
            image_url=image_url
        )

        db.session.add(user)
        return user


    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.
           If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False





class UserRecipes(db.Model):
    """User's Saved recipes Model"""

    __tablename__ = 'user_recipes'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )

    recipe_id = db.Column(
        db.Integer,
        nullable=False,
    )



class MealTime(db.Model):
    """Mealtime Model"""

    __tablename__ = 'meal_time'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )

    mealtime = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow(),
    )

    recipe_id = db.Column(
        db.Integer,
        nullable=False,
    )



class Permissions(db.Model):
    """Permissions Model"""

    __tablename__ = 'permissions'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    
    permissions = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )



def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)






