from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, URL

DEFAULT_IMAGE = "/static/images/default-pic.png"

def validate_image(form, field):
    if field.data == DEFAULT_IMAGE:
        return True
    elif field.data == "":
        return True
    else:
        url_validator = URL(require_tld=True, message="Not a valid URL.")
        return url_validator(form, field) 


class UserSignupForm(FlaskForm):
    """Form for adding users."""
    username = StringField('Username', validators=[DataRequired(), Length(min=5)])
    first_name = StringField('First Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])
    image_url = StringField('(Optional) Image URL', validators=[validate_image])   



class UserEditForm(FlaskForm):
    """Form for editing users."""
    username = StringField('Username', validators=[DataRequired(), Length(min=5)])
    first_name = StringField('First Name', validators=[DataRequired()])
    image_url = StringField('(Optional) Image URL', validators=[validate_image])        
    password = PasswordField('Password', validators=[Length(min=6)])



class UserLoginForm(FlaskForm):
    """Login form."""
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


