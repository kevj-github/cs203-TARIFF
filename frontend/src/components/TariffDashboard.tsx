import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Package,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
} from "lucide-react";

const TariffDashboard = () => {
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedDest, setSelectedDest] = useState("all");
  const [selectedHsCode, setSelectedHsCode] = useState("all");

  // Actual data from SQL file
  const countries = [
    { id: 1, iso2: "SG", name: "Singapore" },
    { id: 2, iso2: "US", name: "United States" },
    { id: 3, iso2: "DE", name: "Germany" },
    { id: 4, iso2: "CN", name: "China" },
    { id: 5, iso2: "GB", name: "United Kingdom" },
    { id: 6, iso2: "ID", name: "Indonesia" },
  ];

  const products = [
    { id: 1, hs_code: "8517.12", name: "Smartphones", product_type: "PHONE" },
    {
      id: 2,
      hs_code: "8471.30",
      name: "Laptops/Portable computers",
      product_type: "LAPTOP",
    },
    {
      id: 3,
      hs_code: "8473.30",
      name: "CPU/Processors",
      product_type: "COMPONENT",
    },
    { id: 4, hs_code: "8473.40", name: "GPU", product_type: "COMPONENT" },
    { id: 5, hs_code: "8473.50", name: "RAM", product_type: "COMPONENT" },
    {
      id: 6,
      hs_code: "8471.70",
      name: "Hard Disk Drives (HDD)",
      product_type: "STORAGE",
    },
    {
      id: 8,
      hs_code: "8528.72",
      name: "Television Receivers - LCD/LED",
      product_type: "DISPLAY",
    },
    {
      id: 9,
      hs_code: "8528.59",
      name: "Computer Monitors",
      product_type: "DISPLAY",
    },
    {
      id: 10,
      hs_code: "8504.40",
      name: "Power Supply Units",
      product_type: "COMPONENT",
    },
    {
      id: 11,
      hs_code: "8473.30",
      name: "Motherboards/System Boards",
      product_type: "COMPONENT",
    },
    {
      id: 12,
      hs_code: "8507.60",
      name: "Lithium-ion Batteries",
      product_type: "BATTERY",
    },
    {
      id: 13,
      hs_code: "8542.31",
      name: "Semiconductors/Processors",
      product_type: "COMPONENT",
    },
    {
      id: 14,
      hs_code: "8471.80",
      name: "Computer Units - Other",
      product_type: "COMPUTER",
    },
    {
      id: 15,
      hs_code: "8517.13",
      name: "Satellite Communication Equipment",
      product_type: "COMMUNICATION",
    },
    {
      id: 16,
      hs_code: "8471.41",
      name: "Data Processing Machines - Digital",
      product_type: "COMPUTER",
    },
    {
      id: 17,
      hs_code: "8471.49",
      name: "Data Processing Machines - Other",
      product_type: "COMPUTER",
    },
    {
      id: 18,
      hs_code: "8471.50",
      name: "Digital Processing Units",
      product_type: "COMPUTER",
    },
    {
      id: 19,
      hs_code: "8471.60",
      name: "Input/Output Units",
      product_type: "COMPUTER",
    },
    {
      id: 20,
      hs_code: "8528.52",
      name: "Television Receivers - CRT",
      product_type: "DISPLAY",
    },
    {
      id: 21,
      hs_code: "8528.73",
      name: "Television Receivers - Other",
      product_type: "DISPLAY",
    },
    {
      id: 22,
      hs_code: "9013.80",
      name: "Optical Devices - Other",
      product_type: "OPTICAL",
    },
    {
      id: 23,
      hs_code: "8542.32",
      name: "Electronic Integrated Circuits - Memories",
      product_type: "COMPONENT",
    },
    {
      id: 24,
      hs_code: "8542.33",
      name: "Electronic Integrated Circuits - Amplifiers",
      product_type: "COMPONENT",
    },
    {
      id: 25,
      hs_code: "8544.42",
      name: "Electric Conductors - Fitted with Connectors",
      product_type: "CABLE",
    },
    {
      id: 26,
      hs_code: "8544.49",
      name: "Electric Conductors - Other",
      product_type: "CABLE",
    },
    {
      id: 27,
      hs_code: "8507.80",
      name: "Lithium Batteries - Other",
      product_type: "BATTERY",
    },
    {
      id: 28,
      hs_code: "3801.20",
      name: "Colloidal/Semi-colloidal Graphite",
      product_type: "CHEMICAL",
    },
  ];

  const indirectTaxRules = [
    {
      id: 1,
      country_iso2: "SG",
      tax_type: "GST",
      rate_value: 9.0,
      rate_unit: "%",
    },
    {
      id: 2,
      country_iso2: "US",
      tax_type: "HTS",
      rate_value: 10.0,
      rate_unit: "%",
    },
    {
      id: 3,
      country_iso2: "DE",
      tax_type: "VAT",
      rate_value: 19.0,
      rate_unit: "%",
    },
    {
      id: 4,
      country_iso2: "CN",
      tax_type: "GST",
      rate_value: 13.0,
      rate_unit: "%",
    },
    {
      id: 5,
      country_iso2: "GB",
      tax_type: "VAT",
      rate_value: 20.0,
      rate_unit: "%",
    },
    {
      id: 6,
      country_iso2: "ID",
      tax_type: "PPN",
      rate_value: 12.0,
      rate_unit: "%",
    },
  ];

  // Key tariff rules from SQL data
  const tariffRules = [
    // Highest rates (CN to US)
    {
      id: 34,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8507.80",
      rate_value: 173.4,
      valid_from: "2025-04-09",
    },
    {
      id: 15,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8471.41",
      rate_value: 125.0,
      valid_from: "2025-04-09",
    },
    {
      id: 16,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8471.49",
      rate_value: 125.0,
      valid_from: "2025-04-09",
    },
    {
      id: 28,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8542.32",
      rate_value: 125.0,
      valid_from: "2025-04-09",
    },
    {
      id: 29,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8542.33",
      rate_value: 125.0,
      valid_from: "2025-04-09",
    },
    {
      id: 35,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "3801.20",
      rate_value: 93.5,
      valid_from: "2025-07-17",
    },
    {
      id: 33,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8507.60",
      rate_value: 54.0,
      valid_from: "2025-01-01",
    },
    {
      id: 30,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8544.42",
      rate_value: 50.0,
      valid_from: "2025-07-30",
    },
    {
      id: 31,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8544.49",
      rate_value: 50.0,
      valid_from: "2025-07-30",
    },
    {
      id: 27,
      origin_iso2: "CN",
      dest_iso2: "US",
      hs_code: "8542.31",
      rate_value: 50.0,
      valid_from: "2025-01-01",
    },

    // Other significant rates
    {
      id: 37,
      origin_iso2: "US",
      dest_iso2: "CN",
      hs_code: "8517.12",
      rate_value: 25.0,
      valid_from: "2025-04-09",
    },
    {
      id: 39,
      origin_iso2: "US",
      dest_iso2: "CN",
      hs_code: "8471.41",
      rate_value: 25.0,
      valid_from: "2025-04-09",
    },
    {
      id: 40,
      origin_iso2: "US",
      dest_iso2: "CN",
      hs_code: "8471.49",
      rate_value: 25.0,
      valid_from: "2025-04-09",
    },
    {
      id: 46,
      origin_iso2: "US",
      dest_iso2: "CN",
      hs_code: "8507.60",
      rate_value: 25.0,
      valid_from: "2025-01-01",
    },
    {
      id: 48,
      origin_iso2: "US",
      dest_iso2: "CN",
      hs_code: "8542.32",
      rate_value: 25.0,
      valid_from: "2025-04-09",
    },

    // Zero rates (various routes)
    {
      id: 2,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8471.30",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
    {
      id: 3,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8473.30",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
    {
      id: 7,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8528.59",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
    {
      id: 8,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8471.70",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
    {
      id: 9,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8504.40",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
    {
      id: 11,
      origin_iso2: "SG",
      dest_iso2: "US",
      hs_code: "8542.31",
      rate_value: 0.0,
      valid_from: "2025-01-01",
    },
  ];

  const getCountryName = (iso2: string) => {
    const country = countries.find((c) => c.iso2 === iso2);
    return country ? country.name : iso2;
  };

  const getProductName = (hsCode: string) => {
    const product = products.find((p) => p.hs_code === hsCode);
    return product ? product.name : hsCode;
  };

  const getProductType = (hsCode: string) => {
    const product = products.find((p) => p.hs_code === hsCode);
    return product ? product.product_type : "UNKNOWN";
  };

  // Calculate statistics from actual data
  const productTypeStats = useMemo(() => {
    const typeCount: Record<string, number> = {};
    products.forEach((product) => {
      typeCount[product.product_type] =
        (typeCount[product.product_type] || 0) + 1;
    });
    return Object.entries(typeCount).map(([type, count]) => ({
      product_type: type,
      count: count,
    }));
  }, []);

  const highestTariffRoutes = useMemo(() => {
    return tariffRules
      .filter((rule) => rule.rate_value > 0)
      .sort((a, b) => b.rate_value - a.rate_value)
      .slice(0, 15)
      .map((rule) => ({
        ...rule,
        origin_name: getCountryName(rule.origin_iso2),
        dest_name: getCountryName(rule.dest_iso2),
        product_name: getProductName(rule.hs_code),
        product_type: getProductType(rule.hs_code),
      }));
  }, []);

  const tariffByCountryPair = useMemo(() => {
    const pairStats: Record<string, any> = {};
    tariffRules.forEach((rule) => {
      const pairKey = `${rule.origin_iso2}-${rule.dest_iso2}`;
      if (!pairStats[pairKey]) {
        pairStats[pairKey] = {
          origin: rule.origin_iso2,
          dest: rule.dest_iso2,
          origin_name: getCountryName(rule.origin_iso2),
          dest_name: getCountryName(rule.dest_iso2),
          pair_label: `${rule.origin_iso2}-${rule.dest_iso2}`,
          rates: [],
          avg_rate: 0,
          max_rate: 0,
          min_rate: Infinity,
        };
      }
      pairStats[pairKey].rates.push(rule.rate_value);
      pairStats[pairKey].max_rate = Math.max(
        pairStats[pairKey].max_rate,
        rule.rate_value
      );
      pairStats[pairKey].min_rate = Math.min(
        pairStats[pairKey].min_rate,
        rule.rate_value
      );
    });

    Object.values(pairStats).forEach((pair) => {
      pair.avg_rate =
        pair.rates.reduce((sum: number, rate: number) => sum + rate, 0) /
        pair.rates.length;
      if (pair.min_rate === Infinity) pair.min_rate = 0;
    });

    return Object.values(pairStats).sort(
      (a: any, b: any) => b.avg_rate - a.avg_rate
    );
  }, [tariffRules]);

  const filteredTariffRules = useMemo(() => {
    return tariffRules.filter(
      (rule) =>
        (selectedOrigin === "all" || rule.origin_iso2 === selectedOrigin) &&
        (selectedDest === "all" || rule.dest_iso2 === selectedDest) &&
        (selectedHsCode === "all" || rule.hs_code === selectedHsCode)
    );
  }, [selectedOrigin, selectedDest, selectedHsCode, tariffRules]);

  const COLORS = [
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#6366f1",
  ];

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    trend?: "up" | "down";
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                TARIFF Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Trade Agreements Regulating Imports and Foreign Fees
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                >
                  <option value="all">All Origins</option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                >
                  <option value="all">All Destinations</option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={selectedHsCode}
                  onChange={(e) => setSelectedHsCode(e.target.value)}
                >
                  <option value="all">All HS Codes</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.hs_code}>
                      {product.hs_code} - {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Countries" value={countries.length} icon={Globe} />
          <StatCard title="HS Codes" value={products.length} icon={Package} />
          <StatCard
            title="Tariff Rules"
            value={tariffRules.length}
            icon={DollarSign}
          />
          <StatCard
            title="Max Tariff Rate"
            value="173.4%"
            icon={AlertTriangle}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Categories Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product_type, count }) =>
                    `${product_type} (${count})`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {productTypeStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tariff Rates by Country Pair */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Average Tariff by Country Pair
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={tariffByCountryPair.slice(0, 8)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="pair_label"
                  width={60}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    "Avg Rate",
                  ]}
                />
                <Bar dataKey="avg_rate" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indirect Tax Rates and High Tariff Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Indirect Tax Rates by Country */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Indirect Tax Rates
            </h3>
            <div className="space-y-4">
              {indirectTaxRules.map((tax, index) => (
                <div key={tax.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getCountryName(tax.country_iso2)}
                      </p>
                      <p className="text-xs text-gray-500">{tax.tax_type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {tax.rate_value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highest Tariff Routes */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Highest Tariff Routes
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {highestTariffRoutes.slice(0, 10).map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {rule.origin_iso2} → {rule.dest_iso2}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {rule.hs_code}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {rule.product_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Valid from: {rule.valid_from}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {rule.rate_value}%
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        rule.rate_value > 100
                          ? "bg-red-100 text-red-800"
                          : rule.rate_value > 50
                          ? "bg-orange-100 text-orange-800"
                          : rule.rate_value > 20
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {rule.rate_value > 100
                        ? "Extreme"
                        : rule.rate_value > 50
                        ? "Very High"
                        : rule.rate_value > 20
                        ? "High"
                        : "Moderate"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Tariff Rules Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tariff Rules ({filteredTariffRules.length} rules)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HS Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid From
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTariffRules.slice(0, 20).map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rule.origin_iso2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule.dest_iso2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rule.hs_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getProductName(rule.hs_code)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {rule.rate_value}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule.valid_from}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTariffRules.length > 20 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Showing first 20 of {filteredTariffRules.length} results
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Data loaded from SQL database
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {countries.length} countries, {products.length} products,{" "}
                {tariffRules.length} tariff rules, {indirectTaxRules.length} tax
                rules
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
    </div>
  );
};

export default TariffDashboard;
