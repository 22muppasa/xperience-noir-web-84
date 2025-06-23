import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ui/ContactForm';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              Have a question, need assistance, or want to explore how we can work together? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 md:px-6 bg-white text-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Contact Information</h2>
              <p className="text-lg text-gray-700 mb-8">
                Reach out using any of the methods below, or fill out the contact form and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-600 mb-1">General Inquiries:</p>
                    <a href="mailto:hello@xperience.com" className="text-blue-600 hover:underline">hello@xperience.com</a>
                    <p className="text-gray-600 mt-2 mb-1">Support:</p>
                    <a href="mailto:support@xperience.com" className="text-blue-600 hover:underline">support@xperience.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-600 mb-1">Main Office:</p>
                    <a href="tel:+18885551234" className="text-blue-600 hover:underline">(888) 555-1234</a>
                    <p className="text-gray-600 mt-2 mb-1">Support:</p>
                    <a href="tel:+18885555678" className="text-blue-600 hover:underline">(888) 555-5678</a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-gray-700">123 Tech Way</p>
                    <p className="text-gray-700">Suite 400</p>
                    <p className="text-gray-700">San Francisco, CA 94107</p>
                  </div>
                </div>

                {/* Schedule a Call */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Schedule a Call</h3>
                    <p className="text-gray-700 mb-3">
                      Book a 30-minute consultation with a member of our team to discuss your needs.
                    </p>
                    <Button asChild>
                      <a href="#contact-form">Schedule Now</a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="mt-12">
                <h3 className="text-xl font-medium mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {/* LinkedIn */}
                  <a href="https://linkedin.com" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="LinkedIn">
                    {/* icon */}
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="Facebook">
                    {/* icon */}
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="Instagram">
                    {/* icon */}
                  </a>
                  {/* Twitter */}
                  <a href="https://twitter.com" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="Twitter">
                    {/* icon */}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div id="contact-form" className="bg-gray-50 border rounded-lg p-8">
                <h2 className="text-2xl font-medium mb-6 text-black">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 md:px-6 bg-gray-100 text-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-medium mb-6">Find Us</h2>
          <div className="aspect-[16/9] w-full bg-white rounded-lg overflow-hidden border">
            <iframe
              title="Vernon Hills High School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2954.4009699145736!2d-87.95205792464262!3d42.22724597120559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880f961786bafebd%3A0xc65b97cc886e0c30!2sVernon%20Hills%20High%20School!5e0!3m2!1sen!2sus!4v1750701323970!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50 text-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700">
              Find quick answers to common questions about our programs and services.
            </p>
          </div>
          <div className="space-y-6">
            {/* FAQ items... */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to Transform Your Digital Experience?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're looking to learn new skills or enhance your digital presence, we're here to help you succeed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="lg" asChild className="text-white border-white hover:bg-white hover:text-black">
              <Link to="/programs">Explore Programs</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-white border-white hover:bg-white hover:text-black">
              <Link to="/consulting">Learn About Consulting</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
