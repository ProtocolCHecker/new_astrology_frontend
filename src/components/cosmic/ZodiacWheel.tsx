import React from 'react';
import { motion } from 'framer-motion';
import { zodiacSigns } from '../../utils/zodiac';

interface ZodiacWheelProps {
  selectedSign?: string;
  onSignSelect?: (sign: string) => void;
  size?: 'small' | 'medium' | 'large';
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  highlightBigThree?: boolean;
}

const ZodiacWheel: React.FC<ZodiacWheelProps> = ({ 
  selectedSign, 
  onSignSelect, 
  size = 'medium',
  sunSign,
  moonSign,
  risingSign,
  highlightBigThree = false
}) => {
  const sizeClasses = {
    small: 'w-48 h-48',
    medium: 'w-80 h-80',
    large: 'w-96 h-96'
  };

  const signSize = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg'
  };

  const getSignHighlight = (signName: string) => {
    if (!highlightBigThree) return null;
    
    if (signName === sunSign) return 'sun';
    if (signName === moonSign) return 'moon';
    if (signName === risingSign) return 'rising';
    return null;
  };

  const getSignStyles = (signName: string) => {
    const highlight = getSignHighlight(signName);
    const isSelected = selectedSign === signName;
    
    if (highlight) {
      switch (highlight) {
        case 'sun':
          return 'bg-gradient-to-r from-gold to-yellow-500 border-gold text-white shadow-lg shadow-gold/50 ring-2 ring-gold/30';
        case 'moon':
          return 'bg-gradient-to-r from-silver to-blue-300 border-silver text-white shadow-lg shadow-silver/50 ring-2 ring-silver/30';
        case 'rising':
          return 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/30';
        default:
          return '';
      }
    }
    
    if (isSelected) {
      return 'bg-gold/20 border-gold text-gold shadow-lg shadow-gold/25';
    }
    
    return 'bg-cosmic-dark/80 border-gold/40 text-white hover:bg-gold/10';
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gold/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-silver/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />

      {/* Zodiac signs */}
      {zodiacSigns.map((sign, index) => {
        const angle = (index * 30) - 90; // Start from top, 30 degrees apart
        const radius = size === 'small' ? 80 : size === 'medium' ? 140 : 170;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const highlight = getSignHighlight(sign.name);

        return (
          <motion.button
            key={sign.name}
            className={`absolute ${signSize[size]} rounded-full border backdrop-blur-sm
              flex items-center justify-center font-semibold transition-all duration-300 hover:scale-110 overflow-hidden
              ${getSignStyles(sign.name)}`}
            style={{
              left: `calc(50% + ${x}px - ${size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px'})`,
              top: `calc(50% + ${y}px - ${size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px'})`,
            }}
            onClick={() => onSignSelect?.(sign.name)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {sign.imageUrl ? (
              <motion.img 
                src={sign.imageUrl} 
                alt={sign.name}
                className="w-full h-full object-cover rounded-full"
                animate={highlight ? { rotate: 360 } : {}}
                transition={highlight ? { duration: 30, repeat: Infinity, ease: "linear" } : {}}
                onError={(e) => {
                  // Fallback to symbol if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
            ) : null}
            <motion.span 
              className={sign.imageUrl ? 'hidden' : 'block'}
              animate={highlight ? { rotate: 360 } : {}}
              transition={highlight ? { duration: 30, repeat: Infinity, ease: "linear" } : {}}
            >
              {sign.symbol}
            </motion.span>
          </motion.button>
        );
      })}

      {/* Center sun symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/50 shadow-lg shadow-gold/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <img
            src="https://res.cloudinary.com/dmzc2hu4h/image/upload/v1761623457/sun_picture_itahsw.png"
            alt="Sun"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to star symbol if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-r from-gold to-silver items-center justify-center text-cosmic-dark font-bold">
            ✦
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ZodiacWheel;