"use client";

import { format } from "date-fns";
import "react-day-picker/style.css";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
import { useState } from "react";
import { CalculationResultCard } from "./CalculationResultCard";

const countries = [
  { label: "Singapore", value: "SG" },
  { label: "United States", value: "US" },
  { label: "China", value: "CN" },
  { label: "Japan", value: "JP" },
  { label: "Germany", value: "DE" },
  { label: "Indonesia", value: "ID" },
] as const;

// PC Components
const pcComponents = [
  { code: "8473.30", name: "Solid State Drives (SSD)" },
  { code: "8471.70", name: "Hard Disk Drives (HDD)" },
  { code: "8473.50", name: "RAM Modules" },
  { code: "8471.50", name: "CPUs" },
  { code: "8471.60", name: "GPUs" },
];

// Consumer Electronics
const consumerElectronics = [
  { code: "8517.12", name: "Mobile Phones" },
  { code: "8471.30", name: "Laptops" },
  { code: "8471.41", name: "Tablets" },
  { code: "8528.72", name: "Televisions (LCD/LED)" },
  { code: "8528.59", name: "Computer Monitors" },
];

// Power & Support
const powerSupport = [
  { code: "8504.40", name: "Power Supply Units" },
  { code: "8473.20", name: "Motherboards" },
];

const FormSchema = z.object({
  origin: z.string().min(1, "Please select origin country."),
  dest: z.string().min(1, "Please select destination country."),
  hs: z.string().min(1, "Please select a product category."),
  customsValue: z.string().min(1, "Product value is required."),
  quantity: z.string().min(1, "Quantity is required."),
  // on: z.date().min(1, "Please select import date."),
  on: z.string().min(1, "Please select import date."),
});

export default function CalculatorPage() {
  const [result, setResult] = useState<any | null>(null); // store backend result
  const [loading, setLoading] = useState(false);

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      setResult(null);

      const payload = {
        origin: data.origin,
        dest: data.dest,
        hs: data.hs,
        on: data.on, // YYYY-MM-DD
        customsValue: Number(data.customsValue),
        quantity: Number(data.quantity),

        // customsValue: data.customsValue,
        // quantity: data.quantity,
      };

      const response = await fetch("http://localhost:8080/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      // console.log("Backend result:", result);
      setResult(result);
      // Show results on screen
      // alert(
      //   `Base Duty: ${result.baseDuty}\nTotal: ${result.total}\nRule: ${result.ruleApplied}`
      // );
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to fetch tariff calculation" });
      // alert("Failed to fetch tariff calculation");
    } finally {
      setLoading(false);
    }
  }

  return (
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[inherit]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>PC Components</SelectLabel>
                      {pcComponents.map((item) => (
                        <SelectItem
                          className="font-bold cursor-pointer hover:bg-indigo-100"
                          key={item.code}
                          value={item.code}
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
                          key={item.code}
                          value={item.code}
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
                          key={item.code}
                          value={item.code}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
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
                          !field.value && "text-muted-foreground"
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
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
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
                    {...field}
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
                    placeholder="1000"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="col-span-full flex justify-end">
            <Button type="submit" className="!bg-[#eddea4]" disabled={loading}>
              {loading ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Display Result */}
      {result && (
        <CalculationResultCard
          baseDuty={result.baseDuty}
          total={result.total}
          ruleApplied={result.ruleApplied}
          error={result.error}
        />
      )}
    </div>
  );
}
