"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
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
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

const countries = [
	{ label: "Singapore", value: "SG" },
	{ label: "United States", value: "US" },
	{ label: "China", value: "CN" },
	{ label: "Japan", value: "JP" },
	{ label: "Germany", value: "DE" },
	{ label: "Indonesia", value: "ID" },
];

const ruleTypes = [
	{ label: "Ad Valorem", value: "ad_valorem" },
	{ label: "Specific", value: "specific" },
	{ label: "Compound", value: "compound" },
] as const;

// Helper function to get available units based on rule type
type RuleType = (typeof ruleTypes)[number]["value"];

const getUnitsForType = (type: RuleType) => {
	switch (type) {
		case "ad_valorem":
			return [{ label: "Percent", value: "PERCENT" }];
		case "specific":
			return [
				{ label: "USD per Unit", value: "USD_PER_UNIT" },
				{ label: "SGD per Unit", value: "SGD_PER_UNIT" },
			];
		case "compound":
			return [
				{ label: "Percent + USD per Unit", value: "PERCENT+USD_PER_UNIT" },
				{ label: "Percent + SGD per Unit", value: "PERCENT+SGD_PER_UNIT" },
			];
		default:
			return [];
	}
};

const FormSchema = z
	.object({
		origin: z.string().length(2, "Please select an origin country"),
		dest: z.string().length(2, "Please select a destination country"),
		hs: z
			.string()
			.max(10, "HS code must be at most 10 characters")
			.min(1, "HS code is required"),
		type: z.enum(["ad_valorem", "specific", "compound"] as const),
		rate: z.number().nonnegative("Rate must be a positive number"),
		unit: z.string().min(1, "Unit is required"),
		validFrom: z.string().min(1, "Valid from date is required"),
		validTo: z.string().optional(),
		description: z
			.string()
			.max(500, "Description must be at most 500 characters")
			.optional(),
	})
	.refine(
		(data) => {
			// Cross-field validation for type and unit
			const validUnits = getUnitsForType(data.type).map((u) => u.value);
			return validUnits.includes(data.unit);
		},
		{
			message: "Invalid unit for selected rule type",
			path: ["unit"],
		}
	);

type FormData = z.infer<typeof FormSchema>;

export default function TariffRuleForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [productDetails, setProductDetails] = useState<{
    name: string;
    productType: string;
  } | null>(null);

  // Persist all form fields in a cookie so the page remembers inputs
  const FORM_COOKIE_KEY = "tariff_rule_form";

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      origin: "",
      dest: "",
      hs: "",
      type: "ad_valorem",
      rate: undefined,
      unit: "",
      validFrom: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  });

  // Hydrate form from cookie (if present)
  useEffect(() => {
    try {
      const raw = getCookie(FORM_COOKIE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        form.reset({
          origin: saved.origin ?? "",
          dest: saved.dest ?? "",
          hs: saved.hs ?? "",
          type: saved.type ?? "ad_valorem",
          rate: typeof saved.rate === "number" ? saved.rate : undefined,
          unit: saved.unit ?? "",
          validFrom: saved.validFrom ?? format(new Date(), "yyyy-MM-dd"),
          validTo: saved.validTo ?? undefined,
          description: saved.description ?? "",
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Watch form values and persist into cookie
  useEffect(() => {
    const sub = form.watch((value) => {
      try {
        setCookie(FORM_COOKIE_KEY, JSON.stringify(value));
      } catch {
        // ignore write errors
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

	const selectedType = form.watch("type");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(false);

		try {
			await api.post("/tariff-rules", {
				...data,
				validTo: data.validTo || null,
			});

      setSuccess(true);
      // Reset form after successful submission and clear the cookie
      form.reset();
      try { deleteCookie(FORM_COOKIE_KEY); } catch { /* ignore */ }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create tariff rule"
      );
    } finally {
      setLoading(false);
    }
  }

	return (
		<div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-6">Create New Tariff Rule</h2>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded">
					Tariff rule created successfully!
				</div>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						{/* Origin Country */}
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
										<SelectTrigger className="w-[inherit]">
											<SelectValue placeholder="Select origin country" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectGroup>
												<SelectLabel>Countries</SelectLabel>
												{countries.map((country) => (
													<SelectItem
														className="font-bold cursor-pointer hover:bg-indigo-100"
														key={country.value}
														value={country.value}
													>
														{country.label} ({country.value})
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Destination Country */}
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
										<SelectContent className="bg-white">
											<SelectGroup>
												<SelectLabel>Countries</SelectLabel>
												{countries.map((country) => (
													<SelectItem
														className="font-bold cursor-pointer hover:bg-indigo-100"
														key={country.value}
														value={country.value}
													>
														{country.label} ({country.value})
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* HS Code */}
					<FormField
						control={form.control}
						name="hs"
						render={({ field }) => (
							<FormItem>
								<FormLabel>HS Code</FormLabel>
								<FormControl>
									<div className="space-y-1">
										<Input
											placeholder="e.g., 8517.12"
											{...field}
											onBlur={async (e) => {
												const value = (e.target as HTMLInputElement)
													.value;
												setProductDetails(null);
												if (!value) {
													form.clearErrors("hs");
													return;
												}
												try {
													const product = await api.get<any>(
														`/products/by-hs/${encodeURIComponent(
															value
														)}`
													);
													if (product) {
														setProductDetails(product);
														form.clearErrors("hs");
													} else {
														form.setError("hs", {
															type: "manual",
															message:
																"HS code not found in products table",
														});
													}
												} catch (err) {
													console.log("Token:", getToken()); // Log the current token
													console.error("Error details:", err); // Log the full error
													form.setError("hs", {
														type: "manual",
														message:
															"HS code not found in products table",
													});
													setProductDetails(null);
												}
											}}
										/>
										{productDetails && (
											<div className="text-sm text-gray-600">
												Product: {productDetails.name}
												{productDetails.productType &&
													` (${productDetails.productType})`}
											</div>
										)}
									</div>
								</FormControl>
								<FormDescription>
									Enter the Harmonized System (HS) code for the product
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						{/* Rule Type */}
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rule Type</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											// Reset unit when type changes
											form.setValue("unit", "");
										}}
										value={field.value}
									>
										<SelectTrigger className="w-[inherit]">
											<SelectValue placeholder="Select rule type" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectGroup>
												{ruleTypes.map((type) => (
													<SelectItem
														className="font-bold cursor-pointer hover:bg-indigo-100"
														key={type.value}
														value={type.value}
													>
														{type.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Unit */}
						<FormField
							control={form.control}
							name="unit"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Unit</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger className="w-[inherit]">
											<SelectValue placeholder="Select unit" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectGroup>
												{getUnitsForType(selectedType).map(
													(unit) => (
														<SelectItem
															className="font-bold cursor-pointer hover:bg-indigo-100"
															key={unit.value}
															value={unit.value}
														>
															{unit.label}
														</SelectItem>
													)
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Rate */}
					<FormField
						control={form.control}
						name="rate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rate</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										min="0"
										placeholder="Enter rate"
										{...field}
										onChange={(e) => {
											const value =
												e.target.value === ""
													? ""
													: Number(e.target.value);
											field.onChange(value);
										}}
									/>
								</FormControl>
								<FormDescription>
									{selectedType === "ad_valorem"
										? "Enter percentage value (e.g., 5.0 for 5%)"
										: selectedType === "specific"
										? "Enter amount per unit"
										: "Enter percentage part of compound rate"}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						{/* Valid From */}
						<FormField
							control={form.control}
							name="validFrom"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Valid From</FormLabel>
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
													date < new Date("1900-01-01")
												}
												captionLayout="dropdown"
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Valid To (Optional) */}
						<FormField
							control={form.control}
							name="validTo"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Valid To (Optional)</FormLabel>
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
													date <
													new Date(
														form.getValues("validFrom") ||
															"1900-01-01"
													)
												}
												captionLayout="dropdown"
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description (Optional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter additional details about the tariff rule"
										className="min-h-[100px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full !bg-[#eddea4]"
						disabled={loading}
					>
						{loading ? "Creating..." : "Create Tariff Rule"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
