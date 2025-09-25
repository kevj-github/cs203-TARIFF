"use client";

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
import { CalendarForm } from "./CalendarForm";

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
  origin: z.string().min(1, "Please select origin."),
  destination: z.string().min(1, "Please select destination."),
  hsCode: z.string().min(4, "HS code must be at least 4 digits."),
  value: z.string().min(1, "Product value is required."),
});

export default function CalculatorPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { origin: "", destination: "", hsCode: "", value: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submitted:", data);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tariff Calculator</h1>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 md:grid-cols-2"
        >
          <Select>
            <SelectTrigger className="w-[inherit]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[inherit]">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[inherit]">
              <SelectValue placeholder="HS Code" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel className="font-bold">PC Components</SelectLabel>
                {pcComponents.map((pcComponent) => (
                  <SelectItem key={pcComponent.code} value={pcComponent.code}>
                    {pcComponent.name}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectGroup>
                <SelectLabel className="font-bold">
                  Consumer Electronics
                </SelectLabel>
                {consumerElectronics.map((consumerElectronics) => (
                  <SelectItem
                    key={consumerElectronics.code}
                    value={consumerElectronics.code}
                  >
                    {consumerElectronics.name}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectGroup>
                <SelectLabel className="font-bold">Power & Support</SelectLabel>
                {powerSupport.map((powerSupport) => (
                  <SelectItem key={powerSupport.code} value={powerSupport.code}>
                    {powerSupport.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Product value"
            title="Product value"
          />

          

          <div className="col-span-full flex justify-end">
            <Button type="submit">Calculate</Button>
          </div>
        </form>
      </Form> */}

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
                <FormLabel>Origin</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[inherit]">
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {countries.map((c) => (
                        <SelectItem
                          className="font-bold"
                          key={c.value}
                          value={c.value}
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Destination */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[inherit]">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {countries.map((c) => (
                        <SelectItem
                          className="font-bold"
                          key={c.value}
                          value={c.value}
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* HS Code */}
          <FormField
            control={form.control}
            name="hsCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HS Code</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[inherit]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>PC Components</SelectLabel>
                      {pcComponents.map((item) => (
                        <SelectItem
                          className="font-bold"
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
                          className="font-bold"
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
                          className="font-bold"
                          key={item.code}
                          value={item.code}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Value (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CalendarForm />
          {/* Submit */}
          <div className="col-span-full flex justify-end">
            <Button type="submit">Calculate</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
