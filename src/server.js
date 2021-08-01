const http = require('http');
const app = require('./app');
const { port,engagedMD } = require('./config');
const { resolve } = require('path');
require('dotenv').config({ path: './.env' });
if (!engagedMD) {
  console.log("There is a problem with your .env file");
  process.exit(0);
}
const server = http.createServer(app);

server.listen(port, ()=> {console.log("launching server at "+ port)});