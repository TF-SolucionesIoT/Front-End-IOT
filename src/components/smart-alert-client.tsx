"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wand2, Loader2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { getSmartAlert } from "@/app/actions";
import type { SmartAlertingToolOutput } from "@/ai/flows/smart-alerting-tool";
import { Badge } from "./ui/badge";

const riskLevelConfig = {
    low: {
        icon: ShieldCheck,
        color: "bg-green-100 text-green-800",
        title: "Low Risk",
    },
    medium: {
        icon: ShieldAlert,
        color: "bg-yellow-100 text-yellow-800",
        title: "Medium Risk",
    },
    high: {
        icon: AlertTriangle,
        color: "bg-red-100 text-red-800",
        title: "High Risk",
    },
};


export function SmartAlertClient() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SmartAlertingToolOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAnalyze = () => {
    startTransition(async () => {
      const res = await getSmartAlert();
      setResult(res);
      setIsDialogOpen(true);
    });
  };

  const riskConfig = result ? riskLevelConfig[result.riskLevel] : riskLevelConfig.low;
  const RiskIcon = riskConfig.icon;

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>AI Smart Analysis</CardTitle>
          <CardDescription>
            Use AI to analyze recent vitals for potential risks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            <span>{isPending ? "Analyzing..." : "Analyze Vitals with AI"}</span>
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          {result && (
            <>
              <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${riskConfig.color}`}>
                    <RiskIcon className="h-8 w-8" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  AI Analysis Complete
                </AlertDialogTitle>
                <div className="flex justify-center">
                    <Badge variant={result.riskLevel === 'high' ? 'destructive' : result.riskLevel === 'medium' ? 'secondary' : 'default'} className={
                        result.riskLevel === 'medium' ? 'bg-yellow-500 text-white' : ''
                    }>
                        {riskConfig.title}
                    </Badge>
                </div>
                <AlertDialogDescription className="text-center pt-2">
                  {result.alertMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                  Understood
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
