const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

function simulateAxiosFetch() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(books);
		}, 1000);
	});
}

public_users.post('/register', (req, res) => {
	const { username } = req.body;
	const { password } = req.body;

	if (username && password) {
		if (!isValid(username)) {
			users.push({ username: username, password: password });
			return res
				.status(200)
				.json({ message: 'User successfully registred. Now you can login' });
		} else {
			return res.status(404).json({ message: 'User already exists!' });
		}
	}
	return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
// 	//Write your code here
// 	// return res.status(200).json({ message: JSON.stringify(books, null, 4) });
// 	if (books) {
// 		return res.status(200).json({ message: books }); // Looks better in postman not stringified
// 	} else {
// 		return res.status(404).json({ message: 'There are no books!' });
// 	}
// });

public_users.get('/', async function (req, res) {
	//Write your code here
	// return res.status(200).json({ message: JSON.stringify(books, null, 4) });
	try {
		const bookList = await simulateAxiosFetch();
		return res.status(200).json({ message: bookList }); // Looks better in postman not stringified
	} catch {
		return res.status(404).json({ message: error.message });
	}
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
// 	let isbn = req.params.isbn;
// 	let book = books[isbn];
// 	if (book) {
// 		return res.status(200).json({ message: book });
// 	} else {
// 		return res
// 			.status(404)
// 			.json({ message: `Book with the isbn ${isbn} not found` });
// 	}
// });

public_users.get('/isbn/:isbn', function (req, res) {
	simulateAxiosFetch()
		.then((books) => {
			let isbn = req.params.isbn;
			let book = books[isbn];
			if (book) {
				return res.status(200).json({ message: book });
			} else {
				return res
					.status(404)
					.json({ message: `Book with the isbn ${isbn} not found` });
			}
		})
		.catch((error) => {
			return res.status(404).json({ message: error.message });
		});
});

// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
// 	//Write your code here
// 	let author = req.params.author;
// 	let foundBook = Object.values(books).filter((book) => {
// 		return book.author == author;
// 	});
// 	if (foundBook && foundBook.length > 0) {
// 		return res.status(200).json({ message: foundBook });
// 	} else {
// 		return res
// 			.status(404)
// 			.json({ message: `No books with the author ${author}  found` });
// 	}
// });

// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
// 	//Write your code here
// 	let title = req.params.title;
// 	let foundBook = Object.values(books).filter((book) => {
// 		return book.title == title;
// 	});
// 	if (foundBook && foundBook.length > 0) {
// 		return res.status(200).json({ message: foundBook });
// 	} else {
// 		return res
// 			.status(404)
// 			.json({ message: `No books with the title ${title}  found` });
// 	}
// });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
	//Write your code here
	try {
		const bookList = await simulateAxiosFetch();
		let author = req.params.author;
		let foundBook = Object.values(bookList).filter((book) => {
			return book.author == author;
		});
		if (foundBook && foundBook.length > 0) {
			return res.status(200).json({ message: foundBook });
		} else {
			return res
				.status(404)
				.json({ message: `No books with the author ${author}  found` });
		}
	} catch {
		return res.status(404).json({ message: error.message });
	}
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
	//Write your code here
	try {
		const bookList = await simulateAxiosFetch();
		let title = req.params.title;
		let foundBook = Object.values(bookList).filter((book) => {
			return book.title == title;
		});
		if (foundBook && foundBook.length > 0) {
			return res.status(200).json({ message: foundBook });
		} else {
			return res
				.status(404)
				.json({ message: `No books with the title ${title}  found` });
		}
	} catch {
		return res.status(404).json({ message: error.message });
	}
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	let isbn = req.params.isbn;
	let book = books[isbn];
	if (book) {
		if (book.reviews) {
			return res.status(200).json({ message: book.reviews });
		}
		// if (book.reviews && book.reviews.length > 0) {
		// 	return res.status(200).json({ message: book.reviews });
		// }
		// task requires return empty object
		// else {
		// 	return res
		// 		.status(404)
		// 		.json({
		// 			message: `Book with the isbn ${isbn} doesn't have any reviews yet`,
		// 		});
		// }
	} else {
		return res
			.status(404)
			.json({ message: `Book with the isbn ${isbn} not found` });
	}
});

module.exports.general = public_users;
