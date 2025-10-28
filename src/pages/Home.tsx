import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, BookOpen, Calendar, Check, Star, HelpCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ZodiacWheel from '../components/cosmic/ZodiacWheel';
import FAQSection from '../components/ui/FAQSection';

const Home: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Birth Chart Analysis',
      description: 'Discover your cosmic blueprint with detailed planetary positions and interpretations.',
      path: '/birth-chart',
      imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/birth_chart_picture.webp'
    },
    {
      icon: Heart,
      title: 'Compatibility Readings',
      description: 'Explore the celestial chemistry between souls and find your cosmic match.',
      path: '/compatibility',
      imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/compatibility_picture.webp'
    },
    {
      icon: Calendar,
      title: 'Cosmic Predictions',
      description: 'Receive personalized astrological predictions for your future.',
      path: '/predictions',
      imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/daily_horoscope_picture.webp'
    },
    {
      icon: BookOpen,
      title: 'Cosmic Wisdom',
      description: 'Delve into ancient astrological knowledge and mystical insights.',
      path: '/blog',
      imageUrl: 'https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/cosmos_wisdom_picture.webp'
    }
  ];

  const benefits = [
    'Detailed astrological analysis',
    'Clarity in details',
    'Innovative interface technology',
    'High quality results',
    'Easy to use',
    'Support for multiple file formats'
  ];

  const faqs = [
    {
      question: "What is the astrological chart?",
      answer: "The natal chart or astrological chart is a personalized map of your cosmic trajectory, prepared by our expert astrologers. It offers a unique interpretation for each individual, revealing a detailed analysis of their personality. Through this tool, you will be able to understand your strengths and weaknesses, as well as anticipate possible events and areas of development. Additionally, it guides you on the optimal time to start meaningful relationships. In short, the analysis of the birth chart is an invaluable tool for self-knowledge and making conscious decisions."
    },
    {
      question: "What are the payment options available?",
      answer: "We accept various payment options, including credit and debit cards (Visa, MasterCard, American Express), PayPal and bank transfers. All payments are processed through secure platforms to ensure the protection of your financial information."
    },
    {
      question: "How can I report a bug?",
      answer: "To report a bug, please contact our support team through the 'Contact' section on our website. You can also send an email to contact@astrea.com. Provide a detailed description of the problem and, if possible, screenshots that can help our team resolve it faster."
    },
    {
      question: "Can I consult astrologers privately?",
      answer: "Yes, we offer private consultations with our astrologers. You can book a private session through our platform. During the consultation, you will have the opportunity to discuss your concerns in detail and receive personalized guidance based on your birth chart."
    },
    {
      question: "How long does it take to receive my birth chart?",
      answer: "The delivery time of your birth chart varies depending on the volume of requests we receive. Generally, it can take 3-5 business days to receive your complete birth chart. We will notify you by email once your letter is ready to download."
    },
    {
      question: "What can I do if I am not satisfied with the result?",
      answer: "If you are not satisfied with the result of your birth chart, we invite you to contact our support team to discuss your concerns. We want to ensure that you have a satisfactory experience and will work with you to resolve any issues or concerns you may have."
    },
    {
      question: "Is the platform compatible with mobile devices and tablets?",
      answer: "Yes, our platform is optimized to be compatible with mobile devices and tablets. You can access all features and services from your smartphone or tablet, ensuring a smooth and convenient user experience no matter what device you use."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl heading-primary mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-shimmer">
              Welcome to
              <br />
              <span className="text-gold heading-zodiac">Astrea</span>
            </h1>
            <p className="text-xl md:text-2xl text-mystical text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Journey through the celestial realms where ancient wisdom meets modern insight. 
              Discover your cosmic destiny written in the stars with Astrea's mystical guidance.
            </p>
            
            {/* Pricing Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <div className="text-center space-y-2">
                <p className="text-lg text-mystical text-gold/90 font-medium">
                  Try for €0.50 for 24 hours.
                </p>
                <p className="text-base text-mystical text-white/70">
                  If you are satisfied, get regular astrological analyzes without obligation for only €39.99 per month.
                </p>
              </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/birth-chart">
                <Button variant="cosmic" size="lg" className="w-full sm:w-auto button-text">
                  <Sparkles className="mr-2" size={20} />
                  Create Your Birth Chart
                </Button>
              </Link>
              <Link to="/predictions">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto button-text">
                  <Calendar className="mr-2" size={20} />
                  Get Predictions
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Zodiac Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-20"
          >
            <ZodiacWheel size="large" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl heading-primary mb-6 text-white">
              Explore Your <span className="text-gold heading-zodiac">Cosmic Journey</span>
            </h2>
            <p className="text-xl text-mystical text-white/70 max-w-2xl mx-auto">
              Unlock the mysteries of the universe through Astrea's mystical tools and celestial wisdom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
              >
                <Link to={feature.path}>
                  <Card className="p-8 h-full text-center group cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold/40 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gold/20">
                      {feature.imageUrl ? (
                        <img 
                          src={feature.imageUrl} 
                          alt={feature.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 items-center justify-center ${feature.imageUrl ? 'hidden' : 'flex'}`}>
                        <feature.icon size={32} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl heading-cosmic mb-4 text-white group-hover:text-gold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-mystical text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Trial Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          >
            {/* Left Side - Benefits */}
            <Card className="p-8" variant="glass">
              <h3 className="text-2xl heading-cosmic text-white mb-8">
                Access all the benefits:
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                    <span className="text-mystical text-white/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Right Side - Trial Plan */}
            <Card className="p-8 text-center" variant="cosmic">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <h3 className="text-xl heading-cosmic text-white mb-4">
                  Activate all features with our
                </h3>
                <h4 className="text-2xl heading-zodiac text-gold mb-2">
                  24-hour trial plan
                </h4>
                <div className="text-5xl font-bold text-gold mb-6 heading-primary">
                  0.50€
                </div>
                
                <p className="text-mystical text-white/70 mb-6 leading-relaxed">
                  All of our plans include email support and high-quality printable downloads.
                </p>
                
                <Link to="/birth-chart">
                  <Button variant="secondary" size="lg" className="w-full mb-6 button-text">
                    <Star className="mr-2" size={20} />
                    Try it now
                  </Button>
                </Link>
                
                <p className="text-xs text-mystical text-white/60">
                  Your subscription will automatically renew if you do not cancel it for €39.99/month.
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl heading-primary mb-6 text-white">
              <HelpCircle className="inline mr-4 text-purple-400" size={48} />
              Frequently Asked <span className="text-purple-400 heading-zodiac">Questions</span>
            </h2>
            <p className="text-xl text-mystical text-white/70 max-w-2xl mx-auto">
              Find answers to common questions about our astrological services and platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
          >
            <FAQSection faqs={faqs} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;