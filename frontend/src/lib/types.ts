export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface TariffRuleResponse {
	id: number;
	origin?: string;
	dest?: string;
	hs: string;
	type: string; // e.g., "ad_valorem", "specific", "compound"
	rate: number;
	unit: string; // e.g., "PERCENT", "USD_PER_UNIT", "PERCENT+USD_PER_UNIT"
	validFrom?: string;
	validTo?: string;
}
