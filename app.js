const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const bodyParser = require("body-parser");
const { join } = require("path");
const authConfig = require(join(__dirname, "./client/auth_config.json"));
const serverConfig = require(join(__dirname, "./server/config.json"));

const app = express();

// Static files
app.use("/", express.static(join(__dirname, "client")));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 


// Create the JWT validation middleware
const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
	}),

	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithm: ["RS256"]
});

module.exports = {
	app: app,
	checkJwt: checkJwt
};


// Setup database
require("./server/db/create.js");

// Endpoints
require("./server/endpoints/centres.js");
require("./server/endpoints/courses.js");
require("./server/endpoints/dates.js");
require("./server/endpoints/managers.js");
require("./server/endpoints/modules.js");
require("./server/endpoints/users.js");
require("./server/endpoints/admins.js");
require("./server/endpoints/exports.js");


//Error handling
app.use(function (err, req, res, next) {
	if (err.name == "UnauthorizedError") {
		if(!req.headers.authorization) return res.status(400).send({status: 400, data: "token missing"});
		return res.status(401).send({status: 401, data: "Invalid token"});
	}
	next(err, req, res);
});

app.listen(process.env.PORT || serverConfig.port);