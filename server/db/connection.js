var mysql = require("mysql");
var config = require("../config.json");

var connection = mysql.createPool({
	connectionLimit : 10,
	host     : config.database.host,
	user     : config.database.user,
	password : config.database.password,
	database : config.database.name
});

// connection.connect(function(err) {
// 	if (err) {
// 		console.error("error connecting: " + err.stack);
// 		return;
// 	}
// 	console.log("Connection to DB established...");
// });

module.exports = {
	mysql: mysql,
	connection: connection
};
