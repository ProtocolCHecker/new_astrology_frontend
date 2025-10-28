import { ZodiacSign } from '../types/astrology';

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    quality: 'cardinal',
    dates: 'March 21 - April 19',
    planet: 'Mars',
    traits: ['Bold', 'Energetic', 'Pioneering', 'Competitive'],
    compatibleSigns: ['Gemini', 'Leo', 'Sagittarius', 'Aquarius'],
    imageUrl: 'https://res.cloudinary.com/dmzc2hu4h/image/upload/v1761623399/aries_picture_e3utfb.webp'
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    quality: 'fixed',
    dates: 'April 20 - May 20',
    planet: 'Venus',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted'],
    compatibleSigns: ['Cancer', 'Virgo', 'Capricorn', 'Pisces'],
    imageUrl: 'https://res.cloudinary.com/dmzc2hu4h/image/upload/v1761623469/taurus_picture_jv7wdk.webp'
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    quality: 'mutable',
    dates: 'May 21 - June 20',
    planet: 'Mercury',
    traits: ['Adaptable', 'Curious', 'Witty', 'Communicative'],
    compatibleSigns: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/gemini_picture.webp'
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    quality: 'cardinal',
    dates: 'June 21 - July 22',
    planet: 'Moon',
    traits: ['Nurturing', 'Intuitive', 'Emotional', 'Protective'],
    compatibleSigns: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/cancer_picture.webp'
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    quality: 'fixed',
    dates: 'July 23 - August 22',
    planet: 'Sun',
    traits: ['Confident', 'Generous', 'Creative', 'Dramatic'],
    compatibleSigns: ['Aries', 'Gemini', 'Libra', 'Sagittarius'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/leo_picture.webp'
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    quality: 'mutable',
    dates: 'August 23 - September 22',
    planet: 'Mercury',
    traits: ['Analytical', 'Practical', 'Helpful', 'Perfectionist'],
    compatibleSigns: ['Taurus', 'Cancer', 'Scorpio', 'Capricorn'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/virgo_picture.webp'
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    quality: 'cardinal',
    dates: 'September 23 - October 22',
    planet: 'Venus',
    traits: ['Harmonious', 'Diplomatic', 'Fair', 'Social'],
    compatibleSigns: ['Gemini', 'Leo', 'Sagittarius', 'Aquarius'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/libra_picture.webp'
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    quality: 'fixed',
    dates: 'October 23 - November 21',
    planet: 'Pluto',
    traits: ['Intense', 'Passionate', 'Mysterious', 'Transformative'],
    compatibleSigns: ['Cancer', 'Virgo', 'Capricorn', 'Pisces'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/scorpio_picture.webp'
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    quality: 'mutable',
    dates: 'November 22 - December 21',
    planet: 'Jupiter',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited'],
    compatibleSigns: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/sagittarius_picture.webp'
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    quality: 'cardinal',
    dates: 'December 22 - January 19',
    planet: 'Saturn',
    traits: ['Ambitious', 'Disciplined', 'Responsible', 'Traditional'],
    compatibleSigns: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/capricorn_picture.webp'
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    quality: 'fixed',
    dates: 'January 20 - February 18',
    planet: 'Uranus',
    traits: ['Independent', 'Innovative', 'Humanitarian', 'Eccentric'],
    compatibleSigns: ['Aries', 'Gemini', 'Libra', 'Sagittarius'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/aquarius_picture.webp'
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    quality: 'mutable',
    dates: 'February 19 - March 20',
    planet: 'Neptune',
    traits: ['Intuitive', 'Compassionate', 'Artistic', 'Dreamy'],
    compatibleSigns: ['Taurus', 'Cancer', 'Scorpio', 'Capricorn'],
    imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/pisces_picture.webp'
  }
];

export const getZodiacSign = (date: Date): ZodiacSign => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10]; // Aquarius
  return zodiacSigns[11]; // Pisces
};

export const getElementColor = (element: string): string => {
  switch (element) {
    case 'fire': return 'from-red-500 to-orange-500';
    case 'earth': return 'from-green-500 to-emerald-500';
    case 'air': return 'from-blue-500 to-cyan-500';
    case 'water': return 'from-blue-600 to-indigo-600';
    default: return 'from-purple-500 to-pink-500';
  }
};