import type { Bar } from './types';


export type PlaceDetails = {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  // Add other fields you might need from the Places API response
  // e.g., opening_hours, amenities, photos, etc.
};
export const allBars: Bar[] = [
  {
    id: '1',
    name: 'The Alchemist',
    location: { lat: 0.3344, lng: 32.5937 },
    address: 'Acacia Avenue, Kololo',
    vibes: ['Expat', 'DJ party', 'Artsy'],
    music: ['Hip Hop', 'Amapiano', 'Electronic'],
    price: '$$',
    buzz: 92,
    rating: 4.5,
    reviews: [
      'Amazing cocktails and great music. The place to be on a Friday night!',
      'A bit pricey but the vibe is worth it. Good mix of locals and expats.',
      'Gets very crowded, but the energy is unmatched. Service can be slow when packed.',
      'Love the open-air concept and the food trucks. A truly unique spot in Kampala.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/TA.png',
    offerings: ['Craft Cocktails', 'Food Trucks', 'Outdoor Seating', 'Live DJs'],
  },
  {
    id: '2',
    name: 'Otters Bar',
    location: { lat: 0.3284, lng: 32.5947 },
    address: 'Sturrock Road, Kololo',
    vibes: ['Chill', 'Date night', 'After-work'],
    music: ['Afrobeats', 'Soul', 'Soft Rock'],
    price: '$$',
    buzz: 65,
    rating: 4.2,
    reviews: [
      'Super chill place for a weekday evening. Their food is surprisingly good.',
      'Love the outdoor seating. Perfect for a date night. Excellent service.',
      'Can get a bit slow on service, but the ambiance makes up for it.',
      'Great wine selection and the garden is beautiful.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=2070&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/OB.png',
    offerings: ['Full Dinner Menu', 'Extensive Wine Selection', 'Garden Ambience', 'Quiet Atmosphere'],
  },
  {
    id: '3',
    name: 'Liquid Silk',
    location: { lat: 0.3308, lng: 32.6044 },
    address: 'Village Mall, Bugolobi',
    vibes: ['Posh', 'Live Band', 'Mature'],
    music: ['Live Band', 'Afrobeats', 'Hip Hop'],
    price: '$$$',
    buzz: 88,
    rating: 4.6,
    reviews: [
      'High-end spot with a mature crowd. Dress to impress. Service is top-notch.',
      'Great selection of premium drinks, but be ready to spend.',
      'The live band nights are legendary. Best sound system in town.',
      'Excellent security and a very classy interior.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=1974&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/LS.png',
    offerings: ['VIP Seating', 'Bottle Service', 'Live Bands', 'Premium Cigars'],
  },
  {
    id: '4',
    name: 'Gabz Lounge',
    location: { lat: 0.3015, lng: 32.5901 },
    address: 'Kisementi, Kamwokya',
    vibes: ['Student', 'DJ party', 'Lively'],
    music: ['Amapiano', 'Dancehall', 'Ugandan Hits'],
    price: '$',
    buzz: 75,
    rating: 3.8,
    reviews: [
        'Always a party here! The music is loud and the drinks are cheap.',
        'Crowded with university students, but fun if that\'s your scene.',
        'The grilled meat is a must-try. Perfect late-night spot, though service gets chaotic.',
        'Great place to watch a football match with friends.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574636753138-6a337c22a76f?q=80&w=2070&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/GL.png',
    offerings: ['Grilled Meats (Nyama Choma)', 'Beer Buckets', 'Sports Screening', 'Lively DJ'],
  },
  {
    id: '5',
    name: 'Jazzville',
    location: { lat: 0.3200, lng: 32.6100 },
    address: 'Bandali Rise, Bugolobi',
    vibes: ['Live Band', 'Date night', 'Chill'],
    music: ['Live Band', 'Jazz', 'Soul'],
    price: '$$',
    buzz: 50,
    rating: 4.8,
    reviews: [
        'A hidden gem for live music lovers. Very intimate and cozy.',
        'The talent they bring in is top-notch. Staff are so welcoming and attentive.',
        'Food and drinks are reasonably priced for the quality of entertainment. A mature and respectful crowd.',
        'Perfect spot for a sophisticated night out without the usual club noise.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/JV.png',
    offerings: ['Live Jazz & Soul Music', 'Intimate Atmosphere', 'Signature Cocktails', 'Full Dinner Menu'],
  },
  {
    id: '6',
    name: 'Zone 7',
    location: { lat: 0.3400, lng: 32.5800 },
    address: 'Mbuya, Kampala',
    vibes: ['Casual', 'After-work', 'Sports'],
    music: ['Afrobeats', 'Pop', 'Reggae'],
    price: '$$',
    buzz: 70,
    rating: 4.1,
    reviews: [
        'Massive outdoor space. Great for big groups.',
        'Good place to watch sports. The screens are huge!',
        'Service is quick and the food is consistently good. Love the pizza.',
        'Family friendly during the day, gets more lively at night.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560023348-159676527b21?q=80&w=1974&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/Z7.png',
    offerings: ['Wood-Fired Pizza', 'Large Projector Screens', 'Play area for kids', 'Outdoor Bar'],
  },
  {
    id: '7',
    name: 'The Fez',
    location: { lat: 0.3290, lng: 32.5990 },
    address: 'Nakasero, Kampala',
    vibes: ['Expat', 'Chill', 'Date night'],
    music: ['Lounge', 'Deep House', 'International'],
    price: '$$$',
    buzz: 60,
    rating: 4.4,
    reviews: [
        'A very chic and stylish Moroccan-themed bar. Feels like an escape.',
        'Impeccable service and a fantastic cocktail menu.',
        'Great for a quiet, intimate conversation. The rooftop is lovely.',
        'A bit hard to find, but worth the effort for the unique ambiance.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1561336183-5461c39a2b1f?q=80&w=2070&auto=format&fit=crop',
    logoUrl: 'https://avatar.vercel.sh/TF.png',
    offerings: ['Rooftop Terrace', 'Moroccan Decor', 'Signature Cocktails', 'Shisha'],
  }
];

// Placeholder function to fetch place details from Google Places API
export const fetchPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  // Replace 'YOUR_GOOGLE_PLACES_API_KEY' with your actual API key
  const apiKey = 'YOUR_GOOGLE_PLACES_API_KEY';
  const fields = 'name,rating,user_ratings_total,geometry,formatted_address,opening_hours,website,photos,editorial_summary,serves_beer,serves_cocktails,serves_food,serves_wine,live_music,sports_bar,outdoor_seating'; // Specify the fields you need
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=${fields}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result as PlaceDetails;
    } else {
      console.error('Google Places API error:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};
