var app = require("../../app.js");

const managers = require("../db/managers.js");
const admins = require("../db/admins.js");
const users = require("../db/users.js");
const centres = require("../db/centres.js");

const error = require("./error.js");

app.app.get("/api/managers/list/centres", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(isAdmin) {
				centres.list()
					.then(list => {
						let out = [];
						for (var i = list.length - 1; i >= 0; i--) {
							out.push(list[i].id);
						}
						resp.status(200).send({status: 200, data: out});
					});
				return;
			}

			return managers.getCentres(req.user.sub);
		})
		.then(results => {
			if(!results) return;

			let out = [];
			for(let i = 0; i < results.length; i +=1) {
				out.push(results[i].centreId);
			}
			return resp.status(200).send({status: 200, data: out});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/managers/list/centres/:userId/", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.params.userId)
		.then(isAdmin => {
			if(isAdmin) {
				centres.list()
					.then(list => {
						let out = [];
						for (var i = list.length - 1; i >= 0; i--) {
							out.push(list[i].id);
						}
						resp.status(200).send({status: 200, data: out});
					});
				return;
			}

			return managers.getCentres(req.params.userId);
		})
		.then(results => {
			if(!results) return;

			let out = [];
			for(let i = 0; i < results.length; i +=1) {
				out.push(results[i].centreId);
			}
			return resp.status(200).send({status: 200, data: out});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/mangers/list/mangers/:centreId/", app.checkJwt, (req, resp) => {
	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission to view this data"});
			}

			return managers.getManagers(req.params.centreId);
		})
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/managers/user/info/:userId/", app.checkJwt, (req, resp) => {
	let mcentres = [];
	let hasAccess = false;

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			hasAccess = isAdmin;
			return managers.getCentres(req.user.sub);
		})
		.then(centres => {
			for(let i = 0; i < centres.length; i += 1) {
				mcentres.push(centres[i].centreId);
			}

			return users.get.centre(req.params.userId);
		})
		.then(centre => {
			if(mcentres.indexOf(centre) == -1 && !hasAccess) {
				return Promise.reject({status: 401, data: "don't have permission to view this data"});
			}

			hasAccess = true;

			return users.get.fullById(req.params.userId);
		})
		.then(info => {
			if(hasAccess) return resp.status(200).send({status: 200, data: info});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/managers/user/change/centre", app.checkJwt, (req, resp) => {
	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			return centres.list();
		})
		.then(centres => {
			let t = [];
			for(let i = 0; i < centres.length; i += 1) {
				t.push(centres.id);
			}

			if(t.indexOf(req.body.centreId) == -1) {
				return Promise.reject({status: 400, data: "invalid centreId"});
			}

			return users.update.centre(req.body.userId, req.body.centreId);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's centre updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});
