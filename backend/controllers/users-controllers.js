const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

/* * get all users (GET)
 * /api/users */
const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again.',
			500
		);
		return next(error);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/* * to create new user (POST)
 * /api/users/signup */
const signup = async (req, res, next) => {
	// get validator result from routes
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'User exists already, please login instead.',
			422
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image: 'https://picsum.photos/200/300',
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again.', 500);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

/* * to login (POST)
 * /api/users/login*/
const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Logging up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError(
			'Invalid credentials, could not log you in.',
			401
		);
		return next(error);
	}

	res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
