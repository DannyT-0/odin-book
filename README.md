# BlueBox Social

BlueBox Social is a simple social media platform clone built with Node.js, Express, MongoDB, and vanilla JavaScript. It allows users to register, login, create posts, like posts, and update their bio.

## Features

- User authentication (register, login, logout)
- Create and delete posts
- Like posts
- Update user bio
- Responsive design

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Passport.js for authentication
- Frontend:
  - HTML5
  - CSS3 (Bootstrap 5)
  - Vanilla JavaScript

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/bluebox-social.git
   cd bluebox-social

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory and add the following:
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret

4. Start the server:
   npm start

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

bluebox-social/
├── config/
│ └── passport.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── Post.js
│ └── User.js
├── public/
│ ├── index.html
│ ├── posts.html
│ ├── styles.css
│ ├── main.js
│ └── posts.js
├── routes/
│ ├── auth.js
│ ├── postsRoute.js
│ └── usersRoute.js
├── app.js
├── package.json
└── README.md

## API Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/logout`: Log out the current user
- `GET /api/posts`: Get all posts
- `POST /api/posts`: Create a new post
- `DELETE /api/posts/:id`: Delete a post
- `POST /api/posts/:id/like`: Like a post
- `GET /api/users/profile`: Get the current user's profile
- `POST /api/users/update-bio`: Update the user's bio

## Contributing

Please feel free to submit issues, fork the repository and send pull requests!
