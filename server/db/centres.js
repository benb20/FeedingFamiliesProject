var sql = require("./connection.js");

function addCentre(name, address, city, postcode, phone, email) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO centres (name, address, city, postcode, phoneNumber, email) \
			VALUES (?, ?, ? ,? ,?, ?)",
		[name, address, city, postcode, phone, email],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	}); 
	
}

function changeCentre (id, name, address, city, postcode, phone, email) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE centres \
		SET name = ?, address = ?, city = ?, postcode = ?, phoneNumber = ?, email = ?\
		WHERE id = ?",
		[name, address, city, postcode, phone, email, id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
	
}

function updateContact(id, phone, email) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE centres \
		SET phoneNumber = ?, email = ?\
		WHERE id = ?",
		[phone, email, id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function listCentres() {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT id, name FROM centres ORDER BY name", 
			function(error, result) {
				if(error) reject(error);
				else resolve(result);
			}
		);
	});
}

function getCentre (id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM centres WHERE id = ?", [id], 
			function(error, result) {
				if(error) reject(error);
				else resolve(result[0]);
			});
	});
}

function removeCentre(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM centres\
		WHERE id = ?", [id], 
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}


// DATES

function addDate(centreId, date, description, capacity, isSeasonal) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO volDates\
		(centreId, date, description, capacity, isSeasonal) VALUES (?, ?, ?, ?, ?)",
		[centreId, date, description, capacity, isSeasonal],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeDate(dateId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM volDates\
		WHERE id = ?", [dateId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeDateUser(userId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM committedDates\
			WHERE userId = ?",
		[userId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function listDates(centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT *\
		FROM volDates\
		WHERE centreId = ?",
		[centreId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function listAllSeasonalDates() {
	return new Promise((resolve, reject) =>{
		sql.connection.query("SELECT *\
			FROM volDates\
			WHERE isSeasonal = 1",
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function getDate(dateId) { 
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM volDates WHERE id = ?",
			[dateId],
			function(error, result) {
				if(error) reject(error);
				else resolve(result[0]);
			});
	});
}

function listUsersAtDate(dateId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT committedDates.userId, fname, lname FROM committedDates, users\
			WHERE committedDates.userId = users.id AND committedDates.dateId = ?",
		[dateId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

module.exports = {
	add: addCentre,
	get: getCentre,
	list: listCentres,
	updateContact: updateContact,
	change: changeCentre,
	remove: removeCentre,
	dates: {
		add: addDate,
		remove: removeDate,
		removeUser: removeDateUser,
		list: listDates,
		listSeasonal: listAllSeasonalDates,
		get: getDate,
		listUsers: listUsersAtDate
	}
};