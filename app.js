const express = require('express');
var cookieParser = require('cookie-parser');
const sls = require('serverless-http')
const bodyParser = require("body-parser");
const app = express();
const url = require('url');
const { resolve } = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var os = require("os");

// Using the dotenv package, read the .env file in the same folder as this file

require('dotenv').config({ path: './.env' });

// Ensure environment variables are set.

checkEnv();

// Read the credentials file name from the environment file

const tokenFile = resolve(process.env.CREDENTIALS_FILE);

// Set up to parse cookies

app.use(cookieParser());

const students = ["Elie", "Matt", "Joel", "Michael"];
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json(students);
});


// Test to make sure the server is running and acting correctly
app.get('/test', async (req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.json({message: 'Successful'})
  });


// This GET is a template for other entry points, they will require a
// valid token as transmitted in the cookie 'engagedMDToken' before doing anything else

app.get('/welcome', async (req, res, next) => {
  // allow cross site scripting from anywhere but presumably this will get 
  // called from a known site and this can be locked down
  res.append('Access-Control-Allow-Origin', ['*']);

  // read the authentication Token from the cookie
  const token = req.cookies['engagedMDToken'];

  // validate the token and return HTTP 400 if not valid
  if(!checkToken(token)) {
    res.status(400).send('You do not have access to this site ')
    return
  }
  // conduct your business here
  res.status(200).send('Welcome to the world of EngagedMD') 

});


// login using this page, takes a valid username and password and returns a generated token as a cookie
// to be used in future connections with this page

app.get('/authenticate', async (req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    const { username, password } = req.query;
    if (validateUser(username, password))  {
      token = generateToken(username)
      res.cookie('engagedMDToken',token, { maxAge: 900000, httpOnly: true });
      res.status(200).send('Logging in successful');
    } else {
      res.cookie('engagedMDToken',"FAIL", { maxAge: 900000, httpOnly: true });
      res.status(400).send('Please try with different credentials');
    }
   
  });


// removes all tokens from the token file, expiring all users - used for testing

app.get('/cleartokens', (req, res) => {
  clearTokens()
  res.status(200).send('Tokens Cleared') 
});

// check to make sure the environment file is readable and intented for this app
function checkEnv() {
  const engaged = process.env.engagedMD;
  if(!engaged) {
    console.log("There is a problem with your .env file");
    process.exit(0);
  }
}

// add a token to the token file
function addToken(token) {
  const tokenLine = token + os.EOL;
  fs.appendFile(tokenFile, tokenLine, function (err) {
    if (err) {
      console.log("Token Append failed: "+err)
    }
  })
}


// check to see if the token is present in the token file
// the jsonwebtoken https://www.npmjs.com/package/jsonwebtoken 
// can be used for signed and expiring tokens and much more, however this sample does not
// take advantage of any of those capabilites.

function checkToken(token) {
    const tokens =  fs.readFileSync(tokenFile,'utf-8');
    const lines = tokens.split(/\r?\n/);
    return (lines.find(element => element === token )) 
}

// delete all tokens in the file

function clearTokens() {
  fs.truncate(tokenFile, 0, function(){})
}

// generate a new token based on the username, replace with real key in production

function generateToken(username) {
  const token = jwt.sign({userId: username },'ENGAGEDMD_PRIVATE_KEY',{ expiresIn: '24h' });
  addToken(token)
  return token
}

// helper function to find a username in a json array of username/password key value pairs
// in this form: [{"username":"password"},{"username1":"password1"}]

function getObjectInArray(arr, key) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key)) return arr[i][key];
    }
}

// check to see if the username and password are valid
// using a simple key value pair should be replace with a db with ecrypted calls to the DB
// the passwords should be encrypted/hashed before saved into the DB, 
// however, for this sample they not

function validateUser(username, password) {
    const credentials = JSON.parse(process.env.credentials);
    const storedPassword = getObjectInArray(credentials,username);
    return password == storedPassword
}

// for running on your local machine, invoke with: node server.js
// app.listen(4242)
// app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
module.exports = app;

// to install on AWS cloud in a lambda server, invoke with: sls deploy
// module.exports.server = sls(app)

// expose the validateUser method for testing
module.exports.validateUser = validateUser