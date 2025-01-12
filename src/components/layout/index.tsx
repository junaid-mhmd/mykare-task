"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "./header";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/utils/protectedRoute";

type Props = {
	children: ReactNode;
	excludedPaths: string[];
};

const Layout = ({ children, excludedPaths }: Props) => {
	const pathname = usePathname();

	if (excludedPaths.includes(pathname)) {
		return (
			<>
				<ToastContainer />
				{children}
			</>
		);
	} else {
		return (
			<>
				<ProtectedRoute>
					<ToastContainer />
					<Header />
					<main className="bg-white min-h-screen">{children}</main>
				</ProtectedRoute>
			</>
		);
	}
};

export default Layout;
