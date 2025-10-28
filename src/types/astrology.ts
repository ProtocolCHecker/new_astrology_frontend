export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  dates: string;
  planet: string;
  traits: string[];
  compatibleSigns: string[];
  imageUrl?: string;
}

export interface BirthChartData {
  id?: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: PlanetPosition[];
  houses: House[];
  birthInfo: {
    coordinates: string;
    date: string;
    place: string;
    time: string;
    timezone: string;
  };
  signInterpretations: string[];
  houseInterpretations: string[];
  aspectInterpretations: string[];
  interpretation?: string;
}

export interface BirthInfo {
  coordinates: string;
  date: string;
  place: string;
  time: string;
  timezone: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  // Remove longitude as it's not in your backend response
  // longitude: number;  // REMOVE THIS LINE
}

export interface House {
  number: number;
  sign: string;
  degree: number;
  meaning: string;
}

export interface AspectData {
  aspect: string;
  nature: string;
  orb: number;
  planet1: string;
  planet2: string;
}

export interface CompatibilityResult {
  sign1: string;
  sign2: string;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  workScore: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

// New detailed compatibility interfaces
export interface DetailedCompatibilityResult {
  aspect_compatibility: number;
  element_compatibility: number;
  house_compatibility: number;
  overall_compatibility: number;
  sign_compatibility: number;
  special_compatibility: number;
  interpretation: CompatibilityInterpretation;
  synastry_aspects: SynastryAspect[];
  // Add new categorized synastry data
  categorized_synastry?: {
    [category: string]: Array<{
      p1: string;
      p2: string;
      aspect: string;
      orb: number;
      interpretation: string;
    }>;
  };
}

export interface CompatibilityInterpretation {
  key_aspects: string[];
  mars: string;
  moon_signs: string;
  overall: string;
  sun_signs: string;
  venus: string;
}

export interface SynastryAspect {
  aspect: string;
  nature: string;
  orb: number;
  person1_planet: string;
  person2_planet: string;
}

export interface PersonData {
  name: string;
  date: string;
  time: string;
  location: string;
  gender: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  email: string;
  birthChart?: BirthChartData;
  preferences: {
    notifications: boolean;
    theme: 'cosmic' | 'celestial';
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'daily-guidance' | 'cosmic-events' | 'sign-spotlights';
  image: string;
  publishedAt: string;
  readTime: number;
}

// Prediction interfaces
export interface PredictionAspect {
  date: string;
  transiting_planet: string;
  natal_planet: string;
  aspect_type: string;
  orb: number;
  aspect_degrees: number;
  diff: number;
  category: string;
  interpretation: string[];
}

export interface PredictionData {
  status: string;
  data: {
    today: PredictionAspect[];
    tomorrow?: PredictionAspect[];
    'week-end': PredictionAspect[];
    'month-end': PredictionAspect[];
    'year-end': PredictionAspect[];
  };
}

// API Response interfaces
export interface AstrologyApiResponse {
  birth_info: {
    coordinates: string;
    date: string;
    place: string;
    time: string;
    timezone: string;
  };
  chart_data: {
    ascendant: {
      degree: number;
      sign: string;
    };
    midheaven: {
      degree: number;
      sign: string;
    };
    planets: {
      [key: string]: {
        degree: number;
        longitude: number;
        sign: string;
      };
    };
    houses: {
      [key: string]: number;
    };
    aspects: Array<{
      aspect: string;
      nature: string;
      orb: number;
      planet1: string;
      planet2: string;
    }>;
    julian_day: number;
  };
  interpretation: string;
}