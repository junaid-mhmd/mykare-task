import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "@/context/authContext";
import Header from "@/components/layout/header";

jest.mock("@/context/authContext", () => ({
	useAuth: jest.fn(),
}));

describe("Header Component", () => {
	const mockLogout = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		(useAuth as jest.Mock).mockReturnValue({
			logout: mockLogout,
		});
	});

	describe("Rendering", () => {
		it("should render the company name", () => {
			render(<Header />);

			const companyName = screen.getByText(/mykare/i);
			expect(companyName).toBeInTheDocument();
		});

		it("should render the logout button", () => {
			render(<Header />);

			const logoutButton = screen.getByRole("button", { name: /log out/i });
			expect(logoutButton).toBeInTheDocument();
		});

		it("should render the home link", () => {
			render(<Header />);

			const homeLink = screen.getByRole("link", { name: /mykare/i });
			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});

	describe("Navigation", () => {
		it("should have correct navigation link for logo", () => {
			render(<Header />);

			const logoLink = screen.getByRole("link", { name: /mykare/i });
			expect(logoLink).toHaveAttribute("href", "/");
		});
	});

	describe("Logout Functionality", () => {
		it("should call logout function when logout button is clicked", () => {
			render(<Header />);

			const logoutButton = screen.getByRole("button", { name: /log out/i });
			fireEvent.click(logoutButton);

			expect(mockLogout).toHaveBeenCalledTimes(1);
		});
	});
});
