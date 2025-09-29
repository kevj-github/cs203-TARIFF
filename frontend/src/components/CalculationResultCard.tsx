"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "framer-motion";

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
    <>
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
            //without animation
            // <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            //   {/* Base Duty */}
            //   <Card className="bg-blue-50 shadow-md rounded-xl flex flex-col justify-between">
            //     <CardHeader>
            //       <CardTitle>Base Duty</CardTitle>
            //       <CardDescription>
            //         The initial customs duty calculated from the product’s
            //         customs value, HS code, and standard tariff rate.
            //       </CardDescription>
            //     </CardHeader>
            //     <CardContent>
            //       <p className="text-xl font-bold text-blue-800 text-right">
            //         {baseDuty}
            //       </p>
            //     </CardContent>
            //   </Card>

            //   {/* Total */}
            //   <Card className="bg-green-50 shadow-md rounded-xl flex flex-col justify-between">
            //     <CardHeader>
            //       <CardTitle>Total</CardTitle>
            //       <CardDescription>
            //         The final payable amount after adding base duty, surcharges,
            //         taxes, and adjustments.
            //       </CardDescription>
            //     </CardHeader>
            //     <CardContent>
            //       <p className="text-xl font-bold text-green-800 text-right">
            //         {total}
            //       </p>
            //     </CardContent>
            //   </Card>

            //   {/* Rules Applied */}
            //   <Card className="bg-yellow-50 shadow-md rounded-xl flex flex-col justify-between">
            //     <CardHeader>
            //       <CardTitle>Rules Applied</CardTitle>
            //       <CardDescription>
            //         Trade agreements, exemptions, or tariff rules that affected
            //         this calculation.
            //       </CardDescription>
            //     </CardHeader>
            //     <CardContent>
            //       <p className="text-xl font-bold text-yellow-800 text-right">
            //         {ruleApplied}
            //       </p>
            //     </CardContent>
            //   </Card>
            // </div>

            //with animation
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Base Duty */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-full"
              >
                <Card className="bg-blue-50 shadow-md rounded-xl flex flex-col justify-between h-full">
                  <CardHeader>
                    <CardTitle className="font-bold">Base Duty</CardTitle>
                    <CardDescription>
                      The initial customs duty calculated from the product’s
                      customs value, HS code, and standard tariff rate.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-blue-800 text-right">
                      {baseDuty} USD
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-full"
              >
                <Card className="bg-green-50 shadow-md rounded-xl flex flex-col justify-between h-full">
                  <CardHeader>
                    <CardTitle className="font-bold">Total</CardTitle>
                    <CardDescription>
                      The final payable amount after adding base duty,
                      surcharges, taxes, and adjustments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-green-800 text-right">
                      {total} USD
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rules Applied */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="h-full"
              >
                <Card className="bg-yellow-50 shadow-md rounded-xl flex flex-col justify-between h-full">
                  <CardHeader>
                    <CardTitle className="font-bold">Rules Applied</CardTitle>
                    <CardDescription>
                      Trade agreements, exemptions, or tariff rules that
                      affected this calculation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-yellow-800 text-right">
                      {ruleApplied}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
