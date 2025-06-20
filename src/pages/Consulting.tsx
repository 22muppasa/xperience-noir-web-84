// src/pages/Consulting.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Users, Clock as ClockIcon, Shield, Target, Zap, Mail, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Navbar from '@/components/layout/Navbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const pastProjects = [
  {
    id: 1,
    name: "EduTech Academy",
    category: "Education Technology",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Transformed a cluttered educational platform into a streamlined learning experience that increased student engagement by 67% and course completion rates by 43%. We redesigned the entire user interface with a focus on intuitive navigation and implemented gamification elements to boost student motivation.",
    metrics: { engagement: "+67%", completion: "+43%", satisfaction: "4.8/5" },
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
    duration: "8 weeks",
    teamSize: "6 people",
  },
  {
    id: 2,
    name: "HealthCore Wellness",
    category: "Healthcare & Wellness",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625-2429e8be8625?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Redesigned the patient portal and appointment system, resulting in a 52% improvement in booking efficiency and 38% increase in patient satisfaction scores. The new system features automated reminders, telemedicine integration, and a comprehensive health dashboard.",
    metrics: { efficiency: "+52%", satisfaction: "+38%", retention: "+29%" },
    technologies: ["Vue.js", "Python", "MongoDB", "WebRTC"],
    duration: "10 weeks",
    teamSize: "8 people",
  },
  {
    id: 3,
    name: "TechStart Solutions",
    category: "Technology Startup",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Built a comprehensive platform from the ground up, enabling them to scale from startup to series A funding with a 300% increase in user acquisition. The platform includes advanced analytics, automated workflows, and seamless third-party integrations.",
    metrics: { users: "+300%", conversion: "+89%", revenue: "+245%" },
    technologies: ["React", "TypeScript", "AWS", "GraphQL"],
    duration: "12 weeks",
    teamSize: "10 people",
  },
  {
    id: 4,
    name: "RetailMax Commerce",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Developed a modern e-commerce platform with advanced inventory management and personalized shopping experiences. The solution increased online sales by 180% and reduced cart abandonment by 45%.",
    metrics: { sales: "+180%", abandonment: "-45%", speed: "+60%" },
    technologies: ["Next.js", "Stripe", "Shopify", "Algolia"],
    duration: "14 weeks",
    teamSize: "7 people",
  },
  {
    id: 5,
    name: "FinanceFlow Pro",
    category: "Financial Services",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Created a secure financial dashboard with real-time analytics and automated reporting features. Enhanced security protocols and user experience led to 95% user adoption rate and zero security incidents.",
    metrics: { adoption: "95%", security: "100%", efficiency: "+75%" },
    technologies: ["Angular", "Spring Boot", "MySQL", "Docker"],
    duration: "16 weeks",
    teamSize: "12 people",
  },
  {
    id: 6,
    name: "GreenEnergy Hub",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Built an innovative platform for renewable energy management and monitoring. The system helps companies track their carbon footprint and optimize energy consumption, resulting in 40% energy savings.",
    metrics: { savings: "40%", efficiency: "+85%", adoption: "92%" },
    technologies: ["React", "Python", "InfluxDB", "Grafana"],
    duration: "10 weeks",
    teamSize: "5 people",
  },
];

const Consulting = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-90" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm uppercase tracking-wider text-gray-200">
                  Digital Transformation
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-semibold mb-6 animate-fade-in text-white drop-shadow-lg">
                Transform Your Digital Presence
              </h1>
              <p className="text-xl text-gray-200 mb-8 animate-fade-in animate-delay-100 font-medium">
                We help businesses create exceptional digital experiences that engage audiences, drive growth, and deliver measurable results through strategic design and development.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <a href="#contact-section">
                  <AnimatedButton
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 transition text-black font-semibold rounded-md px-6 py-3 shadow-lg"
                    sparkleColor="black"
                    textColor="black"
                    icon={ArrowRight}
                  >
                    Start Your Project
                  </AnimatedButton>
                </a>
                <a href="#portfolio">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black hover:border-transparent transition rounded-md font-semibold px-6 py-3"
                  >
                    View Our Work
                  </Button>
                </a>
                <a href="#contact-section">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black hover:border-transparent transition rounded-md font-semibold px-6 py-3"
                  >
                    Schedule a Call
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-300 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-gray-100" />
                      <span className="text-sm text-gray-100">Client Satisfaction</span>
                    </div>
                    <div className="text-2xl font-bold text-white">98%</div>
                  </div>
                  <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-500 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-gray-100" />
                      <span className="text-sm text-gray-100">Success Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">100%</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-400 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <ClockIcon className="w-5 h-5 text-gray-100" />
                      <span className="text-sm text-gray-100">Avg. Timeline</span>
                    </div>
                    <div className="text-2xl font-bold text-white">6 weeks</div>
                  </div>
                  <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-600 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-gray-100" />
                      <span className="text-sm text-gray-100">Projects Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-white">150+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Projects Carousel */}
      <section id="portfolio" className="py-20 px-4 md:px-6 bg-white text-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">Our Recent Projects</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore our portfolio of successful digital transformations across various industries. Click on any project to learn more about our approach and results.
            </p>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {pastProjects.map((project) => (
                <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-gray-500 mb-2">{project.category}</div>
                          <h3 className="text-xl font-medium mb-3 text-black group-hover:text-zinc-800 transition-colors">{project.name}</h3>
                          <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                            {project.description.substring(0, 120)}...
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-black">Click to learn more</span>
                            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-gray-300 shadow-2xl text-black">
                      <DialogHeader className="border-b border-gray-200 pb-6 mb-6">
                        <DialogTitle className="text-3xl font-bold text-black mb-2">{project.name}</DialogTitle>
                        <DialogDescription className="text-lg text-gray-600 font-medium">
                          {project.category}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-8">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-xl font-bold mb-4 text-black">Project Overview</h4>
                          <p className="text-gray-900 leading-relaxed text-base">{project.description}</p>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-xl p-6">
                          <h4 className="text-xl font-bold mb-6 text-center text-black">Key Results</h4>
                          <div className="grid grid-cols-3 gap-6">
                            {Object.entries(project.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg border border-gray-200">
                                <div className="text-3xl font-bold text-black mb-2">{value}</div>
                                <div className="text-sm text-gray-700 font-medium capitalize">{key}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-black text-lg">Duration</h5>
                            <p className="text-gray-900 font-medium">{project.duration}</p>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-black text-lg">Team Size</h5>
                            <p className="text-gray-900 font-medium">{project.teamSize}</p>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-black text-lg">Technologies</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-white text-black text-sm rounded-full border border-gray-200 font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <a href="#contact-section">
                            <AnimatedButton
                              sparkleColor="black"
                              textColor="black"
                              icon={ArrowRight}
                              invertOnHover
                              className="w-full justify-center bg-white text-black hover:bg-zinc-900 hover:text-white transition font-semibold rounded-md px-6 py-3"
                            >
                              Start Similar Project
                            </AnimatedButton>
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">Our Comprehensive Services</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From strategy to execution, we provide end-to-end solutions that address every aspect of your digital transformation journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">Security & Performance</h3>
              <p className="text-gray-300 leading-relaxed">
                Ensure your website is secure, fast, and reliable. We implement best practices for security, optimization, and monitoring.
              </p>
            </div>
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">Analytics & SEO</h3>
              <p className="text-gray-300 leading-relaxed">
                Improve visibility and track performance with comprehensive SEO optimization and analytics implementation.
              </p>
            </div>
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">Brand Strategy</h3>
              <p className="text-gray-300 leading-relaxed">
                Develop a cohesive visual identity and brand strategy that resonates with your audience and builds trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 px-4 md:px-6 bg-white text-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-medium mb-6 text-black">Why Choose XPerience?</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-black">Proven Track Record</h4>
                      <p className="text-gray-700">150+ successful projects with 98% client satisfaction rate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-black">Expert Team</h4>
                      <p className="text-gray-700">Experienced designers and developers who understand your industry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-black">Fast Delivery</h4>
                      <p className="text-gray-700">Average project completion in 6 weeks without compromising quality</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-8">
                <h4 className="font-medium mb-4 text-black">Get in Touch Directly</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-700">Phone:</span>
                      <span className="ml-2 text-black">+1 (888) 555-1234</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-700">Email:</span>
                      <span className="ml-2 text-black">consulting@xperience.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-700">Location:</span>
                      <span className="ml-2 text-black">San Francisco, CA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-zinc-900 rounded-2xl p-8 shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consulting;
