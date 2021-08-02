ame of a file to store your active tokens
>        credentials: a json array with  username password key pairs in this form:
>                        [{"username":"password"},{"username1":"password1"}]

Running the server:

In the project directory, you can run:

### `npm start` or `node server` if you want to go old skool.

Runs the app in the development mode.
The Endpoints will be:
    `http://localhost:4242/authenticate`
     `http://localhost:4242/welcome`

### Design Note
    This example does not use the best pratice of MVC separation and modularity, i.e. folders for
    - api
    - config
    - models
    - controllers
    - services
    - subscribers
      (yet...)  This is highly recommended for project clarity and industry best practice consistency, but may exceed the scope of this project.

* Update I have made some of these structural changes, but in retrospect they really only apply in monolithic applications and wouldn't be really appropriate for microservices architetures which node.js especially deployes as lambdas are especially good at.

### Operation

For simplicities sake these were built as GET methods so it's possible to test from a browser for example:
    `http://localhost:4242/authenticate?username=username&password=password`

    Should successfully return a token in the engagedMD cookie
        using that token stored in the cookie in the for all future references
	`http://localhost:4242/welcome`

A convenience endpoint has been created to clear out existing tokens to simulate their expiration
    `http://localhost:4242/cleartokens`

###  Testing
A number of unit tests and use case tests are included built on the jest and supertest packages.  They are very simple but can be expanded for advanced capabilities.  The tests are in the test folder and are executed by the following command.

### `npm test`

Make sure the server is not running on the local machine at the time the tests run, the test package will launch the server itself.  The username and password entries are hard coded (apologies), changing them should change the outcome of the test, for example on lines: 10, 18, 31, 36, 42, 59, 76

### Production Modifications
This exercise is meant to be prototype only.  In order to put this into production the following issues need to be addressed:

### (These notes are not meant to be formal, just memory triggers for me)
### Security Notes
*    HTTPS should always be used
*    POSTs are more secure (marginally), than GETs, GETs are preferred for simple lists or read requests basically
*    Tokens should employ real certificates for the jsonwebtoken package
*    Additional error checking (lack of parameters, or incoorect username, password) should generate internal audits to be used to lock the accounts and or notify account owners of activity
*    Filter, instead of relying on good coding practices to look for the token before continuing on an endpoint, all endpoints sans the authenticate should be redirections from a filter that checks for the token first.
*    require password complexity (but your users will hate you)
*    use Captcha for authenticate (your users will really really hate you, suggest on 2nd or 3rd retry from the IP)
*    Run standard scanners for Web related CVEs

### Performance Notes
*    Use a real database (service) for the tokens and username/passwords
*    Do not use synchronous functions
*    Expire tokens correctly
*    Deploy on the cloud as a lamba function - saves in cost, complexity, maintenance and security maintenance
*    Use load and stress testing to find real world failure points and modes before developing complicated deployment architectures

