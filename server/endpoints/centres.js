var app = require("../../app.js");

const centres = require("../db/centres.js");
const managers = require("../db/managers.js");
const users = require("../db/users.js");

const error = require("./error.js");

app.app.get("/api/centres/list", function(req, resp) {
	centres.list()
		.then(results => {
			resp.status(200).send({status: 200, data: results});
		})
		.catch(error => {
			resp.status(500).send({status: 500, data: error});
		});
});

app.app.get("/api/centres/listusers/:centreId/", app.checkJwt, (req, resp) => {
	let userId = req.user.sub;
	let centreId = req.params.centreId;

	managers.check(userId, centreId)
		.then(isManager => {
		//Check user has permission to see the infomation
			if(!isManager) {
				return Promise.reject({status: 401, data: "Not a manager of that centre"});
			}

			return users.get.byCentre(centreId);
		})
		.then(results => {
			resp.status(200).send({status: 200, data: results});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/centres/details/:centreId", (req, resp) => {
	centres.get(req.params.centreId)
		.then(result => {
			if(result == undefined) {
				return Promise.reject({status: 400, data: "Not a centre"});
			}

			resp.status(200).send({status: 200, data: result});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});