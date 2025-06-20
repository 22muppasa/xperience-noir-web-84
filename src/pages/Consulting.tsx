// src/pages/Consulting.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Clock as ClockIcon, Target, Zap, Mail, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
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
                    className="flex items-center gap-2bg-white hover:bg-gray-100 transition text-black font-semibold rounded-md px-6 py-3 shadow-lg"
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
                </
