# CAPSTONE 1 PROPOSAL
---
## Objective
This web application will be designed to allow users to search for recipes according to their taste or nutritional goals. The nutritional information for each recipe will be available. Users will be able to save recipes to their account and plan weekly meals. 

## Users
The demographic for our users will be broad, basically anyone who cooks their own food. Most of our users will be men or women of any background between the ages of 18 - 40, assuming younger people are less likely to cook for themselves and older people have enough experience with meal prep that they don't typically rely on web apps for assistance.

## API / Data
The app will use the Spoonacular API for recipes, ingredients, and nutritional information. The users account info and saved recipes will be saved on our SQL database using PostgreSQL. Chart.js may also be included to visual nutritional information.

# Approach

## Overview
The web app will include a home page that lists "Most Popular" recipes based on user data and from the homepage users will be able to search recipes without creating an account. Once an account is created, the user will have access to a dashboard where they can view saved recipes.

## Database Schema
The database will need tables for users, saved_recipes, and possibly something for weekly_recipe_plans.

## Potential API Issues
The API will has paid tiers. The free tier only allows for 150 requests a day which I can easily go over in development. The lowest price tier allows for 1,500 calls a day which should suffice for development and demo purposes. These lower tiers do not guarantee 100% uptime but the APIs overall uptime was 99.993% in the last three months.

## Security
The app should do it's best to protect any User data. Passwords should be encrypted on our database. The API key will be sensitive information. We should determine a method to conceal our API key so hackers can't steal our key and use up our calls.

## Functionality Checklist
The app should be able to do the following:  
- Search recipes
- Search recipes by Ingredients
- Search recipes by Nutrients
- List to 10 Most Popular/Trending recipes based on user data
- Allow users to register an account
- Allow users to login and logout of their accounts
- Show full recipe information
- Show visualization of nutritional data
- Save recipes to user favorites
- Plan weekly recipes
- Plan recipes with budget

## UserFlows
Users will enter the app through the homepage. This will show the top 10 Trending/Popular recipes. There will be a search bar for searching for recipes. Users will be able to drill down into recipes to see the full information. All of this will be available without the need to be logged in. From the homepage the user can Create an Account or Login. Once logged in the user will access to a dashboard will saved recipes and any other information.

## Stretch Goals
Further goals include adding functionality to search recipes based on budget or "what's in the fridge". Also allow users to plan meals based on calories, macro-nutrients, and/or budget.


