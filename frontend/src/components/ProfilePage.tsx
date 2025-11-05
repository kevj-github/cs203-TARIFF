import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface UserProfile {
	id: number;
	username: string;
	email: string;
}

export default function ProfilePage() {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProfile() {
			try {
				const profile = await api.get<UserProfile>("/auth/profile");
				setUser(profile);
				setError(null);
			} catch (err) {
				console.error("Error fetching profile:", err);
				setError("Network error occurred");
				setUser(null);
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, []);

	if (loading) {
		return (
			<div className="p-6">
				<p className="text-gray-600">Loading profile...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					<p className="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="p-6">
				<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
					<p>You are not logged in.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-4 text-gray-800">Profile</h1>
			<div className="bg-white shadow-md rounded-lg p-6 space-y-3">
				<div className="flex justify-between items-center">
					<span className="font-medium text-gray-600">ID:</span>
					<span className="text-gray-800">{user.id}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-medium text-gray-600">Username:</span>
					<span className="text-gray-800">{user.username}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-medium text-gray-600">Email:</span>
					<span className="text-gray-800">{user.email}</span>
				</div>
			</div>
		</div>
	);
}
