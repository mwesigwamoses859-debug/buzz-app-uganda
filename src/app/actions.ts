'use server';

import { suggestBar, SuggestBarInput } from '@/ai/flows/bar-suggestion';
import { aggregateBarReviews, AggregateBarReviewsInput } from '@/ai/flows/aggregate-bar-reviews';
import { analyzeVibe, VibeAnalysisInput } from '@/ai/flows/vibe-analysis';

export async function getBarSuggestion(input: SuggestBarInput) {
  try {
    // Add a slight delay to simulate network latency for a better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await suggestBar(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get suggestion. Please try again.' };
  }
}

export async function getAggregatedReviews(input: AggregateBarReviewsInput) {
  try {
    // Add a slight delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await aggregateBarReviews(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}

export async function getVibeAnalysis(input: VibeAnalysisInput) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await analyzeVibe(input);
      return result;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to analyze vibe. Please try again.' };
    }
}
