
"use client";

import { useState, useEffect } from 'react';
import type { Bar } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BarCard } from './bar-card';
import { BarDetailsDialog } from './bar-details-dialog';
import { Button } from './ui/button';
import { Loader2, LocateFixed, MapPin, Map } from 'lucide-react';
import { MapView } from './MapView';
import { SimpleMapView } from './SimpleMapView';

type Location = {
  latitude: number;
  longitude: number;
};

const haversineDistance = (coords1: Location, coords2: { lat: number, lng: number }) => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.lat - coords1.latitude);
  const dLon = toRad(coords2.lng - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};


export function RadarView({ bars }: { bars: Bar[] }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [sortedBars, setSortedBars] = useState<Bar[]>(bars);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'simple' | 'list'>('simple');
  const { toast } = useToast();

  // Convert Location type to match MapView expectations
  const mapLocation = location ? { lat: location.latitude, lng: location.longitude } : null;

  useEffect(() => {
    if (location) {
      const barsWithDistance = bars.map(bar => ({
        ...bar,
        distance: haversineDistance(location, bar.location),
      }));

      // Sort by buzz (desc) and then by distance (asc)
      barsWithDistance.sort((a, b) => {
        if (b.buzz !== a.buzz) {
          return b.buzz - a.buzz;
        }
        return a.distance - b.distance;
      });
      
      setSortedBars(barsWithDistance);
    } else {
      // Default sort by buzz if no location
      const defaultSorted = [...bars].sort((a,b) => b.buzz - a.buzz);
      setSortedBars(defaultSorted);
    }
  }, [location, bars]);
  
  // Handle location updates from MapView
  const handleLocationUpdate = (newLocation: { lat: number; lng: number }) => {
    setLocation({
      latitude: newLocation.lat,
      longitude: newLocation.lng,
    });
  };

  // Handle bar selection from MapView
  const handleBarSelect = (bar: Bar) => {
    setSelectedBar(bar);
  };

  return (
    <div className="space-y-4">
      {/* Toggle between different view modes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-headline text-lg">Live Radar</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'interactive' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('interactive')}
            className="gap-2"
          >
            <Map className="h-4 w-4" />
            Full Map
          </Button>
          <Button
            variant={viewMode === 'simple' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('simple')}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Radar
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-2"
          >
            <LocateFixed className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Interactive Map View (with Leaflet) */}
      {viewMode === 'interactive' && (
        <MapView
          bars={bars}
          userLocation={mapLocation}
          onLocationUpdate={handleLocationUpdate}
          onBarSelect={handleBarSelect}
        />
      )}

      {/* Simple Radar View (no external dependencies) */}
      {viewMode === 'simple' && (
        <SimpleMapView
          bars={bars}
          userLocation={mapLocation}
          onLocationUpdate={handleLocationUpdate}
          onBarSelect={handleBarSelect}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {location ? (
                `Showing the closest and most popular spots near you (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
              ) : (
                "Switch to Map View to get your location and find the most buzzing bars near you."
              )}
            </p>
          </div>
          <div className="space-y-3">
            {sortedBars.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bars found in your area.</p>
              </div>
            ) : (
              sortedBars.map((bar, index) => {
                const distance = location ? haversineDistance(location, bar.location) : null;
                return (
                  <div key={bar.id} onClick={() => setSelectedBar(bar)} className="cursor-pointer">
                    <div className="relative">
                      <BarCard bar={bar} />
                      {location && distance !== null && (
                        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                          {distance < 1
                            ? `${Math.round(distance * 1000)}m away`
                            : `${distance.toFixed(1)}km away`
                          }
                        </div>
                      )}
                      {index === 0 && location && (
                        <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
                          🎯 Closest & Hottest
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
       {selectedBar && (
        <BarDetailsDialog
          bar={selectedBar}
          isOpen={!!selectedBar}
          onOpenChange={(open) => !open && setSelectedBar(null)}
        />
      )}
    </div>
  );
}
