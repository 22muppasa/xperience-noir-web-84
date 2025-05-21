
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const AboutHero = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section className={`py-12 md:py-20 px-4 md:px-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6 animate-fade-in">
            Our Story
          </h1>
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 md:mb-8 animate-fade-in animate-delay-100`}>
            XPerience was founded with a vision to transform how people and organizations engage with technology through education and expert consulting.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
