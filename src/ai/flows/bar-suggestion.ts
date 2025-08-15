'use server';
/**
 * @fileOverview Provides bar suggestions to users with explanations.
 *
 * - suggestBar - A function that takes user preferences and returns a suggested bar with a rationale.
 * - SuggestBarInput - The input type for the suggestBar function.
 * - SuggestBarOutput - The return type for the suggestBar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBarInputSchema = z.object({
  location: z.string().describe("The user\u2019s current location."),
  musicGenre: z
    .string()
    .optional()
    .describe("The preferred music genre (optional)."),
  crowdVibe: z
    .string()
    .optional()
    .describe("The desired crowd vibe (optional)."),
  drinkPrice: z
    .string()
    .optional()
    .describe("The preferred drink price range (optional)."),
  previousReviews: z.string().optional().describe('Summaries of reviews for bars the user has visited'),
  services: z
    .array(z.string())
    .optional()
    .describe("List of services offered by the bar."),
  popularTimes: z
    .any() // Using z.any() for flexibility to match Google Places API popular_times structure
    .optional()
    .describe("Popular times data for the bar."),
  // Add a field to potentially include aggregated review summary
  aggregatedReviewSummary: z
    .string()
    .optional()
    .describe("Popular times data for the bar."),
});
export type SuggestBarInput = z.infer<typeof SuggestBarInputSchema>;

const SuggestBarOutputSchema = z.object({
  barName: z.string().describe('The name of the suggested bar.'),
  reason: z.string().describe('The explanation of why the bar is a good suggestion.'),
});
export type SuggestBarOutput = z.infer<typeof SuggestBarOutputSchema>;
// type SuggestionResult = SuggestBarOutput | { error: string };
export async function suggestBar(input: SuggestBarInput): Promise<SuggestBarOutput> {
  return suggestBarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBarPrompt',
  input: {schema: SuggestBarInputSchema},
  output: {schema: SuggestBarOutputSchema},
  prompt: `Suggest a bar to the user based on their preferences, location, and detailed information about potential bars (services, popular times, detailed review analysis if available). Explain why you think this bar would be a good fit, even if it doesn't perfectly match their specified criteria. Use the detailed bar information to provide a more accurate and compelling suggestion. Consider user's previous reviews as a high priority. Be creative and think outside the box.

User Location: {{{location}}}
Preferred Music Genre: {{musicGenre}}
Desired Crowd Vibe: {{crowdVibe}}
Preferred Drink Price: {{drinkPrice}}
Previous Reviews: {{previousReviews}}
Aggregated Review Summary: {{aggregatedReviewSummary}}
`,
});

const suggestBarFlow = ai.defineFlow(
  {
    name: 'suggestBarFlow',
    inputSchema: SuggestBarInputSchema,
    outputSchema: SuggestBarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
