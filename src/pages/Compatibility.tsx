import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Clock, User, ArrowRight, Star, Sparkles, Users, Zap, AlertCircle, Search, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DropdownSection from '../components/ui/DropdownSection';
import { PersonData, DetailedCompatibilityResult } from '../types/astrology';
import { calculateDetailedCompatibility } from '../utils/astrology';

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

interface PersonDataWithCoords extends PersonData {
  lat?: number;
  lng?: number;
}
// Move PersonForm component OUTSIDE of the main component
const PersonForm = React.memo<{
  person: PersonDataWithCoords;
  onPersonChange: (field: keyof PersonDataWithCoords, value: string | number) => void;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  title: string;
  gradient: string;
}>(({ person, onPersonChange, onLocationSelect, title, gradient }) => {
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCityResults, setShowCityResults] = useState(false);
  const [selectedBirthPlace, setSelectedBirthPlace] = useState<BirthPlace | null>(null);

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

  const handleCitySelect = (city: CityResult) => {
    const displayName = `${city.properties.name}${city.properties.state ? `, ${city.properties.state}` : ''}, ${city.properties.country}`;
    
    const birthPlace: BirthPlace = {
      display: displayName,
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lon),
      raw: city
    };
    
    setSelectedBirthPlace(birthPlace);
    onLocationSelect(displayName, birthPlace.lat, birthPlace.lon);
    setShowCityResults(false);
    setCitySearchQuery('');
  };

  const handleClearSelection = () => {
    setSelectedBirthPlace(null);
    onLocationSelect('', 0, 0);
    setCitySearchQuery('');
  };

  return (
    <Card className="p-6">
    <h3 className={`text-xl heading-cosmic mb-6 text-center bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
      {title}
    </h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm nav-text text-white/80 mb-2">
          <User className="inline mr-2" size={16} />
          Name
        </label>
        <input
          type="text"
          value={person.name}
          onChange={(e) => onPersonChange('name', e.target.value)}
          placeholder="Enter name"
          className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm nav-text text-white/80 mb-2">
          <Calendar className="inline mr-2" size={16} />
          Date of Birth
        </label>
        <input
          type="date"
          value={person.date}
          onChange={(e) => onPersonChange('date', e.target.value)}
          className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm nav-text text-white/80 mb-2">
          <Clock className="inline mr-2" size={16} />
          Time of Birth
        </label>
        <input
          type="time"
          value={person.time}
          onChange={(e) => onPersonChange('time', e.target.value)}
          className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
          autoComplete="off"
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
                autoComplete="off"
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
          value={person.gender}
          onChange={(e) => onPersonChange('gender', e.target.value)}
          className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-mystical"
          autoComplete="off"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  </Card>
  );
});

const Compatibility: React.FC = () => {
  const [person1, setPerson1] = useState<PersonDataWithCoords>({
    name: '',
    date: '',
    time: '',
    location: '',
    gender: 'Male',
    lat: undefined,
    lng: undefined
  });
  
  const [person2, setPerson2] = useState<PersonDataWithCoords>({
    name: '',
    date: '',
    time: '',
    location: '',
    gender: 'Male',
    lat: undefined,
    lng: undefined
  });

  const [result, setResult] = useState<DetailedCompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to prevent unnecessary re-renders
  const handlePerson1Change = useCallback((field: keyof PersonDataWithCoords, value: string | number) => {
    setPerson1(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePerson2Change = useCallback((field: keyof PersonDataWithCoords, value: string | number) => {
    setPerson2(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePerson1LocationSelect = useCallback((location: string, lat: number, lng: number) => {
    setPerson1(prev => ({
      ...prev,
      location,
      lat,
      lng
    }));
  }, []);

  const handlePerson2LocationSelect = useCallback((location: string, lat: number, lng: number) => {
    setPerson2(prev => ({
      ...prev,
      location,
      lat,
      lng
    }));
  }, []);
  const handleCalculate = async () => {
    if (!person1.name || !person1.date || !person1.location || 
        !person2.name || !person2.date || !person2.location) return;
    
    setIsCalculating(true);
    setError(null);
    
    try {
      const compatibilityResult = await calculateDetailedCompatibility(person1, person2);
      setResult(compatibilityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getAspectColor = (aspect: string) => {
    switch (aspect.toLowerCase()) {
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
      case 'identity & self':
        return <Star className="w-5 h-5 text-white" />;
      case 'emotions & bonding':
        return <Heart className="w-5 h-5 text-white" />;
      case 'communication & intellect':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'love & affection':
        return <Heart className="w-5 h-5 text-white" />;
      case 'passion & drive':
        return <Zap className="w-5 h-5 text-white" />;
      case 'growth & expansion':
        return <ArrowRight className="w-5 h-5 text-white" />;
      case 'commitment & structure':
        return <Users className="w-5 h-5 text-white" />;
      case 'power & transformation':
        return <Star className="w-5 h-5 text-white" />;
      case 'dreams & freedom':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'public persona & ambitions':
        return <Users className="w-5 h-5 text-white" />;
      default:
        return <Star className="w-5 h-5 text-white" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'identity & self':
        return 'from-gold to-yellow-500';
      case 'emotions & bonding':
        return 'from-pink-500 to-rose-500';
      case 'communication & intellect':
        return 'from-blue-500 to-cyan-500';
      case 'love & affection':
        return 'from-red-500 to-pink-500';
      case 'passion & drive':
        return 'from-orange-500 to-red-500';
      case 'growth & expansion':
        return 'from-green-500 to-emerald-500';
      case 'commitment & structure':
        return 'from-gray-500 to-slate-500';
      case 'power & transformation':
        return 'from-purple-500 to-indigo-500';
      case 'dreams & freedom':
        return 'from-cyan-500 to-blue-500';
      case 'public persona & ambitions':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl heading-primary mb-6 text-white">
            <Heart className="inline mr-4 text-pink-400" size={48} />
            Cosmic <span className="text-pink-400 heading-zodiac">Compatibility</span>
          </h1>
          <p className="text-xl text-mystical text-white/70 max-w-3xl mx-auto">
            Discover the celestial chemistry between souls. Explore how the stars influence 
            love, friendship, and partnerships through detailed astrological analysis.
          </p>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {error && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center">
                <AlertCircle className="text-red-400 mr-3" size={20} />
                <p className="text-red-300 text-mystical">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PersonForm
                person={person1}
                onPersonChange={handlePerson1Change}
                onLocationSelect={handlePerson1LocationSelect}
                title="First Person"
                gradient="from-purple-400 to-blue-400"
              />
              
              <PersonForm
                person={person2}
                onPersonChange={handlePerson2Change}
                onLocationSelect={handlePerson2LocationSelect}
                title="Second Person"
                gradient="from-pink-400 to-rose-400"
              />
            </div>

            <div className="text-center">
              <Button
                variant="cosmic"
                size="lg"
                onClick={handleCalculate}
                disabled={!person1.name || !person1.date || !person1.location || 
                         !person2.name || !person2.date || !person2.location || isCalculating}
                className="min-w-64 button-text"
              >
                {isCalculating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Reading the Stars...
                  </div>
                ) : (
                  <>
                    <Heart className="mr-2" size={20} />
                    Calculate Compatibility
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Overall Compatibility */}
            <Card className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="text-2xl font-bold text-purple-400">{person1.name}</div>
                <Heart className="mx-6 text-pink-400" size={32} />
                <div className="text-2xl font-bold text-pink-400">{person2.name}</div>
              </div>
              
              <div className="mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(result.overall_compatibility)} mb-2`}>
                  {result.overall_compatibility}%
                </div>
                <div className="text-white/60 text-mystical">Overall Compatibility</div>
              </div>
              
              <p className="text-lg text-mystical text-white/80 max-w-2xl mx-auto leading-relaxed">
                {result.interpretation.overall}
              </p>
            </Card>

            {/* Compatibility Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Overall', score: result.overall_compatibility, icon: Heart, description: 'General compatibility' },
                { label: 'Communication', score: result.aspect_compatibility, icon: Sparkles, description: 'How you communicate' },
                { label: 'Emotional', score: result.element_compatibility, icon: Star, description: 'Emotional connection' },
                { label: 'Intimacy', score: result.house_compatibility, icon: Users, description: 'Physical & intimate bond' },
                { label: 'Signs', score: result.sign_compatibility, icon: Zap, description: 'Zodiac compatibility' },
                { label: 'Special', score: result.special_compatibility, icon: Star, description: 'Unique connection' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center">
                    <item.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <h3 className="text-sm nav-text text-white mb-1">{item.label}</h3>
                    <div className={`text-2xl font-bold ${getScoreColor(item.score)} mb-2`}>
                      {item.score}%
                    </div>
                    <p className="text-xs text-mystical text-white/50">{item.description}</p>
                    <div className="w-full bg-cosmic-dark/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detailed Interpretations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Heart className="text-pink-400 mr-2" size={20} />
                  Overall Compatibility
                </h3>
                <p className="text-mystical text-white/80 leading-relaxed">
                  {result.interpretation.overall}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Sparkles className="text-blue-400 mr-2" size={20} />
                  Communication Style
                </h3>
                <p className="text-mystical text-white/80 leading-relaxed">
                  {result.interpretation.mars}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Star className="text-silver mr-2" size={20} />
                  Emotional Connection
                </h3>
                <p className="text-mystical text-white/80 leading-relaxed">
                  {result.interpretation.moon_signs}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Users className="text-purple-400 mr-2" size={20} />
                  Intimacy & Connection
                </h3>
                <p className="text-mystical text-white/80 leading-relaxed">
                  {result.interpretation.venus}
                </p>
              </Card>
            </div>

            {/* Key Aspects */}
            <Card className="p-6">
              <h3 className="text-xl heading-cosmic text-white mb-4">Key Aspects</h3>
              <div className="space-y-3">
                {result.interpretation.key_aspects.map((aspect, index) => (
                  <div key={index} className="flex items-start">
                    <ArrowRight className="text-purple-400 mr-3 mt-1 flex-shrink-0" size={16} />
                    <p className="text-mystical text-white/80">{aspect}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Synastry Aspects (Dropdown) */}
            {/* Categorized Synastry Aspects */}
            {result.categorized_synastry && Object.entries(result.categorized_synastry).map(([category, aspects], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 + categoryIndex * 0.1 }}
              >
                <DropdownSection
                  title={category}
                  icon={getCategoryIcon(category)}
                >
                  <div className="space-y-4">
                    {aspects.slice(0, 3).map((aspect, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-cosmic-dark/40 to-purple-900/20 rounded-lg border border-purple-400/20"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryGradient(category)}`}>
                              {getCategoryIcon(category)}
                            </div>
                            <div>
                              <h4 className="nav-text text-white">
                                {aspect.p1} {aspect.aspect} {aspect.p2}
                              </h4>
                              <p className="text-xs text-mystical text-white/60">
                                Orb: {Math.abs(aspect.orb).toFixed(1)}°
                              </p>
                            </div>
                          </div>
                          <span className={`text-sm nav-text ${getAspectColor(aspect.aspect)} px-3 py-1 rounded-full bg-cosmic-dark/50`}>
                            {aspect.aspect}
                          </span>
                        </div>
                        
                        <div className="p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-400">
                          <p className="text-mystical text-white/80 leading-relaxed text-sm">
                            {aspect.interpretation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </DropdownSection>
              </motion.div>
            ))}

            {/* Actions */}
            <div className="text-center space-y-4">
              <Button
                variant="secondary"
                onClick={() => setResult(null)}
                className="button-text"
              >
                Calculate Another Match
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Compatibility;