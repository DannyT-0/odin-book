const express = require("express");
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
	try {
		const users = await User.find({}, "-password");
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: "Error fetching users" });
	}
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.params.id, "-password").populate(
			"posts"
		);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: "Error fetching user profile" });
	}
});

router.post("/:id/follow", ensureAuthenticated, async (req, res) => {
	try {
		const userToFollow = await User.findById(req.params.id);
		userToFollow.pendingFollowRequests.push(req.user._id);
		await userToFollow.save();
		res.json({ message: "Follow request sent" });
	} catch (err) {
		res.status(400).json({ error: "Error sending follow request" });
	}
});

router.post("/:id/accept-follow", ensureAuthenticated, async (req, res) => {
	try {
		const currentUser = await User.findById(req.user._id);
		const follower = await User.findById(req.params.id);

		currentUser.followers.push(follower._id);
		follower.following.push(currentUser._id);
		currentUser.pendingFollowRequests =
			currentUser.pendingFollowRequests.filter(
				(id) => !id.equals(follower._id)
			);

		await currentUser.save();
		await follower.save();

		res.json({ message: "Follow request accepted" });
	} catch (err) {
		res.status(400).json({ error: "Error accepting follow request" });
	}
});

module.exports = router;
