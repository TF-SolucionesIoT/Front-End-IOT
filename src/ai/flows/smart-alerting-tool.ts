'use server';
/**
 * @fileOverview Smart Alerting Tool flow. Analyzes patient vitals using AI to detect anomalies and predict potential health risks.
 *
 * - smartAlertingTool - A function that handles the analysis of patient vitals and generates alerts.
 * - SmartAlertingToolInput - The input type for the smartAlertingTool function.
 * - SmartAlertingToolOutput - The return type for the smartAlertingTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartAlertingToolInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  vitalsData: z.array(
    z.object({
      ts: z.string().describe('Timestamp of the vital sign reading.'),
      type: z.string().describe('Type of vital sign (e.g., heartRate, SpO2, bloodPressure).'),
      value: z.number().describe('The value of the vital sign reading.'),
    })
  ).describe('Array of vital sign readings for the patient.'),
  predefinedThresholds: z.record(z.string(), z.number()).describe('Predefined thresholds for vital signs (e.g., {heartRateHigh: 100, heartRateLow: 60}).'),
});
export type SmartAlertingToolInput = z.infer<typeof SmartAlertingToolInputSchema>;

const SmartAlertingToolOutputSchema = z.object({
  alertNeeded: z.boolean().describe('Whether an alert is needed based on the analysis.'),
  alertMessage: z.string().describe('A message describing the potential health risk and recommended action.'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The level of risk associated with the detected anomaly.'),
});
export type SmartAlertingToolOutput = z.infer<typeof SmartAlertingToolOutputSchema>;

export async function smartAlertingTool(input: SmartAlertingToolInput): Promise<SmartAlertingToolOutput> {
  return smartAlertingToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartAlertingToolPrompt',
  input: {schema: SmartAlertingToolInputSchema},
  output: {schema: SmartAlertingToolOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing patient vital signs and predicting potential health risks.

You will receive the patient's vital signs data, predefined thresholds, and will analyze this information to determine if an alert is needed.

Based on the analysis, you will generate an alert message and assign a risk level (low, medium, or high).

Vitals Data:
{{#each vitalsData}}
  - Timestamp: {{ts}}, Type: {{type}}, Value: {{value}}
{{/each}}

Predefined Thresholds: {{JSONstringify predefinedThresholds}}

Determine if an alert is needed based on anomalies or concerning patterns in the vital signs data, considering the predefined thresholds.

Output:
Alert Needed: {{alertNeeded}}
Alert Message: {{alertMessage}}
Risk Level: {{riskLevel}}`,
});

const smartAlertingToolFlow = ai.defineFlow(
  {
    name: 'smartAlertingToolFlow',
    inputSchema: SmartAlertingToolInputSchema,
    outputSchema: SmartAlertingToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
