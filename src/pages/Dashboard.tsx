import React from 'react';
import { motion } from 'framer-motion';
import { User, Star, Heart, Calendar, BookOpen, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getHoroscope } from '../utils/astrology';
import { getZodiacSign } from '../utils/zodiac';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl heading-primary text-white mb-4">Access Denied</h1>
          <p className="text-mystical text-white/70">Please sign in to view your Astrea dashboard.</p>
        </div>
      </div>
    );
  }

  // Simulate user having a birth chart
  const userSign = user.birthChart?.sunSign || 'Aries';
  const todayHoroscope = getHoroscope(userSign);

  const quickActions = [
    { icon: Star, label: 'Create Birth Chart', path: '/birth-chart', color: 'from-purple-500 to-blue-500' },
    { icon: Heart, label: 'Check Compatibility', path: '/compatibility', color: 'from-pink-500 to-rose-500' },
    { icon: Calendar, label: 'Cosmic Predictions', path: '/predictions', color: 'from-gold to-yellow-500' },
    { icon: BookOpen, label: 'Cosmic Wisdom', path: '/blog', color: 'from-blue-500 to-cyan-500' }
  ];

  const recentReadings = [
    { type: 'Birth Chart', date: '2025-01-14', result: 'Comprehensive analysis completed' },
    { type: 'Compatibility', date: '2025-01-12', result: 'Aries + Leo: 87% compatible' },
    { type: 'Predictions', date: '2025-01-15', result: 'Cosmic energies favor new beginnings' }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl heading-primary text-white">
                Welcome back to <span className="text-purple-400 heading-zodiac">Astrea</span>
              </h1>
              <p className="text-mystical text-white/70">{user.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Guidance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl heading-cosmic text-white mb-4 flex items-center">
                  <Star className="text-gold mr-2" size={20} />
                  Today's Cosmic Guidance
                </h2>
                <div className="bg-gradient-to-r from-gold/10 to-purple-500/10 rounded-lg p-4 border border-gold/20">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getZodiacSign(new Date()).symbol}</span>
                    <span className="text-gold nav-text">{userSign}</span>
                  </div>
                  <p className="text-mystical text-white/80 leading-relaxed">{todayHoroscope}</p>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-xl heading-cosmic text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card key={action.label} className="p-4 group cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="nav-text text-white group-hover:text-purple-400 transition-colors">
                          {action.label}
                        </h3>
                        <p className="text-mystical text-white/60 text-sm">Explore now</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Recent Readings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-xl heading-cosmic text-white mb-4">Recent Readings</h2>
                <div className="space-y-4">
                  {recentReadings.map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-cosmic-dark/30 rounded-lg">
                      <div>
                        <h3 className="nav-text text-white text-sm">{reading.type}</h3>
                        <p className="text-mystical text-white/60 text-xs">{reading.result}</p>
                      </div>
                      <span className="text-mystical text-white/50 text-xs">{reading.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="p-6 text-center">
                <h3 className="text-lg heading-cosmic text-white mb-4">Your Cosmic Profile</h3>
                {user.birthChart ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                      <h4 className="text-gold text-sm nav-text">Sun Sign</h4>
                      <p className="text-mystical text-white">{user.birthChart.sunSign}</p>
                    </div>
                    <div className="p-3 bg-silver/10 rounded-lg border border-silver/20">
                      <h4 className="text-silver text-sm nav-text">Moon Sign</h4>
                      <p className="text-mystical text-white">{user.birthChart.moonSign}</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                      <h4 className="text-purple-400 text-sm nav-text">Rising Sign</h4>
                      <p className="text-mystical text-white">{user.birthChart.risingSign}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-mystical text-white/60 mb-4">Create your birth chart to unlock personalized insights</p>
                    <Button variant="cosmic" size="sm" className="button-text">
                      Create Chart
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Cosmic Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Calendar className="text-purple-400 mr-2" size={18} />
                  Cosmic Events
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-mystical text-white/70">New Moon</span>
                    <span className="text-purple-400 nav-text">Jan 18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mystical text-white/70">Mercury Direct</span>
                    <span className="text-green-400 nav-text">Jan 22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mystical text-white/70">Full Moon</span>
                    <span className="text-gold nav-text">Feb 3</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg heading-cosmic text-white mb-4 flex items-center">
                  <Settings className="text-blue-400 mr-2" size={18} />
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-mystical text-white/70 text-sm">Daily Notifications</span>
                    <div className="w-10 h-5 bg-purple-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mystical text-white/70 text-sm">Weekly Reports</span>
                    <div className="w-10 h-5 bg-gray-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;