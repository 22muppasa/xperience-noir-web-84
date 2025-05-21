
import SocialFeed from '@/components/ui/SocialFeed';

const SocialHub = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-black/80 text-white backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6 animate-fade-in">
              Social Hub
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 animate-fade-in animate-delay-100">
              Stay connected with our latest updates and join the conversation across our social media platforms.
            </p>
          </div>
        </div>
      </section>
      
      {/* Social Feed */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <SocialFeed />
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 md:mb-6">Stay Updated</h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
            Subscribe to our newsletter for the latest updates, events, and opportunities.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SocialHub;
