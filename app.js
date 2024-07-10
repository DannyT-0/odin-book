const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("/Users/danny/Desktop/Odin/odin-book/config/passport.js");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(express.static(path.join(__dirname, "public")));

const { ensureAuthenticated } = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postsRoute");
const userRoutes = require("./routes/usersRoute");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.use("/postsRoute", ensureAuthenticated, postRoutes);
app.use("/usersRoute", ensureAuthenticated, userRoutes);

app.get("/posts.html", ensureAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, "public", "posts.html"));
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
