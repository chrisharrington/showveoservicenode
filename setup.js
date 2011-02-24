var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");

var guid = require("guid");
var userRepository = require("./repositories/userRepository").create(repository);
var uncategorizedMovieRepository = require("./repositories/uncategorizedMovieRepository").create(repository);
var genreRepository = require("./repositories/genreRepository").create(repository);
var userMovieRepository = require("./repositories/userMovieRepository").create(repository);
var movieRepository = require("./repositories/movieRepository").create(repository);
var genres = {};

userMovieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all user-movie info objects."); },
	success: function() {}
});

movieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all movies."); },
	success: function() {}
});

uncategorizedMovieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all uncategorized movies."); },
	success: function() {}
});

genreRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all genres."); },
	success: function() {
		new Array("Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Science Fiction", "Thriller").forEach(function(name) {
			genreRepository.insert({ name: name }, {
				error: function() { console.log("An error has occurred while inserting the \"" + name + "\" genre."); },
				success: function(genre) { genres[name] = genre; }
			})
		});

	}
});

userRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all users from the user collection."); },
	success: function() {
		userRepository.insert({
			firstName: "Chris",
			lastName: "Harrington",
			emailAddress: "chrisharrington99@gmail.com",
			identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb",
			password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
		}, {
			error: function() { console.log("An error has occurred while inserting the base user."); },
			success: function(user) {

				var movies = new Array();
				movies.push({
					name: "The Tourist",
					year: 2010,
					synopsis: "Revolves around Frank, an American tourist visiting Italy to mend a broken heart. Elise is an extraordinary woman who deliberately crosses his path.",
					genres: new Array(genres["Action"], genres["Drama"], genres["Thriller"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/f72/4cfeca335e73d6299e004f72/the-tourist-cover.jpg",
					director: "Florian Henckel von Donnersmarck",
					actors: new Array("Johnny Depp", "Angelina Jolie"),
					url: "http://www.google.com",
					encoded: false
				});
				movies.push({
					name: "Scott Pilgrim vs. the World",
					year: 2010,
					synopsis: "Scott Pilgrim is a film adaptation of the critically acclaimed, award-winning series of graphic novels of the same name by Canadian cartoonist Bryan Lee O’Malley. Scott Pilgrim is a 23 year old Canadian slacker and wannabe rockstar who falls in love with an American delivery girl, Ramona V. Flowers, and must defeat her seven 'evil exes' to be able to date her.",
					genres: new Array(genres["Action"], genres["Adventure"], genres["Comedy"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/20c/4bf96844017a3c702d00020c/scott-pilgrim-vs-the-world-cover.jpg",
					director: "Edgar Wright",
					actors: new Array("Michael Cera", "Mary Elizabeth Winstead"),
					url: "http://www.google.com",
					encoded: true
				});
				movies.push({
					name: "Iron Man 2",
					year: 2010,
					synopsis: "Wealthy inventor Tony Stark (Robert Downey Jr.) -- aka Iron Man -- resists calls by the American government to hand over his technology. Meanwhile, Ivan Vanko (Mickey Rourke) has constructed his own miniaturized arc reactor, causing all kinds of problems for our superhero. Sam Rockwell, Gwyneth Paltrow, Scarlett Johansson, Don Cheadle and Samuel L. Jackson co-star in director Jon Favreau's sequel based on Marvel comic book characters.",
					genres: new Array(genres["Action"], genres["Adventure"], genres["Fantasy"], genres["Science Fiction"], genres["Thriller"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/cf4/4cf5e5325e73d62999000cf4/iron-man-2-cover.jpg",
					director: "Jon Favreau",
					actors: new Array("Robert Downey Jr.", "Mickey Rourke"),
					url: "http://www.google.com",
					encoded: false
				});
				movies.push({
					name: "Fight Club",
					year: 1999,
					synopsis: "A lonely, isolated thirty-something young professional seeks an escape from his mundane existence with the help of a devious soap salesman. They find their release from the prison of reality through underground fight clubs, where men can be what the world now denies them. Their boxing matches and harmless pranks soon lead to an out-of-control spiral towards oblivion.",
					genres: new Array(genres["Action"], genres["Comedy"], genres["Crime"], genres["Drama"], genres["Thriller"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/f8e/4bc908b0017a3c57fe002f8e/fight-club-cover.jpg",
					director: "David Fincher",
					actors: new Array("Edward Norton", "Brad Pitt"),
					url: "http://www.google.com",
					encoded: true
				});

				setTimeout(function() {
					movies.forEach(function(movie) {
						movieRepository.insert(movie, {
							error: function(error) { console.log("An error has occurred while inserting the movie \"The Tourist\"."); },
							success: function(movie) {

								userMovieRepository.insert({
									user: user,
									movie: movie,
									isFavorite: true
								}, {
									error: function() { console.log("An error has occurred while inserting a user-movie link."); },
									success: function() {}
								})

							}
						});
					});
				}, 200);

			}
		});
	}
});


/*
var mongoose = require("mongoose");
var user = require("./models/user").create(mongoose);
var genre = require("./models/genre").create(mongoose);
var movie = require("./models/movie").create(mongoose, user, genre);
require("./models/uncategorizedMovie").create(mongoose);
require("./models/userMovieInfo").create(mongoose, user, movie);

var db = mongoose.connect("mongodb://localhost:3001/dev");

var userModel = db.model("User");

userModel.find({}, function(error, users) {
	for (var i = 0; i < users.length; i++)
		users[i].remove();
});

var uncategorizedMovieModel = db.model("UncategorizedMovie");
uncategorizedMovieModel.find({}, function(error, movies) {
	for (var i = 0; i < movies.length; i++)
		movies[i].remove();
});

setTimeout(function() {
	var user = new userModel({
		firstName: "Chris",
		lastName: "Harrington",
		emailAddress: "chrisharrington99@gmail.com",
		identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb",
		password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
	});
	user.save(function() {
		var genreModel = db.model("Genre");
		genreModel.find({}, function(error, genres) {
			for (var i = 0; i < genres.length; i++)
				genres[i].remove();
		});

		var movieModel = db.model("Movie");
		movieModel.find({}, function(error, movies) {
			for (var i = 0; i < movies.length; i++)
				movies[i].remove();
		});

		setTimeout(function() {
			var genreNames = new Array("Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Science Fiction", "Thriller");
			var genres = {};

			for (var i = 0; i < genreNames.length; i++) {
				var genre = new genreModel({ name: genreNames[i] });
				genre.save();
				genres[genreNames[i]] = genre;
			}

			var userMovieInfoModel = db.model("UserMovieInfo");
			userMovieInfoModel.find({}, function(error, infos) {
				for (var i = 0; i < infos.length; i++)
					infos[i].remove();
			});

			var guid = require("guid");

			setTimeout(function() {
				var movies = new Array();

				var movie = new movieModel({
					id: guid.create().toString(),
					name: "The Tourist",
					year: 2010,
					synopsis: "Revolves around Frank, an American tourist visiting Italy to mend a broken heart. Elise is an extraordinary woman who deliberately crosses his path.",
					//genres: new Array(genres["Action"], genres["Drama"], genres["Thriller"]),
					uploadDate: new Date(),
					//lastWatched: null,
					//lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/f72/4cfeca335e73d6299e004f72/the-tourist-cover.jpg",
					director: "Florian Henckel von Donnersmarck",
					actors: new Array("Johnny Depp", "Angelina Jolie"),
					url: "http://www.google.com",
					encoded: false
				});
				console.log(movie.genres);
				movie.genres.push(genres["Action"]);
				movie.save(function(error) {
					console.log("error: " + error);
				});

				movies.push(new movieModel({
					id: guid.create().toString(),
					name: "Scott Pilgrim vs. the World",
					year: 2010,
					synopsis: "Scott Pilgrim is a film adaptation of the critically acclaimed, award-winning series of graphic novels of the same name by Canadian cartoonist Bryan Lee O’Malley. Scott Pilgrim is a 23 year old Canadian slacker and wannabe rockstar who falls in love with an American delivery girl, Ramona V. Flowers, and must defeat her seven 'evil exes' to be able to date her.",
					genres: new Array(genres["Action"], genres["Adventure"], genres["Comedy"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/20c/4bf96844017a3c702d00020c/scott-pilgrim-vs-the-world-cover.jpg",
					director: "Edgar Wright",
					actors: new Array("Michael Cera", "Mary Elizabeth Winstead"),
					url: "http://www.google.com",
					encoded: true
				}));
				movies[1].save();

				movies.push(new movieModel({
					id: guid.create().toString(),
					name: "Iron Man 2",
					year: 2010,
					synopsis: "Wealthy inventor Tony Stark (Robert Downey Jr.) -- aka Iron Man -- resists calls by the American government to hand over his technology. Meanwhile, Ivan Vanko (Mickey Rourke) has constructed his own miniaturized arc reactor, causing all kinds of problems for our superhero. Sam Rockwell, Gwyneth Paltrow, Scarlett Johansson, Don Cheadle and Samuel L. Jackson co-star in director Jon Favreau's sequel based on Marvel comic book characters.",
					genres: new Array(genres["Action"], genres["Adventure"], genres["Fantasy"], genres["Science Fiction"], genres["Thriller"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/cf4/4cf5e5325e73d62999000cf4/iron-man-2-cover.jpg",
					director: "Jon Favreau",
					actors: new Array("Robert Downey Jr.", "Mickey Rourke"),
					url: "http://www.google.com",
					encoded: false
				}));
				movies[2].save();

				movies.push(new movieModel({
					id: guid.create().toString(),
					name: "Fight Club",
					year: 1999,
					synopsis: "A lonely, isolated thirty-something young professional seeks an escape from his mundane existence with the help of a devious soap salesman. They find their release from the prison of reality through underground fight clubs, where men can be what the world now denies them. Their boxing matches and harmless pranks soon lead to an out-of-control spiral towards oblivion.",
					genres: new Array(genres["Action"], genres["Comedy"], genres["Crime"], genres["Drama"], genres["Thriller"]),
					uploadDate: new Date(),
					lastWatched: null,
					lastWatchedDate: null,
					poster: "http://hwcdn.themoviedb.org/posters/f8e/4bc908b0017a3c57fe002f8e/fight-club-cover.jpg",
					director: "David Fincher",
					actors: new Array("Edward Norton", "Brad Pitt"),
					url: "http://www.google.com",
					encoded: true
				}));
				movies[3].save();

				setTimeout(function() {
					for (var i = 0; i < movies.length; i++)
						new userMovieInfoModel({ user: user, movie: movies[i], isFavorite: i%2 == 0 }).save();

					setTimeout(function() {
						db.connection.close();
						console.log("Done!");
						process.exit();
					}, 500);
				}, 500);
			}, 500);
		}, 500);
	});
}, 500);*/