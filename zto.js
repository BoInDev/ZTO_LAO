const express = require("express");
require('dotenv').config();
const app = express();
const port = 9090;
// Import router
const router_masterdata = require("./router/masterdata_router"); 
const router_auth = require("./router/auth_router");

// Router Integration
app.use('/masterdata', router_masterdata);
app.use('/auth', router_auth);





// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
