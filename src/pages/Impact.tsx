
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/ui/MetricCard';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "The coding camp changed my career trajectory completely. I went from working in retail to landing a junior developer position within three months of graduating.",
    name: "Taylor Johnson",
    title: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    quote: "As a nonprofit with limited resources, the pro bono consulting we received from XPerience transformed our online presence and helped us reach more people in need.",
    name: "Miguel Rodriguez",
    title: "Executive Director, Community First",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    quote: "The scholarship program allowed me to pursue education that would have otherwise been out of reach. Now I'm able to contribute to my community with the skills I've gained.",
    name: "Aisha Williams",
    title: "UX Designer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

const Impact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Our Impact
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              We're committed to making digital skills accessible to everyone and helping businesses thrive in the digital economy.
            </p>
          </div>
        </div>
      </section>
      
      {/* Impact Metrics */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">By The Numbers</h2>
            <p className="text-lg text-gray-600">
              Since 2018, we've been working to create meaningful impact in our community. Here's what we've accomplished together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Students Educated"
              value={4500}
              suffix="+"
              description="Graduates from our educational programs"
            />
            <MetricCard
              title="Career Transitions"
              value={85}
              suffix="%"
              description="Students who found jobs in tech"
              duration={2500}
            />
            <MetricCard
              title="Scholarships"
              value={750000}
              prefix="$"
              description="Awarded in educational scholarships"
              duration={3000}
            />
            <MetricCard
              title="Pro Bono Projects"
              value={120}
              description="Websites built for nonprofits"
              duration={2200}
            />
          </div>
        </div>
      </section>
      
      {/* Focus Areas */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Focus Areas</h2>
            <p className="text-lg text-gray-600">
              We focus our efforts on three key areas where we believe we can make the biggest difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  alt="Education Access" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Education Access</h3>
                <p className="text-gray-600 mb-6">
                  We provide scholarships and reduced tuition rates to ensure our programs are accessible to people from all backgrounds.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">2024-2025 Goal</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>$750,000 awarded</span>
                    <span>Goal: $1,000,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486718448742-163732cd1544"
                  alt="Nonprofit Support" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Nonprofit Support</h3>
                <p className="text-gray-600 mb-6">
                  We provide pro bono consulting and web development services to nonprofits making a difference in our communities.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">2024-2025 Goal</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>40 organizations</span>
                    <span>Goal: 50 organizations</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1527576539890-dfa815648363"
                  alt="Digital Inclusion" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Digital Inclusion</h3>
                <p className="text-gray-600 mb-6">
                  We work to close the digital divide through free workshops, resource centers, and community partnerships.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">2024-2025 Goal</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>12 communities</span>
                    <span>Goal: 20 communities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Impact Stories</h2>
            <p className="text-lg text-gray-600">
              Hear from people whose lives and organizations have been transformed through our programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white border rounded-lg p-8 hover-scale">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="italic text-gray-600">"{testimonial.quote}"</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Annual Report */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Annual Impact Report</h2>
              <p className="text-xl text-gray-300 mb-8">
                Take a deeper dive into our impact through our annual report. Learn about our programs, initiatives, and the stories behind the numbers.
              </p>
              <Button variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
                <a href="#" className="flex items-center gap-2">
                  Download 2024 Report
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1527576539890-dfa815648363"
                  alt="Impact Report Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625"
                  alt="Impact Report Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8">
            There are many ways to get involved and support our work. Together, we can create a more inclusive digital future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="group">
              <Link to="/get-involved" className="flex items-center gap-2">
                Get Involved
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="group">
              <Link to="/contact" className="flex items-center gap-2">
                Contact Us
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
