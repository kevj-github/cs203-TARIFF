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

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: SavedCalculation[] | null = null;
      try {
        data = await api.get<SavedCalculation[]>("/calculations");
      } catch (err: any) {
        // If forbidden, try alternate endpoints
        if (err?.message?.includes("permission")) {
          try {
            data = await api.get<SavedCalculation[]>("/calculations/me");
          } catch {}
          if (!data) {
            try {
              data = await api.get<SavedCalculation[]>("/calculations/user");
            } catch {}
          }
        }
        if (!data) throw err;
      }
      setItems(data || []);
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
                      <td className="p-2 align-top">{it.notes || "-"}</td>
                      <td className="p-2 align-top">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => alert(JSON.stringify(it, null, 2))}>
                            View
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(it.id)}>
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
