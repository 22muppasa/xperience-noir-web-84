
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const AnimatedBackground = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`animated-background ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="container" />
    </div>
  );
};

export default AnimatedBackground;
