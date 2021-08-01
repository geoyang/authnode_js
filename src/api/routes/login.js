const express = require('express');
const router = express.Router();
const token = require('../../services/token')
const user = require('../../services/user')
const { resolve } = require('path');
var cookieParser = require('cookie-parser');

// read token file name

const tokenFile = process.env.TOKEN_FILE;

// Test to make sure the server is running and acting correctly

router.get('/test', async (req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.json({message: 'Successful'})
  });


// This GET is a template for other entry points, they will require a
// valid token as transmitted in the cookie 'engagedMDToken' before doing anything else

router.get('/welcome', async (req, res, next) => {
  // allow cross site scripting from anywhere but presumably this will get 
  // called from a known site and this can be locked down
  res.append('Access-Control-Allow-Origin', ['*']);

   // conduct your business here
   res.status(200).send('Welcome to the world of EngagedMD') 
});

//for reading cookies
router.use(cookieParser());
router.get('/authenticate', async (req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    const { username, password } = req.query;
    if (user.validateUser(username, password))  {
      usertoken = token.generateToken(username)
      res.cookie('engagedMDToken',usertoken, { maxAge: 900000, httpOnly: true });
      res.status(200).send('Logging in successful');
    } else {
      res.cookie('engagedMDToken',"FAIL", { maxAge: 900000, httpOnly: true });
      res.status(400).send('Please try with different credentials');
    }
   
  });

  //TODO: this should be moved to a different file with other utilities
  
  router.get('/cleartokens', async (req, res, next) => {
    token.clearTokens()
    res.status(200).send('Tokens Cleared') 
  });

module.exports = router;