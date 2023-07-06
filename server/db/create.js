var mysql = require("./connection.js");

const VERSION = 1.0;

// Centres
return new Promise((resolve) => {
	mysql.connection.query("\
			CREATE TABLE IF NOT EXISTS centres(\
			id int NOT NULL AUTO_INCREMENT,\
			name varchar(255),\
			address varchar(255),\
			city varchar(255),\
			postcode varchar(8),\
			phoneNumber varchar(15),\
			email varchar(255),\
			PRIMARY KEY (id)\
		)",
	function(error) {
		if(error) throw error;
		resolve();
	});
})
	.then(() => {
		return new Promise((resolve) => {

			// Users
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS users(\
					id varchar(255) NOT NULL,\
					fName varchar(255),\
					lName varchar(255),\
					email varchar(255),\
					phoneNo varchar(15),\
					address varchar(255),\
					city varchar(255),\
					postcode varchar(8),\
					DOB varchar(10),\
					kinName varchar(255),\
					kinPhoneNo varchar(15),\
					isCore BIT NOT NULL,\
					centreId int NOT NULL,\
					unstructured TEXT,\
					PRIMARY KEY (id),\
					FOREIGN KEY (centreId) REFERENCES centres(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});

		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// Mangers
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS managers(\
					userId varchar(255),\
					centreId int,\
					permissions varchar(255),\
					PRIMARY KEY (userId, centreId),\
					FOREIGN KEY (centreId) REFERENCES centres(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});


		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// VolDates
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS volDates(\
					id int NOT NULL AUTO_INCREMENT,\
					centreId int,\
					date varchar(10),\
					description varchar(255),\
					isSeasonal BIT,\
					capacity int,\
					PRIMARY KEY (id),\
					FOREIGN KEY (centreId) REFERENCES centres(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// CommittedDate
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS committedDates(\
					userId varchar(255),\
					dateId int,\
					attended BIT,\
					PRIMARY KEY (userId, dateId),\
					FOREIGN KEY (userId) REFERENCES users(id),\
					FOREIGN KEY (dateId) REFERENCES volDates(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.then(() => {
		return new Promise((resolve) => {

			// Admins
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS admins(\
					userId varchar(255),\
					name varchar(255),\
					PRIMARY KEY (userId)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// Training modules
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS trainingModules(\
					id int NOT NULL AUTO_INCREMENT,\
					title varchar(255),\
					content TEXT,\
					PRIMARY KEY (id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// Courses
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS courses(\
					userId varchar(255),\
					trainingId int,\
					score int,\
					PRIMARY KEY (userId, trainingId),\
					FOREIGN KEY (userId) REFERENCES users(id),\
					FOREIGN KEY (trainingId) REFERENCES trainingModules(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.then(() => {
		return new Promise((resolve) => {
			// Course list
			mysql.connection.query("\
					CREATE TABLE IF NOT EXISTS courseList(\
					title varchar(255) NOT NULL,\
					module int,\
					PRIMARY KEY (title, module),\
					FOREIGN KEY (module) REFERENCES trainingModules(id)\
				)",
			function(error) {
				if(error) throw error;
				resolve();
			});
		});
	})
	.catch(error => {throw error;});