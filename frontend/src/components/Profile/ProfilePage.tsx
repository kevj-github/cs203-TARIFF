import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { logout as doLogout } from "@/lib/auth";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    role?: string;
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [editUsername, setEditUsername] = useState<string>("");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

	useEffect(() => {
		async function fetchProfile() {
			try {
                const profile = await api.get<UserProfile>("/auth/profile");
                setUser(profile);
                setEditUsername(profile.username);
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
        <div className="p-6 max-w-xl mx-auto">
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
                {user.role && (
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Role:</span>
                        <span className="text-gray-800">{user.role}</span>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Edit Profile</h2>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        className="w-full border rounded px-3 py-2"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                    />
                </div>
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                    disabled={saving || !editUsername.trim()}
                    onClick={async () => {
                        setSaving(true);
                        setError(null);
                        setSuccessMsg(null);
                        try {
                            const updated = await api.put<UserProfile>("/auth/profile", { username: editUsername.trim() });
                            setUser(updated);
                            setSuccessMsg("Username updated successfully");
                        } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to update username");
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    {saving ? "Saving..." : "Save Username"}
                </button>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Change Password</h2>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                    disabled={saving || !currentPassword || newPassword.length < 8}
                    onClick={async () => {
                        setSaving(true);
                        setError(null);
                        setSuccessMsg(null);
                        try {
                            await api.put<void>("/auth/password", { currentPassword, newPassword });
                            setSuccessMsg("Password changed successfully");
                            setCurrentPassword("");
                            setNewPassword("");
                        } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to change password");
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    {saving ? "Saving..." : "Change Password"}
                </button>
            </div>

            {(successMsg || error) && (
                <div className="mt-4">
                    {successMsg && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {successMsg}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Logout */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Account</h2>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-2">
                <p className="text-sm text-gray-600">End your current session.</p>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                        // Clear local auth and redirect to login
                        doLogout();
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
