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

async function handleLogin(e) {
	e.preventDefault();
	if (!validateForm("loginForm")) return;

	const email = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;

	try {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (response.ok) {
			alert("Logged in successfully!");
			window.location.href = "/posts";
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
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		});

		const data = await response.json();

		if (response.ok) {
			alert("Registered successfully! Please log in.");
			$("#registerModal").modal("hide");
			$("#loginModal").modal("show");
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
		const response = await fetch("/api/auth/forgot-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (response.ok) {
			alert("Password reset instructions have been sent to your email.");
			$("#forgotPasswordModal").modal("hide");
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
