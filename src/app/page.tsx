"use client";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function Home() {
	const { user } = useAuth();
	return (
		<>
			<div className=" mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
				<h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
					Hi {user?.fullname ?? "username"}!
				</h1>
				<p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
					Welcome to mykare.
				</p>
				{user?.role === "admin" && (
					<div className="mt-10">
						<Link
							href="/dashboard"
							className="text-sm/7 font-semibold text-indigo-600"
						>
							Go to dashboard<span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
