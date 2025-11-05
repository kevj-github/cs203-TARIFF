import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SimulationPanelProps {
	customTaxRate: number;
	onTaxRateChange: (value: number) => void;
	customTaxType: string;
	onTaxTypeChange: (value: string) => void;
	onUseDefaults: () => void;
	isLoadingDefaults?: boolean;
}

export function SimulationPanel({
	customTaxRate,
	onTaxRateChange,
	customTaxType,
	onTaxTypeChange,
	onUseDefaults,
	isLoadingDefaults = false,
}: SimulationPanelProps) {
	return (
		<Card className="mt-4 border border-yellow-200 bg-yellow-50">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-lg font-semibold text-yellow-800">
					Simulation Mode Settings
				</CardTitle>
				<Button
					variant="outline"
					size="sm"
					onClick={onUseDefaults}
					disabled={isLoadingDefaults}
					className="bg-white hover:bg-yellow-100"
				>
					{isLoadingDefaults ? "Loading..." : "Use defaults"}
				</Button>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid gap-2">
					<Label htmlFor="tax-type">Tax Type</Label>
					<Select value={customTaxType} onValueChange={onTaxTypeChange}>
						<SelectTrigger
							id="tax-type"
							className="w-[inherit] text-muted-foreground"
						>
							<SelectValue placeholder="Select Tax Type" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem
								value="AD_VALOREM"
								className="font-bold cursor-pointer hover:bg-indigo-100"
							>
								Ad Valorem
							</SelectItem>
							<SelectItem
								value="SPECIFIC"
								className="font-bold cursor-pointer hover:bg-indigo-100"
							>
								Specific
							</SelectItem>
							<SelectItem
								value="COMPOUND"
								className="font-bold cursor-pointer hover:bg-indigo-100"
							>
								Compound
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="tax-rate">
						{customTaxType === "SPECIFIC"
							? "Tax Amount (USD)"
							: "Tax Rate (%)"}
					</Label>
					<Input
						id="tax-rate"
						type="number"
						value={customTaxRate || ""}
						onChange={(e) => onTaxRateChange(Number(e.target.value))}
						placeholder={customTaxType === "SPECIFIC" ? "1000" : "10"}
						className="focus-visible:border-ring focus-visible:ring-ring/50"
					/>
				</div>
				<p className="text-sm text-yellow-700 mt-2">
					Note: This is a simulation mode. The actual tariff rules will not
					be modified.
				</p>
			</CardContent>
		</Card>
	);
}
