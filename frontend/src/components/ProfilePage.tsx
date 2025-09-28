import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        
        // Debug logging
        console.log("Token from localStorage:", token ? "Present" : "Missing");
        
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/api/auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Response status:", res.status);

        if (res.ok) {
          const apiResponse: ApiResponse<UserProfile> = await res.json();
          console.log("API Response:", apiResponse);
          
          if (apiResponse.success && apiResponse.data) {
            setUser(apiResponse.data); // Extract the user data from the wrapper
            setError(null);
          } else {
            setError("Invalid response format");
            setUser(null);
          }
        } else {
          const errorText = await res.text();
          console.error("Request failed:", res.status, errorText);
          setError(`Authentication failed (${res.status})`);
          setUser(null);
        }
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