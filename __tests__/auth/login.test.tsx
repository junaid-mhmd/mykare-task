import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Login from "@/app/auth/login/page";

// Mock modules
jest.mock("@/context/authContext", () => ({
	useAuth: jest.fn(),
}));
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

describe("Login Component", () => {
	const mockLogin = jest.fn();
	const mockPush = jest.fn();

	beforeEach(() => {
		(useAuth as jest.Mock).mockReturnValue({
			login: mockLogin,
			user: null,
			allUsers: [],
			logout: jest.fn(),
			register: jest.fn(),
		});

		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
			back: jest.fn(),
			forward: jest.fn(),
			refresh: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
		});
	});

	const renderLoginComponent = () => {
		return render(
			<>
				<ToastContainer />
				<Login />
			</>
		);
	};

	describe("Form Rendering", () => {
		it("should render all form elements correctly", () => {
			renderLoginComponent();

			const usernameInput = screen.getByLabelText(/username/i);
			const passwordInput = screen.getByLabelText(/password/i);
			const loginButton = screen.getByRole("button", { name: /login/i });

			expect(usernameInput).toBeInTheDocument();
			expect(passwordInput).toBeInTheDocument();
			expect(loginButton).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		it("should show validation errors when submitting empty form", async () => {
			renderLoginComponent();

			fireEvent.click(screen.getByRole("button", { name: /login/i }));

			const usernameError = await screen.findByText(/username is required/i);
			const passwordError = await screen.findByText(/password is required/i);

			expect(usernameError).toBeInTheDocument();
			expect(passwordError).toBeInTheDocument();
		});
	});

	describe("Login Functionality", () => {
		describe("Admin Login", () => {
			it("should navigate to dashboard on successful admin login", async () => {
				mockLogin.mockResolvedValue({ role: "admin" });
				renderLoginComponent();

				fireEvent.change(screen.getByLabelText(/username/i), {
					target: { value: "admin" },
				});
				fireEvent.change(screen.getByLabelText(/password/i), {
					target: { value: "admin" },
				});

				fireEvent.click(screen.getByRole("button", { name: /login/i }));

				await waitFor(() => {
					expect(mockLogin).toHaveBeenCalledWith("admin", "admin");
				});

				expect(mockPush).toHaveBeenCalledWith("/dashboard");
				expect(
					await screen.findByText(/login successful/i)
				).toBeInTheDocument();
			});
		});

		describe("User Login", () => {
			it("should navigate to home on successful user login", async () => {
				mockLogin.mockResolvedValue({ role: "user" });
				renderLoginComponent();

				fireEvent.change(screen.getByLabelText(/username/i), {
					target: { value: "user" },
				});
				fireEvent.change(screen.getByLabelText(/password/i), {
					target: { value: "password" },
				});

				fireEvent.click(screen.getByRole("button", { name: /login/i }));

				await waitFor(() => {
					expect(mockLogin).toHaveBeenCalledWith("user", "password");
				});

				expect(mockPush).toHaveBeenCalledWith("/");
				expect(
					await screen.findByText(/login successful/i)
				).toBeInTheDocument();
			});
		});

		describe("Failed Login", () => {
			it("should display error toast on failed login attempt", async () => {
				mockLogin.mockRejectedValue(new Error("Invalid credentials"));
				renderLoginComponent();

				fireEvent.change(screen.getByLabelText(/username/i), {
					target: { value: "wrongUser" },
				});
				fireEvent.change(screen.getByLabelText(/password/i), {
					target: { value: "wrongPassword" },
				});

				fireEvent.click(screen.getByRole("button", { name: /login/i }));

				await waitFor(() => {
					expect(mockLogin).toHaveBeenCalledWith("wrongUser", "wrongPassword");
				});

				const errorMessage = await screen.findByText(/invalid credentials/i);
				expect(errorMessage).toBeInTheDocument();
			});
		});
	});
});
