import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SavedCalculation } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function HistoryPage() {
  const [items, setItems] = useState<SavedCalculation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Raw shape returned by backend (/api/calculations)
  type RawCalculation = {
    id?: number;
    hsCode?: string;
    originIso2?: string;
    destIso2?: string;
    declaredValuePerUnit?: number;
    declaredValuePerUnitUsd?: number | string;
    quantity?: number;
    baseDuty?: number;
    total?: number;
    ruleApplied?: string;
    indirectTax?: number;
    calculatedAt?: string;
    calcDate?: string; // yyyy-MM-dd
    notes?: string;
    user?: { id?: number } | null;
    isSimulation?: boolean;
  };

  const mapFromRaw = (d: RawCalculation): SavedCalculation => {
    const customsValueNum = (() => {
      const v = d.declaredValuePerUnitUsd ?? d.declaredValuePerUnit ?? 0;
      return typeof v === "string" ? Number(v) : Number(v || 0);
    })();
    const calcAtIso = d.calculatedAt
      ? d.calculatedAt
      : d.calcDate
      ? `${d.calcDate}T00:00:00Z`
      : new Date().toISOString();
    return {
      id: d.id,
      userId: d.user?.id ?? 0,
      origin: d.originIso2 || "",
      dest: d.destIso2 || "",
      hs: d.hsCode || "",
      customsValue: customsValueNum,
      quantity: Number(d.quantity || 0),
      baseDuty: Number(d.baseDuty || 0),
      total: Number(d.total || 0),
      ruleApplied: d.ruleApplied || "",
      indirectTax: Number(d.indirectTax || 0),
      calculatedAt: calcAtIso,
      notes: d.notes || undefined,
      isSimulation: d.isSimulation ?? false,
    };
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      let raw: RawCalculation[] | null = null;
      try {
        raw = await api.get<RawCalculation[]>("/calculations");
      } catch (err: any) {
        // If forbidden, try alternate endpoints
        if (err?.message?.includes("permission")) {
          try {
            raw = await api.get<RawCalculation[]>("/calculations/me");
          } catch {}
          if (!raw) {
            try {
              raw = await api.get<RawCalculation[]>("/calculations/user");
            } catch {}
          }
        }
        if (!raw) throw err;
      }
      const mapped = (raw || []).map(mapFromRaw);
      setItems(mapped);
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setError(err?.message || "Failed to load saved calculations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this saved calculation?")) return;
    try {
      await api.delete(`/calculations/${id}`);
      // refresh
      await fetchHistory();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Saved Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading...</div>}
          {error && (
            <div className="text-red-600">
              {error}
              {error.includes("permission") && (
                <div className="mt-2 text-sm text-gray-600">
                  If you believe this is a mistake, please contact support or your admin.<br />
                  <span className="underline cursor-pointer" onClick={() => window.location.href = '/profile'}>Go to Profile</span>
                </div>
              )}
            </div>
          )}
          {!loading && items && items.length === 0 && (
            <div>No saved calculations yet.</div>
          )}

          {!loading && items && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Origin</th>
                    <th className="p-2">Dest</th>
                    <th className="p-2">HS</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Duty</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Sim</th>
                    <th className="p-2">Notes</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-2 align-top">{format(new Date(it.calculatedAt), "PPP p")}</td>
                      <td className="p-2 align-top">{it.origin}</td>
                      <td className="p-2 align-top">{it.dest}</td>
                      <td className="p-2 align-top">{it.hs}</td>
                      <td className="p-2 align-top">{it.customsValue}</td>
                      <td className="p-2 align-top">{it.quantity}</td>
                      <td className="p-2 align-top">{it.baseDuty}</td>
                      <td className="p-2 align-top">{it.total}</td>
                      <td className="p-2 align-top">{it.isSimulation ? "Yes" : "No"}</td>
                      <td className="p-2 align-top">{it.notes || "-"}</td>
                      <td className="p-2 align-top">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleDelete(it.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
