//
//	The base repository which all other repositories should extend.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The mongodb instance.
	var _mongodb;

	//	The database.
	var _host;

	//	The port on which to connect.
	var _port;

	//	The database context to use.
	var _database;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the base repository.
	//	mongodb:			The mongodb instance.
	//	host:				The database host.
	//	port:				The port on which to connect.
	//	database:			The database context to use.
	//
	exports.initialize = function(mongodb, host, port, database) {
		_mongodb = mongodb;
		_host = host;
		_port = port;
		_database = database;
		return this;
	};


	//
	//	Creates and opens a new connection.
	//	callback:			The callback function to execute with the created connection.
	//
	exports.open = function(callback) {
		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}), {native_parser:true}).open(function(error, db) {
			callback(error, db);
		});
	};

})();