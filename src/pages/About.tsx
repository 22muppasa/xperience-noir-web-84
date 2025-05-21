
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import CompanyTimeline from '@/components/about/CompanyTimeline';
import TeamSection from '@/components/about/TeamSection';
import CallToAction from '@/components/about/CallToAction';
import ThemeToggle from '@/components/ThemeToggle';

const About = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <AboutHero />
      <MissionVision />
      <CompanyTimeline />
      <TeamSection />
      <CallToAction />
      <ThemeToggle />
    </div>
  );
};

export default About;
