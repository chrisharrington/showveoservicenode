//
//	Watches a folder.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included notification library.
	var _notify;

	//	The events enum.
	var _events;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the watcher.
	//
	exports.initialize = function(parameters) {
		_notify = require("inotify").Inotify;
		_events = _notify;
		_notify = new _notify();
	};

	//
	//	Watches a folder for file changes.
	//	folder:			The path to the folder to watch.
	//	onFileAdded:		The event handler to fire when a file has been added.
	//	onFileRemoved:	The event handler to fire when a file has been removed.
	//
	exports.watch = function(folder, onFileAdded, onFileRemoved) {
		if (!folder.endsWith("/"))
			folder += "/";

		_notify.addWatch({
			path: folder,
			watch_for: _events.IN_CREATE | _events.IN_DELETE | _events.IN_MOVED_TO,
			callback: function(event) {
				var mask = event.mask;
				var name = event.name;
				if ((mask & _events.IN_CREATE) || (mask & _events.IN_MOVED_TO))
					onFileAdded(folder + name);
				else if (mask & _events.IN_DELETE)
					onFileRemoved(folder + name);
			}
		});
	};

})();