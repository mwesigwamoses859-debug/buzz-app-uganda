"use client"; // This is a client component

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Bar } from '@/lib/types';
import { getAggregatedReviews } from '@/app/actions';
import { getVibeAnalysis } from '@/app/actions';
import { Loader2, Sparkles, FileText, Tag, MapPin, Users, Clock, Smile } from 'lucide-react';
import type { AggregateBarReviewsOutput } from '@/ai/flows/aggregate-bar-reviews';
import type { VibeAnalysisOutput } from '@/ai/flows/vibe-analysis';
import { Badge } from './ui/badge';
import Image from 'next/image'; 
import { useEffect } from 'react';
import { Rating } from './rating';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MapView } from './MapView';

// TODO: Define a more comprehensive type for place details based on Google Places API response, including popular_times and opening_hours
type PlaceDetails = { name: string; activities?: string[]; services?: string[] } | null; // Define a type for place details
type AggregatedResult = AggregateBarReviewsOutput | { error: string };
type VibeResult = VibeAnalysisOutput | { error: string };

export function BarDetailsDialog({ bar, isOpen, onOpenChange }: { bar: Bar, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [reviewsResult, setReviewsResult] = useState<AggregatedResult | null>(null);
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingVibe, setLoadingVibe] = useState(false);
  const { toast } = useToast();
  const [placeDetails] = useState<PlaceDetails>(null); // State to store place details
  // TODO: Implement setPlaceDetails when Google Places integration is added

  const handleAggregateReviews = async () => {
    setLoadingReviews(true);
    setReviewsResult(null);
    const response = await getAggregatedReviews({ barName: bar.name, reviewTexts: bar.reviews });
    if ('error' in response && response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else {
      setReviewsResult(response);
    }
    setLoadingReviews(false);
  };

  const handleVibeAnalysis = async () => {
    setLoadingVibe(true);
    setVibeResult(null);
    const response = await getVibeAnalysis({ barName: bar.name, reviewTexts: bar.reviews });
    if ('error' in response && response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else {
      setVibeResult(response);
    }
    setLoadingVibe(false);
  };

  // Fetch place details when the bar prop changes
  useEffect(() => {
    if (bar) {
      // TODO: Replace with actual Place ID from bar data
      // const placeholderPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4"; // Example Place ID (Googleplex)
      // Assuming your Bar type now includes a placeId field
      // fetchPlaceDetails(placeholderPlaceId).then(details => { // Uncomment and use actual fetchPlaceDetails function
      //   setPlaceDetails(details as PlaceDetails); // Cast to the defined type
      // }).catch(error => console.error("Error fetching place details:", error));
    }
  }, [bar]);
  
  const handleGetDirections = () => {
    const { lat, lng } = bar.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog key="dialog-key" open={isOpen} onOpenChange={onOpenChange}> {/* Rewritten Dialog tag */}
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="relative h-48 w-full mb-4">
            <Image
              src={bar.imageUrl}
              data-ai-hint="nightclub atmosphere"
              alt={bar.name}
              className="rounded-md object-cover"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
               <Image 
                  src={bar.logoUrl}
                  alt={`${bar.name} logo`}
                  width={64}
                  height={64}
                  className="rounded-lg border-2 border-background/50 shadow-lg"
                />
              <DialogTitle className="text-3xl font-headline text-primary-foreground">{bar.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {bar.vibes.map(vibe => <Badge key={vibe} variant="secondary">{vibe}</Badge>)}
            {bar.music.map(music => <Badge key={music} variant="secondary">{music}</Badge>)}
            <Badge variant="outline" className="text-accent border-accent/50">{bar.price}</Badge>
          </div>

          {isOpen && bar.location && (
            <div>
 <MapView lat={bar.location.lat} lng={bar.location.lng} />
            </div>
          )}
          
          <Button onClick={handleGetDirections} variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>

           {/* Fetched Place Details (Services, Hours, etc.) */}
          {placeDetails ? (
             <Card className="bg-background/50 animate-in fade-in-50 duration-500">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                        <Clock className="text-primary w-5 h-5" />
                        Details from Google
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                    {/* Example: Displaying opening hours (assuming placeDetails has this field) */}
                    {/* You'll need to adapt this based on the actual structure of your fetched placeDetails */}
                     {placeDetails.opening_hours?.weekday_text && placeDetails.opening_hours.weekday_text.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="font-semibold text-primary-foreground/90">Opening Hours:</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                                {placeDetails.opening_hours.weekday_text.map((text, index) => (
                                    <li key={index}>{text}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                     {/* Example: Displaying popular times (if available and structure is known) */}
                    {/* This part depends heavily on the actual structure of the popular_times data from your API call */}
                    {/* {placeDetails.popular_times && placeDetails.popular_times.some(day => day.data.some(hour => hour > 0)) && (
                        <div className="space-y-1">
                            <h4 className="font-semibold text-primary-foreground/90">Popular Times:</h4>
                            // You'll need a component or logic to render the popular times graph/data
                            <p className="text-muted-foreground">Popular times data is available.</p> // Placeholder
                         </div>
                    )} */}
                     {/* Example: Displaying amenities/services (assuming placeDetails has this field) */}
                    {/* {placeDetails.amenities && placeDetails.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                             <h4 className="font-semibold text-primary-foreground/90 w-full">Services:</h4>
                            {placeDetails.amenities.map((amenity, index) => <Badge key={index} variant="outline" className="text-sm">{amenity}</Badge>)}
                        </div>

                    )} */}
                     {!placeDetails.opening_hours?.weekday_text && (!placeDetails.amenities || placeDetails.amenities.length === 0) /* Add check for popular_times */ && (
                        <div className="text-muted-foreground text-sm italic">
                        (Place details integration is in progress. Opening hours, services, etc. will appear here.)
                    </div>
                     )}
                </CardContent>

            </Card>
          ) : null}
          <Card className="bg-background/50">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <Tag className="text-primary w-5 h-5" />
                    What&apos;s on Offer
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {bar.offerings.map(offering => (
                    <Badge key={offering} variant="outline" className="text-sm">{offering}</Badge>
                ))}
            </CardContent>
          </Card>
          
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Sparkles className="text-primary w-6 h-6" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Review Summary & Rating</AccordionTrigger>
                  <AccordionContent>
                    {reviewsResult && !('error' in reviewsResult) ? (
                      <div className="animate-in fade-in-50 duration-500 space-y-3 pt-2">
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-lg">Overall Vibe Score:</p>
                          <Rating rating={reviewsResult.rating} size={24} />
                          <span className="font-bold text-xl text-accent">({reviewsResult.rating.toFixed(1)}/5.0)</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary-foreground/90">The Lowdown:</h4>
                          <p className="text-muted-foreground">{reviewsResult.summary}</p>
                        </div>
                      </div>
                    ) : loadingReviews ? (
                      <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ): (
                       <div className="text-center space-y-2 text-muted-foreground pt-2">
                         <p>Click the button to get an AI-generated summary of recent reviews.</p>
                      </div>
                    )}
                     <Button onClick={handleAggregateReviews} disabled={loadingReviews} className="w-full mt-4">
                        <FileText className="mr-2 h-4 w-4" />
                        {loadingReviews ? 'Analyzing...' : reviewsResult ? 'Regenerate Summary' : 'Generate Summary'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Vibe & Crowd Analysis</AccordionTrigger>
                  <AccordionContent>
                    {vibeResult && !('error' in vibeResult) ? (
                      <div className="animate-in fade-in-50 duration-500 space-y-4 pt-2">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <h4 className="font-semibold text-primary-foreground/90">Crowd Composition</h4>
                                <p className="text-muted-foreground">{vibeResult.crowdComposition}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <h4 className="font-semibold text-primary-foreground/90">Peak Hours</h4>
                                <p className="text-muted-foreground">{vibeResult.peakHours}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Smile className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <h4 className="font-semibold text-primary-foreground/90">Atmosphere</h4>
                                <p className="text-muted-foreground">{vibeResult.atmosphere}</p>
                            </div>
                        </div>
                      </div>
                    ) : loadingVibe ? (
                       <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (
                       <div className="text-center space-y-2 text-muted-foreground pt-2">
                         <p>Get a breakdown of the typical crowd, peak times, and overall atmosphere.</p>
                      </div>
                    )}
                     <Button onClick={handleVibeAnalysis} disabled={loadingVibe} className="w-full mt-4">
                        <Sparkles className="mr-2 h-4 w-4" />
                        {loadingVibe ? 'Analyzing...' : vibeResult ? 'Regenerate Analysis' : 'Analyze Vibe'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
