import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, Target, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { dashboardAPI } from '../services/api';

const resourceCategories = [
  { label: 'All Resources', icon: BookOpen, type: '' },
  { label: 'Reports', icon: FileText, type: 'report' },
  { label: 'Guides', icon: Target, type: 'guide' },
  { label: 'Articles', icon: BookOpen, type: 'article' },
];

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');

  useEffect(() => {
    fetchResources();
  }, [activeType]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Replace with your actual API call for resources/curated content
      const res = await dashboardAPI.getCuratedContent(activeType);
      setResources(res || []);
    } catch (e) {
      setResources([]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heroTitle} style={{marginBottom:'1.5rem'}}>Resources</h1>
      <div style={{display:'flex',gap:'1.5rem',marginBottom:'2rem'}}>
        {resourceCategories.map(({ label, icon: Icon, type }) => (
          <button
            key={label}
            className={activeType === type ? styles.tabActive : styles.tab}
            onClick={() => setActiveType(type)}
          >
            <Icon size={18} style={{marginRight:8}} /> {label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{textAlign:'center',marginTop:'2rem'}}>Loading resources...</div>
      ) : resources.length === 0 ? (
        <div style={{textAlign:'center',marginTop:'2rem',color:'#64748b'}}>
          <Star style={{marginBottom:8}} />
          <div>No resources found for this category.</div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'2rem'}}>
          {resources.map((item) => (
            <Link to={`/curated-content/${item.slug}`} key={item.id} className={styles.card} style={{textAlign:'left'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                <BookOpen size={28} />
                <span style={{fontWeight:700,fontSize:'1.1rem'}}>{item.title}</span>
              </div>
              <div style={{color:'#64748b',fontSize:'1rem',marginBottom:'0.5rem'}}>{item.description}</div>
              <div style={{fontSize:'0.95rem',color:'#a0aec0'}}>Published: {item.published_date ? new Date(item.published_date).toLocaleDateString() : 'N/A'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
