const express = require("express");
require('dotenv').config();
// const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const port = 2020;
// Import router
const router_masterdata = require("./src/router/masterdata"); 
const router_auth = require("./src/router/auth");

// // Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())


//use bodyParser
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true,limit: "500mb",parameterLimit: 500}))


// Router Integration
app.use('/masterdata', router_masterdata);
app.use('/auth', router_auth);





// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
