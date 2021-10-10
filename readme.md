This is the backend API for registering user, login and then resetting password for the user.

These are the end points-

get "https://password-reset123.herokuapp.com/" - gives welcome message

post "https://password-reset123.herokuapp.com/register" - allows us to register user

post "https://password-reset123.herokuapp.com/login" - allows us to login the user

get "https://password-reset123.herokuapp.com/private" - user will be able to access this route only if he is logged in

post "https://password-reset123.herokuapp.com/forgotPass" - allows us to initiate start of password reset process, we send email through this end point

put "https://password-reset123.herokuapp.com/resetPass" - allows us to send email, new password and otp to our database and reset password
