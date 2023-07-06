var sql = require("./connection.js");

function createUserBasicInfo(id, isCore, centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO users (id, isCore, complete, centreId) \
		VALUES (?, ?, false, ?)",
		[id, isCore, centreId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function createUser(id, fName, lName, email, phoneNo,
	address, city, postcode, DOB, kinName, kinPhoneNo, isCore, centreId, unstrucutredData) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO users \
		(id, fName, lName, email, phoneNo, address, city, postcode, DOB, kinName, kinPhoneNo, isCore, complete, centreId, unstructured)\
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, ?)",
		[id, fName, lName, email, phoneNo, address, city, postcode, DOB, kinName, kinPhoneNo, isCore, centreId, unstrucutredData],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function deleteUser(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM users WHERE id = ?",
			[id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function userSearch(name) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM users \
			WHERE concat(fname, ' ', lname) LIKE concat('%', ?,'%')",
		[name],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function updateFName(id, fname) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET fName = ? WHERE id = ?",
			[fname, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updateLName(id, lname) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET lName = ? WHERE id = ?",
			[lname, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updateEmail(id, email) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET email = ? WHERE id = ?",
			[email, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updatePhoneNo(id, phoneNo) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET phoneNo = ? WHERE id = ?",
			[phoneNo, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updateAddress(id, address, city, postcode) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET \
		address = ?, city = ?, postcode = ? \
		WHERE id = ?",
		[address, city, postcode, id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function updateKinPhoneNo(id, kinPhoneNo) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET kinPhoneNo = ? WHERE id = ?",
			[kinPhoneNo, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function changeKin(id, kinName, kinPhoneNo) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET kinName = ?, kinphoneNo = ? WHERE id = ?",
			[kinName, kinPhoneNo, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updateData(id, unstrucutredData) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET unstructured = ? WHERE id = ?",
			[unstrucutredData, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}

function updateCentre(id, centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE users SET centreId = ? WHERE id = ?",
			[centreId, id],
			function(error) {
				if(error) reject(error);
				else resolve();
			});
	});
}


function getById(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT id, fName, lName \
		FROM users\
		WHERE id = ?",
		[id],
		function(error, results) {
			if(error) reject(error);
			else resolve(results[0]);
		});
	});
}

function getFullById(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * \
		FROM users\
		WHERE id = ?",
		[id],
		function(error, results) {
			if(error) reject(error);
			if(results.length == 0) reject("User not found");
			else {
				let out = results[0];
				out.isCore = results[0].isCore.lastIndexOf(1) !== -1;
				out.complete = results[0].complete.lastIndexOf(1) !== -1;
				resolve(out);
			}
		});
	});
}

function getByCentre(centreId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * \
		FROM users\
		WHERE centreId = ?",
		[centreId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function getUserCentre(userId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT centreId FROM users WHERE id = ?",
			[userId],
			function(error, results) {
				if(error) reject(error);
				else if(!results[0]) reject("No such user");
				else resolve(results[0].centreId);
			});
	});
}

function removeUser(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM users \
		WHERE id = ?",
		[id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}


//DATES
function listDates(userId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT dateId, date, description, centreId, attended FROM committedDates, volDates\
			WHERE committedDates.dateId = volDates.id AND userId = ?", [userId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function commitDate(userId, dateId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO committedDates\
		(userId, dateId) VALUES (?, ?)",
		[userId, dateId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function uncommitDate(userId, dateId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM committedDates\
		WHERE userId = ? AND dateId = ?",
		[userId, dateId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function attendedDate(userId, dateId, attended) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE committedDates\
		SET attended = ?\
		WHERE userId = ? AND dateId = ?",
		[attended, userId, dateId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function getDate(userId, dateId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM committedDates\
			WHERE userId = ? AND dateId = ?",
		[userId, dateId],
		function(error, results) {
			if(error) reject(error);
			else resolve(results[0]);
		});
	});
}


module.exports = {
	createBasicInfo: createUserBasicInfo,
	create: createUser,
	delete: deleteUser,
	update: {
		fName: updateFName,
		lName: updateLName,
		email: updateEmail,
		phoneNo: updatePhoneNo,
		address: updateAddress,
		kin: changeKin,
		kinPhoneNo: updateKinPhoneNo,
		unstructuredData: updateData,
		centre: updateCentre
	},
	search: userSearch,
	get: {
		byId: getById,
		fullById: getFullById,
		byCentre: getByCentre,
		centre: getUserCentre
	},
	remove: removeUser,
	dates: {
		get: getDate,
		list: listDates,
		commit: commitDate,
		uncommit: uncommitDate,
		attended: attendedDate
	}
};
