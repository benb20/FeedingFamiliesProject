const app = require("../../app.js");

const admins = require("../db/admins.js");
const managers = require("../db/managers.js");
const centres = require("../db/centres.js");
const users = require("../db/users.js");

const error = require("./error.js");

function toCSV(data) {
	if(data.length == 0) {
		return "no data";
	}

	let keys = Object.keys(data[0]);
	let csvContent = keys.join(",") + "\n";

	for(let i = 0; i < data.length; i += 1) {
		let row = [];
		for(let y = 0; y < keys.length; y += 1) {
			row.push(data[i][keys[y]]);
		}
		csvContent += row.join(",") + "\n";
	}
	return csvContent;
}


app.app.get("/api/exports/managers", app.checkJwt, (req, resp) => {
	let ids = [];

	managers.checkPermission(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				Promise.reject({status: 401, data: "don't have permission"});
			}

			return centres.list();
		})
		.then(centres => {
			let ps = [];

			for(let i = 0; i < centres.length; i += 1) {
				ps.push(managers.getManagers(centres[i].id));
				ids.push(centres[i].id);
			}

			return Promise.all(ps);
		})
		.then(data => {
			for(let i = 0; i < data.length; i += 1) {
				let centreId = ids[i];
				for(let y = 0; y < data[i].length; y += 1) {
					data[i][y].centre = centreId;
				}
			}

			let arr = [];
			for(let i = 0; i < data.length; i += 1) {
				arr = arr.concat(data[i]);
			}

			return arr;
		})
		.then(data => toCSV(data))
		.then(data => {
			resp.attachment("managers.csv");
			resp.send(data);
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/exports/users", app.checkJwt, (req, resp) => {
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(isAdmin) {
				return centres.list();
			}
			return managers.getCentres(req.user.sub);
		})
		.then(cs => {
			if(cs.length == 0) Promise.reject({status: 401, data: "don't have permission"});

			let ids = [];
			let admin = cs[0].id ? true : false;
			for(let i = 0; i < cs.length; i += 1) {
				if(admin) ids.push(cs[i].id);
				else ids.push(cs[i].centreId);
			}

			let ps = [];
			for(let i = 0; i < cs.length; i += 1) {
				ps.push(users.get.byCentre(ids[i]));
			}

			return Promise.all(ps);
		})
		.then(data => {
			let arr = [];
			for(let i = 0; i < data.length; i += 1) {
				arr = arr.concat(data[i]);
			}

			for (var i = arr.length - 1; i >= 0; i--) {
				arr[i].complete = arr[i].complete.lastIndexOf(1) !== -1;
				arr[i].isCore = arr[i].isCore.lastIndexOf(1) !== -1;
			}
			return arr;
		})
		.then(data => toCSV(data))
		.then(data => {
			resp.attachment("users.csv");
			resp.send(data);
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/exports/:dateId/register", app.checkJwt, (req, resp) => {
	let managingcenters;
	let filename = "";
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(isAdmin) {
				return centres.list();
			} else {
				return managers.getCentres(req.user.sub);
			}
		})
		.then(cs => {
			if(cs.length > 0 && cs[0].centreId) {
				let ids = [];
				for(let i = 0; i < cs.length; i += 1) {
					ids.push(cs[i].centreId);
				}
				return ids;
			}

			let ids = [];
			for(let i = 0; i < cs.length; i += 1) {
				ids.push(cs[i].id);
			}
			return ids;
		})
		.then(cs => {
			managingcenters = cs;
			return centres.dates.get(req.params.dateId);
		})
		.then(date => {
			if(!date) {
				return Promise.reject({status: 400, data: "date doesn't exist"});
			}
			if(managingcenters.indexOf(date.centreId) == -1) {
				return Promise.reject({status: 401, data: "don't have permission to view this centre"});
			}

			filename += date.date;

			return centres.get(date.centreId);
		})
		.then(centre => {
			filename += centre.name;
			return centres.dates.listUsers(req.params.dateId);
		})
		.then(data => toCSV(data))
		.then(data => {
			resp.attachment(filename+"register.csv");
			resp.send(data);
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/exports/dates", app.checkJwt, (req, resp) => {
	let cs;
	managers.checkPermission(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			return centres.list();
		})
		.then(data => {
			cs = {};
			for (let i = data.length - 1; i >= 0; i--) {
				cs[data[i].id] = data[i].name;
			}

			let centreIds = Object.keys(cs);
			let ps = [];
			for (let i = centreIds.length - 1; i >= 0; i--) {
				ps.push(centres.dates.list(centreIds[i]));
			}

			return Promise.all(ps);
		})
		.then(data => {
			let arr = [];
			for(let i = 0; i < data.length; i += 1) {
				arr = arr.concat(data[i]);
			}

			for(let i = 0; i < arr.length; i += 1) {
				arr[i].centreId = arr[i].centreId + "-" + cs[arr[i].centreId];
			}

			return arr;
		})
		.then(data => toCSV(data))
		.then(data => {
			resp.attachment("dates.csv");
			resp.send(data);
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});
