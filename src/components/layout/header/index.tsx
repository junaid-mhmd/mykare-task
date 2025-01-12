"use client";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function Header() {
	const { logout } = useAuth();

	return (
		<header className="bg-gray-50">
			<nav
				aria-label="Global"
				className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
			>
				<div className="flex lg:flex-1">
					<Link href="/" className="-m-1.5 p-1.5">
						<h1 className="text-black font-semibold text-lg ">Mykare</h1>
					</Link>
				</div>

				<div className=" lg:flex lg:flex-1 lg:justify-end">
					<button
						onClick={() => logout()}
						className="text-sm/6 font-semibold text-gray-800"
					>
						Log out
					</button>
				</div>
			</nav>
		</header>
	);
}
