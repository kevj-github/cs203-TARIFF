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
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
interface CalculationResultProps {
  baseDuty: number;
  total: number;
  ruleApplied: string;
  error?: string;
  customsValue?: number;
  quantity?: number;
  indirectTax?: number;
  origin?: string;
  dest?: string;
  hs?: string;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

export function CalculationResultCard({
  baseDuty,
  total,
  ruleApplied,
  error,
  customsValue = 0,
  quantity = 1,
  indirectTax = 0,
  origin,
  dest,
  hs,
}: CalculationResultProps & { origin?: string; dest?: string; hs?: string }) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const toast = useToast();

  const saveCalculation = async (notesToSave: string) => {
    const payload = {
      origin,
      dest,
      hs,
      // also include server-expected field names to avoid mapping issues
      hsCode: hs,
      originIso2: origin,
      destIso2: dest,
      declaredValuePerUnit: customsValue,
      quantity,
      baseDuty,
      total,
      ruleApplied,
      indirectTax: indirectTax || 0,
      calculatedAt: new Date().toISOString(),
      notes: notesToSave?.trim() || undefined
    };
    console.debug("Saving calculation payload:", payload);
    return api.post("/calculations/save", payload);
  };
  

  // Extract rate from ruleApplied string if it's ad valorem
  const extractRate = (rule: string) => {
    const match = rule.match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) : null;
  };

  const rate = extractRate(ruleApplied);
  const isAdValorem = ruleApplied.toLowerCase().includes("ad valorem");
  const isSpecific = ruleApplied.toLowerCase().includes("specific");
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

        {/* Calculation Breakdown Section */}
        {!error && (
          <>
            <button
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
              className="w-full px-6 py-3 flex items-center justify-between text-left border-t border-gray-200 hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-600">
                View Calculation Details
              </span>
              {isBreakdownOpen ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>

            {isBreakdownOpen && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-6">
                {/* Calculation Steps */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Calculation Steps</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-3 mt-0.5">1</span>
                      <div>
                        <p className="font-medium">Input Values</p>
                        <div className="mt-1 text-gray-600 space-y-1">
                          <p>• Customs Value (per unit): {customsValue} USD</p>
                          <p>• Quantity: {quantity} units</p>
                          <p>• Total Value: {customsValue * quantity} USD</p>
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-3 mt-0.5">2</span>
                      <div>
                        <p className="font-medium">Applied Rule</p>
                        <p className="mt-1 text-gray-600">{ruleApplied}</p>
                        {isAdValorem && rate !== null && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <p className="text-gray-600">
                              Ad Valorem Rate: {rate}% of customs value
                            </p>
                            <p className="text-gray-500 mt-1">
                              Formula: (Customs Value × Quantity) × Rate%
                            </p>
                            <p className="text-gray-500">
                              = ({customsValue} × {quantity}) × {rate}%
                            </p>
                            <p className="text-gray-500">
                              = {customsValue * quantity} × {rate}%
                            </p>
                            <p className="text-gray-500">
                              = {baseDuty} USD
                            </p>
                          </div>
                        )}
                        {isSpecific && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <p className="text-gray-600">
                              Specific Rate: Fixed amount per unit
                            </p>
                            <p className="text-gray-500 mt-1">
                              Formula: Rate per unit × Quantity
                            </p>
                            <p className="text-gray-500">
                              = {(baseDuty / quantity).toFixed(2)} × {quantity}
                            </p>
                            <p className="text-gray-500">
                              = {baseDuty} USD
                            </p>
                          </div>
                        )}
                      </div>
                    </li>

                    {indirectTax > 0 && (
                      <li className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-3 mt-0.5">3</span>
                        <div>
                          <p className="font-medium">Indirect Tax (e.g., GST/VAT)</p>
                          <p className="mt-1 text-gray-600">Amount: {indirectTax} USD</p>
                        </div>
                      </li>
                    )}

                    <li className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-medium mr-3 mt-0.5">
                        {indirectTax > 0 ? "4" : "3"}
                      </span>
                      <div>
                        <p className="font-medium">Total Amount Due</p>
                        <div className="mt-1 text-gray-600">
                          <p>Base Value: {customsValue * quantity} USD</p>
                          <p>+ Duty: {baseDuty} USD</p>
                          {indirectTax > 0 && <p>+ Indirect Tax: {indirectTax} USD</p>}
                          <p className="mt-2 font-medium text-green-600">
                            = Total: {total} USD
                          </p>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </>
        )}

  {/* Save Button and Dialog */}
  {!error && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
                  disabled={isSaving}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {isSaving ? "Saving..." : "Save Calculation"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-2 border-gray-100 shadow-lg">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="text-lg font-semibold">Save Calculation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Add Notes (Optional)</Label>
                    <Textarea
                      placeholder="Add any notes about this calculation..."
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                      className="w-full min-h-[100px] border-gray-200 rounded-md focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsSaveDialogOpen(false)}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        setIsSaving(true);
                        await saveCalculation(notes);
                        setIsSaveDialogOpen(false);
                        toast.toast({
                          title: "Calculation saved!",
                          description: "Your calculation has been saved to history.",
                          status: "success",
                        });
                      } catch (error) {
                        toast.toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to save calculation",
                        });
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                    className="bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
    </>
  );
}
