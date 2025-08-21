// src/pages/Consulting.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Users,
  Clock as ClockIcon,
  Target,
  Zap,
  Shield,
} from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Remove the static pastProjects array and replace with this interface:
interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  project_url?: string;
  technologies: string[];
  metrics: Record<string, any>;
  duration?: string;
  team_size?: string;
}

const Consulting = () => {
  // Add this query to fetch projects from database
  const { data: pastProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['published-portfolio-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as PortfolioProject[];
    },
  });

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
                We help businesses create exceptional digital experiences that
                engage audiences, drive growth, and deliver measurable results
                through strategic design and development.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <AnimatedButton
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 transition text-black font-semibold rounded-md px-6 py-3 shadow-lg"
                  sparkleColor="black"
                  textColor="black"
                  icon={ArrowRight}
                  linkToContact={true}
                >
                  Start Your Project
                </AnimatedButton>
                <a href="#portfolio">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black hover:border-transparent transition rounded-md font-semibold px-6 py-3"
                  >
                    View Our Work
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
                      <span className="text-sm text-gray-100">
                        Client Satisfaction
                      </span>
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
                      <span className="text-sm text-gray-100">
                        Projects Completed
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">10+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Projects Carousel */}
      <section
        id="portfolio"
        className="py-20 px-4 md:px-6 bg-white text-black"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
              Our Recent Projects
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore our portfolio of successful digital transformations across
              various industries. Click on any project to learn more about our
              approach and results.
            </p>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-64"></div>
                </div>
              ))}
            </div>
          ) : pastProjects.length > 0 ? (
            <Carousel className="w-full">
              <CarouselPrevious />
              <CarouselContent className="-ml-2 md:-ml-4">
                {pastProjects.map((p) => (
                  <CarouselItem
                    key={p.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6">
                            <div className="text-sm text-gray-500 mb-2">
                              {p.category}
                            </div>
                            <h3 className="text-xl font-medium mb-3 text-black group-hover:text-zinc-800 transition-colors">
                              {p.name}
                            </h3>
                            <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                              {p.description.substring(0, 120)}…
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium text-black">
                                Click to learn more
                              </span>
                              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-gray-300 shadow-2xl text-black">
                        <DialogHeader className="border-b border-gray-200 pb-6 mb-6">
                          <DialogTitle className="text-3xl font-bold text-black mb-2">
                            {p.name}
                          </DialogTitle>
                          <div className="text-lg text-gray-600 mb-4">{p.category}</div>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="aspect-video overflow-hidden rounded-lg">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div>
                            <h4 className="text-xl font-semibold mb-3 text-black">Project Overview</h4>
                            <p className="text-gray-700 leading-relaxed">{p.description}</p>
                          </div>

                          {Object.keys(p.metrics).length > 0 && (
                            <div>
                              <h4 className="text-xl font-semibold mb-3 text-black">Key Results</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(p.metrics).map(([key, value]) => (
                                  <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-black">{value}</div>
                                    <div className="text-sm text-gray-600 capitalize">{key}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {p.technologies.length > 0 && (
                            <div>
                              <h4 className="text-xl font-semibold mb-3 text-black">Technologies Used</h4>
                              <div className="flex flex-wrap gap-2">
                                {p.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="bg-black text-white px-3 py-1 rounded-full text-sm"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            {p.duration && (
                              <div>
                                <h5 className="font-semibold text-black">Duration</h5>
                                <p className="text-gray-700">{p.duration}</p>
                              </div>
                            )}
                            {p.team_size && (
                              <div>
                                <h5 className="font-semibold text-black">Team Size</h5>
                                <p className="text-gray-700">{p.team_size}</p>
                              </div>
                            )}
                          </div>

                          {p.project_url && (
                            <div>
                              <a
                                href={p.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
                              >
                                <span>View Live Project</span>
                                <ArrowRight className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="pt-6 border-t border-gray-200">
                          <Link to="/contact">
                            <AnimatedButton
                              sparkleColor="black"
                              textColor="black"
                              icon={ArrowRight}
                              invertOnHover
                              className="w-full justify-center bg-white text-black hover:bg-zinc-900 hover:text-white transition font-semibold rounded-md px-6 py-3"
                            >
                              Start Similar Project
                            </AnimatedButton>
                          </Link>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No projects have been published yet. Check back soon for our latest work!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              Our Comprehensive Services
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From strategy to execution, we provide end-to-end solutions that
              address every aspect of your digital transformation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* UI/UX Design */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M14 15h1" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                UI/UX Design
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Create intuitive, beautiful interfaces that users love. Our
                design process focuses on user research, wireframing, and
                creating pixel-perfect experiences.
              </p>
            </div>
            {/* Web Development */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="m22 12-4-4v8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                Web Development
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Build fast, secure, and scalable websites using modern
                technologies. From simple landing pages to complex web
                applications.
              </p>
            </div>
            {/* Security & Performance */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                Security & Performance
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Ensure your website is secure, fast, and reliable. We implement
                best practices for security, optimization, and monitoring.
              </p>
            </div>
            {/* Analytics & SEO */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 18a6 6 0 0 0 0-12v12z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                Analytics & SEO
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Improve visibility and track performance with comprehensive SEO
                optimization and analytics implementation.
              </p>
            </div>
            {/* Brand Strategy */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76Z" />
                  <path d="M16 8 2 22" />
                  <path d="m17.5 15 2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                Brand Strategy
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Develop a cohesive visual identity and brand strategy that
                resonates with your audience and builds trust.
              </p>
            </div>
            {/* Ongoing Support */}
            <div className="group bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">
                Ongoing Support
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Keep your digital presence secure and up-to-date with our
                comprehensive maintenance and support services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <Link to="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black transition rounded-md font-semibold px-6 py-3"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Consulting;
