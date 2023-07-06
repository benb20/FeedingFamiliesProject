var sql = require("./connection.js");

function isAdmin(id) {
	return new Promise((resolve, reject) => {
		sql.connection.query("SELECT * FROM admins WHERE userId = ?",
			[id],
			function(error, results) {
				if(error) reject(error);
				else {
					if(results.length == 1) {
						resolve(true);
					} else {
						resolve(false);
					}
				}
			});
	});
}


module.exports = {
	isAdmin: isAdmin
};