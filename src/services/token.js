const jwt = require('jsonwebtoken');
const { resolve } = require('path');
const { tokenFile } = require('../config/');
const fs = require('fs');
var os = require("os");


module.exports = {

// add a token to the token file
addToken: (token) => {
    const tokenLine = token + os.EOL;
    fs.appendFile(tokenFile, tokenLine, function (err) {
      if (err) {
        console.log("Token Append failed: "+err);
      }
    });
  },
  
  
  // check to see if the token is present in the token file
  // the jsonwebtoken https://www.npmjs.com/package/jsonwebtoken 
  // can be used for signed and expiring tokens and much more, however this sample does not
  // take advantage of any of those capabilites.
  
  checkToken: (token) => {
      const tokens =  fs.readFileSync(tokenFile,'utf-8');
      const lines = tokens.split(/\r?\n/);
      return (lines.find(element => element === token )) 
  },
  
  // delete all tokens in the file
  
  clearTokens: ()  => {
    fs.truncate(tokenFile, 0, function(){})
  },
  
  // generate a new token based on the username, replace with real key in production
  
  generateToken: (username) => {
    const token = jwt.sign({userId: username },'ENGAGEDMD_PRIVATE_KEY',{ expiresIn: '24h' });
    addToken(token)
    return token
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