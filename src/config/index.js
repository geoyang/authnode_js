const { resolve } = require('path');
require('dotenv').config({ path: '/.env' });

module.exports = {
  port: process.env.PORT,
  credentials: process.env.CREDENTIALS,
  tokenFile: process.env.TOKENS_FILE,
  engagedMD: process.env.ENGAGEDMD
};