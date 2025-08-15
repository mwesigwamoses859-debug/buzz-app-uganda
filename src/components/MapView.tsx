"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Bar } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

type Location = {
  lat: number;
  lng: number;
};

interface MapViewProps {
  bars: Bar[];
  userLocation: Location | null;
  onLocationUpdate: (location: Location) => void;
  onBarSelect: (bar: Bar) => void;
}

const defaultCenter: [number, number] = [0.3476, 32.5825]; // Kampala, Uganda

export function MapView({ bars, userLocation, onLocationUpdate, onBarSelect }: MapViewProps) {
  const [selectedBar] = useState<Bar | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyBars, setNearbyBars] = useState<Bar[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Load Leaflet CSS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet/dist/leaflet.css');
      import('../styles/leaflet-custom.css');
      setMapLoaded(true);
    }
  }, []);

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

  // Update nearby bars when user location changes
  useEffect(() => {
    if (userLocation && bars.length > 0) {
      const barsWithDistance = bars.map(bar => ({
        ...bar,
        distance: calculateDistance(userLocation, bar.location),
      }));

      // Sort by distance and buzz level
      const sortedBars = barsWithDistance.sort((a, b) => {
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
      });

      setNearbyBars(sortedBars.slice(0, 10)); // Show top 10
    }
  }, [userLocation, bars, calculateDistance]);

  // Create custom icons for Leaflet
  const createCustomIcon = (color: string, emoji: string, size: number = 32) => {
    if (typeof window === 'undefined') return null;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    return new L.DivIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.4}px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${emoji}</div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  const getUserIcon = () => createCustomIcon('#3B82F6', '📍', 24);
  const getBarIcon = (buzz: number) => {
    const color = buzz > 70 ? '#EF4444' : buzz > 40 ? '#F59E0B' : '#10B981';
    return createCustomIcon(color, '🍺', 32);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Radar Map
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
        <CardContent className="p-0">
          {mapLoaded ? (
            <div className="h-[400px] rounded-xl overflow-hidden">
              <MapContainer
                center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
                zoom={userLocation ? 15 : 12}
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                {userLocation && (
                  <>
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={getUserIcon()}
                    >
                      <Popup>
                        <div className="text-center">
                          <strong>📍 Your Location</strong>
                          <br />
                          <small>
                            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                          </small>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Radius circle around user */}
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={2000} // 2km radius
                      pathOptions={{
                        fillColor: '#3B82F6',
                        fillOpacity: 0.1,
                        color: '#3B82F6',
                        opacity: 0.3,
                        weight: 1,
                      }}
                    />
                  </>
                )}

                {/* Bar markers */}
                {bars.map((bar) => (
                  <Marker
                    key={bar.id}
                    position={[bar.location.lat, bar.location.lng]}
                    icon={getBarIcon(bar.buzz)}
                    eventHandlers={{
                      click: () => setSelectedBar(bar),
                    }}
                  >
                    <Popup>
                      <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-lg">{bar.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{bar.address}</p>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary">Buzz: {bar.buzz}%</Badge>
                          <Badge variant="outline">⭐ {bar.rating}</Badge>
                        </div>
                        {userLocation && (
                          <p className="text-xs text-gray-500 mb-2">
                            📍 {calculateDistance(userLocation, bar.location).toFixed(1)}km away
                          </p>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            onBarSelect(bar);
                            setSelectedBar(null);
                          }}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby bars list */}
      {nearbyBars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nearby Hotspots ({nearbyBars.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nearbyBars.slice(0, 5).map((bar, index) => (
                <div
                  key={bar.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onBarSelect(bar)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bar.name}</span>
                      {index === 0 && <Badge variant="default">🎯 Closest</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{bar.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {userLocation && `${calculateDistance(userLocation, bar.location).toFixed(1)}km`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Buzz: {bar.buzz}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}