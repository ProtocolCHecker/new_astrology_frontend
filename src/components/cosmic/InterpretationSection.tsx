import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sun, Moon, ArrowUp, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

interface InterpretationSectionProps {
  interpretation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  showOnlyEssence?: boolean;
  showOnlyCommunication?: boolean;
}

interface ParsedInterpretation {
  sunInterpretation: string;
  moonInterpretation: string;
  risingInterpretation: string;
  mercuryInterpretation: string;
  housePlacements: Array<{ house: string; planets: string; description: string }>;
  aspects: Array<{ aspect: string; planets: string; description: string; nature: string }>;
}

const InterpretationSection: React.FC<InterpretationSectionProps> = ({
  interpretation,
  sunSign,
  moonSign,
  risingSign,
  showOnlyEssence = false,
  showOnlyCommunication = false
}) => {
  const parseInterpretation = (text: string): ParsedInterpretation => {
    const sections = text.split('\n\n');
    
    let sunInterpretation = '';
    let moonInterpretation = '';
    let risingInterpretation = '';
    let mercuryInterpretation = '';
    const housePlacements: Array<{ house: string; planets: string; description: string }> = [];
    const aspects: Array<{ aspect: string; planets: string; description: string; nature: string }> = [];
    
    let currentSection = '';
    
    sections.forEach(section => {
      const lines = section.split('\n');
      
      if (section.includes('SUN IN')) {
        sunInterpretation = lines.slice(1).join(' ').trim();
      } else if (section.includes('MOON IN')) {
        moonInterpretation = lines.slice(1).join(' ').trim();
      } else if (section.includes('ASCENDANT IN') || section.includes('RISING IN')) {
        risingInterpretation = lines.slice(1).join(' ').trim();
      } else if (section.includes('MERCURY IN')) {
        mercuryInterpretation = lines.slice(1).join(' ').trim();
      } else if (section.includes('HOUSE PLACEMENTS')) {
        currentSection = 'houses';
      } else if (section.includes('PLANETARY ASPECTS')) {
        currentSection = 'aspects';
      } else if (currentSection === 'houses' && section.includes('House')) {
        const match = section.match(/House (\d+) \(([^)]+)\): (.+)/);
        if (match) {
          housePlacements.push({
            house: `House ${match[1]}`,
            planets: match[3],
            description: match[2]
          });
        }
      } else if (currentSection === 'aspects' && section.includes('(orb:')) {
        const aspectMatch = section.match(/(.+) \(orb: ([\d.]+)°\)/);
        const descriptionMatch = section.match(/This indicates (.+) between (.+)\./);
        
        if (aspectMatch && descriptionMatch) {
          aspects.push({
            aspect: aspectMatch[1],
            planets: descriptionMatch[2],
            description: descriptionMatch[1],
            nature: descriptionMatch[1]
          });
        }
      }
    });
    
    return {
      sunInterpretation,
      moonInterpretation,
      risingInterpretation,
      mercuryInterpretation,
      housePlacements,
      aspects
    };
  };

  const parsed = parseInterpretation(interpretation);

  // Show only Cosmic Essence section
  if (showOnlyEssence) {
    return (
      <Card className="p-8">
        <h3 className="text-2xl heading-cosmic mb-8 text-white text-center flex items-center justify-center">
          <Sparkles className="text-gold mr-3" size={24} />
          Your Cosmic Essence
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sun Sign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                <Sun className="text-white" size={24} />
              </div>
              <h4 className="text-xl heading-cosmic text-gold mb-2">Sun in {sunSign}</h4>
              <p className="text-sm text-mystical text-white/60 mb-4">Your Core Identity</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gold/10 to-yellow-500/10 rounded-lg border border-gold/20">
              <p className="text-mystical text-white/80 leading-relaxed text-sm">
                {parsed.sunInterpretation || `As a ${sunSign}, you embody the core qualities of this sign in your essential nature.`}
              </p>
            </div>
          </motion.div>

          {/* Moon Sign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-silver to-blue-300 flex items-center justify-center">
                <Moon className="text-white" size={24} />
              </div>
              <h4 className="text-xl heading-cosmic text-silver mb-2">Moon in {moonSign}</h4>
              <p className="text-sm text-mystical text-white/60 mb-4">Your Emotional Nature</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-silver/10 to-blue-300/10 rounded-lg border border-silver/20">
              <p className="text-mystical text-white/80 leading-relaxed text-sm">
                {parsed.moonInterpretation || `Your ${moonSign} Moon reveals your emotional patterns and inner world.`}
              </p>
            </div>
          </motion.div>

          {/* Rising Sign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <ArrowUp className="text-white" size={24} />
              </div>
              <h4 className="text-xl heading-cosmic text-purple-400 mb-2">Rising in {risingSign}</h4>
              <p className="text-sm text-mystical text-white/60 mb-4">Your Outer Persona</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
              <p className="text-mystical text-white/80 leading-relaxed text-sm">
                {parsed.risingInterpretation || `Your ${risingSign} Rising shapes how others perceive you.`}
              </p>
            </div>
          </motion.div>
        </div>
      </Card>
    );
  }

  // Show only Communication Style section
  if (showOnlyCommunication && parsed.mercuryInterpretation) {
    return (
      <Card className="p-8">
        <h3 className="text-xl heading-cosmic mb-6 text-white flex items-center">
          <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            ☿
          </div>
          Your Communication Style
        </h3>
        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
          <p className="text-mystical text-white/80 leading-relaxed">
            {parsed.mercuryInterpretation}
          </p>
        </div>
      </Card>
    );
  }

  // Return null if showing specific sections but they don't exist
  if (showOnlyEssence || showOnlyCommunication) {
    return null;
  }

  // Original full interpretation (not used in the new structure)
  return null;
};

export default InterpretationSection;