import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { CalendarIcon, FilterIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Country {
  id: number;
  iso2: string;
  name: string;
}

interface Product {
  id: number;
  hsCode: string;
  name: string;
  productType: string;
}

interface DashboardFiltersProps {
  isLoading: boolean;
  countries: Country[];
  products: Product[];
  groupedProducts: Record<string, Product[]>;
  selectedOrigin: string;
  selectedDest: string;
  selectedHS: string;
  selectedDate: string;
  onOriginChange: (value: string) => void;
  onDestChange: (value: string) => void;
  onHSChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export function DashboardFilters({
  isLoading,
  countries,
  products,
  groupedProducts,
  selectedOrigin,
  selectedDest,
  selectedHS,
  selectedDate,
  onOriginChange,
  onDestChange,
  onHSChange,
  onDateChange,
}: DashboardFiltersProps) {
  return (
    <Card className="p-3 border-dashed bg-white/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-violet-600" />
          <h3 className="font-medium text-sm text-violet-600">Quick Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <InfoIcon className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs text-muted-foreground">
            Filter tariff data by location and time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Origin */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-500">From</Label>
          {isLoading ? (
            <Skeleton className="h-8 w-full animate-pulse bg-violet-100 rounded-md" />
          ) : (
            <Select value={selectedOrigin} onValueChange={onOriginChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                <SelectGroup>
                  <SelectItem value="all">All Origins</SelectItem>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.iso2}
                      value={country.iso2}
                      className="cursor-pointer hover:bg-violet-50 text-sm"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-500">To</Label>
          {isLoading ? (
            <Skeleton className="h-8 w-full animate-pulse bg-violet-100 rounded-md" />
          ) : (
            <Select value={selectedDest} onValueChange={onDestChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                <SelectGroup>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.iso2}
                      value={country.iso2}
                      className="cursor-pointer hover:bg-violet-50 text-sm"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Product */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-500">Product</Label>
          {isLoading ? (
            <Skeleton className="h-8 w-full animate-pulse bg-violet-100 rounded-md" />
          ) : (
            <Select value={selectedHS} onValueChange={onHSChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                {selectedHS && selectedHS !== "all"
                  ? products.find((p) => p.hsCode === selectedHS)?.name
                  : "All Products"}
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                <SelectGroup>
                  <SelectItem
                    value="all"
                    className="text-sm text-gray-600 hover:bg-violet-50"
                  >
                    All Products
                  </SelectItem>
                </SelectGroup>
                {Object.entries(groupedProducts).map(([category, items]) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-xs font-semibold text-violet-600">
                      {category}
                    </SelectLabel>
                    {items
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.hsCode}
                          className="cursor-pointer hover:bg-violet-50 text-sm"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Date */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-500">Date</Label>
          {isLoading ? (
            <Skeleton className="h-8 w-full animate-pulse bg-violet-100 rounded-md" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-8 justify-start text-left font-normal text-sm",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
                  {selectedDate ? (
                    format(new Date(selectedDate), "MMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) =>
                    date && onDateChange(format(date, "yyyy-MM-dd"))
                  }
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </Card>
  );
}
