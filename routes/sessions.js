import Router from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import UsersDAO from "../daos/users.dao.js";

const router = Router()

router.post('/register', async (req, res) => {
	
	const { first_name, last_name, age, email, password } = req.body;

	if (!first_name || !last_name || !age || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	let user = await UsersDAO.getUserByEmail(email);

	if (user) {
		return res.status(400).json({ message: 'Email already in use' });
	}

	user = await UsersDAO.insert(first_name, last_name, age, email, password);

	res.status(201).json({ message: 'User created' });

});

router.post('/login', async (req, res) => {

	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	let user = await UsersDAO.getUserByCreds(email, password);

	if (!user) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, { expiresIn: '1h' });

	res.cookie('jwt', token, {
		signed: true,
		httpOnly: true,
		maxAge: 1000 * 60 * 60
	}).json({ message: 'Logged in' });

});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json(req.user);
});

router.get('/logout', (req, res) => {
	res.clearCookie('jwt').json({ message: 'Logged out' });
});

export default router;