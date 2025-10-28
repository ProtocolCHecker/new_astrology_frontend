import { BirthChartData, PlanetPosition, House, CompatibilityResult, AstrologyApiResponse, AspectData, DetailedCompatibilityResult, PersonData, PredictionData } from '../types/astrology';
import { zodiacSigns, getZodiacSign } from './zodiac';

// Planet symbols mapping
const planetSymbols: { [key: string]: string } = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇'
};

// House meanings
const houseMeanings = [
  'Self & Identity',
  'Money & Possessions',
  'Communication',
  'Home & Family',
  'Creativity & Romance',
  'Health & Work',
  'Relationships',
  'Transformation',
  'Philosophy & Travel',
  'Career & Status',
  'Friendships & Goals',
  'Spirituality & Subconscious'
];

// Helper function to get zodiac sign from degree
const getSignFromDegree = (degree: number): string => {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[signIndex] || 'Aries';
};

// Function to determine which house a planet is in based on degree
const getPlanetHouse = (planetLongitude: number, houses: { [key: string]: number }): number => {
  const housePositions = Object.entries(houses)
    .map(([house, degree]) => ({ house: parseInt(house), degree }))
    .sort((a, b) => a.house - b.house);

  for (let i = 0; i < housePositions.length; i++) {
    const currentHouse = housePositions[i];
    const nextHouse = housePositions[(i + 1) % housePositions.length];
    let currentDegree = currentHouse.degree;
    let nextDegree = nextHouse.degree;

    if (nextDegree < currentDegree) {
      nextDegree += 360;
    }

    let adjustedPlanetLongitude = planetLongitude;
    if (planetLongitude < currentDegree && nextDegree > 360) {
      adjustedPlanetLongitude += 360;
    }

    if (adjustedPlanetLongitude >= currentDegree && adjustedPlanetLongitude < nextDegree) {
      return currentHouse.house;
    }
  }
  return 1;
};

// Function to parse date and time strings
const parseDateTime = (dateStr: string, timeStr: string): { date: number[], time: number[] } => {
  const date = new Date(dateStr + 'T' + timeStr);
  return {
    date: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
    time: [date.getHours(), date.getMinutes(), date.getSeconds()]
  };
};

// Function to get timezone from coordinates or use browser timezone
const getTimezoneForLocation = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using a free timezone API that supports CORS
    const response = await fetch(
      `https://api.geotimezone.com/public/timezone?latitude=${lat}&longitude=${lng}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.timezoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  } catch (error) {
    console.warn('Could not fetch timezone from coordinates:', error);
  }
  
  // Fallback to browser timezone
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const ASTROLOGY_API_URL = 'https://new-astrology-backend.onrender.com';

// Replace your calculateBirthChart function in astrology.ts with this:

export const calculateBirthChart = async (
  date: string,
  time: string,
  location: string,
  gender: string,
  lat?: number,
  lng?: number
): Promise<BirthChartData> => {
  try {
    const { date: birthDate, time: birthTime } = parseDateTime(date, time);

    // Use provided coordinates or default to New York coordinates
    const latitude = lat || 40.7128;
    const longitude = lng || -74.0060;
    
    // Get timezone for the location
    const timezone = await getTimezoneForLocation(latitude, longitude);

    const response = await fetch(`${ASTROLOGY_API_URL}/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: location,
        gender: gender.toLowerCase(),
        lat: latitude,
        lng: longitude,
        timezone: timezone
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to calculate birth chart');
    }

    const responseData = await response.json();
    
    if (responseData.status !== 'success') {
      throw new Error(responseData.message || 'Invalid response from server');
    }

    const backendData = responseData.data;

    // Transform the backend response to match our interface
    return {
      sunSign: backendData.sunSign,
      moonSign: backendData.moonSign,
      risingSign: backendData.risingSign,
      planets: backendData.planets || [],
      houses: backendData.houses || [],
      birthInfo: {
        date: backendData.birthInfo?.date || date,
        time: backendData.birthInfo?.time || time,
        place: backendData.birthInfo?.place || location,
        coordinates: backendData.birthInfo?.coordinates || `${latitude}, ${longitude}`,
        timezone: backendData.birthInfo?.timezone || 'UTC'
      },
      signInterpretations: backendData.signInterpretations || [],
      houseInterpretations: backendData.houseInterpretations || [],
      aspectInterpretations: backendData.aspectInterpretations || [],
      interpretation: backendData.interpretation || `You are a ${backendData.sunSign} with ${backendData.moonSign} Moon and ${backendData.risingSign} Rising.`
    };

  } catch (error) {
    console.error('Error in calculateBirthChart:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to calculate birth chart. Please try again.'
    );
  }
};

export const calculateDetailedCompatibility = async (person1: PersonData, person2: PersonData): Promise<DetailedCompatibilityResult> => {
  try {
    const { date: birthDate1, time: birthTime1 } = parseDateTime(person1.date, person1.time || '12:00');
    const { date: birthDate2, time: birthTime2 } = parseDateTime(person2.date, person2.time || '12:00');

    // Default coordinates for Paris if not provided
    const lat1 = (person1 as any).lat || 48.8566;
    const lng1 = (person1 as any).lng || 2.3522;
    const lat2 = (person2 as any).lat || 48.8566;
    const lng2 = (person2 as any).lng || 2.3522;

    const requestBody = {
      person1: { 
        name: person1.name, 
        birth_date: birthDate1, 
        birth_time: birthTime1, 
        birth_place: person1.location, 
        gender: person1.gender?.toLowerCase() || 'other', 
        lat: lat1, 
        lng: lng1 
      },
      person2: { 
        name: person2.name, 
        birth_date: birthDate2, 
        birth_time: birthTime2, 
        birth_place: person2.location, 
        gender: person2.gender?.toLowerCase() || 'other', 
        lat: lat2, 
        lng: lng2 
      }
    };

    const response = await fetch(`${ASTROLOGY_API_URL}/compatibility`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody) 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const apiData = await response.json();
    if (apiData.status !== 'success') {
      throw new Error('Failed to calculate compatibility');
    }

    const { compatibility, sun1, sun2, synastry } = apiData.data;
    
    return {
      overall_compatibility: compatibility?.overall_score || 50,
      aspect_compatibility: compatibility?.communication_score || 50,
      element_compatibility: compatibility?.emotional_score || 50,
      house_compatibility: compatibility?.intimacy_score || 50,
      sign_compatibility: Math.round(((compatibility?.overall_score || 50) + (compatibility?.emotional_score || 50))/2),
      special_compatibility: Math.round(((compatibility?.communication_score || 50) + (compatibility?.emotional_score || 50) + (compatibility?.intimacy_score || 50))/3),
      interpretation: {
        overall: compatibility?.overall_explanation || 'Compatibility analysis not available',
        sun_signs: `${sun1 || 'Unknown'} and ${sun2 || 'Unknown'}: ${compatibility?.overall_explanation || 'Analysis not available'}`,
        moon_signs: compatibility?.emotional_explanation || 'Moon sign analysis not available',
        venus: compatibility?.intimacy_explanation || 'Venus analysis not available',
        mars: compatibility?.communication_explanation || 'Mars analysis not available',
        key_aspects: []
      },
      synastry_aspects: [],
      categorized_synastry: synastry || {}
    };
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    throw new Error(`Failed to calculate compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to format transit data into readable text
const formatTransitPredictions = (transits: any[]): string => {
  if (!Array.isArray(transits) || transits.length === 0) {
    return 'No transits available for this period';
  }

  return transits.map(transit => {
    const { transiting_planet, natal_planet, aspect_type, category, interpretation } = transit;
    const interpretationText = Array.isArray(interpretation) ? interpretation.join(' ') : interpretation;
    return `${transiting_planet} ${aspect_type} ${natal_planet} (${category}): ${interpretationText}`;
  }).join('\n\n');
};

// Helper function to categorize transits by category
const categorizeTransits = (transits: any[]) => {
  if (!Array.isArray(transits)) return [];
  
  return transits.map(transit => ({
    planet: `${transit.transiting_planet} ${transit.aspect_type} ${transit.natal_planet}`,
    category: transit.category || 'General',
    interpretation: Array.isArray(transit.interpretation) 
      ? transit.interpretation.join(' ') 
      : transit.interpretation || 'No interpretation available',
    date: transit.date
  }));
};

export const calculatePredictions = async (personData: PersonData): Promise<PredictionData> => {
  try {
    const { date: birthDate, time: birthTime } = parseDateTime(personData.date, personData.time || '12:00');

    // Default coordinates if not provided
    const lat = (personData as any).lat || 48.8566;
    const lng = (personData as any).lng || 2.3522;

    const requestBody = {
      user: {
        name: personData.name,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: personData.location,
        gender: personData.gender?.toLowerCase() || 'other',
        lat: lat,
        lng: lng
      },
      period: ["today", "tomorrow", "week-end", "month-end", "year-end"] // Default periods
    };

    const response = await fetch(`${ASTROLOGY_API_URL}/transit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const apiData = await response.json();
    if (apiData.status !== 'success') {
      throw new Error('Failed to calculate predictions');
    }

    const data = apiData.data || {};
    
    // Process the transit arrays into readable predictions
    const todayTransits = data.today || [];
    const tomorrowTransits = data.tomorrow || [];
    const weekEndTransits = data['week-end'] || [];
    const monthEndTransits = data['month-end'] || [];
    const yearEndTransits = data['year-end'] || [];

    // Get all transits for categorization
    const allTransits = [
      ...todayTransits,
      ...tomorrowTransits,
      ...weekEndTransits,
      ...monthEndTransits,
      ...yearEndTransits
    ];

    // Categorize transits by type
    const personalInsights = categorizeTransits(
      allTransits.filter(t => ['Identity', 'Emotion', 'Self'].includes(t.category))
    );
    
    const careerGuidance = categorizeTransits(
      allTransits.filter(t => ['Career', 'Ambition', 'Status'].includes(t.category))
    );
    
    const relationshipAdvice = categorizeTransits(
      allTransits.filter(t => ['Relationships', 'Love', 'Partnership'].includes(t.category))
    );
    
    const healthWellness = categorizeTransits(
      allTransits.filter(t => ['Health', 'Wellness', 'Energy'].includes(t.category))
    );

    return {
      today: formatTransitPredictions(todayTransits),
      tomorrow: formatTransitPredictions(tomorrowTransits),
      thisWeek: formatTransitPredictions(weekEndTransits),
      thisMonth: formatTransitPredictions(monthEndTransits),
      thisYear: formatTransitPredictions(yearEndTransits),
      personalInsights,
      careerGuidance,
      relationshipAdvice,
      healthWellness
    };
  } catch (error) {
    console.error('Error calculating predictions:', error);
    throw new Error(`Failed to calculate predictions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Keep your existing compatibility function if you still need it
export const calculateCompatibility = (sign1: string, sign2: string): CompatibilityResult => {
  // Your existing implementation here
  return {
    compatibility: 50,
    description: 'Basic compatibility calculation'
  };
};

// Keep your existing horoscope function if you still need it
export const getHoroscope = async (sign: string): Promise<string> => {
  // Your existing implementation here
  return `Horoscope for ${sign}`;
};