from models import db, User, UserRecipes, MealTime, Permissions

def run_seed():
    db.drop_all()
    db.create_all()


    p1 = Permissions(
        permissions="basic"
    )


    db.session.add(p1)
    db.session.commit()


    u1 = User.signup("Thomfb3", "Tom", "password", "/static/images/default-pic.png")
    
    # u1 = User(
    #     username="Thomfb3",
    #     first_name="Tom",
    #     password="password",
    #     permissions=1
    # )

    db.session.add(u1)
    db.session.commit()