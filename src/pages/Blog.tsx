
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import BlogCard from '@/components/ui/BlogCard';

// Mock blog data
const blogPosts = [
  {
    id: "1",
    title: "The Future of Coding Education: Trends to Watch in 2025",
    excerpt: "Explore emerging technologies and methodologies reshaping how we teach and learn programming skills.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Education",
    date: "2025-05-10",
    author: {
      name: "Alexandra Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
    }
  },
  {
    id: "2",
    title: "Web Design Principles That Stand the Test of Time",
    excerpt: "Despite rapidly evolving technology, these core design principles remain essential for creating effective websites.",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Design",
    date: "2025-05-05",
    author: {
      name: "Sophia Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
    }
  },
  {
    id: "3",
    title: "How Small Nonprofits Can Make a Big Digital Impact",
    excerpt: "Strategic approaches for resource-constrained organizations to maximize their online presence and reach.",
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Consulting",
    date: "2025-04-28",
    author: {
      name: "David Williams",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"
    }
  },
  {
    id: "4",
    title: "Bridging the Digital Divide: Success Stories from Our Community Programs",
    excerpt: "Real-world examples of how technology education is creating opportunities in underserved communities.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Community",
    date: "2025-04-20",
    author: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
    }
  },
  {
    id: "5",
    title: "The Business Case for Accessible Web Design",
    excerpt: "Why accessibility is not just a compliance requirement but a smart business decision with measurable ROI.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Design",
    date: "2025-04-15",
    author: {
      name: "Sophia Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
    }
  },
  {
    id: "6",
    title: "From Bootcamp to Job: A Graduate's Journey",
    excerpt: "Follow the path of one of our recent graduates as they transition from student to professional developer.",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&h=500&q=80",
    category: "Success Stories",
    date: "2025-04-08",
    author: {
      name: "Alexandra Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
    }
  }
];

// Extract unique categories for filtering
const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Blog & Resources
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              Insights, tutorials, and stories from our team and community to help you navigate the digital landscape.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filter */}
      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Post */}
      <section className="py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-medium mb-6">Featured Article</h2>
          <BlogCard
            id={blogPosts[0].id}
            title={blogPosts[0].title}
            excerpt={blogPosts[0].excerpt}
            image={blogPosts[0].image}
            category={blogPosts[0].category}
            date={blogPosts[0].date}
            author={blogPosts[0].author}
            featured={true}
          />
        </div>
      </section>
      
      {/* All Posts */}
      <section className="py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-medium mb-6">Latest Articles</h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map(post => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  category={post.category}
                  date={post.date}
                  author={post.author}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Resources */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Free Resources</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Download these guides, templates, and tools to help you on your digital journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Beginner's Guide to HTML & CSS</h3>
                <p className="text-gray-600 mb-6">
                  A comprehensive guide to help you understand the fundamentals of web development.
                </p>
                <Button variant="outline" asChild>
                  <a href="#" download className="flex items-center gap-2">
                    Download PDF
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Website Audit Checklist</h3>
                <p className="text-gray-600 mb-6">
                  Evaluate your website's performance, accessibility, and user experience with this comprehensive checklist.
                </p>
                <Button variant="outline" asChild>
                  <a href="#" download className="flex items-center gap-2">
                    Download PDF
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden hover-scale">
              <div className="p-6">
                <h3 className="text-xl font-medium mb-4">Digital Marketing Starter Kit</h3>
                <p className="text-gray-600 mb-6">
                  Templates and tools to help small businesses and nonprofits kickstart their digital marketing efforts.
                </p>
                <Button variant="outline" asChild>
                  <a href="#" download className="flex items-center gap-2">
                    Download PDF
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Join Our Newsletter</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest articles, resources, and insights delivered to your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
