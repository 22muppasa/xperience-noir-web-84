
import SocialFeed from '@/components/ui/SocialFeed';

const SocialHub = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Social Hub
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              Stay connected with our latest updates and join the conversation across our social media platforms.
            </p>
          </div>
        </div>
      </section>
      
      {/* Social Feed */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <SocialFeed />
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
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
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
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
