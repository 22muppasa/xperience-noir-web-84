
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">Portfolio</h1>
            <p className="text-lg text-muted-foreground">
              Showcasing our work and achievements in youth development and community impact.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
