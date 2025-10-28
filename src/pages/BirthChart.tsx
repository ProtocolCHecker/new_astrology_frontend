import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Home, Users, ArrowUp, Sun, Moon } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DropdownSection from '../components/ui/DropdownSection';
import ZodiacWheel from '../components/cosmic/ZodiacWheel';
import InterpretationSection from '../components/cosmic/InterpretationSection';
import MultiStepForm from '../components/forms/MultiStepForm';
import { calculateBirthChart } from '../utils/astrology';
import { BirthChartData } from '../types/astrology';

const BirthChart: React.FC = () => {
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormComplete = async (formData: any) => {
  setIsCalculating(true);
  setError(null);
  
  try {
    const chart = await calculateBirthChart(
      formData.date, 
      formData.time, 
      formData.location,
      formData.gender,
      formData.lat, // Pass latitude
      formData.lng  // Pass longitude
    );
    setBirthChart(chart);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
  } finally {
    setIsCalculating(false);
  }
};

  const formatAspectName = (aspect: string): string => {
    return aspect.charAt(0).toUpperCase() + aspect.slice(1).toLowerCase();
  };

  const getAspectColor = (aspect: string): string => {
    switch (aspect.toLowerCase()) {
      case 'conjunction': return 'text-red-400';
      case 'opposition': return 'text-orange-400';
      case 'square': return 'text-yellow-400';
      case 'trine': return 'text-green-400';
      case 'sextile': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };

  const getHousePlacements = () => {
    if (!birthChart) return [];
    
    const housePlacements: { [key: number]: string[] } = {};
    
    birthChart.planets.forEach(planet => {
      if (!housePlacements[planet.house]) {
        housePlacements[planet.house] = [];
      }
      housePlacements[planet.house].push(planet.name);
    });
    
    return Object.entries(housePlacements).map(([house, planets]) => ({
      house: parseInt(house),
      planets: planets.join(', '),
      meaning: birthChart.houses.find(h => h.number === parseInt(house))?.meaning || ''
    }));
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
            Your <span className="text-gold heading-zodiac">Birth Chart</span>
          </h1>
          <p className="text-xl text-mystical text-white/70 max-w-3xl mx-auto">
            Unveil the cosmic blueprint of your soul with Astrea. Your birth chart reveals the exact planetary 
            positions at the moment you entered this world, holding the keys to your destiny.
          </p>
        </motion.div>

        {!birthChart ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <MultiStepForm onComplete={handleFormComplete} isLoading={isCalculating} />
            
            {error && (
              <div className="mt-6 max-w-2xl mx-auto p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <p className="text-red-300 text-mystical">{error}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* 1. Birth Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-xl heading-cosmic mb-4 text-white">Birth Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-cosmic-dark/30 rounded-lg">
                    <h4 className="text-purple-400 nav-text mb-1">Date & Time</h4>
                    <p className="text-mystical text-white">{birthChart.birthInfo.date}</p>
                    <p className="text-mystical text-white">{birthChart.birthInfo.time}</p>
                  </div>
                  <div className="p-3 bg-cosmic-dark/30 rounded-lg">
                    <h4 className="text-purple-400 nav-text mb-1">Location</h4>
                    <p className="text-mystical text-white">{birthChart.birthInfo.place}</p>
                  </div>
                  <div className="p-3 bg-cosmic-dark/30 rounded-lg">
                    <h4 className="text-purple-400 nav-text mb-1">Coordinates</h4>
                    <p className="text-mystical text-white">{birthChart.birthInfo.coordinates}</p>
                  </div>
                  <div className="p-3 bg-cosmic-dark/30 rounded-lg">
                    <h4 className="text-purple-400 nav-text mb-1">Timezone</h4>
                    <p className="text-mystical text-white">{birthChart.birthInfo.timezone}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 2. Your Cosmic Blueprint */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl heading-cosmic mb-6 text-white text-center">
                  Your Cosmic Blueprint
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <ZodiacWheel 
                      selectedSign={birthChart.sunSign} 
                      size="large"
                      sunSign={birthChart.sunSign}
                      moonSign={birthChart.moonSign}
                      risingSign={birthChart.risingSign}
                      highlightBigThree={true}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="text-center lg:text-left">
                      <h3 className="text-xl heading-cosmic text-gold mb-2">The Big Three</h3>
                      <p className="text-mystical text-white/70 mb-4">
                        The foundation of your astrological identity
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-gold/10 to-silver/10 rounded-lg border border-gold/20">
                        <h4 className="nav-text text-gold mb-1">☉ Sun Sign</h4>
                        <p className="text-mystical text-white text-lg">{birthChart.sunSign}</p>
                        <p className="text-mystical text-white/60 text-sm">Your core identity and life purpose</p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-silver/10 to-blue-500/10 rounded-lg border border-silver/20">
                        <h4 className="nav-text text-silver mb-1">☽ Moon Sign</h4>
                        <p className="text-mystical text-white text-lg">{birthChart.moonSign}</p>
                        <p className="text-mystical text-white/60 text-sm">Your emotions and inner world</p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                        <h4 className="nav-text text-purple-400 mb-1">↗ Rising Sign</h4>
                        <p className="text-mystical text-white text-lg">{birthChart.risingSign}</p>
                        <p className="text-mystical text-white/60 text-sm">How others perceive you</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 3. Your Cosmic Essence */}
            {birthChart.interpretation && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <InterpretationSection
                  interpretation={birthChart.interpretation}
                  sunSign={birthChart.sunSign}
                  moonSign={birthChart.moonSign}
                  risingSign={birthChart.risingSign}
                  showOnlyEssence={true}
                />
              </motion.div>
            )}

            {/* 4. Your Communication Style */}
            {birthChart.interpretation && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <InterpretationSection
                  interpretation={birthChart.interpretation}
                  sunSign={birthChart.sunSign}
                  moonSign={birthChart.moonSign}
                  risingSign={birthChart.risingSign}
                  showOnlyCommunication={true}
                />
              </motion.div>
            )}

            {/* 5. Planetary Positions (Dropdown) */}
            {/* 5. Sign Interpretations */}
            {birthChart.signInterpretations && birthChart.signInterpretations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl heading-cosmic mb-6 text-white text-center flex items-center justify-center">
                    <Star className="text-gold mr-3" size={24} />
                    Planetary Sign Interpretations
                  </h2>
                  <div className="space-y-6">
                    {birthChart.signInterpretations.map((interpretation, index) => {
                      const lines = interpretation.split('\n');
                      const title = lines[0];
                      const hook = lines.find(line => line.startsWith('Hook:'))?.replace('Hook: ', '') || '';
                      const core = lines.find(line => line.startsWith('Core:'))?.replace('Core: ', '') || '';
                      const special = lines.find(line => line.startsWith('Specially for you:'))?.replace('Specially for you: ', '') || '';
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                          className="p-6 bg-gradient-to-br from-cosmic-dark/40 to-purple-900/20 rounded-lg border border-gold/20"
                        >
                          <h3 className="text-xl heading-cosmic text-gold mb-3">{title}</h3>
                          {hook && (
                            <div className="mb-4 p-3 bg-gold/10 rounded-lg border-l-4 border-gold">
                              <p className="text-mystical text-white/90 italic">"{hook}"</p>
                            </div>
                          )}
                          {core && (
                            <div className="mb-4">
                              <h4 className="text-sm nav-text text-purple-400 mb-2">Core Essence</h4>
                              <p className="text-mystical text-white/80 leading-relaxed">{core}</p>
                            </div>
                          )}
                          {special && (
                            <div className="p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-400">
                              <h4 className="text-sm nav-text text-purple-400 mb-2">Specially for You</h4>
                              <p className="text-mystical text-white/80 leading-relaxed">{special}</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 6. House Interpretations */}
            {birthChart.houseInterpretations && birthChart.houseInterpretations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl heading-cosmic mb-6 text-white text-center flex items-center justify-center">
                    <Home className="text-blue-400 mr-3" size={24} />
                    House Placements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {birthChart.houseInterpretations.map((interpretation, index) => {
                      try {
                        const parsed = JSON.parse(interpretation);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                            className="p-6 bg-gradient-to-br from-cosmic-dark/40 to-blue-900/20 rounded-lg border border-blue-400/20"
                          >
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">{parsed.house}</span>
                              </div>
                              <div>
                                <h3 className="text-lg heading-cosmic text-blue-400">{parsed.planet} in {parsed.house} House</h3>
                              </div>
                            </div>
                            
                            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-400">
                              <p className="text-mystical text-white/90 italic">"{parsed.hook}"</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm nav-text text-blue-400 mb-2">Core Interpretation</h4>
                                <p className="text-mystical text-white/80 leading-relaxed text-sm">{parsed.core_interpretation}</p>
                              </div>
                              
                              <div className="p-3 bg-cyan-500/10 rounded-lg border-l-4 border-cyan-400">
                                <h4 className="text-sm nav-text text-cyan-400 mb-2">Personal Insight</h4>
                                <p className="text-mystical text-white/80 leading-relaxed text-sm">{parsed.interpretation}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      } catch (e) {
                        return null;
                      }
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 7. Aspect Interpretations */}
            {birthChart.aspectInterpretations && birthChart.aspectInterpretations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl heading-cosmic mb-6 text-white text-center flex items-center justify-center">
                    <Users className="text-purple-400 mr-3" size={24} />
                    Planetary Aspects
                  </h2>
                  <div className="space-y-6">
                    {birthChart.aspectInterpretations.map((interpretation, index) => {
                      try {
                        const parsed = JSON.parse(interpretation);
                        const aspectColor = getAspectColor(parsed.aspect);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                            className="p-6 bg-gradient-to-br from-cosmic-dark/40 to-purple-900/20 rounded-lg border border-purple-400/20"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg heading-cosmic text-white">
                                {parsed.main} {parsed.aspect} {parsed.other}
                              </h3>
                              <span className={`text-sm nav-text ${aspectColor} px-3 py-1 rounded-full bg-cosmic-dark/50`}>
                                {parsed.aspect}
                              </span>
                            </div>
                            
                            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-400">
                              <p className="text-mystical text-white/90 italic">"{parsed.hook}"</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm nav-text text-purple-400 mb-2">Core Description</h4>
                                <p className="text-mystical text-white/80 leading-relaxed text-sm">{parsed.core_description}</p>
                              </div>
                              
                              <div className="p-3 bg-pink-500/10 rounded-lg border-l-4 border-pink-400">
                                <h4 className="text-sm nav-text text-pink-400 mb-2">Personal Expression</h4>
                                <p className="text-mystical text-white/80 leading-relaxed text-sm">{parsed.gender_description}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      } catch (e) {
                        return null;
                      }
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 10. Your Cosmic Journey Awaits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="p-8 text-center" variant="glass">
                <h3 className="text-xl heading-cosmic mb-4 text-white flex items-center justify-center">
                  <Sparkles className="text-gold mr-3" size={24} />
                  Your Cosmic Journey Awaits
                </h3>
                <p className="text-mystical text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Your birth chart reveals the intricate cosmic patterns that shape your personality, 
                  relationships, and life path. Each interpretation offers deep insights into 
                  your soul's unique journey through this lifetime.
                </p>
                <div className="mt-6 flex justify-center">
                  <Star className="text-gold animate-pulse" size={24} />
                </div>
              </Card>
            </motion.div>

            {/* Actions */}
            <div className="text-center space-y-4">
              <Button
                variant="secondary"
                onClick={() => setBirthChart(null)}
                className="button-text"
              >
                Calculate Another Chart
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BirthChart;