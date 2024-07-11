const express = require("express");
const Post = require("../models/Post");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("author", "username")
			.sort("-createdAt");
		res.json(posts);
	} catch (err) {
		res.status(500).json({ error: "Error fetching posts" });
	}
});

router.post("/", ensureAuthenticated, async (req, res) => {
	try {
		const { content } = req.body;
		const post = new Post({ content, author: req.user._id });
		await post.save();
		res.status(201).json(post);
	} catch (err) {
		res.status(400).json({ error: "Error creating post" });
	}
});

router.post("/:id/like", ensureAuthenticated, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.user._id)) {
			post.likes.push(req.user._id);
			await post.save();
		}
		res.json(post);
	} catch (err) {
		res.status(400).json({ error: "Error liking post" });
	}
});

router.post("/:id/comment", ensureAuthenticated, async (req, res) => {
	try {
		const { content } = req.body;
		const post = await Post.findById(req.params.id);
		post.comments.push({ content, author: req.user._id });
		await post.save();
		res.json(post);
	} catch (err) {
		res.status(400).json({ error: "Error commenting on post" });
	}
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.author.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "Not authorized to delete this post" });
		}
		await Post.findByIdAndDelete(req.params.id);
		res.json({ message: "Post deleted successfully" });
	} catch (err) {
		console.error("Error deleting post:", err);
		res.status(500).json({ error: "Error deleting post" });
	}
});

module.exports = router;
