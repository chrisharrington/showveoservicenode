//
//	The base encoder which wraps an ffmpeg implementation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included child process library.
	var _cp;

	//	The file extension used for encoding files.
	var _extension;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the encoder.
	//	cp:				The included child process library.
	//	extension:		The file extension used for encoding files.
	//
	exports.initialize = function(cp, extension) {
		_cp = cp;
		_extension = extension;
	};

	//
	//	Encodes a video file.
	//	input:			The location of the input file.
	//	output:			The location to place the output file.
	//	success:		The success callback.
	//	error:			The error callback.
	//
	exports.encode = function(input, output, success, error) {
		var status = { full: true, mobile: false };
		//execute(["-i", input, "-s", "720x480", "-b", "3000k", "-ab", "192k", "-r", "30", "-ac", "2", "-f", _extension, output + ".full"], function() { status.full = true; done(status, success); }, error);
		execute(["-i", input, "-s", "480x320", "-b", "500k", "-ab", "128k", "-r", "30", "-ac", "2", "-f", _extension, output + ".mobile"], function() { status.mobile = true; done(status, success); }, error);
		//execute(["-i", input, "-s", "480x320", "-b", "500k", "-ab", "128k", "-ac", "2", "-vcodec", "libx264", "-threads", "0", "-vpre", "superfast", "-f", _extension, output + ".mobile"], function() { status.mobile = true; done(status, success); }, error);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Executes a spawned ffmpeg process.
	//	params:			The ffmpeg parameters.
	//	success:		The success callback.
	//	error:			The error callback.
	//
	var execute = function(params, success, error) {
		var ffmpeg = _cp.spawn("ffmpeg", params);
		ffmpeg.stdout.on("data", function(data) {
			console.log(data.toString("utf8"));
		});
		ffmpeg.stderr.on("data", function(data) {
			console.log(data.toString("utf8"));
		});
		ffmpeg.on("exit", function(code) {
			if (code == 1)
				error();
			else
				success();
		});
	};

	//
	//	Checks to see if all encoding operations have completed and, if they have, executes the success callback.
	//	status:			The status object.
	//	success:		The success callback function.
	//
	var done = function(status, success) {
		var complete = true;
		for (var name in status)
			complete = complete && status[name];

		if (complete)
			success();
	}

})();

