
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  className?: string;
  featured?: boolean;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  image,
  category,
  date,
  author,
  className,
  featured = false
}: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  if (featured) {
    return (
      <div className={cn(
        "grid md:grid-cols-2 gap-6 overflow-hidden rounded-lg bg-white hover-scale",
        className
      )}>
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-6">
          <div className="mb-4">
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">
              {category}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-medium mb-3">{title}</h3>
          <p className="text-gray-600 mb-4">{excerpt}</p>
          <div className="flex items-center gap-3 mb-6">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-gray-500">{formatDate(date)}</p>
            </div>
          </div>
          <Link
            to={`/blog/${id}`}
            className="inline-flex items-center font-medium button-hover"
          >
            Read Article
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "overflow-hidden rounded-lg bg-white h-full flex flex-col hover-scale",
      className
    )}>
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{excerpt}</p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {author.avatar && (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm">{author.name}</span>
            </div>
            <span className="text-xs text-gray-500">{formatDate(date)}</span>
          </div>
          <Link
            to={`/blog/${id}`}
            className="inline-flex items-center mt-4 font-medium button-hover"
          >
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
