document.addEventListener("DOMContentLoaded", () => {
	fetchUserProfile();
	fetchPosts();

	document
		.getElementById("newPostForm")
		.addEventListener("submit", handleNewPost);
	document
		.getElementById("logoutButton")
		.addEventListener("click", handleLogout);
	document
		.getElementById("editBioBtn")
		.addEventListener("click", handleEditBio);
});

const API_BASE_URL = "https://odin-book-production-f32c.up.railway.app";

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
		console.error("Error details:", error.message, error.stack);
	}
}

async function handleEditBio() {
	const bioElement = document.getElementById("userBio");
	const currentBio = bioElement.textContent;

	const textArea = document.createElement("textarea");
	textArea.id = "bioInput";
	textArea.className = "form-control";
	textArea.value = currentBio;

	const saveBtn = document.createElement("button");
	saveBtn.id = "saveBioBtn";
	saveBtn.className = "btn btn-sm btn-primary mt-2";
	saveBtn.textContent = "Save";

	const cancelBtn = document.createElement("button");
	cancelBtn.id = "cancelBioBtn";
	cancelBtn.className = "btn btn-sm btn-secondary mt-2 ms-2";
	cancelBtn.textContent = "Cancel";

	const buttonContainer = document.createElement("div");
	buttonContainer.appendChild(saveBtn);
	buttonContainer.appendChild(cancelBtn);

	bioElement.textContent = "";
	bioElement.appendChild(textArea);
	bioElement.appendChild(buttonContainer);

	saveBtn.addEventListener("click", async () => {
		const newBio = textArea.value;
		try {
			const response = await fetch(`${API_BASE_URL}/api/users/update-bio`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ bio: newBio }),
				credentials: "include",
			});
			if (response.ok) {
				fetchUserProfile();
			} else {
				console.error("Error updating bio");
			}
		} catch (error) {
			console.error("Error updating bio:", error);
		}
	});

	cancelBtn.addEventListener("click", () => {
		fetchUserProfile();
	});
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
		console.error("Error details:", error.message, error.stack);
	}
}

function displayPosts(posts) {
	const postsFeed = document.getElementById("postsFeed");

	while (postsFeed.firstChild) {
		postsFeed.removeChild(postsFeed.firstChild);
	}

	posts.forEach((post) => {
		const postElement = createPostElement(post);
		postsFeed.appendChild(postElement);
	});
}

function createPostElement(post) {
	const postDiv = document.createElement("div");
	postDiv.className = "card mb-3";

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const title = document.createElement("h5");
	title.className = "card-title";
	title.textContent = post.author.username;

	const content = document.createElement("p");
	content.className = "card-text";
	content.textContent = post.content;

	const timestamp = document.createElement("p");
	timestamp.className = "card-text";
	const small = document.createElement("small");
	small.className = "text-muted";
	small.textContent = new Date(post.createdAt).toLocaleString();
	timestamp.appendChild(small);

	const likeButton = document.createElement("button");
	likeButton.className = "btn btn-primary btn-sm like-button";
	likeButton.dataset.postId = post._id;

	const thumbsUpIcon = document.createElement("i");
	thumbsUpIcon.className = "fas fa-thumbs-up";
	likeButton.appendChild(thumbsUpIcon);

	const likeText = document.createTextNode(` Like (${post.likes.length})`);
	likeButton.appendChild(likeText);

	likeButton.addEventListener("click", () => handleLike(post._id));

	const deleteButton = document.createElement("button");
	deleteButton.className = "btn btn-danger btn-sm delete-button ms-2";
	deleteButton.textContent = "Delete";
	deleteButton.addEventListener("click", () => handleDeletePost(post._id));

	cardBody.appendChild(title);
	cardBody.appendChild(content);
	cardBody.appendChild(timestamp);
	cardBody.appendChild(likeButton);
	cardBody.appendChild(deleteButton);
	postDiv.appendChild(cardBody);

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

async function handleDeletePost(postId) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
			method: "DELETE",
			credentials: "include",
		});
		if (response.ok) {
			fetchPosts();
		} else {
			console.error("Error deleting post");
		}
	} catch (error) {
		console.error("Error deleting post:", error);
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
