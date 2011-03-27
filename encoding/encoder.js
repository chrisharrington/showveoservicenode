//
//	The base encoder which wraps an ffmpeg implementation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included child process library.
	var _cp;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the encoder.
	//	cp:				The included child process library.
	//
	exports.initialize = function(cp) {
		_cp = cp;
	};

	//
	//	Encodes a video file.
	//	input:			The location of the input file.
	//	output:			The location to place the output file.
	//	success:		The success callback.
	//	error:			The error callback.
	//
	exports.encode = function(input, output, success, error) {
		var name = output.replace(".mp4", "");

		var status = { full: false, mobile: false };
		execute(_cp.spawn("ffmpeg", ["-i", input, "-s", "720x480", "-b", "3000k", "-ab", "192k", "-r", "30", "-ac", "2", name + ".full.mp4"]), function() { status.full = true; done(status, success); }, error);
		execute(_cp.spawn("ffmpeg", ["-i", input, "-s", "480x320", "-b", "500k", "-ab", "128k", "-r", "30", "-ac", "2", name + ".mobile.mp4"]), function() { status.mobile = true; done(status, success); }, error);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Executes a spawned ffmpeg process.
	//	ffmpeg:			The spawned ffmpeg process.
	//	success:		The success callback.
	//	error:			The error callback.
	//
	var execute = function(ffmpeg, success, error) {
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
		console.log(status.toString());

		var complete = true;
		for (var name in status)
			complete = complete && status[name];

		if (complete)
			success();
	}

})();

