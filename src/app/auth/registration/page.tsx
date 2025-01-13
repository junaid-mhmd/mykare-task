"use client";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Props = {};

type FormData = {
	username: string;
	password: string;
	confirmPassword: string;
	fullname: string;
};

const Registration = (props: Props) => {
	const { register: register_ } = useAuth();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		await register_(data.fullname, data.username, data.password)
			.then((res: any) => {
				router.push("/");
				toast.success("Registration successful");
			})
			.catch((err: any) => {
				toast.error(err.message);
			});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-black text-2xl font-bold text-center">
					Registration
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label
							htmlFor="fullname"
							className="block text-sm font-medium text-gray-700"
						>
							Fullname
						</label>
						<input
							id="fullname"
							type="text"
							{...register("fullname", {
								required: "fullname is required",
							})}
							className="w-full px-3 py-2 text-black mt-1 border rounded-md shadow-sm "
						/>
						{errors.fullname && (
							<p className="mt-1 text-sm text-red-600">
								{errors.fullname.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							{...register("username", {
								required: "Username is required",
								minLength: {
									value: 4,
									message: "Username must have at least 4 characters",
								},
							})}
							className="w-full px-3 py-2 text-black mt-1 border rounded-md shadow-sm "
						/>
						{errors.username && (
							<p className="mt-1 text-sm text-red-600">
								{errors.username.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 5,
									message: "Password must have at least 5 characters",
								},
							})}
							className="w-full px-3 py-2 text-black mt-1 border rounded-md shadow-sm "
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							{...register("confirmPassword", {
								required: "Confirm Password is required",
								validate: (value) =>
									value === watch("password") || "Passwords do not match",
							})}
							className="w-full px-3 py-2 text-black mt-1 border rounded-md shadow-sm "
						/>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>
					<div>
						<button
							type="submit"
							className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Signup
						</button>
						<p className="mt-10 text-center text-sm/6 text-gray-500">
							Already have a account?{" "}
							<Link
								href="/auth/login"
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Go to login
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Registration;
