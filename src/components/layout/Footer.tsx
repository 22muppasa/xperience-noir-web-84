
import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-8 md:py-12 mt-10 md:mt-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-bold">XPerience</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-xs">
              Transforming digital experiences through education and consulting.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-gray-300 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-gray-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gray-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="mailto:contact@xperience.com" aria-label="Email" className="hover:text-gray-300 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Site Links</h3>
            <ul className="space-y-2">
              <li><Link to="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link></li>
              <li><Link to="/consulting" className="text-gray-300 hover:text-white transition-colors">Consulting</Link></li>
              <li><Link to="/impact" className="text-gray-300 hover:text-white transition-colors">Impact</Link></li>
              <li><Link to="/get-involved" className="text-gray-300 hover:text-white transition-colors">Get Involved</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2">
              <li><Link to="/social-hub" className="text-gray-300 hover:text-white transition-colors">Social Hub</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">Get the latest updates from our team.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button 
                type="submit" 
                className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} XPerience. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
