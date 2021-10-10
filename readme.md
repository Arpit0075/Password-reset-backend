This is the backend API for registering user, login and then resetting password for the user.

These are the end points-

get "/" - gives welcome message

post "/register" - allows us to register user

post "/login" - allows us to login the user

get "/private" - user will be able to access this route only if he is logged in

post "/forgotPass" - allows us to initiate start of password reset process, we send email through this end point

post "/resetPass" - allows us to send email, new password and otp to our database and reset password
