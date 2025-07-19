import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curatedContentAPI } from '../services/api';
import { 
  Calendar, 
  Tag, 
  Building, 
  ExternalLink, 
  Download, 
  ArrowLeft,
  BookOpen,
  FileText,
  Bookmark,
  Clock
} from 'lucide-react';

const CuratedContentDetailPage = () => {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContentDetails();
  }, [slug]);

  const fetchContentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await curatedContentAPI.getOne(slug);
      setContent(data);
    } catch (err) {
      console.error('Error fetching content details:', err);
      setError(err.message || 'Failed to load content details');
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
          <Link to="/curated-content" className="btn btn-primary">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-8">The resource you're looking for doesn't exist or has been removed.</p>
          <Link to="/curated-content" className="btn btn-primary">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container">
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/curated-content" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Resources
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                {getContentTypeIcon(content.content_type)}
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {content.content_type_display}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {formatDate(content.published_date)}
              </div>
              
              {content.industries && content.industries.length > 0 && (
                <div className="flex items-center">
                  <Tag size={16} className="mr-2" />
                  {content.industries.map(i => i.name).join(', ')}
                </div>
              )}
              
              {content.related_companies && content.related_companies.length > 0 && (
                <div className="flex items-center">
                  <Building size={16} className="mr-2" />
                  {content.related_companies.map(c => c.name).join(', ')}
                </div>
              )}
            </div>
            
            {content.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {content.description}
              </p>
            )}
          </div>
          
          {/* Content Body */}
          <div className="p-8">
            {content.external_url && (
              <div className="mb-8">
                <a 
                  href={content.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center justify-center gap-2"
                >
                  Visit External Resource
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
            
            {content.file && (
              <div className="mb-8">
                <a 
                  href={content.file} 
                  download
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  Download File
                  <Download size={16} />
                </a>
              </div>
            )}
            
            {content.content && (
              <div className="prose prose-blue max-w-none">
                {/* Render content - in a real app, you might use a rich text renderer here */}
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </div>
            )}
            
            {!content.content && !content.file && !content.external_url && (
              <div className="text-center py-12">
                <p className="text-gray-500">No content available for this resource.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Companies Section */}
        {content.related_companies && content.related_companies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.related_companies.map(company => (
                <Link 
                  key={company.id} 
                  to={`/companies/${company.slug}`}
                  className="card hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body flex items-center gap-4">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Building size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      {company.short_description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{company.short_description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuratedContentDetailPage;