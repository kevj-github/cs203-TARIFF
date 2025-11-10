import { getToken, logout } from "./auth";
import type { ApiResponse } from "./types";

// Point to backend API root without trailing slash
const API_BASE_URL = "https://anglify-e9ejgvekgafrf5bc.southeastasia-01.azurewebsites.net/api";

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
	 * Make a POST request with multipart/form-data (e.g., file uploads)
	 * @param endpoint - API endpoint (without the base URL)
	 * @param formData - FormData body
	 * @param options - Additional fetch options
	 * @returns Promise with the response data
	 */
	async postForm<T>(endpoint: string, formData: FormData, options = {}): Promise<T> {
		const token = getToken();
		const headers: HeadersInit = {
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
			body: formData,
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
	// Auto-logout only on unauthorized (401), not on forbidden (403)
	if (response.status === 401) {
		try {
			logout();
		} catch (e) {
			// ignore
		}
		// redirect to login page
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw new Error("Unauthorized - Please log in again");
	}

	// Handle forbidden (403) without logging out
	if (response.status === 403) {
		throw new Error("You don't have permission to perform this action");
	}

	// Try to parse JSON; if it fails, include text in error
	let body: any = null;
	try {
		body = await response.json();
	} catch (err) {
		const text = await response.text().catch(() => "");
		throw new Error(text || `HTTP ${response.status}`);
	}

	// If the server uses the ApiResponse wrapper, unwrap it (must include a data field)
	const isWrapped =
		body &&
		typeof body === "object" &&
		Object.prototype.hasOwnProperty.call(body, "success") &&
		Object.prototype.hasOwnProperty.call(body, "data");

	if (isWrapped) {
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
		const maybeError =
			body &&
			typeof body === "object" &&
			Object.prototype.hasOwnProperty.call(body, "error")
				? (body.error as string)
				: null;
		throw new Error(maybeError || `API request failed (${response.status})`);
	}

	return body as T;
}
