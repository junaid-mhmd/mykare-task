import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Registration from "@/app/auth/registration/page";

// Mock modules
jest.mock("@/context/authContext", () => ({
	useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

describe("Registration Component", () => {
	const mockRegister = jest.fn();
	const mockPush = jest.fn();

	beforeEach(() => {
		(useAuth as jest.Mock).mockReturnValue({
			register: mockRegister,
			user: null,
			login: jest.fn(),
			logout: jest.fn(),
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

	const renderRegistrationComponent = () => {
		return render(
			<>
				<ToastContainer />
				<Registration />
			</>
		);
	};

	describe("Form Rendering", () => {
		it("should render all form elements correctly", () => {
			renderRegistrationComponent();

			expect(screen.getByLabelText(/fullname/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /signup/i })
			).toBeInTheDocument();
			expect(screen.getByText(/already have a account/i)).toBeInTheDocument();
			expect(screen.getByText(/go to login/i)).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		it("should show validation errors when submitting empty form", async () => {
			renderRegistrationComponent();

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			const errorMessages = await screen.findAllByText(/is required/i);

			expect(errorMessages).toHaveLength(4);
			expect(errorMessages[0]).toHaveTextContent(/fullname is required/i);
			expect(errorMessages[1]).toHaveTextContent(/username is required/i);
			expect(errorMessages[2]).toHaveTextContent(/password is required/i);
			expect(errorMessages[3]).toHaveTextContent(
				/confirm password is required/i
			);
		});

		it("should validate username minimum length", async () => {
			renderRegistrationComponent();

			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "usr" },
			});

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			expect(
				await screen.findByText(/username must have at least 4 characters/i)
			).toBeInTheDocument();
		});

		it("should validate password minimum length", async () => {
			renderRegistrationComponent();

			fireEvent.change(screen.getByLabelText(/^password$/i), {
				target: { value: "pass" },
			});

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			expect(
				await screen.findByText(/password must have at least 5 characters/i)
			).toBeInTheDocument();
		});

		it("should validate password match", async () => {
			renderRegistrationComponent();

			fireEvent.change(screen.getByLabelText(/^password$/i), {
				target: { value: "password123" },
			});
			fireEvent.change(screen.getByLabelText(/confirm password/i), {
				target: { value: "password456" },
			});

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			expect(
				await screen.findByText(/passwords do not match/i)
			).toBeInTheDocument();
		});
	});

	describe("Registration Functionality", () => {
		it("should handle successful registration", async () => {
			mockRegister.mockResolvedValue({});
			renderRegistrationComponent();

			fireEvent.change(screen.getByLabelText(/fullname/i), {
				target: { value: "John Doe" },
			});
			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "johndoe" },
			});
			fireEvent.change(screen.getByLabelText(/^password$/i), {
				target: { value: "password123" },
			});
			fireEvent.change(screen.getByLabelText(/confirm password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			await waitFor(() => {
				expect(mockRegister).toHaveBeenCalledWith(
					"John Doe",
					"johndoe",
					"password123"
				);
			});

			expect(mockPush).toHaveBeenCalledWith("/");
			expect(
				await screen.findByText(/registration successful/i)
			).toBeInTheDocument();
		});

		it("should handle registration failure", async () => {
			const errorMessage = "Username already exists";
			mockRegister.mockRejectedValue(new Error(errorMessage));
			renderRegistrationComponent();

			fireEvent.change(screen.getByLabelText(/fullname/i), {
				target: { value: "unais Doe" },
			});
			fireEvent.change(screen.getByLabelText(/username/i), {
				target: { value: "unais" },
			});
			fireEvent.change(screen.getByLabelText(/^password$/i), {
				target: { value: "password123" },
			});
			fireEvent.change(screen.getByLabelText(/confirm password/i), {
				target: { value: "password123" },
			});

			fireEvent.click(screen.getByRole("button", { name: /signup/i }));

			await waitFor(() => {
				expect(mockRegister).toHaveBeenCalledWith(
					"John Doe",
					"johndoe",
					"password123"
				);
			});

			expect(await screen.findByText(errorMessage)).toBeInTheDocument();
		});
	});
});
