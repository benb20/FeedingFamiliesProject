var app = require("../../app.js");

const modules = require("../db/modules.js");
const courses = require("../db/courses.js");
const admins = require("../db/admins.js");

const error = require("./error.js");

app.app.post("/api/modules/add", app.checkJwt, (req, resp) => {
	let title = req.body.title;
	let content = req.body.content;

	let errored = false;
	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return resp.status(401).send({status: 401, data: "don't have permission"});
			}

			
			if(title.length > 255) {
				errored = true;
				return resp.status(400).send({status: 400, data: "title too long, max 255 characters"});
			}

			try {
				JSON.parse(content);
			} catch(err) {
				errored = true;
				return resp.status(400).send({status: 400, data: "content not valid JSON"});
			}

			return modules.add(title, content);
		})
		.then(() => {
			if(!errored) {
				return resp.status(200).send({status: 200, data: "module added"});
			}
			return resp.status(400).send({status: 400, data: "??? I don't know how you got here ???"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/modules/remove", app.checkJwt, (req, resp) => {
	let id = req.body.id;

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			return courses.list.getByModule(id);
		})
		.then(courses => {
			if(courses.length != 0) {
				return Promise.reject({status: 400, data: "cannot delete module as it is still in a course list"});
			}

			return modules.remove(id);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "module removed"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/modules/update", app.checkJwt, (req, resp) => {
	let id = req.body.id;
	let title = req.body.title;
	let content = req.body.content;

	try {
		JSON.parse(content);
	} catch(err) {
		return resp.status(400).send({status: 400, data: "content not valid JSON"});
	}

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			if(title.length > 255) {
				return Promise.reject({status: 400, data: "title can't be longer than 255 characters"});
			}

			modules.update(id, title, content);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "module updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/modules/list", app.checkJwt, (req, resp) => {
	modules.list()
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/modules/module/:id/", app.checkJwt, (req, resp) => {
	modules.get(req.params.id)
		.then(r => {
			if(r.length != 0) return resp.status(200).send({status: 200, data: r});
			else return resp.status(400).send({status: 400, data: "no such module"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});