export type CrowdVibe = "Student" | "After-work" | "Expat" | "Date night" | "DJ party" | "Chill" | "Live Band" | "Artsy" | "Posh" | "Mature" | "Lively" | "Casual" | "Sports";
export type MusicGenre = "Afrobeats" | "Hip Hop" | "Reggae" | "Amapiano" | "Live Band" | "Jazz" | "Soul" | "Dancehall" | "Electronic" | "Soft Rock" | "Ugandan Hits" | "Pop" | "Lounge" | "Deep House" | "International";
export type DrinkPrice = "$" | "$$" | "$$$";

// Google Places API types
export type OpeningHours = {
  open_now?: boolean;
  weekday_text?: string[];
  periods?: Array<{
    open: { day: number; time: string };
    close?: { day: number; time: string };
  }>;
};

export type PopularTimes = Array<{
  name: string;
  data: number[];
}>;

export type Bar = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  vibes: CrowdVibe[];
  music: MusicGenre[];
  price: DrinkPrice;
  buzz: number; // 0-100, for heatmap
  rating: number; // 1-5
  reviews: string[];
  imageUrl: string;
  logoUrl: string;
 offerings: string[];
  placeId?: string; // Google Place ID
  opening_hours?: OpeningHours; // Type for opening hours from Places API
  amenities?: string[]; // Amenities/services from Places API
  popular_times?: PopularTimes; // Type for popular times from Places API
};
