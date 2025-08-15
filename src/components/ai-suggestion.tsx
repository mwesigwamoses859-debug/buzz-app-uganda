"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Sparkles, RotateCw, LocateFixed } from 'lucide-react';
import { getBarSuggestion } from '@/app/actions';
import type { SuggestBarOutput } from '@/ai/flows/bar-suggestion';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from './ui/input';

const suggestionSchema = z.object({
  location: z.string().min(1, 'Location is required').default('Kampala'),
  musicGenre: z.string().optional(),
  crowdVibe: z.string().optional(),
  drinkPrice: z.string().optional(),
  timeOfDay: z.string().optional(),
  groupSize: z.string().optional(),
  specialRequests: z.string().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;
type SuggestionResult = SuggestBarOutput & { error?: string };

export function AiSuggestion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      location: 'Kampala',
      musicGenre: '',
      crowdVibe: '',
      drinkPrice: '',
      timeOfDay: '',
      groupSize: '',
      specialRequests: '',
    },
  });

  const onSubmit = async (data: SuggestionFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      // Add loading toast
      toast({
        title: "AI is thinking...",
        description: "Finding the perfect spot for you based on your preferences.",
      });

      const response = await getBarSuggestion(data);

      if ('error' in response && response.error) {
        throw new Error(response.error);
      } else {
        setResult(response);
        toast({
          title: "Perfect match found!",
          description: "AI has found a great spot for you.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: errorMessage,
      });
      setResult({
        barName: "Error",
        reason: "Sorry, I couldn't find a suggestion right now. Please try again with different preferences.",
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    form.reset();
    setResult(null);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', `${latitude}, ${longitude}`);
          setLoading(false);
          toast({ title: "Location captured!", description: "Your current location will be used for the suggestion." });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your location. Please ensure you have location services enabled and have granted permission.",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Unsupported",
        description: "Your browser does not support Geolocation.",
      });
    }
  };


  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="text-primary" />
          Feeling Adventurous?
        </CardTitle>
        <CardDescription>Let AI find your perfect spot. Tell us what you&apos;re looking for.</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-48 space-y-2"

            >
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Finding your vibe...</p>
            </motion.div>
          ) : result && !result.error ? (
            <motion.div

              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}

              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4 text-center"
            >
              <Sparkles className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-xl font-bold font-headline text-accent">{result.barName}</h3>
              <p className="text-muted-foreground italic">&ldquo;{result.reason}&rdquo;</p>
              <Button onClick={handleReset} variant="outline" size="sm" className="group">
                <RotateCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                Try Again
              </Button>

            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Location</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="e.g., Kampala" {...field} />
                          </FormControl>
                          <Button type="button" variant="outline" size="icon" onClick={handleUseLocation} aria-label="Use my current location">
                            <LocateFixed className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="crowdVibe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vibe</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Any Vibe" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Student">Student</SelectItem>
                              <SelectItem value="After-work">After-work</SelectItem>
                              <SelectItem value="Date night">Date night</SelectItem>
                              <SelectItem value="DJ party">DJ Party</SelectItem>
                              <SelectItem value="Chill">Chill</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="drinkPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Any Price" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="$">Budget ($)</SelectItem>
                              <SelectItem value="$$">Mid-range ($$)</SelectItem>
                              <SelectItem value="$$$">Premium ($$$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="musicGenre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Music</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Any Genre" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Afrobeats">Afrobeats</SelectItem>
                            <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                            <SelectItem value="Reggae">Reggae</SelectItem>
                            <SelectItem value="Amapiano">Amapiano</SelectItem>
                            <SelectItem value="Live Band">Live Band</SelectItem>
                            <SelectItem value="Jazz">Jazz</SelectItem>
                            <SelectItem value="Electronic">Electronic</SelectItem>
                            <SelectItem value="Ugandan Hits">Ugandan Hits</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timeOfDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Any Time" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="afternoon">Afternoon (2-6 PM)</SelectItem>
                              <SelectItem value="evening">Evening (6-10 PM)</SelectItem>
                              <SelectItem value="night">Night (10 PM+)</SelectItem>
                              <SelectItem value="late-night">Late Night (12 AM+)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Any Size" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solo">Solo</SelectItem>
                              <SelectItem value="couple">Couple (2)</SelectItem>
                              <SelectItem value="small-group">Small Group (3-5)</SelectItem>
                              <SelectItem value="large-group">Large Group (6+)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., outdoor seating, live sports, karaoke..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Suggest a Bar
                  </Button>
                </form>

              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
