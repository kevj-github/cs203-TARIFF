"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalculationResultProps {
  baseDuty: number;
  total: number;
  ruleApplied: string;
  error?: string;
}

export function CalculationResultCard({
  baseDuty,
  total,
  ruleApplied,
  error,
}: CalculationResultProps) {
  return (
    <Card className="mt-6 border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Calculation Result
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-700">Base Duty:</span>{" "}
              <span className="text-blue-600">{baseDuty}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Total:</span>{" "}
              <span className="text-green-600 font-bold">{total}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Rule Applied:</span>{" "}
              <span className="italic">{ruleApplied}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
