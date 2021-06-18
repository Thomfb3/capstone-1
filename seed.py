from models import db, User, UserRecipes, MealTime, Permissions

db.drop_all()
db.create_all()


p1 = Permissions(
    permissions="basic"
)


db.session.add(p1)
db.session.commit()


u1 = User.signup("Thomfb3", "Tom", "password", "/static/images/default-pic.png")


db.session.add(u1)
db.session.commit()