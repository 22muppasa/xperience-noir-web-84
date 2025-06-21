
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, Gift, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/integrations/supabase/client';

const GetInvolved = () => {
  const { toast } = useToast();
  const [volunteerFormData, setVolunteerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    experience: '',
    availability: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVolunteerFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .insert({
          name: volunteerFormData.name,
          email: volunteerFormData.email,
          phone: volunteerFormData.phone || null,
          area_of_interest: volunteerFormData.area,
          experience: volunteerFormData.experience,
          availability: volunteerFormData.availability,
        });

      if (error) throw error;
      
      toast({
        title: "Application submitted successfully!",
        description: "Thank you for your interest in volunteering! We'll be in touch soon.",
      });
      
      // Reset form
      setVolunteerFormData({
        name: '',
        email: '',
        phone: '',
        area: '',
        experience: '',
        availability: '',
      });
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Join Our Mission
            </h1>
            <p className="text-xl text-white mb-8 animate-fade-in animate-delay-100">
              Whether you want to volunteer your time, expertise, or contribute financially, there are many ways to support our work and make a difference.
            </p>
          </div>
        </div>
      </section>
      
      {/* Ways to Get Involved */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-12 text-center text-black">Ways to Get Involved</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Volunteer */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 flex items-center justify-center bg-gray-50">
                <Users size={64} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4 text-black">Volunteer</h3>
                <p className="text-gray-800 mb-6">
                  Share your skills and time to help with our programs, events, and initiatives. We have opportunities for all skill levels.
                </p>
                <a href="#volunteer-form" className="inline-flex items-center font-medium button-hover text-primary">
                  Apply to Volunteer
                </a>
              </div>
            </div>
            
            {/* Donate */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 flex items-center justify-center bg-gray-50">
                <Gift size={64} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4 text-black">Donate</h3>
                <p className="text-gray-800 mb-6">
                  Support our work with a one-time or recurring donation. Your contribution helps fund scholarships and community initiatives.
                </p>
                <a href="#donate-section" className="inline-flex items-center font-medium button-hover text-primary">
                  Make a Donation
                </a>
              </div>
            </div>
            
            {/* Partner */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="h-48 flex items-center justify-center bg-gray-50">
                <Calendar size={64} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4 text-black">Partner With Us</h3>
                <p className="text-gray-800 mb-6">
                  Become a corporate or community partner. We work with organizations that share our vision for digital inclusion.
                </p>
                <Link to="/contact" className="inline-flex items-center font-medium button-hover text-primary">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Volunteer Form */}
      <section id="volunteer-form" className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-black">Volunteer Application</h2>
            <p className="text-lg text-gray-800">
              Join our team of volunteers who help make our programs possible. Tell us a bit about yourself and how you'd like to contribute.
            </p>
          </div>
          
          <form onSubmit={handleVolunteerSubmit} className="bg-white border rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={volunteerFormData.name}
                  onChange={handleVolunteerChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-black">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={volunteerFormData.email}
                  onChange={handleVolunteerChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                />
              </div>
            </div>
            
            <div className="mb-6 space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-black">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={volunteerFormData.phone}
                onChange={handleVolunteerChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              />
            </div>
            
            <div className="mb-6 space-y-2">
              <label htmlFor="area" className="text-sm font-medium text-black">
                Area of Interest <span className="text-red-500">*</span>
              </label>
              <select
                id="area"
                name="area"
                value={volunteerFormData.area}
                onChange={handleVolunteerChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              >
                <option value="">Select an area</option>
                <option value="teaching">Teaching & Mentoring</option>
                <option value="events">Event Support</option>
                <option value="marketing">Marketing & Communications</option>
                <option value="development">Web Development</option>
                <option value="administration">Administrative Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-6 space-y-2">
              <label htmlFor="experience" className="text-sm font-medium text-black">
                Relevant Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                id="experience"
                name="experience"
                value={volunteerFormData.experience}
                onChange={handleVolunteerChange}
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                placeholder="Tell us about your relevant skills and experience..."
              />
            </div>
            
            <div className="mb-6 space-y-2">
              <label htmlFor="availability" className="text-sm font-medium text-black">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={volunteerFormData.availability}
                onChange={handleVolunteerChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              >
                <option value="">Select availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="evenings">Evenings</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </section>
      
      {/* Donate Section */}
      <section id="donate-section" className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6 text-black">Support Our Mission</h2>
              <p className="text-lg text-gray-800 mb-6">
                Your donation helps us provide scholarships, develop new programs, and create opportunities for underrepresented groups in tech.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-black">Fund a Scholarship</h3>
                    <p className="text-gray-800">Provide financial support for students from underrepresented backgrounds.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                      <path d="m7.5 4.27 9 5.15" />
                      <polyline points="3.29 7 12 12 20.71 7" />
                      <line x1="12" x2="12" y1="22" y2="12" />
                      <circle cx="18.5" cy="15.5" r="2.5" />
                      <path d="M20.27 17.27 22 19" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-black">Support New Programs</h3>
                    <p className="text-gray-800">Help us develop and launch new educational initiatives.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M18 8a6 6 0 0 1-12 0" />
                      <circle cx="12" cy="2" r="2" />
                      <path d="m18 15 2 5h-4.75" />
                      <path d="m4 15 2 5H1.25" />
                      <path d="M14 21h-4" />
                      <path d="M7 13a6 6 0 0 0 10 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-black">Community Outreach</h3>
                    <p className="text-gray-800">Fund initiatives that bring technology education to underserved communities.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button size="lg" className="w-full md:w-auto">Donate Now</Button>
                <p className="text-sm text-gray-700">
                  XPerience is a 501(c)(3) nonprofit organization. All donations are tax-deductible.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-medium mb-6 text-black">Choose Your Donation</h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white border rounded-md p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-black">One-time Donation</p>
                    <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-md p-4 cursor-pointer hover:border-black transition-colors">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-black">Monthly Donation</p>
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  $25
                </div>
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  $50
                </div>
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  $100
                </div>
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  $250
                </div>
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  $500
                </div>
                <div className="bg-white border rounded-md py-3 px-4 text-center cursor-pointer hover:border-black transition-colors text-black">
                  Custom
                </div>
              </div>
              
              <Button size="lg" className="w-full">Continue to Payment</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Corporate Partners */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-black">Our Corporate Partners</h2>
            <p className="text-lg text-gray-800 max-w-3xl mx-auto">
              We're grateful for the support of these organizations who share our commitment to digital inclusion and education.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center justify-center py-8 px-4 bg-white border rounded-lg hover-scale">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Have Questions?</h2>
          <p className="text-xl text-white mb-8">
            Our team is happy to talk about ways you can get involved and support our mission.
          </p>
          <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black group">
            <Link to="/contact" className="flex items-center gap-2">
              Contact Us
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
