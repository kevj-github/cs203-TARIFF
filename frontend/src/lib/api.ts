import { getToken, logout } from "./auth";
import type { ApiResponse } from "./types";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * API client that automatically includes JWT token in requests
 */
export const api = {
	/**
	 * Make a GET request to the API
	 * @param endpoint - API endpoint (without the base URL)
	 * @param options - Additional fetch options
	 * @returns Promise with the response data
	 */
	async get<T>(endpoint: string, options = {}): Promise<T> {
		const token = getToken();
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const url = endpoint.startsWith("http")
			? endpoint
			: `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			method: "GET",
			headers,
			...options,
		});

		return await handleApiResponse<T>(response);
	},

	/**
	 * Make a POST request to the API
	 * @param endpoint - API endpoint (without the base URL)
	 * @param data - Request body data
	 * @param options - Additional fetch options
	 * @returns Promise with the response data
	 */
	async post<T>(endpoint: string, data: any, options = {}): Promise<T> {
		const token = getToken();
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const url = endpoint.startsWith("http")
			? endpoint
			: `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(data),
			...options,
		});

		return await handleApiResponse<T>(response);
	},

	/**
	 * Make a PUT request to the API
	 * @param endpoint - API endpoint (without the base URL)
	 * @param data - Request body data
	 * @param options - Additional fetch options
	 * @returns Promise with the response data
	 */
	async put<T>(endpoint: string, data: any, options = {}): Promise<T> {
		const token = getToken();
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const url = endpoint.startsWith("http")
			? endpoint
			: `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			method: "PUT",
			headers,
			body: JSON.stringify(data),
			...options,
		});

		return await handleApiResponse<T>(response);
	},

	/**
	 * Make a DELETE request to the API
	 * @param endpoint - API endpoint (without the base URL)
	 * @param options - Additional fetch options
	 * @returns Promise with the response data
	 */
	async delete<T>(endpoint: string, options = {}): Promise<T> {
		const token = getToken();
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const url = endpoint.startsWith("http")
			? endpoint
			: `${API_BASE_URL}${endpoint}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers,
			...options,
		});

		return await handleApiResponse<T>(response);
	},
};

async function handleApiResponse<T>(response: Response): Promise<T> {
	// Auto-logout on unauthorized
	if (response.status === 401 || response.status === 403) {
		try {
			logout();
		} catch (e) {
			// ignore
		}
		// redirect to login page
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new Error("Unauthorized");
	}

	// Try to parse JSON; if it fails, include text in error
	let body: any = null;
	try {
		body = await response.json();
	} catch (err) {
		const text = await response.text().catch(() => "");
		throw new Error(text || `HTTP ${response.status}`);
	}

	// If the server uses the ApiResponse wrapper, unwrap it
	if (
		body &&
		typeof body === "object" &&
		Object.prototype.hasOwnProperty.call(body, "success")
	) {
		const apiResponse = body as ApiResponse<T>;
		if (!response.ok || !apiResponse?.success) {
			const msg =
				apiResponse?.message || `API request failed (${response.status})`;
			throw new Error(msg);
		}

		return apiResponse.data as T;
	}

	// Otherwise assume the backend returned the raw data (e.g. plain list/object)
	if (!response.ok) {
		throw new Error(`API request failed (${response.status})`);
	}

	return body as T;
}
