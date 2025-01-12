import { useAuth } from "@/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { user_permissions } from "./common";
import Loader from "./loader";

const ProtectedRoute: React.FC<{
	children: ReactNode;
}> = ({ children }) => {
	const { user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (pathname !== "/not-found") {
			if (user) {
				if (user_permissions[user.role]?.some((path) => path === pathname)) {
					setIsLoading(false);
				} else {
					router.push("/not-found");
					return;
				}
			}
			if (user === null) {
				router.push("/auth/login");
				return;
			}
		}
	}, [user, pathname, router]);

	if (isLoading) {
		return <Loader />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
