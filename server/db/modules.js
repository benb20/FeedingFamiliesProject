var sql = require("./connection.js");

function addModule(title, content) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO trainingModules (title, content)\
		VALUES (?, ?)",
		[title, content],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeModule(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM trainingModules\
		WHERE id = ?",
		[id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function updateModule(id, title, content) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE trainingModules\
			SET title = ?, content = ?\
			WHERE id = ?",
		[title, content, id],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function listModules() {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT id, title FROM trainingModules",
			function(error, results) {
				if(error) reject(error);
				else resolve(results);
			});
	});
}

function getModule(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM trainingModules\
			WHERE id = ?",
		[id],
		function(error, results) {
			if(error) reject(error);
			else resolve(results[0]);
		});
	});
}

module.exports = {
	add: addModule,
	remove: removeModule,
	update: updateModule,
	list: listModules,
	get: getModule
};