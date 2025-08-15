"use client";

import React, { useState, useCallback } from 'react';
import type { Bar } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Navigation, Loader2, Locate } from 'lucide-react';

type Location = {
  lat: number;
  lng: number;
};

interface SimpleMapViewProps {
  bars: Bar[];
  userLocation: Location | null;
  onLocationUpdate: (location: Location) => void;
  onBarSelect: (bar: Bar) => void;
}

export function SimpleMapView({ bars, userLocation, onLocationUpdate, onBarSelect }: SimpleMapViewProps) {
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((point1: Location, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        onLocationUpdate(newLocation);
        
        toast({
          title: "Location found!",
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
        });
        
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          variant: "destructive",
          title: "Location Error",
          description: errorMessage,
        });
        
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      }
    );
  }, [onLocationUpdate, toast]);

  // Sort bars by distance if user location is available
  const sortedBars = userLocation 
    ? bars
        .map(bar => ({
          ...bar,
          distance: calculateDistance(userLocation, bar.location),
        }))
        .sort((a, b) => {
          // Prioritize bars within 5km, then sort by buzz and distance
          const aIsNear = a.distance <= 5;
          const bIsNear = b.distance <= 5;
          
          if (aIsNear && !bIsNear) return -1;
          if (!aIsNear && bIsNear) return 1;
          
          // Both near or both far - sort by buzz then distance
          if (Math.abs(a.buzz - b.buzz) > 10) {
            return b.buzz - a.buzz; // Higher buzz first
          }
          return a.distance - b.distance; // Closer first
        })
    : bars.sort((a, b) => b.buzz - a.buzz); // Sort by buzz only

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Locate className="h-5 w-5 text-primary" />
              Location-Based Radar
            </CardTitle>
            <Button
              onClick={getCurrentLocation}
              disabled={isLocating}
              size="sm"
              className="gap-2"
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {isLocating ? "Locating..." : "Find Me"}
            </Button>
          </div>
          {userLocation && (
            <p className="text-sm text-muted-foreground">
              📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Visual representation of location and bars */}
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-6 h-[300px] overflow-hidden">
            {/* Compass directions */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">N</div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">S</div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">W</div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">E</div>
            
            {/* Center point (user location) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              {userLocation && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap">
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs">
                    You are here
                  </div>
                </div>
              )}
            </div>

            {/* Radar circles */}
            {userLocation && (
              <>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-300 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-200 rounded-full opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-blue-100 rounded-full opacity-20"></div>
              </>
            )}

            {/* Bar positions (simplified) */}
            {userLocation && sortedBars.slice(0, 8).map((bar, index) => {
              const distance = calculateDistance(userLocation, bar.location);
              const angle = Math.random() * 2 * Math.PI; // Random angle for demo
              const radius = Math.min(distance * 30, 120); // Scale distance to pixels
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={bar.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  onClick={() => onBarSelect(bar)}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                    bar.buzz > 70 ? 'bg-red-500' : bar.buzz > 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                  </div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap">
                    <div className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded shadow text-xs max-w-20 truncate">
                      {bar.name}
                    </div>
                  </div>
                </div>
              );
            })}

            {!userLocation && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click &ldquo;Find Me&rdquo; to see nearby bars</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nearby bars list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {userLocation ? `Nearby Hotspots (${sortedBars.length})` : `All Hotspots (${bars.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedBars.slice(0, 10).map((bar, index) => (
              <div
                key={bar.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onBarSelect(bar)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bar.name}</span>
                    {index === 0 && userLocation && <Badge variant="default">🎯 Closest</Badge>}
                    <div className={`w-2 h-2 rounded-full ${
                      bar.buzz > 70 ? 'bg-red-500' : bar.buzz > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{bar.address}</p>
                </div>
                <div className="text-right">
                  {userLocation && (
                    <div className="text-sm font-medium">
                      {calculateDistance(userLocation, bar.location).toFixed(1)}km
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Buzz: {bar.buzz}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
