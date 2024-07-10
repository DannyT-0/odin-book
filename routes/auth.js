const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		console.log("Received signup request:", req.body);
		const { username, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email or username already exists" });
		}

		const user = new User({ username, email, password });
		await user.save();
		console.log("User saved successfully");
		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		console.error("Signup error:", err);
		res
			.status(400)
			.json({ message: "Error creating user", error: err.message });
	}
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			console.error("Login error:", err);
			return res.status(500).json({ message: "Internal server error" });
		}
		if (!user) {
			return res
				.status(401)
				.json({ message: info.message || "Authentication failed" });
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				console.error("Login error:", loginErr);
				return res.status(500).json({ message: "Error logging in" });
			}
			return res.json({
				message: "Logged in successfully",
				user: { id: user._id, username: user.username, email: user.email },
			});
		});
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			console.error("Logout error:", err);
			return res.status(500).json({ message: "Error logging out" });
		}
		res.json({ message: "Logged out successfully" });
	});
});

module.exports = router;
