import { useState } from "react";
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface CalculationResult {
  lineNumber: number;
  productId: number;
  productName: string;
  hsCode: string;
  originCountry: string;
  destCountry: string;
  quantity: number;
  customsValuePerUnit: number;
  customsValueTotal: number;
  ruleType: string;
  rateValue: number;
  rateUnit: string;
  tariffAmount: number;
  totalWithTariff: number;
  success: boolean;
  errorMessage?: string;
}

interface BulkResponse {
  success: boolean;
  itemCount: number;
  successfulCalculations: number;
  failedCalculations: number;
  summary: {
    totalCustomsValue: number;
    totalTariff: number;
    grandTotal: number;
  };
  calculations: CalculationResult[];
}

export function CsvBulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await api.postForm<BulkResponse>("/csv/calculate", formData);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = `productId,originCountry,destCountry,quantity,customsValue
1,CN,US,100,500.00
2,SG,US,50,1200.00
3,DE,US,75,800.00
1,GB,US,200,450.00
5,CN,US,150,300.00`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_tariff_calculation.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Bulk Tariff Calculation
          </CardTitle>
          <CardDescription>
            Upload a CSV file to calculate tariffs for multiple products at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <Upload className="h-5 w-5" />
                  <span>{file ? file.name : "Choose CSV File"}</span>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                size="lg"
                className="bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                {loading ? "Processing..." : "Calculate Tariffs"}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={downloadSampleCsv}
              className="w-fit"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </Button>
          </div>

          {/* CSV Format Instructions */}
          <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-yellow-700 mt-1" />
            <div className="text-sm text-yellow-900">
              <strong>CSV Format:</strong> productId, originCountry,
              destCountry, quantity, customsValue
              <br />
              <strong>Example:</strong> 1,CN,US,100,500.00
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 rounded-md border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-1" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Calculation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{results.itemCount}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.successfulCalculations}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {results.failedCalculations}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.summary.grandTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Total Customs Value</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(results.summary.totalCustomsValue)}
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Total Tariff</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(results.summary.totalTariff)}
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {formatCurrency(results.summary.grandTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Per-item calculation breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Line</th>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Route</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Customs Value</th>
                      <th className="px-4 py-2 text-right">Tariff</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.calculations.map((calc, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          calc.success ? "" : "bg-red-50"
                        }`}
                      >
                        <td className="px-4 py-2">{calc.lineNumber}</td>
                        <td className="px-4 py-2">
                          {calc.success ? (
                            <>
                              <div className="font-medium">
                                {calc.productName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {calc.productId} | HS: {calc.hsCode}
                              </div>
                            </>
                          ) : (
                            <span className="text-red-600">
                              ID: {calc.productId}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {calc.originCountry} → {calc.destCountry}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {calc.quantity}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {calc.success
                            ? formatCurrency(calc.customsValueTotal)
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {calc.success
                            ? formatCurrency(calc.tariffAmount)
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {calc.success
                            ? formatCurrency(calc.totalWithTariff)
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          {calc.success ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Success
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                ✗ Failed
                              </span>
                              <p className="text-xs text-red-600 mt-1">
                                {calc.errorMessage}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
