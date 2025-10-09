"use server";
import { smartAlertingTool } from "@/ai/flows/smart-alerting-tool";
import type { SmartAlertingToolOutput } from "@/ai/flows/smart-alerting-tool";

export async function getSmartAlert(): Promise<SmartAlertingToolOutput> {
  // Mock data for demonstration
  const mockVitals = {
    patientId: "patient-123",
    vitalsData: [
      { ts: "2024-07-30T10:00:00Z", type: "heartRate", value: 125 },
      { ts: "2024-07-30T10:00:00Z", type: "SpO2", value: 92 },
      { ts: "2024-07-30T10:05:00Z", type: "heartRate", value: 128 },
      { ts: "2024-07-30T10:05:00Z", type: "SpO2", value: 91 },
      { ts: "2024-07-30T10:10:00Z", type: "heartRate", value: 130 },
      { ts: "2024-07-30T10:10:00Z", type: "SpO2", value: 90 },
    ],
    predefinedThresholds: {
      heartRateHigh: 100,
      heartRateLow: 50,
      SpO2Low: 92,
    },
  };

  try {
    const result = await smartAlertingTool(mockVitals);
    return result;
  } catch (error) {
    console.error("Error calling smart alerting tool:", error);
    // Return a structured error response
    return {
      alertNeeded: true,
      alertMessage:
        "Failed to analyze vitals due to a technical error. Please check the system.",
      riskLevel: "high",
    };
  }
}
