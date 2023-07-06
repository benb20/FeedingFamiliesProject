var app = require("../../app.js");

const centres = require("../db/centres.js");
const users = require("../db/users.js");
const managers = require("../db/managers.js");

const error = require("./error.js");


app.app.get("/api/dates/seasonal/available", (req, resp) => {
	centres.dates.listSeasonal()
		.then(data => {
			let today = new Date();

			for(let i = 0; i < data.length; i += 1) {
				let d = data[i].date;
				let ds = d.split("/");
				let nd = new Date([ds[1], ds[0], ds[2]].join("/"));

				if(nd > today) {
					return true;
				}
			}
			return false;
		})
		.then(isDate => {
			return resp.status(200).send({status: 200, data: isDate});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/centres/date/list/:centreId/", (req, resp) => {
	let centreId = req.params.centreId;

	centres.get(centreId)
		.then(result => {
			if(result == undefined) {
				return Promise.reject({status: 400, data: "Invalid centreId"});
			}

			return centres.dates.list(centreId);
		})
		.then(results => {
			resp.status(200).send({status: 200, data: results});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/centres/date/listusers/:dateId/", app.checkJwt, (req, resp) => {
	let dateId = req.params.dateId;

	centres.dates.get(dateId)
		.then(date => {
			if(date == undefined) {
				return Promise.reject({status: 400, data: "Not a date"});
			}

			return managers.check(req.user.sub, date.centreId);
		})
		.then(isManager => {
		//Check user has permission to see this information
			if(!isManager) {
				return Promise.reject({status: 401, data: "Not a managers of the centre"});
			}

			return centres.dates.listUsers(dateId);
		})
		.then(results => {
			return resp.status(200).send({status: 200, data: results});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/centres/date/add", app.checkJwt, (req, resp) => {
	let centreId = req.body.centreId;
	let date = req.body.date;
	let description = req.body.description;
	let capacity = req.body.capacity;
	let isSeasonal = req.body.isSeasonal;


	//Check request has valid parameters
	let errors = [];
	try {
		centreId = parseInt(centreId);
	} catch(err) {
		errors.push("Invalid centreId");
	}
	let regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
	if(typeof date != "string" || !regex.test(date)) {
		errors.push("Malformed date string: format 'DD/MM/YYYY'");
	}
	if(typeof description != "string" || description.length > 250) {
		errors.push("Bad description: string of length <= 250");
	}
	if(capacity != null) {
		try {
			capacity = parseInt(capacity);
		} catch(err) {
			errors.push("Invalid capacity");
		}
	}
	if(isSeasonal != null && typeof isSeasonal != "boolean") {
		errors.push("Invalid isSeasonal");
	}

	if(errors.length != 0) {
		return resp.status(400).send({status: 400, data: errors.join("\n")});
	}

	managers.check(req.user.sub, centreId)
		.then(isManager => {
		//Check the user is manager of centre nad has permission
			if(!isManager) {
				return Promise.reject({status: 401, data: "Not a manager of that centre"});
			}

			//Add date to the centre
			return centres.dates.add(centreId, date, description, capacity, isSeasonal);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "Successfully added date"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/centres/date/remove", app.checkJwt, (req, resp) => {
	let userId = req.user.sub;
	let dateId = req.body.dateId;

	centres.dates.get(dateId)
		.then(date => {
		//Check date exists
			if(date == undefined) {
				return Promise.reject({status: 400, data: "Not a date"});
			}

			return managers.check(userId, date.centreId);
		})
		.then(isManager => {
			//Check user is a manager of the centre and has permission
			if(!isManager) {
				return Promise.reject({status: 401, data: "Not a manager of that centre"});
			}

			//Remove the date
			return centres.dates.remove(dateId);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "Successfully removed date"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/date/commit", app.checkJwt, (req, resp) => {
	let userId = req.user.sub;
	let dateId = req.body.dateId;

	let userCentre = null;
	let dateCapacity = null;

	users.get.centre(userId)
		.then(centre => {
			userCentre = centre;
			if(centre == undefined) {
				return Promise.reject({status:400, data: "Not a user"});
			}
			return centres.dates.get(dateId);
		})
		.then(date => {
			if(date == undefined) {
				return Promise.reject({status: 400, data: "Not a date"});
			}
			//Check the user goes to the centre
			if(userCentre != date.centreId) {
				return Promise.reject({status: 401, data: "Not your centre"});
			}

			dateCapacity = date.capacity;
			return centres.dates.listUsers(dateId);
		})
		.then(listusers => {
			// Check the date isn't full
			if(dateCapacity != null && listusers.length > dateCapacity) {
				return Promise.reject({status: 400, data: "Date at capacity, no more volunteers needed"});
			}

			return users.dates.commit(userId, dateId);
		})
		.then(() => {
			resp.status(200).send({status: 200, data: "Commited to date"});
		})
		.catch(err => {
			if(err.status && err.data) {
				resp.status(err.status).send(err);
				return;
			}

			if(err.code == "ER_DUP_ENTRY") {
				resp.status(400).send({status: 400, data: "Duplicate"});
				return;
			}

			console.log("/api/users/date/commit \n" + err);
			resp.status(500).send({status: 500, data: "Server error"});
		});
});

app.app.post("/api/users/date/uncommit", app.checkJwt, (req, resp) => {
	let userId = req.user.sub;
	let dateId = req.body.dateId;

	users.dates.get(userId, dateId)
		.then(date => {
			//Check the user is commited to the date
			if(date == undefined) {
				return Promise.reject({status: 400, data: "Not commited to that date"});
			}

			//uncommit from the date
			return users.dates.uncommit(userId, dateId);
		})
		.then(() => {
			resp.status(200).send({status: 200, data: "Uncommited from date"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/users/date/list", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	users.dates.list(id)
		.then(r => {
			resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});
