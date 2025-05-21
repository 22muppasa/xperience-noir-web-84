
import React from 'react';

const MissionVision = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We're on a mission to empower individuals and organizations with the digital skills and resources they need to thrive in today's technology-driven world.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Through accessible education, expert consulting, and community initiatives, we're building a more inclusive digital future where everyone has the opportunity to participate and succeed.
            </p>
            
            <h3 className="text-2xl font-medium mb-4">Our Values</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <p className="font-medium">Accessibility</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <p className="font-medium">Excellence</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <p className="font-medium">Innovation</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <p className="font-medium">Community</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <p className="font-medium">Impact</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Our Mission"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden mt-8">
              <img
                src="https://images.unsplash.com/photo-1486718448742-163732cd1544"
                alt="Our Values"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
