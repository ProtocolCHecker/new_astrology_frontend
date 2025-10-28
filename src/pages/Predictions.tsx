import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, User, MapPin, Clock, Search, Check, Sparkles, Sun, Moon, Zap, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PersonData } from '../types/astrology';
import { calculatePredictions, PredictionData } from '../utils/astrology';

interface PersonDataWithCoords extends PersonData {
  lat?: number;
  lng?: number;
}

// City search interfaces
interface CityResult {
  display_name: string;
  lat: string;
  lon: string;
  properties: {
    name: string;
    state?: string;
    country: string;
    city?: string;
  };
}

interface BirthPlace {
  display: string;
  lat: number;
  lon: number;
  raw: CityResult;
}

// Define PredictionAspect interface based on your backend response
interface PredictionAspect {
  date: string;
  transiting_planet: string;
  natal_planet: string;
  aspect_type: string;
  category: string;
  interpretation: string[];
  orb?: number;
}

const Predictions: React.FC = () => {
  const [personData, setPersonData] = useState<PersonDataWithCoords>({
    name: '',
    date: '',
    time: '',
    location: '',
    gender: 'Male',
    lat: undefined,
    lng: undefined
  });

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCityResults, setShowCityResults] = useState(false);
  const [selectedBirthPlace, setSelectedBirthPlace] = useState<BirthPlace | null>(null);
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Debounced city search
  React.useEffect(() => {
    if (citySearchQuery.length < 2) {
      setCityResults([]);
      setShowCityResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(citySearchQuery)}&limit=8`
        );
        const data = await response.json();
        
        const cities = data.features
          .filter((feature: any) => 
            feature.properties.type === 'city' || 
            feature.properties.type === 'town' || 
            feature.properties.type === 'village' ||
            feature.properties.osm_key === 'place'
          )
          .map((feature: any) => ({
            display_name: feature.properties.name,
            lat: feature.geometry.coordinates[1].toString(),
            lon: feature.geometry.coordinates[0].toString(),
            properties: {
              name: feature.properties.name,
              state: feature.properties.state,
              country: feature.properties.country,
              city: feature.properties.city || feature.properties.name
            }
          }));
        
        setCityResults(cities);
        setShowCityResults(true);
      } catch (error) {
        console.error('Error searching cities:', error);
        setCityResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearchQuery]);

  const handlePersonChange = (field: keyof PersonData, value: string) => {
    setPersonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (location: string, lat: number, lng: number) => {
    setPersonData(prev => ({
      ...prev,
      location,
      lat,
      lng
    }));
  };
  
  const handleCitySelect = (city: CityResult) => {
    const displayName = `${city.properties.name}${city.properties.state ? `, ${city.properties.state}` : ''}, ${city.properties.country}`;
    
    const birthPlace: BirthPlace = {
      display: displayName,
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lon),
      raw: city
    };
    
    setSelectedBirthPlace(birthPlace);
    handleLocationSelect(displayName, birthPlace.lat, birthPlace.lon);
    setShowCityResults(false);
    setCitySearchQuery('');
  };

  const handleClearSelection = () => {
    setSelectedBirthPlace(null);
    handleLocationSelect('', 0, 0);
    setCitySearchQuery('');
  };

  const handleCalculatePredictions = async () => {
    if (!personData.name || !personData.date || !personData.location) return;
    
    setIsCalculating(true);
    
    try {
      const predictionsResult = await calculatePredictions(personData);
      setPredictions(predictionsResult);
      console.log('Predictions result:', predictionsResult); // Debug log
    } catch (error) {
      console.error('Error calculating predictions:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsCalculating(false);
    }
  };

  // Helper function to parse predictions text into aspects
  const parseTextToAspects = (text: string): PredictionAspect[] => {
    if (!text || text === 'No transits available for this period') return [];
    
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
      // Try to extract info from the formatted text
      const lines = section.split('\n');
      const firstLine = lines[0] || '';
      
      // Extract planets and aspect from text like "Sun sextile Sun (Identity): ..."
      const match = firstLine.match(/(\w+)\s+(\w+)\s+(\w+)\s+\(([^)]+)\):\s*(.+)/);
      
      if (match) {
        const [, transitingPlanet, aspectType, natalPlanet, category, interpretationText] = match;
        return {
          date: new Date().toISOString().split('T')[0], // Default to today
          transiting_planet: transitingPlanet,
          natal_planet: natalPlanet,
          aspect_type: aspectType,
          category: category,
          interpretation: [interpretationText],
          orb: 0
        };
      }
      
      // Fallback for unparseable text
      return {
        date: new Date().toISOString().split('T')[0],
        transiting_planet: 'Unknown',
        natal_planet: 'Unknown',
        aspect_type: 'conjunction',
        category: 'General',
        interpretation: [section],
        orb: 0
      };
    }).filter(aspect => aspect.interpretation[0].length > 0);
  };

  const getAspectColor = (aspectType: string) => {
    switch (aspectType.toLowerCase()) {
      case 'conjunction': return 'text-red-400';
      case 'opposition': return 'text-orange-400';
      case 'square': return 'text-yellow-400';
      case 'trine': return 'text-green-400';
      case 'sextile': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'identity': return <Sun className="w-5 h-5" />;
      case 'emotion': return <Moon className="w-5 h-5" />;
      case 'love': return <Heart className="w-5 h-5" />;
      case 'communication': return <Zap className="w-5 h-5" />;
      case 'abundance': case 'growth': return <Sparkles className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'identity': return 'from-gold to-yellow-500';
      case 'emotion': return 'from-blue-400 to-cyan-400';
      case 'love': return 'from-pink-400 to-rose-400';
      case 'communication': return 'from-purple-400 to-indigo-400';
      case 'abundance': case 'growth': return 'from-green-400 to-emerald-400';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group aspects by category and take only first 3 per category
  const groupAspectsByCategory = (aspects: PredictionAspect[]) => {
    const grouped: { [category: string]: PredictionAspect[] } = {};
    
    aspects.forEach(aspect => {
      if (!grouped[aspect.category]) {
        grouped[aspect.category] = [];
      }
      if (grouped[aspect.category].length < 3) {
        grouped[aspect.category].push(aspect);
      }
    });
    
    return grouped;
  };

  const renderPredictionSection = (title: string, predictionText: string, icon: React.ReactNode, gradient: string) => {
    const aspects = parseTextToAspects(predictionText);
    const groupedAspects = groupAspectsByCategory(aspects);
    
    return (
      <Card className="p-6">
        <h3 className={`text-xl heading-cosmic mb-6 text-center bg-gradient-to-r ${gradient} bg-clip-text text-transparent flex items-center justify-center`}>
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        
        {aspects.length === 0 ? (
          <div className="text-center text-white/60 text-mystical py-8">
            {predictionText}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAspects).map(([category, categoryAspects], categoryIndex) => (
              <div key={category} className="space-y-3">
                <h4 className="text-lg heading-cosmic text-white flex items-center">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)} mr-3`}>
                    {getCategoryIcon(category)}
                  </div>
                  {category}
                </h4>
                
                <div className="space-y-3">
                  {categoryAspects.map((aspect, index) => (
                    <motion.div
                      key={`${category}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (categoryIndex * 3 + index) * 0.1 }}
                      className="p-4 bg-cosmic-dark/30 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h5 className="nav-text text-white text-sm">
                              {aspect.transiting_planet} {aspect.aspect_type} {aspect.natal_planet}
                            </h5>
                            <p className="text-xs text-mystical text-white/60">{formatDate(aspect.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm nav-text ${getAspectColor(aspect.aspect_type)}`}>
                            {aspect.aspect_type}
                          </span>
                          <p className="text-xs text-mystical text-white/50">
                            Orb: {Math.abs(aspect.orb || 0).toFixed(1)}°
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {aspect.interpretation.slice(0, 2).map((text, i) => (
                          <p key={i} className="text-mystical text-white/80 leading-relaxed text-sm">
                            {text}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  const renderSimplePredictionSection = (title: string, predictionText: string, icon: React.ReactNode, gradient: string) => {
    const aspects = parseTextToAspects(predictionText);
    
    return (
      <Card className="p-6">
        <h3 className={`text-xl heading-cosmic mb-6 text-center bg-gradient-to-r ${gradient} bg-clip-text text-transparent flex items-center justify-center`}>
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        
        {aspects.length === 0 ? (
          <div className="text-center text-white/60 text-mystical py-8">
            {predictionText}
          </div>
        ) : (
          <div className="space-y-4">
            {aspects.slice(0, 3).map((aspect, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-4 bg-cosmic-dark/30 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(aspect.category)}`}>
                      {getCategoryIcon(aspect.category)}
                    </div>
                    <div>
                      <h4 className="nav-text text-white">{aspect.category}</h4>
                      <p className="text-xs text-mystical text-white/60">{formatDate(aspect.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm nav-text ${getAspectColor(aspect.aspect_type)}`}>
                      {aspect.aspect_type}
                    </span>
                    <p className="text-xs text-mystical text-white/50">
                      {aspect.transiting_planet} → {aspect.natal_planet}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {aspect.interpretation.slice(0, 2).map((text, i) => (
                    <p key={i} className="text-mystical text-white/80 leading-relaxed text-sm">
                      {text}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl heading-primary mb-6 text-white">
            <Calendar className="inline mr-4 text-purple-400" size={48} />
            Cosmic <span className="text-purple-400 heading-zodiac">Predictions</span>
          </h1>
          <p className="text-xl text-mystical text-white/70 max-w-3xl mx-auto">
            Discover what the stars have in store for you. Get personalized astrological 
            predictions based on your birth chart and current planetary transits.
          </p>
        </motion.div>

        {!predictions ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8">
              <h3 className="text-2xl heading-cosmic mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Personal Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm nav-text text-white/80 mb-2">
                    <User className="inline mr-2" size={16} />
                    Name
                  </label>
                  <input
                    type="text"
                    value={personData.name}
                    onChange={(e) => handlePersonChange('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm nav-text text-white/80 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={personData.date}
                    onChange={(e) => handlePersonChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm nav-text text-white/80 mb-2">
                    <Clock className="inline mr-2" size={16} />
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    value={personData.time}
                    onChange={(e) => handlePersonChange('time', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
                  />
                  <p className="text-xs text-mystical text-white/50 mt-1">
                    If unknown, 12:00 PM will be used
                  </p>
                </div>

                <div>
                  <label className="block text-sm nav-text text-white/80 mb-2">
                    <Search className="inline mr-2" size={16} />
                    Place of Birth
                  </label>
                  
                  {selectedBirthPlace ? (
                    <div className="w-full px-4 py-3 bg-green-500/20 border border-green-400/40 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <Check className="text-green-400 mr-2" size={16} />
                        <span className="text-green-300 text-mystical">{selectedBirthPlace.display}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="text-white/60 hover:text-white text-sm nav-text"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                        <input
                          type="text"
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          placeholder="Search for your birth city..."
                          className="w-full pl-10 pr-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                          </div>
                        )}
                      </div>
                      
                      {showCityResults && cityResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-cosmic-dark/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                          {cityResults.map((city, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleCitySelect(city)}
                              className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors border-b border-purple-500/10 last:border-b-0"
                            >
                              <div className="flex items-center">
                                <MapPin className="text-purple-400 mr-3 flex-shrink-0" size={14} />
                                <div>
                                  <div className="text-white text-mystical">
                                    {city.properties.name}
                                    {city.properties.state && (
                                      <span className="text-white/60">, {city.properties.state}</span>
                                    )}
                                    <span className="text-white/60">, {city.properties.country}</span>
                                  </div>
                                  <div className="text-xs text-white/50 text-mystical">
                                    {parseFloat(city.lat).toFixed(4)}, {parseFloat(city.lon).toFixed(4)}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {showCityResults && cityResults.length === 0 && !isSearching && citySearchQuery.length >= 2 && (
                        <div className="absolute z-50 w-full mt-1 bg-cosmic-dark/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl p-4">
                          <div className="text-white/60 text-mystical text-center">
                            No cities found for "{citySearchQuery}"
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm nav-text text-white/80 mb-2">
                    Gender
                  </label>
                  <select
                    value={personData.gender}
                    onChange={(e) => handlePersonChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="text-center pt-4">
                  <Button
                    variant="cosmic"
                    size="lg"
                    onClick={handleCalculatePredictions}
                    disabled={!personData.name || !personData.date || !personData.location || isCalculating}
                    className="min-w-64 button-text"
                  >
                    {isCalculating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Reading the Stars...
                      </div>
                    ) : (
                      <>
                        <Star className="mr-2" size={20} />
                        Get My Predictions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header with person info */}
            <Card className="p-6 text-center">
              <h2 className="text-2xl heading-cosmic text-white mb-2">
                Cosmic Predictions for {personData.name}
              </h2>
              <p className="text-mystical text-white/70">
                Born on {new Date(personData.date).toLocaleDateString()} in {personData.location}
              </p>
            </Card>

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {renderPredictionSection(
                "Today's Energy",
                predictions.today,
                <Sun className="w-6 h-6" />,
                "from-gold to-yellow-500"
              )}
              
              {predictions.tomorrow && renderSimplePredictionSection(
                "Tomorrow's Forecast",
                predictions.tomorrow,
                <Calendar className="w-6 h-6" />,
                "from-green-400 to-emerald-400"
              )}
              
              {renderSimplePredictionSection(
                "Weekend Forecast",
                predictions.thisWeek,
                <Calendar className="w-6 h-6" />,
                "from-blue-400 to-cyan-400"
              )}
              
              {renderSimplePredictionSection(
                "Month-End Outlook",
                predictions.thisMonth,
                <Moon className="w-6 h-6" />,
                "from-purple-400 to-indigo-400"
              )}
              
              {renderSimplePredictionSection(
                "Year-End Vision",
                predictions.thisYear,
                <Sparkles className="w-6 h-6" />,
                "from-pink-400 to-rose-400"
              )}
            </div>

            {/* Actions */}
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={() => setPredictions(null)}
                className="button-text"
              >
                Get New Predictions
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Predictions;