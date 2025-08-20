
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Code, Smartphone, Globe, Database, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Consulting = () => {
  const services = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies and best practices."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "Mobile Development", 
      description: "Native and cross-platform mobile apps that provide exceptional user experiences."
    },
    {
      icon: <Database className="h-8 w-8 text-blue-600" />,
      title: "Database Design",
      description: "Scalable database solutions optimized for performance and data integrity."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Security Consulting",
      description: "Comprehensive security audits and implementation of robust security measures."
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Performance Optimization",
      description: "Speed up your applications and improve user experience through optimization."
    },
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Code Review & Architecture",
      description: "Expert code reviews and architectural guidance for scalable solutions."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We start by understanding your business goals, technical requirements, and project constraints."
    },
    {
      step: "02", 
      title: "Solution Design",
      description: "Our team creates a comprehensive solution architecture tailored to your specific needs."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build your solution using industry best practices with rigorous testing throughout."
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your solution and provide ongoing support to ensure continued success."
    }
  ];

  const benefits = [
    "Expert guidance from experienced developers",
    "Custom solutions tailored to your business",
    "Modern technologies and best practices",
    "Scalable and maintainable code",
    "Ongoing support and maintenance",
    "Competitive pricing and flexible engagement models"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Digital Vision Into Reality
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Partner with our expert development team to build custom software solutions 
            that drive your business forward. From web applications to mobile apps, 
            we deliver excellence at every step.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/contact">Start Your Project</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Consulting Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive development and consulting services to help 
              your business leverage technology effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Development Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology to ensure your project is delivered 
              on time, within budget, and exceeds expectations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Xperience Code?</h2>
              <p className="text-xl text-gray-600">
                We bring years of experience and a commitment to excellence to every project.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and explore how we can help 
            bring your digital vision to life.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/contact">Start Your Project Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Consulting;
