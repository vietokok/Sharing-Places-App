const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
// to fake data
let DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers in the world!',
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: '20 W 34Th St, New York, NY 10001',
		creator: 'u1',
	},
];

// to get place by place id (GET)
const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;

	const place = DUMMY_PLACES.find((p) => p.id === placeId);

	if (!place) {
		throw new HttpError('Could not find a place for the provided id.', 404);
	}

	res.json({ place });
};

// to get place by user id (GET)
const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;

	const places = DUMMY_PLACES.filter((p) => p.creator === userId);

	if (!places || places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		);
	}

	res.json({ places });
};

// to create place (POST)
const createPlace = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		throw new HttpError('Invalid inputs passed, please check your data', 422);
	}

	const { title, description, coordinates, address, creator } = req.body;

	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};

	DUMMY_PLACES.push(createdPlace);

	res.status(201).json({ place: createdPlace });
};

// to update place by place id (PATCH)
const updatePlace = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		throw new HttpError('Invalid inputs passed, please check your data', 422);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id == placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => (p.id = placeId));
	updatedPlace.title = title;
	updatedPlace.description = description;

	DUMMY_PLACES[placeIndex] = updatedPlace;

	res.status(200).json({ place: updatedPlace });
};

// to delete place by place id (DELETE)
const deletePlace = (req, res, next) => {
	const placeId = req.params.pid;
	if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
		throw new HttpError('Could not find a place for that id', 404);
	}

	DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

	res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
