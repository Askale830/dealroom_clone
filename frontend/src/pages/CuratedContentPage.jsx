import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { curatedContentAPI } from '../services/api';
import { 
  BookOpen, 
  FileText, 
  Bookmark, 
  ExternalLink, 
  ChevronRight, 
  Download,
  Clock,
  Tag,
  Building,
  ArrowRight
} from 'lucide-react';

const CuratedContentPage = () => {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [contentByType, setContentByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCuratedContent();
  }, []);

  const fetchCuratedContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch featured content
      const featuredData = await curatedContentAPI.getFeatured();
      setFeaturedContent(featuredData);
      
      // Fetch content by type
      const contentByTypeData = await curatedContentAPI.getByType();
      setContentByType(contentByTypeData);
    } catch (err) {
      console.error('Error fetching curated content:', err);
      setError(err.message || 'Failed to load curated content');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <BookOpen size={20} />;
      case 'report':
        return <FileText size={20} />;
      case 'guide':
        return <Bookmark size={20} />;
      case 'resource':
        return <Download size={20} />;
      case 'news':
        return <Clock size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Content</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="dealroom-hero py-16 lg:py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ethiopia Startup Ecosystem
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Curated Resources
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover essential reports, guides, and insights about Ethiopia's startup ecosystem
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Featured Content */}
      {featuredContent && featuredContent.length > 0 && (
        <section className="py-16 bg-white relative -mt-16 z-20">
          <div className="container">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredContent.map((item) => (
                  <div key={item.id} className="card group hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          {getContentTypeIcon(item.content_type)}
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          {item.content_type_display}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="mt-auto">
                        {item.external_url ? (
                          <a 
                            href={item.external_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all"
                          >
                            View Resource
                            <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ) : (
                          <Link 
                            to={`/curated-content/${item.slug}`}
                            className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all"
                          >
                            Read More
                            <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content By Type */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          {Object.entries(contentByType).map(([type, data]) => (
            <div key={type} className="mb-16 last:mb-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                <Link 
                  to={`/curated-content?type=${type}`}
                  className="flex items-center text-blue-600 font-medium hover:gap-2 transition-all"
                >
                  View All
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.content.map((item) => (
                  <div key={item.id} className="card group hover:shadow-lg transition-all duration-300">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            {getContentTypeIcon(item.content_type)}
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            {formatDate(item.published_date)}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {item.description}
                      </p>
                      
                      {item.industries && item.industries.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Tag size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {item.industries.map(i => i.name).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {item.related_companies && item.related_companies.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Building size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {item.related_companies.map(c => c.name).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-4">
                        {item.external_url ? (
                          <a 
                            href={item.external_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all"
                          >
                            View Resource
                            <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ) : (
                          <Link 
                            to={`/curated-content/${item.slug}`}
                            className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all"
                          >
                            Read More
                            <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CuratedContentPage;