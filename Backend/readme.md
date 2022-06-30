# Backend API

Protected routes always check within the scope of the scoreboard
This is determined by the serial number in the JWT token.

Routes marked with an "\*" are only allowed to be used by the admin.

The first account to be created on a scoreboard is automatically the admin.

## HTTP(S)

```js
///Unprotected

//login to app
POST /auth
body: {
    username,
    password
}

//register an account
POST /register
body: {
    username,
    password,
    serial,
}

//logout from app (Frontend only)
GET /logout

//void current JWT token (Frontend only)
GET /revoke

///Protected

//change password
PUT /changepassword
body: {
    currentPassword,
    newPassword,
}

//edit username
* POST /edituser
body: {
    currentUsername,
    newUsername,
}

//logout from app (And get rid of JWT tokens)
GET /logout

//void all JWT tokens attached to user
GET /revoke

//shows content of JWT token in JSON
GET /status

//get list of all sponsor bundles & sponsor images inside
GET /sponsors

//delete a sponsor by its bundle & name
DELETE /sponsors ?bundle=NAME&file=NAME

//add a match template
POST /template
body: {
    name,
    parts,
    duration,
}

//get all templates for current scoreboard
GET /template

//modify a template
PUT /template
body: {
    name,
    parts,
    duration,
}

//delete a template
DELETE /template
body: {
    name,
}

//get all users that have access to the scoreboard
* GET /user

//delete a user by name
* DELETE /user
body: {
    user,
}
```

## WS(S)

```js
///Unprotected

//relay data and log it in Backend console
EMIT "echo" data

//tells the server you want to subscribe to that scoreboard's datastream
EMIT "data" serial

///Protected

//inject data into the scoreboard and clients (in own scope)
EMIT "input" type value
"1B" CSSCOLOR // Team 1 Top color
"2B" CSSCOLOR // Team 2 Top color
"1O" CSSCOLOR // Team 1 Bottom color
"2O" CSSCOLOR // Team 2 Bottom color
"screen" SPONSORPATH // Display a sponsor
"message" MESSAGESTRING // Set the scrolltext message
"timer" TIMERVALUE // Set the timer
"G1" +-1 OR "reset" // Set the score of team 1
"G2" +-1 OR "reset" // Set the score of team 2
"COLORS" [CSSCOLOR] // Set the colors in the colorpicker

//emit the name and folder the newly uploaded sponsor image needs to go in
EMIT "upload" folder name
```
