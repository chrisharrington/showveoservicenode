var Db = require("mongodb").Db;
var Server = require("mongodb").Server;

var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");
var userRepository = require("./repositories/userRepository").create(repository);

var user = {
	firstName: "Chris",
	lastName: "Harrington",
	emailAddress: "chrisharrington99@gmail.com",
	identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb",
	password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
};

var db = new Db("dev", new Server("localhost", 3001, {}), {native_parser:true});

db.open(function(error, db) {
	db.collection("users", function(error, collection) {
		collection.insert({ blah: "boo" }, function(error, docs) {
			db.close();
		});
	});
});

/*
GLOBAL.DEBUG = true;

var sys = require("sys");
var test = require("assert");

var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
var BSON = require("mongodb").BSONNative;

var host = "localhost";
var port = 3001;

//db.open(function(error, db) {
//	db.collection("users", function(error, collection) {
//		collection.find(function(error, cursor) {
//			cursor.toArray(function(error, users) {
//				users.forEach(function(user) {
//					console.log(user);
//				});
//				db.close();
//			});
//		});
//	});
//});

var db = new Db("dev", new Server(host, port, {}), {native_parser:true});
var userRepository = require("./repositories/userRepository");
userRepository.create(db);
userRepository.getByIdentity("757a3f7922bc4176eeae0d8c9611bf1ee7993beb", {
	success: function(user) {
		console.log("success - " + user.firstName);
	},
	error: function(error) {
		conole.log("error - " + error);
	}
});
*/