function errCatch(req, resp, err) {
	if(err.status && err.data) {
		resp.status(err.status).send(err);
		return;
	}

	if(err.code == "ER_DUP_ENTRY") {
		return resp.status(400).send("entry already exists");
	}
	else if(err.code && err.code.indexOf("ER_NO_REFERENCED_ROW") != -1) {
		return resp.status(400).send("failed a foreign key contraint");
	}

	console.log(req.url + "\n" + err);
	resp.status(400).send({status: 400, data: "Error Encountered", error: err});
}

module.exports = {
	catch: errCatch
};