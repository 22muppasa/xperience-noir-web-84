
import React from 'react';

const AboutHero = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
            Our Story
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
            XPerience was founded with a vision to transform how people and organizations engage with technology through education and expert consulting.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
