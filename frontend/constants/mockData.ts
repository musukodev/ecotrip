export interface ForecastDay {
  day: string;
  icon: 'cloud' | 'cloud-rain' | 'sun' | 'cloud-sun';
  temp: number;
}

export interface Weather {
  location: string;
  temp: number;
  condition: string;
  wind: string;
  humidity: string;
  forecast: ForecastDay[];
}

export interface ActiveTrip {
  title: string;
  dates: string;
  version: string;
  image: string;
}

export interface ImageItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  price?: string;
  image: string;
}

export interface ListingItem {
  id: string;
  name: string;
  rating: number;
  location?: string;
  tags?: string;
  price: string;
  image: string;
}

export const weather: Weather = {
  location: 'Batam, Kepri',
  temp: 31,
  condition: 'Partly Cloudy',
  wind: '12 km/h',
  humidity: '75%',
  forecast: [
    { day: 'Tomorrow', icon: 'cloud', temp: 30 },
    { day: 'Mon', icon: 'cloud-rain', temp: 28 },
    { day: 'Tue', icon: 'sun', temp: 32 },
    { day: 'Wed', icon: 'cloud-sun', temp: 31 },
  ],
};

export const activeTrip: ActiveTrip = {
  title: 'Batam – Singapura, 3D2N',
  dates: '12–14 Sep 2026 · 2 people',
  version: 'v3',
  image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=300',
};

export const ecoRecommendations: ImageItem[] = [
  {
    id: '1',
    tag: 'CONSERVATION',
    title: 'Panjang Mangrove Forest',
    subtitle: 'Batam · Conservation',
    image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400',
  },
  {
    id: '2',
    tag: 'TRANSPORT',
    title: 'Low Emission Fast Ferry',
    subtitle: 'Batam Center–Harbour Bay',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
  },
];

export const featuredTrips: ImageItem[] = [
  {
    id: '1',
    tag: '7D6N',
    title: 'Batam - Singapore Explorer',
    subtitle: 'Sustainable island hopping & city tour',
    price: 'From Rp 2.5M / person',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400',
  },
  {
    id: '2',
    tag: 'ADVENTURE',
    title: 'Bintan Eco Trail',
    subtitle: 'Mangrove kayaking & jungle stay',
    price: 'From Rp 1.8M / person',
    image: 'https://images.unsplash.com/photo-1596178060810-72660ee8f61e?w=400',
  },
];

export const ecoStays: ListingItem[] = [
  {
    id: '1',
    name: 'Nirwana Eco Resort',
    rating: 4.8,
    location: 'Bintan',
    price: 'Rp 1.2M / night',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300',
  },
  {
    id: '2',
    name: 'Batam Green Villa',
    rating: 4.9,
    location: 'Batam',
    price: 'Rp 850k / night',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300',
  },
];

export const rentalVehicles: ListingItem[] = [
  {
    id: '1',
    name: 'Tesla Model 3',
    rating: 4.9,
    tags: 'Electric · Premium',
    price: 'Rp 1.5M / day',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300',
  },
];