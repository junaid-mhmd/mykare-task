"use client";

import { useAuth } from "@/context/authContext";

export default function Dashboard() {
	const { allUsers } = useAuth();

	return (
		<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div className="py-7">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold text-gray-900">
							User registrations
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							A list of all the registered users.
						</p>
					</div>
				</div>
				<div className="mt-8 flow-root">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<table className="min-w-full divide-y divide-gray-300">
								<thead>
									<tr>
										<th
											scope="col"
											className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
										>
											Fullname
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Username
										</th>

										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Role
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{allUsers.map((user, index) => (
										<tr key={index}>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
												{user.fullname}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{user.username}
											</td>

											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{user.role}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
