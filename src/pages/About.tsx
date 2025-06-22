import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import CompanyTimeline from '@/components/about/CompanyTimeline';
import TeamSection from '@/components/about/TeamSection';
import CallToAction from '@/components/about/CallToAction';


const About = () => {

  
  return (
    <div className={`flex flex-col min-h-screen`}>
      <Navbar />
      <AboutHero />
      <MissionVision />
      <CompanyTimeline />
      <TeamSection />
      <CallToAction />
    </div>
  );
};

export default About;
