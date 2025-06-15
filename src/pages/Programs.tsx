
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const Programs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Learn & Grow with Our Programs
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              From beginner workshops to advanced boot camps, we offer educational experiences designed to build the skills needed for today's digital world.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Programs */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-12">Featured Programs</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="aspect-[16/9] relative">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450"
                  alt="Web Development Bootcamp"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
                  Flagship Program
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Web Development Bootcamp</h3>
                <p className="text-gray-600 mb-6">
                  A comprehensive 12-week program covering front-end and back-end development, designed for career changers and aspiring developers.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>12 Weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>25 Students</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/contact">Apply Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Program 2 */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="aspect-[16/9] relative">
                <img
                  src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=450"
                  alt="UX/UI Design Workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">UX/UI Design Workshop</h3>
                <p className="text-gray-600 mb-6">
                  Learn the fundamentals of user experience and interface design in this hands-on 6-week part-time workshop.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>6 Weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Part-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>15 Students</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/contact">Apply Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Program 3 */}
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="aspect-[16/9] relative">
                <img
                  src="https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&h=450"
                  alt="Digital Marketing Essentials"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Digital Marketing Essentials</h3>
                <p className="text-gray-600 mb-6">
                  Master the tools and strategies of modern digital marketing with this 8-week program focused on practical applications.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>8 Weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Part-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>20 Students</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/contact">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Program Schedule */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium">Upcoming Program Schedule</h2>
            <Button variant="outline" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                Request Information
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] bg-white border">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left">Program</th>
                  <th className="px-6 py-4 text-left">Start Date</th>
                  <th className="px-6 py-4 text-left">Format</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Web Development Bootcamp</td>
                  <td className="px-6 py-4">June 15, 2025</td>
                  <td className="px-6 py-4">Full-time</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Open
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" asChild>
                      <Link to="/contact">Apply</Link>
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">UX/UI Design Workshop</td>
                  <td className="px-6 py-4">July 8, 2025</td>
                  <td className="px-6 py-4">Part-time</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Open
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" asChild>
                      <Link to="/contact">Apply</Link>
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Digital Marketing Essentials</td>
                  <td className="px-6 py-4">July 22, 2025</td>
                  <td className="px-6 py-4">Part-time</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Limited Seats
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" asChild>
                      <Link to="/contact">Apply</Link>
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Web Development Bootcamp</td>
                  <td className="px-6 py-4">September 10, 2025</td>
                  <td className="px-6 py-4">Full-time</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/contact">Join Waitlist</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Do I need prior experience to join your programs?</h3>
              <p className="text-gray-600">
                Most of our beginner programs don't require prior experience. However, some advanced courses may have prerequisites. Each program page clearly states any requirements.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Are there payment plans available?</h3>
              <p className="text-gray-600">
                Yes, we offer flexible payment plans for most of our programs. We also have scholarship opportunities for qualified candidates. Contact us for more information.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">What happens if I miss a class?</h3>
              <p className="text-gray-600">
                All sessions are recorded and made available to enrolled students. We also offer office hours for additional support if you need to catch up.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Will I receive a certificate upon completion?</h3>
              <p className="text-gray-600">
                Yes, all students who successfully complete their program receive a digital certificate of completion that can be shared on professional networks.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our team is ready to answer your questions and help you find the perfect program for your goals.
          </p>
          <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Programs;
