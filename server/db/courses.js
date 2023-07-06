var sql = require("./connection.js");

function getCourses(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT trainingId, score\
			FROM courses WHERE userId = ?",
		[id],
		function(error, results) {
			if(error) reject(error);
			else resolve(results[0]);
		});
	});
}

function addCourse(userId, trainingId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO courses (userId, trainingId)\
		VALUES (?, ?)",
		[userId, trainingId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function updateScore(userId, trainingId, score) {
	return new Promise((resolve, reject) => {
		sql.connection.query("UPDATE courses\
		SET score = ?\
		WHERE userId = ? AND trainingId = ?",
		[score, userId, trainingId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeCourse(userId, trainingId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM courses\
		WHERE userId = ? AND trainingId = ?",
		[userId, trainingId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeUser(userId) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM courses\
			WHERE userId = ?",
		[userId],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function createList(title, modules) {
	return new Promise((resolve, reject) => {
		let ps = [];
		for (let i = 0; i < modules.length; i += 1) {
			ps.push(
				new Promise((resolve, reject) => {
					sql.connection.query("INSERT INTO courseList (title, module)\
							VALUES (?, ?)",
					[title, modules[i]],
					function(error) {
						if(error) reject(error);
						else resolve();
					});
				})
			);
		}

		Promise.all(ps)
			.then(() => {
				resolve();
			})
			.catch(err => reject(err));
	});
}

function addListItem(title, module) {
	return new Promise((resolve, reject) => {
		sql.connection.query("INSERT INTO courseList (title, module)\
			VALUES (?, ?)",
		[title, module],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function removeListItem(title, module) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM courseList\
		WHERE title = ? AND module = ?",
		[title, module],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function deleteList(title) {
	return new Promise((resolve, reject) => {
		sql.connection.query("DELETE FROM courseList\
			WHERE title = ?",
		[title],
		function(error) {
			if(error) reject(error);
			else resolve();
		});
	});
}

function getList(title) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT module FROM courseList\
			WHERE title = ?",
		[title],
		function(error, results) {
			if(error) reject(error);
			else {
				let out = [];
				for (var i = results.length - 1; i >= 0; i--) {
					out.push(results[i].module);
				}
				resolve(out);
			}
		});
	});
}

function getListByModule(module) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT title FROM courseList\
			WHERE module = ?",
		[module],
		function(error, results) {
			if(error) reject(error);
			else resolve(results);
		});
	});
}

function listList() {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT DISTINCT title FROM courseList",
			function(error, results) {
				if(error) reject(error);
				else {
					let out = [];
					for(let i = 0; i < results.length; i += 1) {
						out.push(results[i].title);
					}
					resolve(out);
				}
			});
	});
}


module.exports = {
	get: getCourses,
	add: addCourse,
	changeScore: updateScore,
	remove: removeCourse,
	removeUser: removeUser,
	list: {
		get: getList,
		getByModule: getListByModule,
		create: createList,
		addModule: addListItem,
		removeModule: removeListItem,
		delete: deleteList,
		list: listList
	}
};