import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BlogPost } from '../types/astrology';

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Understanding Your Moon Phase Birth Chart',
      excerpt: 'Discover how the lunar cycle at your birth influences your emotional patterns and intuitive abilities throughout life.',
      content: '',
      category: 'cosmic-events',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      publishedAt: '2025-01-15',
      readTime: 8
    },
    {
      id: '2',
      title: 'Mercury Retrograde: Myth vs Reality',
      excerpt: 'Learn the truth about Mercury retrograde and how to navigate these cosmic periods with grace and wisdom.',
      content: '',
      category: 'cosmic-events',
      image: 'https://images.pexels.com/photos/2240772/pexels-photo-2240772.jpeg',
      publishedAt: '2025-01-12',
      readTime: 6
    },
    {
      id: '3',
      title: 'The Spiritual Journey of Scorpio Season',
      excerpt: 'Dive deep into the transformative energies of Scorpio season and how it affects all zodiac signs.',
      content: '',
      category: 'sign-spotlights',
      image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
      publishedAt: '2025-01-10',
      readTime: 10
    },
    {
      id: '4',
      title: 'Daily Meditation Practices by Element',
      excerpt: 'Align your meditation practice with your zodiac element for deeper spiritual connection and inner peace.',
      content: '',
      category: 'daily-guidance',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
      publishedAt: '2025-01-08',
      readTime: 5
    },
    {
      id: '5',
      title: 'The Great Conjunction: A New Age Begins',
      excerpt: 'Explore the significance of rare planetary alignments and their impact on humanity\'s spiritual evolution.',
      content: '',
      category: 'cosmic-events',
      image: 'https://images.pexels.com/photos/2303832/pexels-photo-2303832.jpeg',
      publishedAt: '2025-01-05',
      readTime: 12
    },
    {
      id: '6',
      title: 'Finding Your Life Purpose Through Astrology',
      excerpt: 'Use your birth chart to uncover your soul\'s mission and align with your highest potential.',
      content: '',
      category: 'daily-guidance',
      image: 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg',
      publishedAt: '2025-01-03',
      readTime: 9
    }
  ];

  const categories = [
    { id: 'all', label: 'All Posts', color: 'from-purple-500 to-blue-500' },
    { id: 'daily-guidance', label: 'Daily Guidance', color: 'from-gold to-yellow-500' },
    { id: 'cosmic-events', label: 'Cosmic Events', color: 'from-blue-500 to-cyan-500' },
    { id: 'sign-spotlights', label: 'Sign Spotlights', color: 'from-pink-500 to-rose-500' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-purple-500 to-blue-500';
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            <BookOpen className="inline mr-4 text-purple-400" size={48} />
            Cosmic <span className="text-purple-400">Wisdom</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Delve into the ancient mysteries of the cosmos. Discover profound insights, 
            celestial guidance, and timeless wisdom from the stars.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'cosmic' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? '' : 'hover:bg-white/10'}
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark/60 to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(filteredPosts[0].category)} text-white`}>
                      Featured • {getCategoryLabel(filteredPosts[0].category)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/60 text-sm space-x-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(filteredPosts[0].publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {filteredPosts[0].readTime} min read
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Read More
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
            >
              <Card className="overflow-hidden h-full group cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(post.category)} text-white`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {post.readTime} min
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <Card className="p-8 text-center" variant="glass">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join Our Cosmic Community
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Receive weekly cosmic insights, planetary updates, and exclusive astrological 
              guidance delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-cosmic-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              />
              <Button variant="cosmic">
                Subscribe
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;