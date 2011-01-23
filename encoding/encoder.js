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
	//	success:			The success callback.
	//	error:			The error callback.
	//
	exports.encode = function(input, output, success, error) {
		var ffmpeg = _cp.spawn("ffmpeg", ["-i", input, "-b", "3000k", "-ab", "192k", output]);
//		ffmpeg.stderr.on("data", function (data) {
//			console.log("stderr: " + data);
//		});
		ffmpeg.on("exit", function(code) {
			if (code == 1)
				error();
			else
				success();
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

})();

