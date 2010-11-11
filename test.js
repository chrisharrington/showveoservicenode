var sqlite = require("./sqlite/sqlite");


var db = new sqlite.Database();
db.open("sqlite/blah.db", function(error) {
	if (error)
		throw error;

//	db.execute("create table boo(id integer primary key asc, name string)", function(error, rows) {
//		console.log(error);
//	});
//	db.execute("insert into boo (name) values (?)", ["the_name"], function(error, rows) {
//		if (error)
//			throw error;
//
//		db.execute("select * from boo", function(error, rows) {
//			if (error)
//				throw error;
//
//			console.log(rows);
//		});
//	});

	db.execute("delete from boo", function(error) {
		if (error)
			throw error;

		console.log("deleted");
	});
});