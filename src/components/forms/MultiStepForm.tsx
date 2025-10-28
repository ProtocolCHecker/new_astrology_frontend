import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, Calendar, MapPin, Clock, User, Mail, Sparkles, Search, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface FormData {
  gender: string;
  birthDate: { day: string; month: string; year: string };
  birthTime: { hour: string; minute: string; unknown: boolean };
  birthPlace: { display: string; lat: number; lon: number; raw: any } | null;
  name: string;
  lastName: string;
  email: string;

  // Additional questions
  sentimentalSituation: string;
  hadBirthChart: string;
  recentThoughts: string[];
  element: string;
  personality: string[];
  compatibleSigns: string[];
  misunderstood: string;
  partnerGestures: string;
  favoriteActivity: string;
  livingPlace: string;
}

interface PhotonResult {
  properties: {
    name: string;
    country: string;
    state?: string;
    city?: string;
    osm_id: number;
    osm_type: string;
    extent?: number[];
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface Step {
  type: 'transition' | 'question';
  content: string;
  field?: keyof FormData;
  options?: string[];
  multiple?: boolean;
  isSpecial?: boolean;
  hasAstreaInfo?: boolean;
}

const steps: Step[] = [
  {
    type: 'transition',
    content: 'Take the time to answer your questions that way we can get to know you better, which will allow us to recommend personalized content based on your interests.'
  },
  {
    type: 'transition',
    content: 'Before starting...'
  },
  {
    type: 'question',
    content: 'What is your sex?',
    field: 'gender',
    options: ['Women', 'Man', 'I don\'t want to specify', 'LGTBI']
  },
  {
    type: 'question',
    content: 'What is your birth date?',
    field: 'birthDate',
    isSpecial: true,
    hasAstreaInfo: true
  },
  {
    type: 'transition',
    content: 'Great! The location of the Sun, the Moon and the planets on the exact day and moment of our birth defines our birth chart.'
  },
  {
    type: 'question',
    content: 'Birth hour',
    field: 'birthTime',
    isSpecial: true
  },
  {
    type: 'question',
    content: 'What is your birthplace?',
    field: 'birthPlace',
    isSpecial: true
  },
  {
    type: 'question',
    content: 'What is your sentimental situation?',
    field: 'sentimentalSituation',
    options: ['Married', 'Engaged to', 'In a relationship', 'Complicated', 'Single', 'Divorced']
  },
  {
    type: 'question',
    content: 'Have you ever had a birth chart done?',
    field: 'hadBirthChart',
    options: ['Yes, they have done it to me', 'No, I haven\'t done it']
  },
  {
    type: 'transition',
    content: 'The birth chart is not a prediction. It is a tool to interpret astrology in a scientific way. It can only be prepared and interpreted by certified and experienced experts.'
  },
  {
    type: 'question',
    content: 'What topics have you thought about lately?',
    field: 'recentThoughts',
    options: ['Career', 'Financial issues', 'Love', 'Health', 'Family life', 'Friendships'],
    multiple: true
  },
  {
    type: 'transition',
    content: 'Promised aspects: Understand what they have offered you, the topics you need to delve into, your inclinations and the attitude you should adopt.'
  },
  {
    type: 'question',
    content: 'Which of the four elements matches your personality?',
    field: 'element',
    options: ['Fire', 'Water', 'Land', 'Air']
  },
  {
    type: 'question',
    content: 'What traits reflect your personality?',
    field: 'personality',
    options: ['Emotional', 'Logical', 'Intelligent', 'Enthusiastic', 'Bossy', 'Introvert', 'Reliable', 'Moody', 'Aesthetic', 'Open-minded', 'Children\'s', 'Positive', 'It\'s intimate', 'Leal', 'Honest', 'Pessimistic'],
    multiple: true
  },
  {
    type: 'transition',
    content: 'Tenth House: What are your goals and responsibilities in life? Are you focused on career, fame, success or career advancement? Get ready to find out.'
  },
  {
    type: 'question',
    content: 'What signs do you get along with? Choose 3 options',
    field: 'compatibleSigns',
    options: ['Aries', 'Taurus', 'Gemini', 'Leo', 'Cancer', 'Libra', 'Virgo', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    multiple: true
  },
  {
    type: 'question',
    content: 'How often do you think you are misunderstood by the people around you?',
    field: 'misunderstood',
    options: ['Very often', 'Sometimes', 'Rarely', 'Never']
  },
  {
    type: 'question',
    content: 'Which of these gestures do you expect from your partner?',
    field: 'partnerGestures',
    options: ['Approval statements', 'Material things', 'Affective behaviors', 'Quality time', 'Physical intimacy']
  },
  {
    type: 'transition',
    content: 'Relationships and marriage: The birth chart is not used to predict who we will marry, but it can indicate the most favorable dates to get married.'
  },
  {
    type: 'transition',
    content: 'Thanks for sharing this information! Our purpose is to elevate your self-awareness and facilitate the discovery of your hidden talents.'
  },
  {
    type: 'question',
    content: 'What is your favorite activity?',
    field: 'favoriteActivity',
    options: ['Do sports', 'Read a book', 'See live performances', 'Watch a movie or series']
  },
  {
    type: 'question',
    content: 'Where would you like to spend the rest of your life?',
    field: 'livingPlace',
    options: ['Traveling all the time', 'Coastal city', 'Metropolis', 'Secluded cabin']
  },
  {
    type: 'transition',
    content: 'Seventh House: In the Seventh House, you will find important aspects related to your intimate relationships, business partnerships, agreements, marriage and partnership. Pay attention to these details.'
  },
  {
    type: 'question',
    content: 'What is your name?',
    field: 'name',
    isSpecial: true
  },
  {
    type: 'transition',
    content: 'Your astrological analysis is complete.'
  },
  {
    type: 'question',
    content: 'What email address should we send the reading to?',
    field: 'email',
    isSpecial: true
  }
];

interface MultiStepFormProps {
  onComplete: (data: FormData) => void;
  isLoading: boolean;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<PhotonResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCityResults, setShowCityResults] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    gender: '',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', unknown: false },
    birthPlace: null,
    name: '',
    lastName: '',
    email: '',
    sentimentalSituation: '',
    hadBirthChart: '',
    recentThoughts: [],
    element: '',
    personality: [],
    compatibleSigns: [],
    misunderstood: '',
    partnerGestures: '',
    favoriteActivity: '',
    livingPlace: ''
  });

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySearchResults([]);
      setShowCityResults(false);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();
      setCitySearchResults(data.features || []);
      setShowCityResults(true);
    } catch (error) {
      console.error('Error searching cities:', error);
      setCitySearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySearch = (query: string) => {
    setCitySearchQuery(query);
    const timeoutId = setTimeout(() => searchCities(query), 300);
    return () => clearTimeout(timeoutId);
  };

  const selectCity = (result: PhotonResult) => {
    const cityName = result.properties.city || result.properties.name;
    const stateName = result.properties.state;
    const countryName = result.properties.country;

    let displayName = cityName;
    if (stateName && stateName !== cityName) {
      displayName += `, ${stateName}`;
    }
    displayName += `, ${countryName}`;
    setFormData(prev => ({
      ...prev,
      birthPlace: {
        display: displayName,
        lat: result.geometry.coordinates[1],
        lon: result.geometry.coordinates[0],
        raw: result
      }
    }));

    setCitySearchQuery(displayName);
    setShowCityResults(false);
    setCitySearchResults([]);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStepData.type === 'transition' || isFieldComplete();

  function isFieldComplete(): boolean {
    if (!currentStepData.field) return true;
    const field = currentStepData.field;
    const value = formData[field];
    if (field === 'birthDate') {
      const date = value as typeof formData.birthDate;
      return date.day !== '' && date.month !== '' && date.year !== '';
    }
    if (field === 'birthTime') {
      const time = value as typeof formData.birthTime;
      return time.unknown || (time.hour !== '' && time.minute !== '');
    }
    if (field === 'birthPlace') {
      return formData.birthPlace !== null;
    }
    if (Array.isArray(value)) {
      if (field === 'compatibleSigns') return value.length === 3;
      return value.length > 0;
    }
    return value !== '';
  }

  const handleNext = () => {
    if (isLastStep && canProceed) {
      const birthChartData = {
        date: `${formData.birthDate.year}-${formData.birthDate.month.padStart(2, '0')}-${formData.birthDate.day.padStart(2, '0')}`,
        time: formData.birthTime.unknown ? '12:00' : `${formData.birthTime.hour.padStart(2, '0')}:${formData.birthTime.minute.padStart(2, '0')}`,
        location: formData.birthPlace?.display || '',
        gender: formData.gender === 'Women' ? 'Female' : formData.gender === 'Man' ? 'Male' : 'Other',
        lat: formData.birthPlace?.lat,
        lng: formData.birthPlace?.lon 
      };
      onComplete(birthChartData as any);
    } else if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleOptionSelect = (option: string) => {
    if (!currentStepData.field) return;
    const field = currentStepData.field;
    if (currentStepData.multiple) {
      const currentValue = formData[field] as string[];
      const maxSelections = field === 'compatibleSigns' ? 3 : Infinity;
      if (currentValue.includes(option)) {
        setFormData(prev => ({
          ...prev,
          [field]: currentValue.filter(item => item !== option)
        }));
      } else if (currentValue.length < maxSelections) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentValue, option]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: option
      }));
    }
  };

  const getOptionImage = (option: string, field?: string) => {
    // Gender options
    if (field === 'gender') {
      switch (option) {
        case 'Women': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/woman_astrea.webp';
        case 'Man': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/man_astrea.webp';
        case 'I don\'t want to specify': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/dont_reply_astrea.webp';
        case 'LGTBI': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/lgbt_astrea.webp';
      }
    }
    // Sentimental situation options
    if (field === 'sentimentalSituation') {
      switch (option) {
        case 'Married': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/married.webp';
        case 'Engaged to': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/engaged_to.webp';
        case 'In a relationship': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/in_a_relationship.webp';
        case 'Complicated': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/complicated.webp';
        case 'Single': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/single.webp';
        case 'Divorced': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/divorced.webp';
      }
    }
    // Birth chart experience options
    if (field === 'hadBirthChart') {
      switch (option) {
        case 'Yes, they have done it to me': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/yes.webp';
        case 'No, I haven\'t done it': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/no.webp';
      }
    }
    // Recent thoughts options
    if (field === 'recentThoughts') {
      switch (option) {
        case 'Career': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/careers.webp';
        case 'Financial issues': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/financial_issues.webp';
        case 'Love': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/love.webp';
        case 'Health': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/health.webp';
        case 'Family life': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/family_life.webp';
        case 'Friendships': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/friendships.webp';
      }
    }
    // Element options
    if (field === 'element') {
      switch (option) {
        case 'Fire': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/fire.webp';
        case 'Water': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/water.webp';
        case 'Land': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/earth.webp';
        case 'Air': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/air.webp';
      }
    }
    // Personality traits options
    if (field === 'personality') {
      switch (option) {
        case 'Emotional': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/emotional.webp';
        case 'Logical': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/logical.webp';
        case 'Intelligent': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/intelligent.webp';
        case 'Enthusiastic': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/enthusiastic.webp';
        case 'Bossy': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/bossy.webp';
        case 'Introvert': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/introvert.webp';
        case 'Reliable': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/reliable.webp';
        case 'Moody': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/moody.webp';
        case 'Aesthetic': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/aesthetic.webp';
        case 'Open-minded': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/open_minded.webp';
        case 'Children\'s': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/childrens.webp';
        case 'Positive': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/positive.webp';
        case 'It\'s intimate': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/intimate.webp';
        case 'Leal': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/leal.webp';
        case 'Honest': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/honest.webp';
        case 'Pessimistic': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/pessimistic.webp';
      }
    }
    // Compatible signs - use zodiac images
    if (field === 'compatibleSigns') {
      const zodiacImages: { [key: string]: string } = {
        'Aries': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/aries_picture.webp',
        'Taurus': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/taurus_picture.webp',
        'Gemini': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/gemini_picture.webp',
        'Cancer': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/cancer_picture.webp',
        'Leo': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/leo_picture.webp',
        'Virgo': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/virgo_picture.webp',
        'Libra': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/libra_picture.webp',
        'Scorpio': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/scorpio_picture.webp',
        'Sagittarius': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/sagittarius_picture.webp',
        'Capricorn': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/capricorn_picture.webp',
        'Aquarius': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/aquarius_picture.webp',
        'Pisces': 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/pisces_picture.webp'
      };
      return zodiacImages[option];
    }
    // Misunderstood options
    if (field === 'misunderstood') {
      switch (option) {
        case 'Very often': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/very_often.webp';
        case 'Sometimes': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/sometimes.webp';
        case 'Rarely': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/rarely.webp';
        case 'Never': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/never.webp';
      }
    }
    // Partner gestures options
    if (field === 'partnerGestures') {
      switch (option) {
        case 'Approval statements': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/approval_sentiments.webp';
        case 'Material things': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/material_things.webp';
        case 'Affective behaviors': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/affective_behavior.webp';
        case 'Quality time': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/quality_time.webp';
        case 'Physical intimacy': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/physical_intimacy.webp';
      }
    }
    // Favorite activity options
    if (field === 'favoriteActivity') {
      switch (option) {
        case 'Do sports': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/sportive.webp';
        case 'Read a book': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/reader.webp';
        case 'See live performances': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/performer.webp';
        case 'Watch a movie or series': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/watcher.webp';
      }
    }
    // Living place options
    if (field === 'livingPlace') {
      switch (option) {
        case 'Traveling all the time': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/traveler.webp';
        case 'Coastal city': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/coastal_city.webp';
        case 'Metropolis': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/metropolis.webp';
        case 'Secluded cabin': return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/secluded_cabin.webp';
      }
    }
    return null;
  };

  const getTransitionImage = () => {
    // Steps that need images at the top: 4, 9, 11, 14, 18, 19, 22, 24 (0-indexed)
    const imageSteps = [4, 9, 11, 14, 18, 19, 22, 24];
    if (imageSteps.includes(currentStep)) {
      switch (currentStep) {
        case 4: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/great_transition.webp';
        case 9: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/birth_chart_scientific_transition.webp';
        case 11: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/promised_aspects.webp';
        case 14: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/tenth_house.webp';
        case 18: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/relationship_and_marriage.webp';
        case 19: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/find_hidden_talent.webp';
        case 22: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/seventh_house.webp';
        case 24: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/complete_birth_chart.webp';
        default: return 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/birth_chart_picture.webp';
      }
    }
    return null;
  };

  const getTransitionTitle = () => {
    switch (currentStep) {
      case 0: return 'Take the time to answer your questions';
      case 4: return 'Great!';
      case 9: return 'The birth chart is not a prediction.';
      case 11: return 'Promised aspects:';
      case 14: return 'Tenth House:';
      case 18: return 'Relationships and marriage:';
      case 19: return 'Thanks for sharing this information!';
      case 22: return 'Seventh House:';
      case 24: return 'Your astrological analysis is complete.';
      default: return null;
    }
  };

  const getTransitionText = () => {
    switch (currentStep) {
      case 0: return 'that way we can get to know you better, which will allow us to recommend personalized content based on your interests.';
      case 4: return 'The location of the Sun, the Moon and the planets on the exact day and moment of our birth defines our birth chart.';
      case 9: return 'It is a tool to interpret astrology in a scientific way. It can only be prepared and interpreted by certified and experienced experts.';
      case 11: return 'Understand what they have offered you, the topics you need to delve into, your inclinations and the attitude you should adopt.';
      case 14: return 'What are your goals and responsibilities in life? Are you focused on career, fame, success or career advancement? Get ready to find out.';
      case 18: return 'The birth chart is not used to predict who we will marry, but it can indicate the most favorable dates to get married.';
      case 19: return 'Our purpose is to elevate your self-awareness and facilitate the discovery of your hidden talents.';
      case 22: return 'In the Seventh House, you will find important aspects related to your intimate relationships, business partnerships, agreements, marriage and partnership. Pay attention to these details.';
      default: return currentStepData.content;
    }
  };

  const renderSpecialField = () => {
    const field = currentStepData.field!;
    if (field === 'birthDate') {
      return (
        <div className="space-y-6">
          {/* Astrea Info Section */}
          <div className="mb-8">
            <h3 className="text-lg heading-cosmic text-white mb-4 text-center">What does Astrea offer us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Your birth chart',
                  image: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/birth_chart_picture.webp'
                },
                {
                  title: 'The most important decisions',
                  image: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/most_important_decision.webp'
                },
                {
                  title: 'Marriage and relationships',
                  image: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/marriage_and_relationship.webp'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative h-32 rounded-lg border border-purple-500/20 text-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/50" />

                  {/* Text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p className="text-mystical text-white text-sm font-medium text-center leading-tight">
                      {item.title}
                    </p>
                  </div>
                  {/* Fallback for images that fail to load */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="hidden"
                    onError={(e) => {
                      // Remove background image if it fails to load
                      const container = e.currentTarget.parentElement as HTMLElement;
                      if (container) {
                        container.style.backgroundImage = 'linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(160, 82, 45, 0.3))';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Date Selection */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm nav-text text-white/80 mb-2">Day</label>
              <select
                value={formData.birthDate.day}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  birthDate: { ...prev.birthDate, day: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm nav-text text-white/80 mb-2">Month</label>
              <select
                value={formData.birthDate.month}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  birthDate: { ...prev.birthDate, month: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm nav-text text-white/80 mb-2">Year</label>
              <select
                value={formData.birthDate.year}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  birthDate: { ...prev.birthDate, year: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
      );
    }
    if (field === 'birthTime') {
      return (
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="timeUnknown"
              checked={formData.birthTime.unknown}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                birthTime: { ...prev.birthTime, unknown: e.target.checked }
              }))}
              className="mr-2"
            />
            <label htmlFor="timeUnknown" className="text-mystical text-white/80">I don't know</label>
          </div>
          {!formData.birthTime.unknown && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm nav-text text-white/80 mb-2">Hour</label>
                <select
                  value={formData.birthTime.hour}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    birthTime: { ...prev.birthTime, hour: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm nav-text text-white/80 mb-2">Minute</label>
                <select
                  value={formData.birthTime.minute}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    birthTime: { ...prev.birthTime, minute: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
                >
                  <option value="">Minute</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      );
    }
    if (field === 'birthPlace') {
      return (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => handleCitySearch(e.target.value)}
              onFocus={() => {
                if (citySearchResults.length > 0) {
                  setShowCityResults(true);
                }
              }}
              placeholder="Search for your birth city..."
              className="w-full pl-12 pr-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {showCityResults && citySearchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-cosmic-dark/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
              {citySearchResults.map((result, index) => {
                const cityName = result.properties.city || result.properties.name;
                const stateName = result.properties.state;
                const countryName = result.properties.country;

                let displayName = cityName;
                if (stateName && stateName !== cityName) {
                  displayName += `, ${stateName}`;
                }
                displayName += `, ${countryName}`;
                return (
                  <button
                    key={`${result.properties.osm_type}-${result.properties.osm_id}`}
                    onClick={() => selectCity(result)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors border-b border-purple-500/10 last:border-b-0 flex items-center"
                  >
                    <MapPin className="text-purple-400 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <div className="text-white text-mystical">{displayName}</div>
                      <div className="text-white/60 text-xs text-mystical">
                        {result.geometry.coordinates[1].toFixed(4)}, {result.geometry.coordinates[0].toFixed(4)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected City Display */}
          {formData.birthPlace && (
            <div className="mt-3 p-3 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center">
              <Check className="text-green-400 mr-2" size={16} />
              <div>
                <div className="text-green-400 text-sm nav-text">Selected Location:</div>
                <div className="text-white text-mystical">{formData.birthPlace.display}</div>
                <div className="text-white/60 text-xs text-mystical">
                  Coordinates: {formData.birthPlace.lat.toFixed(4)}, {formData.birthPlace.lon.toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {showCityResults && citySearchResults.length === 0 && citySearchQuery.length >= 2 && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-cosmic-dark/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl z-50 p-4 text-center">
              <div className="text-white/60 text-mystical">No cities found for "{citySearchQuery}"</div>
              <div className="text-white/40 text-xs text-mystical mt-1">Try a different search term</div>
            </div>
          )}
        </div>
      );
    }
    if (field === 'name') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm nav-text text-white/80 mb-2">First Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="First name"
              className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
            />
          </div>
          <div>
            <label className="block text-sm nav-text text-white/80 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Last name"
              className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
            />
          </div>
        </div>
      );
    }
    if (field === 'email') {
      return (
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
        />
      );
    }
    return null;
  };

  const getGridLayout = (field?: string) => {
    // Single row layouts
    if (field === 'gender' || field === 'element' || field === 'misunderstood' ||
        field === 'favoriteActivity' || field === 'livingPlace') {
      return 'flex flex-wrap justify-center gap-4';
    }

    // 3x2 grid layouts
    if (field === 'sentimentalSituation' || field === 'recentThoughts') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto';
    }

    // 2 items centered
    if (field === 'hadBirthChart') {
      return 'flex justify-center gap-8';
    }

    // 3 on first row, 2 centered on second row for partner gestures
    if (field === 'partnerGestures') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto';
    }

    // Default grid for other fields
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  };

  const getCardSize = (field?: string) => {
    // Single row layouts get wider cards
    if (field === 'gender' || field === 'element' || field === 'misunderstood' ||
        field === 'favoriteActivity' || field === 'livingPlace') {
      return 'w-40 h-32';
    }

    // 2 items get larger cards
    if (field === 'hadBirthChart') {
      return 'w-48 h-32';
    }

    // Default size
    return 'h-32';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm nav-text text-white/60">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm nav-text text-white/60">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-cosmic-dark/50 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <Card className="p-8 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1">
              {currentStepData.type === 'transition' ? (
                <div className="text-center py-12">
                  {/* Image at top for specific steps */}
                  {getTransitionImage() && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`mx-auto mb-8 rounded-full border-2 border-gold/50 shadow-lg shadow-gold/25 overflow-hidden ${
                        [4, 9, 11, 14, 18, 19, 22, 24].includes(currentStep) ? 'w-48 h-48' : 'w-32 h-32'
                      }`}
                    >
                      <img
                        src={getTransitionImage()!}
                        alt="Astrea"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 items-center justify-center">
                        <Sparkles className="text-white" size={32} />
                      </div>
                    </motion.div>
                  )}
                  {/* First step special layout */}
                  {currentStep === 0 ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <div className="w-3/5 pr-8">
                        <h2 className="text-3xl heading-cosmic text-white font-bold mb-6 text-left">
                          {getTransitionTitle()}
                        </h2>
                        <p className="text-lg text-mystical text-white/80 leading-relaxed text-left">
                          {getTransitionText()}
                        </p>
                      </div>
                      <div className="w-2/5 flex justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-48 h-48 rounded-full border-2 border-gold/50 shadow-lg shadow-gold/25 overflow-hidden"
                        >
                          <img
                            src="https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/birth_chart_picture.webp"
                            alt="Birth Chart"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 items-center justify-center">
                            <Sparkles className="text-white" size={32} />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ) : getTransitionTitle() ? (
                    /* Steps with title/text split */
                    <div>
                      <h2 className="text-3xl heading-cosmic text-white font-bold mb-6">
                        {getTransitionTitle()}
                      </h2>
                      {currentStep !== 24 && (
                        <p className="text-lg text-mystical text-white/80 leading-relaxed max-w-2xl mx-auto">
                          {getTransitionText()}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Simple centered text for step 2 */
                    <h2 className="text-2xl heading-cosmic text-white leading-relaxed max-w-2xl mx-auto">
                      {currentStepData.content}
                    </h2>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl heading-cosmic text-white mb-8 text-center">
                    {currentStepData.content}
                  </h2>
                  {currentStepData.isSpecial ? (
                    <div className="max-w-md mx-auto">
                      {renderSpecialField()}
                    </div>
                  ) : (
                    <div className={getGridLayout(currentStepData.field)}>
                      {currentStepData.options?.map((option, index) => {
                        const isSelected = currentStepData.multiple
                          ? (formData[currentStepData.field!] as string[]).includes(option)
                          : formData[currentStepData.field!] === option;
                        const imageUrl = getOptionImage(option, currentStepData.field);
                        return (
                          <motion.button
                            key={option}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            onClick={() => handleOptionSelect(option)}
                            className={`relative rounded-lg border transition-all duration-300 text-center group overflow-hidden ${getCardSize(currentStepData.field)} ${
                              isSelected
                                ? 'border-purple-400 ring-2 ring-purple-400/50'
                                : 'border-purple-500/20 hover:border-purple-400/40'
                            }`}
                            style={{
                              backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            {/* Dark overlay for better text readability */}
                            <div className={`absolute inset-0 transition-all duration-300 ${
                              isSelected
                                ? 'bg-purple-500/40'
                                : 'bg-black/40 group-hover:bg-purple-500/20'
                            }`} />

                            {/* Text overlay */}
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                              <span className={`text-mystical font-semibold text-center leading-tight text-sm ${
                                isSelected ? 'text-white' : 'text-white/90'
                              }`}>
                                {option}
                              </span>
                            </div>
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            {/* Fallback for images that fail to load */}
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={option}
                                className="hidden"
                                onError={(e) => {
                                  // Remove background image if it fails to load
                                  const button = e.currentTarget.parentElement as HTMLElement;
                                  if (button) {
                                    button.style.backgroundImage = 'linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(160, 82, 45, 0.3))';
                                  }
                                }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                  {currentStepData.multiple && (
                    <p className="text-center text-mystical text-white/60 mt-4">
                      {currentStepData.field === 'compatibleSigns'
                        ? `Select exactly 3 options (${(formData[currentStepData.field!] as string[]).length}/3 selected)`
                        : `Select one or more options (${(formData[currentStepData.field!] as string[]).length} selected)`}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-purple-500/20">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center button-text"
              >
                <ChevronLeft size={20} className="mr-2" />
                Previous
              </Button>
              <Button
                variant="cosmic"
                onClick={handleNext}
                disabled={!canProceed || isLoading}
                className="flex items-center button-text"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </div>
                ) : isLastStep ? (
                  <>
                    <Star size={20} className="mr-2" />
                    Complete Analysis
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default MultiStepForm;
