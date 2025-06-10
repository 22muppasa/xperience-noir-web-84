
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Star, Users, Clock, Shield, Target, Zap } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import AnimatedButton from '@/components/ui/AnimatedButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const pastProjects = [
  {
    id: 1,
    name: "EduTech Academy",
    category: "Education Technology",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Transformed a cluttered educational platform into a streamlined learning experience that increased student engagement by 67% and course completion rates by 43%. We redesigned the entire user interface with a focus on intuitive navigation and implemented gamification elements to boost student motivation.",
    metrics: {
      engagement: "+67%",
      completion: "+43%",
      satisfaction: "4.8/5"
    },
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
    duration: "8 weeks",
    teamSize: "6 people"
  },
  {
    id: 2,
    name: "HealthCore Wellness",
    category: "Healthcare & Wellness",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Redesigned the patient portal and appointment system, resulting in a 52% improvement in booking efficiency and 38% increase in patient satisfaction scores. The new system features automated reminders, telemedicine integration, and a comprehensive health dashboard.",
    metrics: {
      efficiency: "+52%",
      satisfaction: "+38%",
      retention: "+29%"
    },
    technologies: ["Vue.js", "Python", "MongoDB", "WebRTC"],
    duration: "10 weeks",
    teamSize: "8 people"
  },
  {
    id: 3,
    name: "TechStart Solutions",
    category: "Technology Startup",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Built a comprehensive platform from the ground up, enabling them to scale from startup to series A funding with a 300% increase in user acquisition. The platform includes advanced analytics, automated workflows, and seamless third-party integrations.",
    metrics: {
      users: "+300%",
      conversion: "+89%",
      revenue: "+245%"
    },
    technologies: ["React", "TypeScript", "AWS", "GraphQL"],
    duration: "12 weeks",
    teamSize: "10 people"
  },
  {
    id: 4,
    name: "RetailMax Commerce",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Developed a modern e-commerce platform with advanced inventory management and personalized shopping experiences. The solution increased online sales by 180% and reduced cart abandonment by 45%.",
    metrics: {
      sales: "+180%",
      abandonment: "-45%",
      speed: "+60%"
    },
    technologies: ["Next.js", "Stripe", "Shopify", "Algolia"],
    duration: "14 weeks",
    teamSize: "7 people"
  },
  {
    id: 5,
    name: "FinanceFlow Pro",
    category: "Financial Services",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Created a secure financial dashboard with real-time analytics and automated reporting features. Enhanced security protocols and user experience led to 95% user adoption rate and zero security incidents.",
    metrics: {
      adoption: "95%",
      security: "100%",
      efficiency: "+75%"
    },
    technologies: ["Angular", "Spring Boot", "MySQL", "Docker"],
    duration: "16 weeks",
    teamSize: "12 people"
  },
  {
    id: 6,
    name: "GreenEnergy Hub",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Built an innovative platform for renewable energy management and monitoring. The system helps companies track their carbon footprint and optimize energy consumption, resulting in 40% energy savings.",
    metrics: {
      savings: "40%",
      efficiency: "+85%",
      adoption: "92%"
    },
    technologies: ["React", "Python", "InfluxDB", "Grafana"],
    duration: "10 weeks",
    teamSize: "5 people"
  }
];

const beforeAfterProjects = [
  {
    id: 1,
    name: "EduTech Academy",
    category: "Education Technology",
    before: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600&q=80",
    after: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Transformed a cluttered educational platform into a streamlined learning experience that increased student engagement by 67% and course completion rates by 43%.",
    metrics: {
      engagement: "+67%",
      completion: "+43%",
      satisfaction: "4.8/5"
    }
  },
  {
    id: 2,
    name: "HealthCore Wellness",
    category: "Healthcare & Wellness",
    before: "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&h=600&q=80",
    after: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Redesigned the patient portal and appointment system, resulting in a 52% improvement in booking efficiency and 38% increase in patient satisfaction scores.",
    metrics: {
      efficiency: "+52%",
      satisfaction: "+38%",
      retention: "+29%"
    }
  },
  {
    id: 3,
    name: "TechStart Solutions",
    category: "Technology Startup",
    before: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=600&q=80",
    after: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80",
    description: "Built a comprehensive platform from the ground up, enabling them to scale from startup to series A funding with a 300% increase in user acquisition.",
    metrics: {
      users: "+300%",
      conversion: "+89%",
      revenue: "+245%"
    }
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    company: "EduTech Academy",
    role: "CEO",
    quote: "XPerience transformed our digital presence completely. The new platform not only looks amazing but has dramatically improved our student outcomes.",
    rating: 5
  },
  {
    name: "Dr. Michael Rodriguez",
    company: "HealthCore Wellness",
    role: "Chief Medical Officer",
    quote: "The team's understanding of healthcare workflows was impressive. They created solutions that actually work for our staff and patients.",
    rating: 5
  },
  {
    name: "Jennifer Park",
    company: "TechStart Solutions",
    role: "Founder",
    quote: "From concept to launch, XPerience was instrumental in building our platform. Their expertise helped us secure our Series A funding.",
    rating: 5
  }
];

const packages = [
  {
    name: "Starter",
    price: "$2,500",
    duration: "2-3 weeks",
    description: "Perfect for small businesses looking to establish their digital presence",
    features: [
      "Custom website design",
      "Responsive development",
      "Basic SEO optimization",
      "Contact form integration",
      "1 month support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$5,000",
    duration: "4-6 weeks",
    description: "Ideal for growing businesses needing advanced functionality",
    features: [
      "Everything in Starter",
      "Advanced animations",
      "Content management system",
      "Analytics integration",
      "E-commerce capability",
      "3 months support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "8-12 weeks",
    description: "Comprehensive solutions for large organizations",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Advanced security",
      "Performance optimization",
      "Staff training",
      "12 months support"
    ],
    popular: false
  }
];

const Consulting = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm uppercase tracking-wider text-gray-300">Digital Transformation</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in text-white">
                Transform Your Digital Presence
              </h1>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
                We help businesses create exceptional digital experiences that engage audiences, drive growth, and deliver measurable results through strategic design and development.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <Link to="#contact-form">
                  <AnimatedButton 
                    className="flex items-center gap-2" 
                    sparkleColor="white" 
                    textColor="white"
                    icon={ArrowRight}
                  >
                    Start Your Project
                  </AnimatedButton>
                </Link>
                <Link to="#portfolio">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-300">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-white" />
                      <span className="text-sm text-gray-300">Client Satisfaction</span>
                    </div>
                    <div className="text-2xl font-bold text-white">98%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-500">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-white" />
                      <span className="text-sm text-gray-300">Success Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">100%</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-400">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-white" />
                      <span className="text-sm text-gray-300">Avg. Timeline</span>
                    </div>
                    <div className="text-2xl font-bold text-white">6 weeks</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animate-delay-600">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-white" />
                      <span className="text-sm text-gray-300">Projects Completed</span>
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
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">Our Recent Projects</h2>
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
                      <div className="group cursor-pointer bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-gray-600 mb-2">{project.category}</div>
                          <h3 className="text-xl font-medium mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                            {project.description.substring(0, 120)}...
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600">Click to learn more</span>
                            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
                      <DialogHeader className="border-b border-gray-100 pb-6 mb-6">
                        <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">{project.name}</DialogTitle>
                        <DialogDescription className="text-lg text-gray-600 font-medium">
                          {project.category}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-8">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl border border-gray-200">
                          <img 
                            src={project.image} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-xl font-bold mb-4 text-gray-900">Project Overview</h4>
                          <p className="text-gray-800 leading-relaxed text-base">{project.description}</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h4 className="text-xl font-bold mb-6 text-gray-900 text-center">Key Results</h4>
                          <div className="grid grid-cols-3 gap-6">
                            {Object.entries(project.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
                                <div className="text-sm text-gray-700 font-medium capitalize">{key}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-gray-900 text-lg">Duration</h5>
                            <p className="text-gray-800 font-medium">{project.duration}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-gray-900 text-lg">Team Size</h5>
                            <p className="text-gray-800 font-medium">{project.teamSize}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h5 className="font-bold mb-3 text-gray-900 text-lg">Technologies</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-white text-gray-800 text-sm rounded-full border border-gray-300 font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-200">
                          <Link to="#contact-form">
                            <AnimatedButton 
                              sparkleColor="black" 
                              textColor="black"
                              icon={ArrowRight}
                              invertOnHover={true}
                              className="w-full justify-center bg-black text-white hover:bg-gray-800"
                            >
                              Start Similar Project
                            </AnimatedButton>
                          </Link>
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
      
      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">Transformation Gallery</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              See the measurable impact of our work through these before and after transformations. Each project represents unique challenges we helped solve with strategic design and development.
            </p>
          </div>
          
          <div className="space-y-24">
            {beforeAfterProjects.map((project, index) => (
              <div key={project.id} className="group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="space-y-8">
                      <div className="relative">
                        <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">BEFORE</span>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img 
                            src={project.before} 
                            alt={`${project.name} Before`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">AFTER</span>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img 
                            src={project.after} 
                            alt={`${project.name} After`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : ''} space-y-6`}>
                    <div>
                      <h3 className="text-3xl font-medium mb-2 text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 text-lg">{project.category}</p>
                    </div>
                    
                    <p className="text-lg leading-relaxed text-gray-800">
                      {project.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="#contact-form">
                      <AnimatedButton 
                        sparkleColor="black" 
                        textColor="black"
                        icon={ArrowRight}
                        invertOnHover={true}
                        className="mt-4"
                      >
                        Start Similar Project
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-white">What Our Clients Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Hear from the leaders who trusted us to transform their digital presence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed text-gray-200">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-medium text-white">{testimonial.name}</div>
                  <div className="text-gray-300">{testimonial.role}</div>
                  <div className="text-gray-400 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Packages */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">Choose Your Package</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Transparent pricing for every business size. All packages include our commitment to excellence and your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className={`relative bg-white rounded-2xl p-8 ${pkg.popular ? 'ring-2 ring-black scale-105' : 'border'} hover:shadow-xl transition-all duration-300`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{pkg.name}</h3>
                  <div className="text-4xl font-bold mb-2 text-gray-900">{pkg.price}</div>
                  <div className="text-gray-600 mb-4">{pkg.duration}</div>
                  <p className="text-gray-700">{pkg.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="#contact-form" className="block">
                  <AnimatedButton 
                    className="w-full justify-center"
                    sparkleColor={pkg.popular ? "white" : "black"}
                    textColor={pkg.popular ? "white" : "black"}
                    invertOnHover={!pkg.popular}
                  >
                    Get Started
                  </AnimatedButton>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">Our Comprehensive Services</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From strategy to execution, we provide end-to-end solutions that address every aspect of your digital transformation journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M14 15h1" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">UI/UX Design</h3>
              <p className="text-gray-700 leading-relaxed">
                Create intuitive, beautiful interfaces that users love. Our design process focuses on user research, wireframing, and creating pixel-perfect experiences.
              </p>
            </div>
            
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="m22 12-4-4v8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Web Development</h3>
              <p className="text-gray-700 leading-relaxed">
                Build fast, secure, and scalable websites using modern technologies. From simple landing pages to complex web applications.
              </p>
            </div>
            
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Security & Performance</h3>
              <p className="text-gray-700 leading-relaxed">
                Ensure your website is secure, fast, and reliable. We implement best practices for security, optimization, and monitoring.
              </p>
            </div>
            
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 18a6 6 0 0 0 0-12v12z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Analytics & SEO</h3>
              <p className="text-gray-700 leading-relaxed">
                Improve visibility and track performance with comprehensive SEO optimization and analytics implementation.
              </p>
            </div>
            
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76Z" />
                  <path d="M16 8 2 22" />
                  <path d="m17.5 15 2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Brand Strategy</h3>
              <p className="text-gray-700 leading-relaxed">
                Develop a cohesive visual identity and brand strategy that resonates with your audience and builds trust.
              </p>
            </div>
            
            <div className="group bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Ongoing Support</h3>
              <p className="text-gray-700 leading-relaxed">
                Keep your digital presence secure and up-to-date with our comprehensive maintenance and support services.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-white">Ready to Transform?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Let's discuss your project and create something extraordinary together. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-medium mb-6 text-white">Why Choose XPerience?</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Proven Track Record</h4>
                      <p className="text-gray-300">150+ successful projects with 98% client satisfaction rate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Expert Team</h4>
                      <p className="text-gray-300">Experienced designers and developers who understand your industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Fast Delivery</h4>
                      <p className="text-gray-300">Average project completion in 6 weeks without compromising quality</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-8">
                <h4 className="font-medium mb-4 text-white">Get in Touch Directly</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300">Phone:</span>
                      <span className="ml-2 text-white">+1 (888) 555-1234</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300">Email:</span>
                      <span className="ml-2 text-white">consulting@xperience.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 bg-white rounded-2xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consulting;
