const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email, password });
		await user.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		res.status(400).json({ error: "Error creating user" });
	}
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(400).json({ message: info.message });
		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.json({ message: "Logged in successfully" });
		});
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout();
	res.json({ message: "Logged out successfully" });
});

module.exports = router;
