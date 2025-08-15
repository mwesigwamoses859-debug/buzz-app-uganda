'use server';

/**
 * @fileOverview This file defines a Genkit flow to aggregate bar reviews from online sources and create a rating.
 *
 * - aggregateBarReviews - A function that handles the aggregation of bar reviews and generates a rating.
 * - AggregateBarReviewsInput - The input type for the aggregateBarReviews function.
 * - AggregateBarReviewsOutput - The return type for the aggregateBarReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateBarReviewsInputSchema = z.object({
  barName: z.string().describe('The name of the bar to aggregate reviews for.'),
  reviewTexts: z.array(z.string()).describe('An array of review texts for the bar.'),
});
export type AggregateBarReviewsInput = z.infer<typeof AggregateBarReviewsInputSchema>;

const AggregateBarReviewsOutputSchema = z.object({
  rating: z.number().describe('The aggregated rating for the bar, based on the reviews, from 1.0 to 5.0.'),
  summary: z.string().describe('A short summary of the reviews, focusing on atmosphere and service quality.'),
});
export type AggregateBarReviewsOutput = z.infer<typeof AggregateBarReviewsOutputSchema>;

export async function aggregateBarReviews(input: AggregateBarReviewsInput): Promise<AggregateBarReviewsOutput> {
  return aggregateBarReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aggregateBarReviewsPrompt',
  input: {schema: AggregateBarReviewsInputSchema},
  output: {schema: AggregateBarReviewsOutputSchema},
  prompt: `You are an expert in aggregating bar reviews and generating a rating.

  You will receive the bar name and an array of review texts. Your task is to analyze these reviews and provide an aggregated rating between 1.0 and 5.0 (inclusive), as well as a short summary of the reviews.

  Bar Name: {{{barName}}}
  Reviews:
  {{#each reviewTexts}}
  - {{{this}}}
  {{/each}}

  When creating the summary, focus on the general atmosphere, crowd, and most importantly, the quality of service mentioned in the reviews.
  The rating should reflect the overall customer satisfaction, considering sentiment, recurring themes, and service quality.
  `,
});

const aggregateBarReviewsFlow = ai.defineFlow(
  {
    name: 'aggregateBarReviewsFlow',
    inputSchema: AggregateBarReviewsInputSchema,
    outputSchema: AggregateBarReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
