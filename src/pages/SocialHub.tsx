import Navbar from '@/components/layout/Navbar'
import SocialFeed from '@/components/ui/SocialFeed'

export default function SocialHub() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6 animate-fade-in">
              Social Hub
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 animate-fade-in animate-delay-100">
              Stay connected with our latest updates and join the conversation
              across our social media platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Social Feed Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <SocialFeed />
        </div>
      </section>

      
    </div>
  )
}
