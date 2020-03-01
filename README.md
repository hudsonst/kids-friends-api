# Your Kid's Friends API

This API is the backend of an app called "Your Kid's Friends!" It's a database of your kids and their friends, sorted by kid. Kids and Friends can be added and edited. Friends each have a list of siblings as well. The api uses Express and Knex, and the database is Postgres. 

## Endpoints

### kids-routers.js

/Home
-----
GET - The Home endpoint returns a master list of kids and all of their Friends.

/
-
POST - Adds a kid to the kids table.

/:kidId
-------
GET - Gets the kid info from the kids and kids_friends tables.
PATCH - Updates the kid in the kids and kids_friends tables.
DELETE - Deletes the kid from the kids and kids_friends tables.

/getFriends/:kidId
------------------
GET - gets all the friends of the kid referenced by 'kidId'. 

### friends-routers.js

/
-
GET - get all friends from the friends table.
POST - Adds a friend to a the friends table.

/:friendId
----------
GET - gets friend from friend table (including siblings).
PATCH - updates friend in the friends table and/or siblings in the siblings table.
DELETE - deletes friend from the friends table (including siblings).


/siblings/:friendId
-------------------
POST - adds siblings to the siblings table to the friend referenced by 'friendId'.

/siblings/:siblingId
--------------------
DELETE - Deletes the sibling from the siblings table.





