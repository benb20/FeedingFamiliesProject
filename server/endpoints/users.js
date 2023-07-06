var app = require("../../app.js");

var users = require("../db/users.js");
var managers = require("../db/managers.js");
var courses = require("../db/courses.js");
var centres = require("../db/centres.js");

const fetch = require("node-fetch");

const error = require("./error.js");

app.app.post("/api/users/create/basic", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let isCore = req.body.isCore;
	let centreId = req.body.centreId;

	users.createBasicInfo(id, isCore, centreId)
		.then(() => {
			return resp.status(200).send({status: 200, data: "basic data creted"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});

});


app.app.post("/api/users/create/full", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	let fname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;
	let phoneNo = req.body.phoneNo;
	let address = req.body.address;
	let city = req.body.city;
	let postcode = req.body.postcode;
	let DOB = req.body.DOB;
	let kinName = req.body.kinName;
	let kinPhone = req.body.kinPhone;
	let isCore = req.body.isCore;
	let centreId = req.body.centreId;
	let unstructuredData = req.body.unstructuredData;

	/*let regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
	if(typeof DOB != "string" || !regex.test(DOB)) {
		return resp.status(400).send({status: 400, data:"Malformed DOB string: format 'DD/MM/YYYY'"});
	}

	if(phoneNo.length <10 || phoneNo.length>11) {
		return resp.status(400).send({status: 400, data:"phone number not the right length"});
	}

	if(kinPhone.length <10 || kinPhone.length>11) {
		return resp.status(400).send({status: 400, data:"next of kin phone number not the right length"});
	}*/

	let regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/i;
	if(typeof email != "string" || !regex.test(email)) {
		return resp.status(400).send({status: 400, data:"invalid email format"});
	}

	fetch("http://api.postcodes.io/postcodes/"+postcode+"/validate")
		.then(data => data.json())
		.then(data => {
			if(!data.result) {
				return Promise.reject({status: 400, data:"invalid postcode"});
			}
			return users.create(id, fname, lname, email, phoneNo,
				address, city, postcode, DOB, kinName, kinPhone, isCore, centreId, unstructuredData);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "user profile created"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/user/delete", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	managers.removeUser(id)
		.then(() => centres.dates.removeUser(id))
		.then(() => courses.removeUser(id))
		.then(() => users.delete(id))
		.then(() => {
			return resp.status(200).send({status: 200, data: "your user has been deleted"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});


app.app.post("/api/users/update/name", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	let fname = req.body.fname;
	let lname = req.body.lname;

	users.update.fName(id, fname)
		.then(() => {
			return users.update.lName(id, lname);
		})
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's name updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/update/email", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let email = req.body.email;

	let regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/i;
	if(typeof email != "string" || !regex.test(email)) {
		return resp.status(400).send({status: 400, data:"invalid email format"});
	}

	users.update.email(id, email)
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's email updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/update/phoneNo", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let phoneNo = req.body.phoneNo;

	if(phoneNo.length <10 || phoneNo.length>11) {
		return resp.status(400).send({status: 400, data:"phone number not the right length"});
	}

	users.update.phoneNo(id, phoneNo)
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's phone number updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/update/address", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let address = req.body.address;
	let city = req.body.city;
	let postcode = req.body.postcode;

	users.update.address(id, address, city, postcode)
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's address updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/update/nextofkin", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let name = req.body.name;
	let phoneNo = req.body.phoneNo;

	if(phoneNo.length <10 || phoneNo.length>11) {
		return resp.status(400).send({status: 400, data:"phone number not the right length"});
	}

	users.update.kin(id, name, phoneNo)
		.then(() => {
			return resp.status(200).send({status: 200, data: "user's next of kin updated"});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});

app.app.post("/api/users/update/data", app.checkJwt, (req, resp) => {
	let id = req.user.sub;
	let data = req.body.data;

	users.update.unstructured(id, data)
		.then(() => {
			return resp.status(200).send({status: 200, data: "unstructured data updated"});
		});
});



app.app.get("/api/users/info", app.checkJwt, (req, resp) => {
	let id = req.user.sub;

	users.get.fullById(id)
		.then(r => {
			return resp.status(200).send({status: 200, data: r});
		})
		.catch(err => {
			error.catch(req, resp, err);
		});
});
