"use client";

import { format } from "date-fns";
import "react-day-picker/style.css";
import { CalendarIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { CalculationResultCard } from "./CalculationResultCard";
import { SimulationPanel } from "./SimulationPanel";
import { getCookie, setCookie } from "@/lib/cookies";

const countries = [
  { label: "Singapore", value: "SG" },
  { label: "United States", value: "US" },
  { label: "China", value: "CN" },
  { label: "United Kingdom", value: "GB" },
  { label: "Germany", value: "DE" },
  { label: "Indonesia", value: "ID" },
];

//3
const pcComponents = [
  { id: 3, code: "8473.30", name: "CPU" },
  { id: 4, code: "8473.40", name: "GPU" },
  { id: 6, code: "8471.70", name: "Hard Disk Drives (HDD)" },
  { id: 11, code: "8473.30", name: "Motherboards" }, // duplicate HS, unique id
  { id: 10, code: "8504.40", name: "Power Supply Units" },
  { id: 5, code: "8473.50", name: "RAM" },
  { id: 7, code: "8473.30", name: "Solid State Drives (SSD)" }, // duplicate HS, unique id
];

const consumerElectronics = [
  { id: 9, code: "8528.59", name: "Computer Monitors" },
  { id: 2, code: "8471.30", name: "Laptops/Portable computers" },
  { id: 1, code: "8517.12", name: "Smartphones" },
  { id: 8, code: "8528.72", name: "Television Receivers - LCD/LED" },
];

const powerSupport = [
  { id: 14, code: "8471.80", name: "Computer Units - Other" },
  { id: 12, code: "8507.60", name: "Lithium-ion Batteries" },
  { id: 13, code: "8542.31", name: "Semiconductors/Processors" },
];

const FormSchema = z.object({
  origin: z.string().min(1, "Please select origin country."),
  dest: z.string().min(1, "Please select destination country."),
  hs: z.string().min(1, "Please select a product category."),
  customsValue: z.string().min(1, "Product value is required."),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .refine((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 1;
    }, { message: "Minimum quantity is 1" }),
  // on: z.date().min(1, "Please select import date."),
  on: z.string().min(1, "Please select import date."),
});

export default function CalculatorPage() {
	const [result, setResult] = useState<any | null>(null); // store backend result
	const [loading, setLoading] = useState(false);
	const [isSimulationMode, setIsSimulationMode] = useState(false);
	const [customTaxRate, setCustomTaxRate] = useState(0);
	const [customTaxType, setCustomTaxType] = useState("AD_VALOREM");
	const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

	// Persist form and UI state in cookies so navigating away and back keeps inputs
	const FORM_COOKIE_KEY = "calculator_form";
	const UI_COOKIE_KEY = "calculator_ui";

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			origin: "",
			dest: "",
			hs: "",
			customsValue: "",
			quantity: "",
			on: "",
		},
	});

	// On first render, hydrate the form from cookie (session)
	useEffect(() => {
		try {
			const raw = getCookie(FORM_COOKIE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				// Only merge known fields
				form.reset({
					origin: saved.origin ?? "",
					dest: saved.dest ?? "",
					hs: saved.hs ?? "",
					customsValue: saved.customsValue ?? "",
					quantity: saved.quantity ?? "",
					on: saved.on ?? "",
				});
			}
		} catch (e) {
			// ignore parse errors
		}
	}, []);

	// Subscribe to form changes and persist to cookie (session)
	useEffect(() => {
		const sub = form.watch((value) => {
			try {
				setCookie(FORM_COOKIE_KEY, JSON.stringify(value));
			} catch (e) {
				// ignore
			}
		});
		return () => sub.unsubscribe();
	}, [form]);

	// Hydrate and persist UI toggles for simulation panel
	useEffect(() => {
		try {
			const raw = getCookie(UI_COOKIE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				setIsSimulationMode(Boolean(saved.isSimulationMode));
				setCustomTaxRate(Number(saved.customTaxRate ?? 0));
				setCustomTaxType(String(saved.customTaxType ?? "AD_VALOREM"));
			}
		} catch (e) {
			// ignore
		}
	}, []);

	useEffect(() => {
		try {
			setCookie(
				UI_COOKIE_KEY,
				JSON.stringify({
					isSimulationMode,
					customTaxRate,
					customTaxType,
				})
			);
		} catch (e) {
			// ignore
		}
	}, [isSimulationMode, customTaxRate, customTaxType]);

	// watch form fields so we can fetch default tariff rule when all are present
	const originVal = form.watch("origin");
	const destVal = form.watch("dest");
	const hsVal = form.watch("hs");
	const onVal = form.watch("on");

	// Map backend rule type to simulation select values
	const mapType = (t: string) => {
		if (!t) return "AD_VALOREM";
		switch (t.toLowerCase()) {
			case "ad_valorem":
				return "AD_VALOREM";
			case "specific":
				return "SPECIFIC";
			case "compound":
				return "COMPOUND";
			default:
				return String(t).toUpperCase();
		}
	};

	// Function to fetch default tariff rules
	// Watch form fields for changes
	useEffect(() => {
		fetchDefaultRule();
	}, [originVal, destVal, hsVal, onVal]);

	const fetchDefaultRule = async () => {
			// only fetch when all fields have values
			if (!originVal || !destVal || !hsVal || !onVal) {
				// not an error — just early-return until the user fills in the form
				console.debug("Cannot fetch defaults: missing required fields");
				return;
			}

		setIsLoadingDefaults(true);
		try {
			// map selected hs id to HS code
			const selectedItem = [
				...pcComponents,
				...consumerElectronics,
				...powerSupport,
			].find((item) => String(item.id) === hsVal);
			const hsCode = selectedItem?.code;
			if (!hsCode) {
				console.warn("Cannot fetch defaults: invalid HS code");
				return;
			}

			const url = `/tariff-rules?origin=${encodeURIComponent(
				originVal
			)}&dest=${encodeURIComponent(destVal)}&hs=${encodeURIComponent(
				hsCode
			)}&on=${encodeURIComponent(onVal)}`;
			const rules = await api.get<any[]>(url);
			console.debug("Fetched tariff rules:", rules);
			if (rules && rules.length > 0) {
				const r = rules[0];
				// prefer percent if unit indicates percent, otherwise use numeric rate
				const unit: string = r.unit || "";
				const rateNum = Number(r.rate ?? 0);
				if (unit.includes("PERCENT")) {
					setCustomTaxType(mapType(r.type));
					setCustomTaxRate(rateNum);
				} else if (
					unit.includes("USD_PER_UNIT") ||
					unit.includes("SGD_PER_UNIT")
				) {
					setCustomTaxType("SPECIFIC");
					setCustomTaxRate(rateNum);
				} else {
					// fallback
					setCustomTaxType(mapType(r.type));
					setCustomTaxRate(rateNum);
				}
			}
		} catch (err) {
			// don't block user; just log
			console.warn("Failed to fetch default tariff rule:", err);
		} finally {
			setIsLoadingDefaults(false);
		}
	};

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			setLoading(true);
			setResult(null);

			// const payload = {
			//   origin: data.origin,
			//   dest: data.dest,
			//   hs: data.hs,
			//   on: data.on, // YYYY-MM-DD
			//   customsValue: Number(data.customsValue),
			//   quantity: Number(data.quantity),
			// };

			const selectedItem = [
				...pcComponents,
				...consumerElectronics,
				...powerSupport,
			].find((item) => String(item.id) === data.hs);

			const payload = {
				origin: data.origin,
				dest: data.dest,
				hs: selectedItem?.code, // send HS code to backend
				on: data.on,
				customsValue: Number(data.customsValue),
				quantity: Number(data.quantity),
				simulation: isSimulationMode
					? {
							taxRate: customTaxRate,
							taxType: customTaxType,
					  }
					: null,
			};

			const result = await api.post("/calculate", payload);
			setResult(result);
		} catch (err) {
			console.error(err);
			setResult({
				error:
					err instanceof Error
						? err.message
						: "Failed to fetch tariff calculation",
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="p-3">
				<h1 className="text-2xl font-bold mb-4">Tariff Calculator</h1>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-6 md:grid-cols-2"
					>
						{/* Origin */}
						<FormField
							control={form.control}
							name="origin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Origin Country</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger className="w-[inherit] ">
											<SelectValue placeholder="Select origin country" />
										</SelectTrigger>
										<SelectContent className="bg-white ">
											<SelectGroup>
												<SelectLabel>Countries</SelectLabel>
												{countries.map((c) => (
													<SelectItem
														className="font-bold cursor-pointer hover:bg-indigo-100"
														key={c.value}
														value={c.value}
													>
														{c.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						{/* Destination */}
						<FormField
							control={form.control}
							name="dest"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Destination Country</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger className="w-[inherit]">
											<SelectValue placeholder="Select destination country" />
										</SelectTrigger>
										<SelectContent className="bg-white ">
											<SelectGroup>
												<SelectLabel>Countries</SelectLabel>
												{countries.map((c) => (
													<SelectItem
														className="font-bold cursor-pointer hover:bg-indigo-100"
														key={c.value}
														value={c.value}
													>
														{c.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						{/* Product Category */}
						<FormField
							control={form.control}
							name="hs"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										{/* <SelectTrigger className="w-[inherit]">
                      <SelectValue placeholder="Select product">
                        {
                          [
                            ...pcComponents,
                            ...consumerElectronics,
                            ...powerSupport,
                            // ...communication,
                          ].find((item) => item.code === field.value)?.name
                        }
                      </SelectValue>
                    </SelectTrigger> */}
                    <SelectTrigger className="w-[inherit]">
                      {/* Custom label: show the product name instead of HS code */}
                      {[
                        ...pcComponents,
                        ...consumerElectronics,
                        ...powerSupport,
                      ].find((item) => String(item.id) === field.value)
                        ?.name || <SelectValue placeholder="Select product" />}
                    </SelectTrigger>

                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>PC Components</SelectLabel>
                        {pcComponents.map((item) => (
                          <SelectItem
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                            key={item.id}
                            value={String(item.id)}
                            // value={item.code}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Consumer Electronics</SelectLabel>
                        {consumerElectronics.map((item) => (
                          <SelectItem
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                            key={item.id}
                            value={String(item.id)}
                            // value={item.code}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Power & Support</SelectLabel>
                        {powerSupport.map((item) => (
                          <SelectItem
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                            key={item.id}
                            value={String(item.id)}
                            // value={item.code}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>

                      {/* <SelectGroup>
                        <SelectLabel>Communication</SelectLabel>
                        {communication.map((item) => (
                          <SelectItem
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                            key={item.code}
                            value={item.code}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup> */}
										</SelectContent>
									</Select>
									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="on"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Import Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[full] pl-3 text-left font-normal",
														!field.value &&
															"text-muted-foreground"
													)}
												>
													{field.value ? (
														format(new Date(field.value), "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0 bg-white"
											align="start"
										>
											<Calendar
												mode="single"
												selected={
													field.value
														? new Date(field.value)
														: undefined
												}
												onSelect={(date) =>
													field.onChange(
														date ? format(date, "yyyy-MM-dd") : ""
													)
												}
												disabled={(date) =>
													date > new Date() ||
													date < new Date("1900-01-01")
												}
												captionLayout="dropdown"
											/>
										</PopoverContent>
									</Popover>

									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						{/* Product Value */}
						<FormField
							control={form.control}
							name="customsValue"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product Value (USD)</FormLabel>

									<FormControl>
										<Input
											className="focus-visible:border-ring focus-visible:ring-ring/50"
											type="number"
											placeholder="1000"
											value={field.value}
											onChange={e => field.onChange(e.target.value)}
										/>
									</FormControl>
									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						{/* Product Quantity */}
						<FormField
							control={form.control}
							name="quantity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
                                        <Input
                                            className="focus-visible:border-ring focus-visible:ring-ring/50"
                                            type="number"
                                            placeholder="Minimum quantity of 1"
                                            min={1}
                                            step={1}
                                            value={field.value}
                                            onChange={e => field.onChange(e.target.value)}
                                        />
									</FormControl>
									<FormMessage className="text-red-500" />
								</FormItem>
							)}
						/>

						{/* Submit */}
						<div className="col-span-full flex justify-end items-center gap-4">
							<div className="flex items-center gap-2">
								<Label
									htmlFor="simulation-mode"
									className="font-medium text-gray-600"
								>
									Simulation Mode
								</Label>
								<Switch
									id="simulation-mode"
									checked={isSimulationMode}
									onCheckedChange={setIsSimulationMode}
								/>
							</div>
							<Button
								type="submit"
								className="!bg-[#eddea4]"
								disabled={loading}
							>
								{loading ? "Calculating..." : "Calculate"}
							</Button>
						</div>
					</form>
				</Form>

				{/* Simulation Panel */}
				{isSimulationMode && (
								<SimulationPanel
									customTaxRate={String(customTaxRate)}
									onTaxRateChange={val => setCustomTaxRate(Number(val))}
									customTaxType={customTaxType}
									onTaxTypeChange={setCustomTaxType}
									onUseDefaults={fetchDefaultRule}
									isLoadingDefaults={isLoadingDefaults}
								/>
				)}

				{/* Display Result */}
        {result && (
          <CalculationResultCard
            baseDuty={result.baseDuty}
            total={result.total}
            ruleApplied={result.ruleApplied}
            error={result.error}
			customsValue={Number(form.getValues("customsValue"))}
			quantity={Number(form.getValues("quantity"))}
            indirectTax={result.indirectTax || 0}
            origin={form.getValues("origin")}
            dest={form.getValues("dest")}
            hs={(() => {
              const item = [...pcComponents, ...consumerElectronics, ...powerSupport].find(
                (item) => String(item.id) === form.getValues("hs")
              );
              return item?.code || "";
            })()}
            on={form.getValues("on")}
            isSimulation={isSimulationMode}
          />
        )}
			</div>
		</>
	);
}
