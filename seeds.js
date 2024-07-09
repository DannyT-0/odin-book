const mongoose = require("mongoose");
const faker = require("faker");
const User = require("./models/User");
const Post = require("./models/Post");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const createUsers = async (count) => {
	const users = [];
	for (let i = 0; i < count; i++) {
		const user = new User({
			username: faker.internet.userName(),
			email: faker.internet.email(),
			password: "password123",
			bio: faker.lorem.sentence(),
			profilePicture: faker.image.avatar(),
		});
		await user.save();
		users.push(user);
	}
	return users;
};

const createPosts = async (users, count) => {
	for (let i = 0; i < count; i++) {
		const post = new Post({
			content: faker.lorem.paragraph(),
			author: users[Math.floor(Math.random() * users.length)]._id,
		});
		await post.save();
	}
};

const seed = async () => {
	await User.deleteMany({});
	await Post.deleteMany({});

	const users = await createUsers(10);
	await createPosts(users, 50);

	console.log("Database seeded!");
	mongoose.connection.close();
};

seed();
