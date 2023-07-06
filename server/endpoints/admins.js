var app = require("../../app.js");

var admins = require("../db/admins.js");
var managers = require("../db/managers.js");
var centres = require("../db/centres.js");
var courses =require("../db/courses.js");
var users = require("../db/users.js");

const error = require("./error.js");


app.app.get("/api/admins/check", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/admins/user/search/:name", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(isAdmin) {
				users.search(req.params.name)
					.then(data => {
						return resp.status(200).send({status: 200, data: data});
					})
					.catch(err => {
						error.catch(req, resp, err);
					});
			} else {
				let mcs = [];
				managers.getCentres(req.user.sub)
					.then(cs => {
						for (let i = cs.length - 1; i >= 0; i--) {
							mcs.push(cs[i].centreId);
						}
				
						if(mcs.length == 0) {
							return Promise.reject({status: 401, data: "don't have permission"});
						}

						return users.search(req.params.name);
					})
					.then(data => {
						let out = [];
						for(let i = 0; i < data.length; i += 1) {
							if(mcs.indexOf(data[i].centreId) != -1) {
								out.push(data[i]);
							}
						}
						return resp.status(200).send({status: 200, data: out});
					})
					.catch(err => {
						error.catch(req, resp, err);
					});
			}
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/admins/users/delete", app.checkJwt, (req, resp) => {
	let id = req.body.userId;
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "not an admin"});
			}

			return managers.removeUser(id);
		})
		.then(() => centres.dates.removeUser(id))
		.then(() => courses.removeUser(id))
		.then(() => users.delete(id))
		.then(() => {
			return resp.status(200).send({status: 200, data: "user deleted"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/admins/manager/set", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	let user = req.body.id;
	let centre = req.body.centreId;

	if(!user || !centre) {
		return resp.status(400).send({status: 400, data: "missing required fields"});
	}

	admins.isAdmin(id)
		.then(r => {
			if(!r) {
				return Promise.reject({status: 400, data: "not an admin"});
			}

			return managers.add(user, centre);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: user+" added as manager of centre: " + centre});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/manager/remove", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	let user = req.body.id;
	let centre = req.body.centreId;

	admins.isAdmin(id)
		.then(r => {
			if(!r) {
				return Promise.reject({status: 400, data: "not an admin"});
			}

			return managers.remove(user, centre, null);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: user + " is no longer a manager of centre: " + centre});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/centres/create", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "not an admin"});
			}

			let name = req.body.name;
			let address = req.body.address;
			let city = req.body.city;
			let postcode = req.body.postcode;
			let phoneNo = req.body.phoneNo;
			let email = req.body.email;

			centres.add(name, address, city, postcode, phoneNo, email);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "centre created"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/centres/remove", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "not an admin"});
			}

			return users.get.byCentre(req.body.centreId);
		})
		.then(r => {
			if(r.length != 0) {
				return Promise.reject({status: 400, data: "cannot remove, users are still assigned to this centre"});
			}

			return centres.remove(req.body.centreId);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "centre removed"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/centres/update", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "not an admin"});
			}

			let id = req.body.centreId;
			let name = req.body.name;
			let address = req.body.address;
			let city = req.body.city;
			let postcode = req.body.postcode;
			let phoneNo = req.body.phoneNo;
			let email = req.body.email;

			centres.change(id, name, address, city, postcode, phoneNo, email);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "centre updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/centres/update/contact", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "not an admin"});
			}

			let id = req.body.centreId;
			let phone = req.body.phoneNo;
			let email = req.body.email;

			return centres.updateContact(id, phone, email);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "centre contact details updated"});
		});
});