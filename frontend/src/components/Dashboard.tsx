import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Calculator,
  Search,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Flag,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  hsCode: string;
  name: string;
  productType: string;
}

interface TariffRule {
  id: number;
  origin: string;
  dest: string;
  hs: string;
  type: string;
  rate: number;
  unit: string;
  validFrom: string;
  validTo?: string;
}

interface Country {
  id: number;
  iso2: string;
  name: string;
}

// FIXED: Added proper ApiResponse interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const countries: Country[] = [
  { id: 1, iso2: "SG", name: "Singapore" },
  { id: 2, iso2: "US", name: "United States" },
  { id: 3, iso2: "DE", name: "Germany" },
  { id: 4, iso2: "CN", name: "China" },
  { id: 5, iso2: "GB", name: "United Kingdom" },
  { id: 6, iso2: "ID", name: "Indonesia" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tariffRules, setTariffRules] = useState<TariffRule[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedDest, setSelectedDest] = useState<string>("all");

  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    console.log("🔍 DEBUG:", msg);
    setDebugInfo((prev) => [...prev, msg]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setDebugInfo([]);

      try {
        addDebug("Starting data fetch...");
        const today = new Date().toISOString().split("T")[0];
        addDebug(`Using date: ${today}`);

        // Test products endpoint
        addDebug("Fetching products from /api/products");
        const productsRes = await api.get("/products");
        addDebug(
          `Products response received: ${JSON.stringify(productsRes).substring(
            0,
            200
          )}`
        );

        // Test tariff rules endpoint
        addDebug(`Fetching tariff rules from /api/tariff-rules?on=${today}`);
        const tariffRes = await api.get(`/tariff-rules?on=${today}`);
        addDebug(
          `Tariff response received: ${JSON.stringify(tariffRes).substring(
            0,
            200
          )}`
        );

        // Try different data extraction methods
        let productsData: Product[] = [];
        let tariffData: TariffRule[] = [];

        // Method 1: Check if response has .data.data (ApiResponse wrapper)
        if (productsRes?.data?.data) {
          productsData = productsRes.data.data;
          addDebug(
            `✅ Products extracted via .data.data: ${productsData.length} items`
          );
        }
        // Method 2: Check if response.data is the array directly
        else if (Array.isArray(productsRes?.data)) {
          productsData = productsRes.data;
          addDebug(
            `✅ Products extracted via .data: ${productsData.length} items`
          );
        }
        // Method 3: Check if response is the array directly
        else if (Array.isArray(productsRes)) {
          productsData = productsRes;
          addDebug(
            `✅ Products extracted directly: ${productsData.length} items`
          );
        } else {
          addDebug(
            `❌ Could not extract products. Response type: ${typeof productsRes}`
          );
        }

        // Same for tariff rules
        if (tariffRes?.data?.data) {
          tariffData = tariffRes.data.data;
          addDebug(
            `✅ Tariff rules extracted via .data.data: ${tariffData.length} items`
          );
        } else if (Array.isArray(tariffRes?.data)) {
          tariffData = tariffRes.data;
          addDebug(
            `✅ Tariff rules extracted via .data: ${tariffData.length} items`
          );
        } else if (Array.isArray(tariffRes)) {
          tariffData = tariffRes;
          addDebug(
            `✅ Tariff rules extracted directly: ${tariffData.length} items`
          );
        } else {
          addDebug(
            `❌ Could not extract tariff rules. Response type: ${typeof tariffRes}`
          );
        }

        setProducts(productsData);
        setTariffRules(tariffData);

        addDebug(
          `✅ Final state - Products: ${productsData.length}, Tariff Rules: ${tariffData.length}`
        );
      } catch (err: any) {
        console.error("❌ Failed to load dashboard data:", err);
        const errorMessage =
          err.response?.data?.message || err.message || String(err);
        addDebug(`❌ ERROR: ${errorMessage}`);
        addDebug(`❌ Error details: ${JSON.stringify(err.response || err)}`);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // FIXED: Properly handle ApiResponse wrapper and add date parameter
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       // Get current date in ISO format (YYYY-MM-DD)
  //       const today = new Date().toISOString().split("T")[0];

  //       const [productsRes, tariffRes] = await Promise.all([
  //         api.get<ApiResponse<Product[]>>("/products"),
  //         // FIXED: Added 'on' parameter with today's date
  //         api.get<ApiResponse<TariffRule[]>>(`/tariff-rules?on=${today}`),
  //       ]);

  //       // FIXED: Extract data from ApiResponse wrapper
  //       const productsData = productsRes?.data?.data || [];
  //       const tariffData = tariffRes?.data?.data || [];

  //       setProducts(productsData);
  //       setTariffRules(tariffData);

  //       console.log("✅ Products loaded:", productsData.length);
  //       console.log("✅ Tariff rules loaded:", tariffData.length);
  //     } catch (err: any) {
  //       console.error("❌ Failed to load dashboard data:", err);
  //       const errorMessage =
  //         err.response?.data?.message || err.message || String(err);
  //       setError(errorMessage);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Calculate statistics for cards
  const stats = {
    totalProducts: products.length,
    activeRules: tariffRules.length,
    avgRate: tariffRules.length
      ? (
          tariffRules.reduce((sum, rule) => sum + rule.rate, 0) /
          tariffRules.length
        ).toFixed(1)
      : "0.0",
    maxRate: tariffRules.length
      ? Math.max(...tariffRules.map((rule) => rule.rate))
      : 0,
  };

  // Prepare chart data
  const productTypeData = products.reduce((acc: any[], product) => {
    const existingType = acc.find((p) => p.type === product.productType);
    if (existingType) {
      existingType.count++;
    } else {
      acc.push({ type: product.productType, count: 1 });
    }
    return acc;
  }, []);

  const ratesByCountryData = tariffRules.reduce((acc: any[], rule) => {
    const key = `${rule.origin}-${rule.dest}`;
    const existing = acc.find((item) => item.pair === key);
    if (existing) {
      existing.count++;
      existing.avgRate =
        (existing.avgRate * (existing.count - 1) + rule.rate) / existing.count;
    } else {
      acc.push({
        pair: key,
        count: 1,
        avgRate: rule.rate,
        from: rule.origin,
        to: rule.dest,
      });
    }
    return acc;
  }, []);

  const COLORS = [
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#6366f1",
  ];

  const StatCard = ({
    title,
    value,
    trend,
    change,
    icon: Icon,
  }: {
    title: string;
    value: string | number;
    trend?: "up" | "down";
    change?: string;
    icon: React.ElementType;
  }) => (
    <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-violet-50 rounded-lg">
          <Icon className="w-6 h-6 text-violet-600" />
        </div>
      </div>
    </Card>
  );

  const QuickActionCard = ({
    title,
    description,
    icon: Icon,
    onClick,
  }: {
    title: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
  }) => (
    <Card
      className="p-8 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-violet-50/50 to-violet-50/10 hover:from-violet-100/50 hover:to-violet-50/20 group relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="w-24 h-24 text-violet-900 transform rotate-12" />
      </div>
      <div className="relative space-y-4">
        <div className="p-3 bg-violet-100 rounded-xl w-fit group-hover:bg-violet-200 transition-colors">
          <Icon className="w-8 h-8 text-violet-700" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            {description}
          </p>
          <div className="inline-flex items-center text-violet-700 font-medium text-sm group-hover:text-violet-900">
            Get Started
            <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px] animate-pulse bg-violet-100" />
          <Skeleton className="h-8 w-[60px] animate-pulse bg-violet-100" />
          <Skeleton className="h-4 w-[80px] animate-pulse bg-violet-100" />
        </div>
        <div className="p-3 bg-violet-50 rounded-lg">
          <Skeleton className="h-6 w-6 rounded-lg animate-pulse bg-violet-200" />
        </div>
      </div>
    </Card>
  );

  const SkeletonChart = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <Skeleton className="h-6 w-[200px] animate-pulse bg-violet-100" />
        <Skeleton className="h-[300px] w-full animate-pulse bg-violet-100/50" />
      </div>
    </Card>
  );

  const SkeletonAction = () => (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-violet-50 rounded-lg">
          <Skeleton className="h-6 w-6 rounded-lg animate-pulse bg-violet-200" />
        </div>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-[140px] animate-pulse bg-violet-100" />
          <Skeleton className="h-4 w-full animate-pulse bg-violet-100" />
        </div>
      </div>
    </Card>
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-semibold">Error Loading Dashboard</h3>
          <p className="mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>

        {/* Debug Info Panel */}
        <div className="bg-gray-50 text-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🔍 Debug Information:</h3>
          <div className="text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
            {debugInfo.map((info, idx) => (
              <div key={idx}>{info}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <header className="bg-white border-b border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                TARIFF Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Trade Agreements Regulating Imports and Foreign Fees
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-[180px]">
                {isLoading ? (
                  <Skeleton className="h-9 w-full animate-pulse bg-violet-100 rounded-md" />
                ) : (
                  <Select
                    value={selectedOrigin || "all"}
                    onValueChange={(v) => setSelectedOrigin(v)}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>Origins</SelectLabel>
                        <SelectItem value="all">All Origins</SelectItem>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.iso2}
                            value={country.iso2}
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex-1 min-w-[180px]">
                {isLoading ? (
                  <Skeleton className="h-9 w-full animate-pulse bg-violet-100 rounded-md" />
                ) : (
                  <Select
                    value={selectedDest || "all"}
                    onValueChange={(v) => setSelectedDest(v)}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>Destinations</SelectLabel>
                        <SelectItem value="all">All Destinations</SelectItem>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.iso2}
                            value={country.iso2}
                            className="font-bold cursor-pointer hover:bg-indigo-100"
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Debug Panel - Only show if data is 0 */}
      {!isLoading && (products.length === 0 || tariffRules.length === 0) && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">
            ⚠️ Debug Information
          </h3>
          <div className="text-xs font-mono text-yellow-800 space-y-1 max-h-48 overflow-y-auto">
            {debugInfo.map((info, idx) => (
              <div key={idx}>{info}</div>
            ))}
          </div>
        </Card>
      )}

      <div className="px-6 pb-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <SkeletonAction />
              <SkeletonAction />
              <SkeletonAction />
            </>
          ) : (
            <>
              <QuickActionCard
                title="Calculate Tariff"
                description="Get instant duty calculations for your shipments"
                icon={Calculator}
                onClick={() => navigate("/calculator")}
              />
              <QuickActionCard
                title="Browse Products"
                description="Search and explore product categories and HS codes"
                icon={Search}
                onClick={() => navigate("/product")}
              />
              <QuickActionCard
                title="Simulation Mode"
                description="Model different scenarios and optimize your trade routes"
                icon={LineChartIcon}
                onClick={() => navigate("/calculator")}
              />
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                trend="up"
                change="+12% from last month"
              />
              <StatCard
                title="Active Tariff Rules"
                value={stats.activeRules}
                icon={Flag}
                trend="up"
                change="+5 new rules"
              />
              <StatCard
                title="Average Rate"
                value={`${stats.avgRate}%`}
                icon={TrendingUp}
                trend="down"
                change="-2.3% overall"
              />
              <StatCard
                title="Highest Rate"
                value={`${stats.maxRate}%`}
                icon={TrendingDown}
                trend="up"
                change="CN → US route"
              />
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Product Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productTypeData}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({ type }) => type as string}
                      >
                        {productTypeData.map((entry, index) => (
                          <Cell
                            key={entry.type}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [value, "Products"]}
                        contentStyle={{ borderRadius: "8px" }}
                      />
                      <Legend
                        formatter={(value) => (
                          <span className="text-sm">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Average Rates by Route
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratesByCountryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="pair"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}%`,
                          "Rate",
                        ]}
                        contentStyle={{ borderRadius: "8px" }}
                      />
                      <Bar
                        dataKey="avgRate"
                        fill="#8b5cf6"
                        name="Average Rate"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Data loaded from SQL database
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
