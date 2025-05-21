
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ConsultingProcess from '@/components/ui/ConsultingProcess';
import ContactForm from '@/components/ui/ContactForm';

const beforeAfterProjects = [
  {
    id: 1,
    name: "BrightPath Academy",
    category: "Education",
    before: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600&q=80",
    after: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Transformed a cluttered educational website into a clean, user-friendly platform that increased student applications by 43%."
  },
  {
    id: 2,
    name: "NorthStar Wellness",
    category: "Healthcare",
    before: "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&h=600&q=80",
    after: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Redesigned the patient portal experience, resulting in a 38% improvement in appointment scheduling and patient satisfaction."
  }
];

const Consulting = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Transform Your Digital Presence
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              We help businesses create exceptional websites that engage audiences and drive results. Our data-driven approach focuses on performance, usability, and conversion.
            </p>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black animate-fade-in animate-delay-200">
              <Link to="#contact-form" className="flex items-center gap-2">
                Start Your Project
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Process Timeline */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Process</h2>
            <p className="text-lg text-gray-600">
              We follow a proven approach to deliver websites that exceed expectations. Our collaborative process ensures your vision comes to life while meeting strategic business objectives.
            </p>
          </div>
          
          <ConsultingProcess />
        </div>
      </section>
      
      {/* Before/After Gallery */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Transformation Gallery</h2>
            <p className="text-lg text-gray-600">
              See the impact of our work through these before and after comparisons. Each project represents a unique challenge we helped solve.
            </p>
          </div>
          
          <div className="space-y-20">
            {beforeAfterProjects.map((project, index) => (
              <div key={project.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="space-y-8">
                    <div>
                      <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">BEFORE</span>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                        <img 
                          src={project.before} 
                          alt={`${project.name} Before`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">AFTER</span>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                        <img 
                          src={project.after} 
                          alt={`${project.name} After`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : ''} flex flex-col justify-center`}>
                  <h3 className="text-2xl font-medium mb-2">{project.name}</h3>
                  <p className="text-gray-500 mb-6">{project.category}</p>
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    {project.description}
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="#contact-form" className="flex items-center gap-2 w-fit">
                      Start a Similar Project
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Services</h2>
            <p className="text-lg text-gray-600">
              We offer a comprehensive range of services to address every aspect of your digital presence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M14 15h1" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Website Design</h3>
              <p className="text-gray-600">
                Beautiful, functional designs that enhance your brand and deliver exceptional user experiences across all devices.
              </p>
            </div>
            
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="m22 12-4-4v8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Development</h3>
              <p className="text-gray-600">
                Clean, efficient code that ensures your site is fast, secure, and easy to maintain as your business grows.
              </p>
            </div>
            
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 18a6 6 0 0 0 0-12v12z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Analytics & SEO</h3>
              <p className="text-gray-600">
                Improve visibility and understand user behavior with comprehensive search engine optimization and analytics.
              </p>
            </div>
            
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76Z" />
                  <path d="M16 8 2 22" />
                  <path d="m17.5 15 2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Branding</h3>
              <p className="text-gray-600">
                Develop a cohesive visual identity that makes your business memorable and builds customer trust.
              </p>
            </div>
            
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect width="7" height="13" x="3" y="2" rx="1" />
                  <rect width="7" height="13" x="14" y="2" rx="1" />
                  <path d="M10 2v20" />
                  <path d="M10 14h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Content Strategy</h3>
              <p className="text-gray-600">
                Develop compelling content that engages your audience and supports your business objectives.
              </p>
            </div>
            
            <div className="bg-white border p-6 rounded-lg hover-scale">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Ongoing Support</h3>
              <p className="text-gray-600">
                Keep your website secure, updated, and performing optimally with our maintenance and support services.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Start Your Project</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ready to transform your digital presence? Fill out this form and we'll get back to you within 24 hours to discuss your project.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Discuss via Phone</h3>
                    <p className="text-gray-600">+1 (888) 555-1234</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-gray-600">consulting@xperience.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 bg-white rounded-lg border p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consulting;
