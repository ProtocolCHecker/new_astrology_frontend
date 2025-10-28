import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import VideoBackground from '../cosmic/VideoBackground';
import FloatingParticles from '../cosmic/FloatingParticles';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <VideoBackground />
      <FloatingParticles />
      
      <div className="relative z-20">
        <Header />
        <main className="pt-20">
          <Outlet />
        </main>
      </div>
      
      {/* Additional cosmic overlay gradients */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-pink-500/5 rounded-full filter blur-3xl" />
      </div>
    </div>
  );
};

export default Layout;