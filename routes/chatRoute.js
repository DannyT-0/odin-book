const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI();

router.post("/", async (req, res) => {
	try {
		const { message } = req.body;

		const completion = await openai.chat.completions.create({
			messages: [{ role: "user", content: message }],
			model: "gpt-4o-mini",
		});

		res.json({ response: completion.choices[0].message.content });
	} catch (error) {
		console.error("Error in chat route:", error);
		res
			.status(500)
			.json({ error: "An error occurred while processing your request." });
	}
});

module.exports = router;
