document.addEventListener("DOMContentLoaded", () => {
	// Form submission handlers
	document.getElementById("loginForm").addEventListener("submit", handleLogin);
	document
		.getElementById("registerForm")
		.addEventListener("submit", handleRegister);
	document
		.getElementById("forgotPasswordForm")
		.addEventListener("submit", handleForgotPassword);

	// Input validation
	document.querySelectorAll("input").forEach((input) => {
		input.addEventListener("input", validateInput);
	});
});

const API_BASE_URL = "odin-book-production-f32c.up.railway.app";

async function handleLogin(e) {
	e.preventDefault();
	if (!validateForm("loginForm")) return;

	const email = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include",
		});

		const text = await response.text();
		console.log("Response status:", response.status);
		console.log("Response text:", text);

		let data;
		try {
			data = JSON.parse(text);
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
			alert(`An error occurred. Server response: ${text}`);
			return;
		}

		if (response.ok) {
			alert("Logged in successfully!");
			window.location.href = `${API_BASE_URL}/posts.html`;
		} else {
			alert(data.message || "Login failed. Please try again.");
		}
	} catch (error) {
		console.error("Login error:", error);
		alert("An error occurred. Please try again later.");
	}
}

async function handleRegister(e) {
	e.preventDefault();
	if (!validateForm("registerForm")) return;

	const username = document.getElementById("registerUsername").value;
	const email = document.getElementById("registerEmail").value;
	const password = document.getElementById("registerPassword").value;
	const confirmPassword = document.getElementById(
		"registerConfirmPassword"
	).value;

	if (password !== confirmPassword) {
		alert("Passwords don't match!");
		return;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		});

		console.log("Response status:", response.status);
		console.log("Response headers:", response.headers);

		const text = await response.text();
		console.log("Response text:", text);

		let data;
		try {
			data = JSON.parse(text);
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
			alert("An error occurred. Please try again later.");
			return;
		}

		if (response.ok) {
			alert("Registered successfully! Please log in.");
			document.getElementById("registerModal").style.display = "none";
			document.getElementById("loginModal").style.display = "block";
		} else {
			alert(data.message || "Registration failed. Please try again.");
		}
	} catch (error) {
		console.error("Registration error:", error);
		alert("An error occurred. Please try again later.");
	}
}

async function handleForgotPassword(e) {
	e.preventDefault();
	if (!validateForm("forgotPasswordForm")) return;

	const email = document.getElementById("forgotEmail").value;

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		const text = await response.text();
		console.log("Response status:", response.status);
		console.log("Response text:", text);

		let data;
		try {
			data = JSON.parse(text);
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
			alert(`An error occurred. Server response: ${text}`);
			return;
		}

		if (response.ok) {
			alert("Password reset instructions have been sent to your email.");
			document.getElementById("forgotPasswordModal").style.display = "none";
		} else {
			alert(
				data.message || "Failed to process your request. Please try again."
			);
		}
	} catch (error) {
		console.error("Forgot password error:", error);
		alert("An error occurred. Please try again later.");
	}
}

function validateInput(e) {
	const input = e.target;
	const value = input.value.trim();
	let isValid = true;
	let errorMessage = "";

	switch (input.type) {
		case "email":
			isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			errorMessage = "Please enter a valid email address.";
			break;
		case "password":
			isValid = value.length >= 8;
			errorMessage = "Password must be at least 8 characters long.";
			break;
		case "text":
			isValid = value.length > 0;
			errorMessage = "This field is required.";
			break;
	}

	if (input.id === "registerConfirmPassword") {
		const password = document.getElementById("registerPassword").value;
		isValid = value === password;
		errorMessage = "Passwords do not match.";
	}

	if (!isValid) {
		input.classList.add("is-invalid");
		let feedbackElement = input.nextElementSibling;
		if (
			!feedbackElement ||
			!feedbackElement.classList.contains("invalid-feedback")
		) {
			feedbackElement = document.createElement("div");
			feedbackElement.classList.add("invalid-feedback");
			input.parentNode.insertBefore(feedbackElement, input.nextSibling);
		}
		feedbackElement.textContent = errorMessage;
	} else {
		input.classList.remove("is-invalid");
		const feedbackElement = input.nextElementSibling;
		if (
			feedbackElement &&
			feedbackElement.classList.contains("invalid-feedback")
		) {
			feedbackElement.remove();
		}
	}
}

function validateForm(formId) {
	const form = document.getElementById(formId);
	let isValid = true;

	form.querySelectorAll("input").forEach((input) => {
		const event = new Event("input", {
			bubbles: true,
			cancelable: true,
		});
		input.dispatchEvent(event);

		if (input.classList.contains("is-invalid")) {
			isValid = false;
		}
	});

	return isValid;
}
