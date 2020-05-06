const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');

/** to get place by place id (GET)
 * /api/places/:pid  */

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = HttpError(
			'Something went wrong, could not find a place.',
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			'Could not find a place for the provided id.',
			404
		);
		return next(error);
	}

	// toObject: convert to normal JS Object
	res.json({ place: place.toObject({ getters: true }) });
};

/** to get place by user id (GET)
 * /api/places/user/:uid */

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let userWithPlaces;
	try {
		// populate: get the reference object
		userWithPlaces = await User.findById(userId).populate('places');
	} catch (err) {
		const error = HttpError(
			'Fetching places failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		);
	}

	res.json({
		places: userWithPlaces.places.map((place) =>
			place.toObject({ getters: true })
		),
	});
};

/** to create place (POST)
 * /api/places */
const createPlace = async (req, res, next) => {
	// to validate
	const error = validationResult(req);
	if (!error.isEmpty()) {
		throw new HttpError('Invalid inputs passed, please check your data', 422);
	}

	// get data from client
	const { title, description, coordinates, address, creator } = req.body;

	// create new object follow Place Schema
	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: 'https://picsum.photos/200/300',
		creator,
	});

	// to find user by user id
	let user;

	try {
		user = await User.findById(creator);
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);

		return next(error);
	}

	// to check if not user found
	if (!user) {
		const error = new HttpError('Could not find user for provided id', 404);
		return next(error);
	}

	try {
		// transaction in NoSQL
		const sess = await mongoose.startSession();
		sess.startTransaction();

		await createdPlace.save({ session: sess });
		user.places.push(createdPlace);
		await user.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Creating place failed, please try again', 500);
		return next(error);
	}

	res.status(201).json({ place: createdPlace });
};

/** to update place by place id (PATCH)
 * /api/places/:pid */
const updatePlace = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update place.',
			500
		);
		return next(error);
	}

	// change data
	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

/** to delete place by place id (DELETE)
 * /api/places/:pid */
const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId).populate('creator');
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError('Could not find place for this id', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();

		await place.remove({ session: sess });
		// 'pull' to put data out of object
		place.creator.places.pull(place);
		await place.creator.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
