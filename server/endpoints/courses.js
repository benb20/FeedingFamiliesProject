var app = require("../../app.js");

const modules = require("../db/modules.js");
const courses = require("../db/courses.js");
const managers = require("../db/managers.js");
const admins = require("../db/admins.js");

const error = require("./error.js");

app.app.get("/api/courses/list", app.checkJwt, (req, resp) => {
	courses.get(req.user.sub)
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/managers/courses/list/:userId/", app.checkJwt, (req, resp) => {
	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			courses.get(req.params.userId);
		})
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/courses/score/set", app.checkJwt, (req, resp) => {
	let training = req.body.moduleId;
	let score = req.body.score;

	if(!Number.isInteger(score)) {
		return resp.status(400).send({status: 400, data: "score is not an integer"});
	}

	courses.changeScore(req.user.sub, training, score)
		.then(() => {
			return resp.status(200).send({status: 200, data: "score updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/managers/courses/score/set", app.checkJwt, (req, resp) => {
	let id = req.body.userId;
	let training = req.body.moduleId;
	let score = req.body.score;

	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			if(!Number.isInteger(score)) {
				return Promise.reject({status: 400, data: "score is not an integer"});
			}

			return courses.changeScore(id, training, score);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "score updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/managers/courses/add", app.checkJwt, (req, resp) => {
	let id = req.body.userId;
	let training;
	try {
		training = parseInt(req.body.moduleId);
	} catch(err) {
		return resp.status(400).send({status: 400, data: "module id need to be an integer"});
	}

	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			return modules.list();
		})
		.then(ms => {
			let mids = [];
			for(let i = 0; i < ms.length; i += 1) {
				mids.push(ms[i].id);
			}

			if(mids.indexOf(training) == -1) {
				return Promise.reject({status: 400, data: "no such training module"});
			}

			return courses.add(id, training);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "course added"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/managers/courses/remove", app.checkJwt, (req, resp) => {
	let id = req.body.userId;
	let training = req.body.moduleId;

	managers.check(req.user.sub)
		.then(isManager => {
			if(!isManager) {
				return Promise.reject({status: 401, data: "don't have permission"});
			}

			return courses.remove(id, training);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "course removed"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.get("/api/courselist/:title/", app.checkJwt, (req, resp) => {
	courses.list.get(req.params.title)
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/courselist/list/modules/:title", app.checkJwt, (req, resp) => {
	courses.list.get(req.params.title)
		.then(mods => {
			let ps = [];
			for(let i = 0; i < mods.length; i += 1) {
				ps.push(modules.get(mods[i]));
			}

			return Promise.all(ps);
		})
		.then(mods => {
			let r = [];
			for (var i = mods.length - 1; i >= 0; i--) {
				r.push({id: mods[i].id, title: mods[i].title});
			}
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/courselist/list/titles", app.checkJwt, (req, resp) => {
	courses.list.list()
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/courselist/create", app.checkJwt, (req, resp) => {
	let id = req.body.id;
	if(id.indexOf("/") != -1) {
		return resp.status(400).send({status: 400, data: "id cannot contain '/'"});
	}
	let content;
	try {
		content = JSON.parse(req.body.content);
	} catch(err) {
		return resp.status(400).send({status: 400, data: "content needs to be a list of module ids"});
	}

	if(id.length > 255) {
		return resp.status(400).send({status: 400, data: "id can't be longer than 255 characters"});
	}
	if(!Array.isArray(content)) {
		return resp.status(400).send({status: 400, data: "content needs to be a list of module ids"});
	}

	let ids = [];
	for(let i = 0; i < content.length; i += 1) {
		ids.push(modules.get(content[i]));
	}
	Promise.all(ids)
		.then(mods => {
			for(let i = 0; i < mods.length; i += 1) {
				if(mods[i].length == 0) {
					return Promise.reject({status: 400, data: "bad list of training modules"});
				}
			}

			return admins.isAdmin(req.user.sub);
		})
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data:"don't have permission"});
			}

			return courses.list.create(id, content);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "course list created"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/courselist/remove/module", app.checkJwt, (req, resp) => {
	let title = req.body.title;
	let module = req.body.module;

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data:"don't have permission"});
			}

			return courses.list.removeModule(title, module);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "module deleted from course list"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/courselist/add/module", app.checkJwt, (req, resp) => {
	let title = req.body.title;
	try {
		var module = parseInt(req.body.module);
	} catch(err) {
		return resp.status(400).send({status: 400, data: "module id not an int"});
	}

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data:"don't have permission"});
			}

			return modules.list(module);
		})
		.then(mods => {
			let ms = [];
			for(let i = 0; i < mods.length; i += 1) {
				ms.push(mods[i].id);
			}
			if(ms.indexOf(module) == -1) {
				return Promise.reject({status: 400, data: "module couldn't be added because it doesn't exist"});
			}

			return courses.list.addModule(title, module);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "module added to course list"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/admins/courselist/delete", app.checkJwt, (req, resp) => {
	let id = req.body.title;

	admins.isAdmin(req.user.sub)
		.then(isAdmin => {
			if(!isAdmin) {
				return Promise.reject({status: 401, data:"don't have permission"});
			}

			return courses.list.delete(id);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "course list deleted"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.get("/api/courses/enroll/:courseListId", app.checkJwt, (req, resp) => {
	courses.list.get(req.params.courseListId)
		.then(list => {
			if(list.length == 0) {
				return Promise.reject({status: 400, data: "no course list"});
			}
			let running = [];
			for(let i = 0; i < list.length; i += 1) {
				running.push(courses.add(req.user.sub, list[i]));
			}

			return Promise.all(running);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "enrolled in course"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});
