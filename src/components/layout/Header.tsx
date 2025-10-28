import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const { user, login, register, logout, isLoading } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/birth-chart', label: 'Birth Chart' },
    { path: '/compatibility', label: 'Compatibility' },
    { path: '/predictions', label: 'Predictions' },
    { path: '/blog', label: 'Cosmic Wisdom' },
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = isLogin ? await login(email, password) : await register(email, password);
    if (success) {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-full overflow-hidden"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://res.cloudinary.com/dmzc2hu4h/image/upload/v1761623457/astrea_logo_ftfqw1.webp"
                  alt="Astrea Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to star icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <span className="text-xl heading-cosmic bg-gradient-to-r from-gold via-purple-400 to-blue-400 bg-clip-text text-transparent text-shadow-gold-glow">
                Astrea
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm nav-text transition-colors duration-300 relative group ${
                    location.pathname === item.path
                      ? 'text-purple-400'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 button-text">
                      <User size={16} />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-2 button-text"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="cosmic"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="button-text"
                >
                  Enter Astrea
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-cosmic-dark/95 backdrop-blur-xl border-t border-purple-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block nav-text text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="space-y-2 pt-4 border-t border-purple-500/20">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start button-text">
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full justify-start button-text"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="cosmic"
                  size="sm"
                  onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                  className="w-full button-text"
                >
                  Enter Astrea
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={isLogin ? 'Enter Astrea' : 'Join Astrea'}
      >
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm nav-text text-white/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm nav-text text-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-mystical"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="cosmic"
            size="lg"
            className="w-full button-text"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <p className="text-center text-mystical text-white/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 transition-colors nav-text"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </Modal>
    </>
  );
};

export default Header;