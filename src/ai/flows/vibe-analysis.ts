'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze bar reviews to determine the crowd composition and atmosphere.
 *
 * - analyzeVibe - A function that handles the analysis of reviews.
 * - VibeAnalysisInput - The input type for the analyzeVibe function.
 * - VibeAnalysisOutput - The return type for the analyzeVibe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VibeAnalysisInputSchema = z.object({
  barName: z.string().describe('The name of the bar to analyze.'),
  reviewTexts: z.array(z.string()).describe('An array of review texts for the bar.'),
});
export type VibeAnalysisInput = z.infer<typeof VibeAnalysisInputSchema>;

const VibeAnalysisOutputSchema = z.object({
  crowdComposition: z.string().describe('A summary of the typical crowd composition (e.g., students, professionals, expats, tourists, mixed).'),
  peakHours: z.string().describe('An estimation of the busiest times or days, based on mentions in reviews.'),
  atmosphere: z.string().describe('A description of the general atmosphere (e.g., loud, chill, sophisticated, party-centric).'),
});
export type VibeAnalysisOutput = z.infer<typeof VibeAnalysisOutputSchema>;

export async function analyzeVibe(input: VibeAnalysisInput): Promise<VibeAnalysisOutput> {
  return analyzeVibeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVibePrompt',
  input: {schema: VibeAnalysisInputSchema},
  output: {schema: VibeAnalysisOutputSchema},
  prompt: `You are an expert nightlife analyst. Your task is to analyze a series of user reviews for a specific bar and generate a "Vibe Analysis" profile.

  Based on the reviews provided for {{{barName}}}, determine the following:
  1.  **Crowd Composition**: Who typically goes here? Is it students, young professionals, expats, a mature crowd, or a mix?
  2.  **Peak Hours**: When does it seem to be busiest? Are there mentions of specific nights (e.g., "packed on Fridays") or times?
  3.  **Atmosphere**: What is the overall feeling of the place? Is it loud and energetic, chill and relaxed, good for conversations, or a wild party spot?

  Reviews:
  {{#each reviewTexts}}
  - {{{this}}}
  {{/each}}

  Provide a concise summary for each of these three points.
  `,
});

const analyzeVibeFlow = ai.defineFlow(
  {
    name: 'analyzeVibeFlow',
    inputSchema: VibeAnalysisInputSchema,
    outputSchema: VibeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
