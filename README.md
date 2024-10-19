"# chain-reaction" 

this is a NODE/EXPRESS template with basic features like:
    Redis
    Cookies and sessions
    passport
    Oauth2



Setting up Redis:
open Ubuntu WSL terminal in the root folder..
Run these following commands...

    sudo service redis-server start
enter password

to check if the server is up and running type.. 
    redis-cli ping
you should get PONG as output

to access redis terminal type
    redis-cli

now type 
    ping
or
    keys *
it'll show saved keys

to exit redis-cli terminal
either press ctrl + C
or type "exit"

-------------------------------------------------

open chain-reaction //this is frontend
in terminal and type "npm start"
this will start front end server on port 3000

open backend in terminal
type "npm start"
this will start backend server on port 5000

-------------------------------------------------

cookies, sessions, OAuth and passport
the endpoint /auth/google leads to google login
and to check if the login was successful
go to localhost:5000/profile
this is a protected route.. so it is accessible if the user is logged in

-------------------------------------------------

