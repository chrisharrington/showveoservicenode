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

		var db = new Db(_database, new Server(_host, _port, {})).open(function(error, db) {
			callback(error, db);
		});
	};

	//
	//	Inserts an object into a collection.
	//	collection:			The collection into which the object should be inserted.
	//	object:				The object to insert.
	//	handlers:			The function handlers.
	//
	exports.insert = function(collection, object, handlers) {
		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}));
		db.on("error", function(error) { handleError(db, error.message, handlers); });
		db.open(function(error, db) {
			db.collection(collection, function(error, collection) {
				collection.insert(object, function(error, docs) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success(docs[0]);
				});
			});
		});
	};

	//
	//	Updates an object in a collection.
	//	collection:			The name of the collection in which the object resides.
	//	id:					The ID of the object to update.
	//	values:				The container of fields and values to update.
	//	handlers:			The function handlers.
	//
	exports.update = function(collection, id, values, handlers) {
		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}));
		db.on("error", function(error) { handleError(db, error.message, handlers); });
		db.open(function(error, db) {
			db.collection(collection, function(error, collection) {
				collection.update({ _id: id }, values, function(error, document) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success(document);
				});
			});
		});
	};

	//
	//	Removes all objects from the given collection.
	//	collection:			The name of the collection from which all objects should be removed.
	//	handlers:			The function handlers.
	//
	exports.removeAll = function(collection, handlers) {
		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}));
		db.on("error", function(error) { handleError(db, error.message, handlers); });
		db.open(function(error, db) {
			db.collection(collection, function(error, collection) {
				collection.remove(function(error, collection) {
					db.close();
					if (error)
						handlers.error();
					else
						handlers.success();
				});
			});
		});
	};

	//
	//	Retrieves a single object.
	//	collection:			The name of the collection in which to find the object.
	//	parameters:			Parameters describing the query. Think "where" clause in sql.
	//	options:			Options describing how the data is displayed.
	//	handlers:			The function handlers.
	//
	exports.findOne = function(collection, parameters, options, handlers) {
		if (!handlers) {
			handlers = options;
			options = undefined;
		}
		if (!handlers) {
			handlers = parameters;
			parameters = undefined;
		}

		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}));
		db.on("error", function(error) { handleError(db, error.message, handlers); });
		db.open(function(error, db) {
			db.collection(collection, function(error, collection) {
				var callback = function(error, object) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success(object);
				};

				if (parameters && options)
					collection.findOne(parameters, options, callback);
				else if (parameters && !options)
					collection.findOne(parameters, callback);
				else if (!parameters && options)
					collection.findOne(options, callback);
				else
					collection.findOne(callback);
			});
		});
	};

	//
	//	Retrieves a collection of objects.
	//	collection:			The name of the collection in which to find the object.
	//	parameters:			Parameters describing the query. Think "where" clause in sql.
	//	options:			Options describing how the data is displayed.
	//	handlers:			The function handlers.
	//
	exports.find = function(collection, parameters, options, handlers) {
		if (!handlers) {
			handlers = options;
			options = undefined;
		}
		if (!handlers) {
			handlers = parameters;
			parameters = undefined;
		}

		var Db = _mongodb.Db;
		var Server = _mongodb.Server;

		var db = new Db(_database, new Server(_host, _port, {}));
		db.on("error", function(error) { handleError(db, error.message, handlers); });
		db.open(function(error, db) {
			db.collection(collection, function(error, collection) {
				var callback = function(error, cursor) {
					cursor.toArray(function(error, array) {
						db.close();
						if (error)
							handlers.error(error);
						else
							handlers.success(array);
					});
				};

				if (parameters && options)
					collection.find(parameters, options, callback);
				else if (parameters && !options)
					collection.find(parameters, callback);
				else if (!parameters && options)
					collection.find(options, callback);
				else
					collection.find(callback);
			});
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Handles an error case.
	//	db:					The database instance.
	//	error:				The error message.
	//	handlers:			The handler functions.
	//
	var handleError = function(db, error, handlers) {
		if (db && db.close)
			db.close();
		if (handlers.error)
			handlers.error(error);
	};

})();