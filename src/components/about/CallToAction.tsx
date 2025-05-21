
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-medium mb-6">Join Our Mission</h2>
        <p className="text-xl text-gray-300 mb-8">
          Whether you're looking to learn, teach, or partner with us, we'd love to hear from you.
        </p>
        <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black group">
          <Link to="/contact" className="flex items-center gap-2">
            Get in Touch
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
