var sql = require("./connection.js");

var admins = require("./admins.js");

function addManager(userId, centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO managers (userId, centreId)\
		VALUES (?, ?)",
		[userId, centreId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeManager(userId, centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM managers \
		WHERE userId = ? AND centreId = ?",
		[userId, centreId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeUser(userId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM managers\
			WHERE userId = ?",
		[userId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function getCentres(userId) {
	return new Promise((resolve,reject) => {
		sql.connection.query("SELECT centreId FROM managers WHERE userId = ?",
			[userId],
			function(error, results) {
				if(error) reject(error);
				else resolve(results);
			});
	});
}

function getManagers(centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT userId, fName, lName\
			FROM managers, users\
			WHERE id = userId AND managers.centreId = ?",
		[centreId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function checkManager(userId, centreId) {
	return new Promise((resolve, reject) => {
		admins.isAdmin(userId)
			.then(isAdmin => {
				if(isAdmin) resolve(true);
				else {
					sql.connection.query("SELECT * FROM managers\
					WHERE userId = ? AND centreId = ?",
					[userId, centreId],
					function(error, results) {
						if(error) reject(error);
						else if(results.length == 1) resolve(true);
						else resolve(false);
					});
				}
			});
	});
}

function checkPermission(userId) {
	return new Promise((resolve, reject) => {
		admins.isAdmin(userId)
			.then(isAdmin => {
				if(isAdmin) resolve(true);
				else {
					sql.connection.query("SELECT * FROM managers\
					WHERE userId = ?",
					[userId],
					function(error, results) {
						if(error) reject(error);
						else {
							if(results.length > 0) resolve(true);
							else resolve(false);
						}
					});
				}
			});
	});
}

function changePermissions(userId, centreId, permissions) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE managers\
		SET permissions = ?\
		WHERE userId = ? AND centreId = ?",
		[permissions, userId, centreId],
		function(error) {
			if(error) reject(error);
			else resolve;
		});
	});
}

module.exports = {
	add: addManager,
	remove: removeManager,
	removeUser: removeUser,
	check: checkManager,
	checkPermission: checkPermission,
	getCentres: getCentres,
	getManagers : getManagers,
	changePermissions: changePermissions
};