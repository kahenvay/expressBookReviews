const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const { username } = req.body;
	const { password } = req.body;

	if (!username || !password) {
		return res.status(404).json({ message: 'Error logging in' });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{ expiresIn: 60 * 60 },
		);

		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send('User successfully logged in');
	} else {
		return res
			.status(208)
			.json({ message: 'Invalid Login. Check username and password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	//Write your code here
	const { username } = req.session.authorization;
	// const { review } = req.body;
	const { review } = req.query; //review needs to come from request params

	let isbn = req.params.isbn;
	let book = books[isbn];
	if (book) {
		book.reviews[username] = {
			username,
			review,
		};
		return res.status(200).json({
			message: `Review for book with the isbn ${isbn} has been added/modified. Review: ${review}`,
		});
	} else {
		return res
			.status(404)
			.json({ message: `Book with the isbn ${isbn} not found` });
	}
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const { username } = req.session.authorization;
	let isbn = req.params.isbn;
	let book = books[isbn];
	if (book) {
		if (book.reviews[username]) {
			delete book.reviews[username];
			return res.status(200).json({
				message: `Review for book with the isbn ${isbn} by user ${username} has been deleted`,
			});
		} else {
			return res.status(404).json({
				message: `Review by user ${username} for book with the isbn ${isbn} not found`,
			});
		}
	} else {
		return res
			.status(404)
			.json({ message: `Book with the isbn ${isbn} not found` });
	}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
