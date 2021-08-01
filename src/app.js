const express = require('express');
const app = express();
const { resolve } = require('path');
require('dotenv').config({ path: './.env' });
var cookieParser = require('cookie-parser');
const token = require('./services/token')


app.use(cookieParser());

//routes 
const loginRoutes = require('./api/routes/login');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//overall site filter
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    const eMdtoken = req.cookies['engagedMDToken'];
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }

    //this filter will protect any content from being exposed, except for the /authenticate end point by requiring a valid token
    if(req.path != "/authenticate" && !token.checkToken(eMdtoken)) {
      res.status(400).send('You do not have access to this site !!!')
      return
    }
    next();
});

app.use('/', loginRoutes);
module.exports = app;