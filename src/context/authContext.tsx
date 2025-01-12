"use client";
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

interface User {
	fullname: string;
	username: string;
	password: string;
	role: "admin" | "user";
}

interface AuthContextType {
	user: Omit<User, "password"> | null | undefined;
	allUsers: Omit<User, "password">[];
	login: (
		username: string,
		password: string
	) => Promise<Omit<User, "password">>;
	logout: () => void;
	register: (
		fullname: string,
		username: string,
		password: string,
		role?: "admin" | "user"
	) => Promise<Omit<User, "password">>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<Omit<User, "password"> | null | undefined>(
		undefined
	);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const router = useRouter();

	// Sync localStorage to state on load
	useEffect(() => {
		const storedUsers = localStorage.getItem("allUsers");
		const storedUser = localStorage.getItem("currentUser");
		if (storedUsers) {
			setAllUsers(JSON.parse(storedUsers));
		}
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			setUser(null);
		}
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem("currentUser", JSON.stringify(user));
		} else {
			localStorage.removeItem("currentUser");
		}
	}, [user]);

	useEffect(() => {
		const initializeAdminUser = async () => {
			const storedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
			// Check if there is already an admin user
			const existingAdmin = storedUsers.find(
				(user: any) => user.role === "admin"
			);

			if (!existingAdmin) {
				// If no admin exists, create a new one
				const adminUser: User = {
					fullname: "Admin user",
					username: "admin",
					password: await bcrypt.hash("admin", 10),
					role: "admin",
				};

				storedUsers.push(adminUser);
				localStorage.setItem("allUsers", JSON.stringify(storedUsers));

				setAllUsers(storedUsers);
			} else {
				setAllUsers(storedUsers);
			}
		};

		initializeAdminUser();
	}, []);

	useEffect(() => {
		localStorage.setItem("allUsers", JSON.stringify(allUsers));
	}, [allUsers]);

	const register = (
		fullname: string,
		username: string,
		password: string,
		role: "admin" | "user" = "user"
	): Promise<Omit<User, "password">> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (allUsers.some((u) => u.username === username)) {
					return reject(new Error("Username already registered."));
				}

				// Hash the password before saving
				const hashedPassword = await bcrypt.hash(password, 10);

				const newUser: User = {
					fullname,
					username,
					password: hashedPassword,
					role: role,
				};

				setAllUsers((prev) => [...prev, newUser]);
				setUser({ fullname, username, role });

				resolve({ fullname, username, role });
			} catch (error) {
				reject(error);
			}
		});
	};

	const login = (
		username: string,
		password: string
	): Promise<Omit<User, "password">> => {
		return new Promise(async (resolve, reject) => {
			try {
				const existingUser = allUsers.find((u) => u.username === username);

				if (!existingUser) {
					return reject(new Error("Invalid username or password."));
				}

				const isPasswordValid = await bcrypt.compare(
					password,
					existingUser.password
				);

				if (!isPasswordValid) {
					return reject(new Error("Invalid username or password."));
				}

				setUser({
					fullname: existingUser.fullname,
					username: existingUser.username,
					role: existingUser.role,
				});

				resolve({
					fullname: existingUser.fullname,
					username: existingUser.username,
					role: existingUser.role,
				});
			} catch (error) {
				reject(error);
			}
		});
	};

	const logout = () => {
		setUser(null);
		router.push("/auth/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				allUsers: allUsers.map(({ password, ...rest }) => rest),
				login,
				logout,
				register,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
