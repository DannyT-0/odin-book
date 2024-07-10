document.addEventListener("DOMContentLoaded", () => {
	fetchUserProfile();
	fetchPosts();

	document
		.getElementById("newPostForm")
		.addEventListener("submit", handleNewPost);
	document
		.getElementById("logoutButton")
		.addEventListener("click", handleLogout);
});

const API_BASE_URL = "http://localhost:3000";

async function fetchUserProfile() {
	try {
		const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
			credentials: "include",
		});
		const userData = await response.json();
		document.getElementById("userUsername").textContent = userData.username;
		document.getElementById("userBio").textContent =
			userData.bio || "No bio available.";
	} catch (error) {
		console.error("Error fetching user profile:", error);
	}
}

async function fetchPosts() {
	try {
		const response = await fetch(`${API_BASE_URL}/api/posts`, {
			credentials: "include",
		});
		const posts = await response.json();
		displayPosts(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
	}
}

function displayPosts(posts) {
	const postsFeed = document.getElementById("postsFeed");
	postsFeed.innerHTML = "";
	posts.forEach((post) => {
		const postElement = createPostElement(post);
		postsFeed.appendChild(postElement);
	});
}

function createPostElement(post) {
	const postDiv = document.createElement("div");
	postDiv.className = "card mb-3";
	postDiv.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${post.author.username}</h5>
            <p class="card-text">${post.content}</p>
            <p class="card-text"><small class="text-muted">${new Date(
							post.createdAt
						).toLocaleString()}</small></p>
            <button class="btn btn-primary btn-sm like-button" data-post-id="${
							post._id
						}">
                <i class="fas fa-thumbs-up"></i> Like (${post.likes.length})
            </button>
        </div>
    `;
	postDiv
		.querySelector(".like-button")
		.addEventListener("click", () => handleLike(post._id));
	return postDiv;
}

async function handleNewPost(event) {
	event.preventDefault();
	const content = document.getElementById("postContent").value;
	try {
		const response = await fetch(`${API_BASE_URL}/api/posts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content }),
			credentials: "include",
		});
		if (response.ok) {
			document.getElementById("postContent").value = "";
			fetchPosts();
		} else {
			console.error("Error creating post");
		}
	} catch (error) {
		console.error("Error creating post:", error);
	}
}

async function handleLike(postId) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
			method: "POST",
			credentials: "include",
		});
		if (response.ok) {
			fetchPosts();
		} else {
			console.error("Error liking post");
		}
	} catch (error) {
		console.error("Error liking post:", error);
	}
}

async function handleLogout() {
	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
			method: "GET",
			credentials: "include",
		});
		if (response.ok) {
			window.location.href = `${API_BASE_URL}/index.html`;
		} else {
			console.error("Error logging out");
		}
	} catch (error) {
		console.error("Error logging out:", error);
	}
}
