import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardAPI } from '../services/api';
import { 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign,
  Globe,
  Target,
  Award,
  Zap,
  ChevronRight,
  Play,
  Star,
  BarChart3,
  Activity,
  BookOpen,
  Search,
  Loader2,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from './HomePage.module.css';
import Footer from '../components/Layout/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [data, setData] = useState({
    overview: {
      total_companies: 0,
      total_investors: 0,
      total_funding: 0,
      active_companies: 0,
    },
    recent_companies: [],
    recent_funding: [],
    industry_stats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    total_companies: 0,
    total_rounds: 0
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Animate stats numbers
  useEffect(() => {
    if (data?.overview?.total_companies > 0) {
      const animateNumber = (target, key) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 30);
      };
      
      animateNumber(data.overview.total_companies, 'total_companies');
      animateNumber(data.overview.total_rounds || 0, 'total_rounds');
    }
  }, [data?.overview]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardAPI.getStats();
      setData(dashboardData);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  };

  // Enhanced loading component
  const LoadingComponent = () => (
    <div className={styles.homeBg} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={48} className="text-blue-600" />
        </motion.div>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg"
        >
          Loading Ethiopia's startup ecosystem...
        </motion.span>
      </motion.div>
    </div>
  );

  // Enhanced error component
  const ErrorComponent = () => (
    <div className={styles.homeBg} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <AlertCircle size={64} className="text-red-500 mx-auto" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Data</h1>
        <p className="text-gray-600 mb-6">{safeString(error)}</p>
        <div className="flex gap-4 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className={styles.heroCta}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <RefreshCw size={18} className="mr-2" />}
            {loading ? 'Retrying...' : 'Try Again'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className={styles.addCompanyBtn}
          >
            Go to Dashboard
          </motion.button>
        </div>
        {retryCount > 2 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mt-4"
          >
            Having trouble? Try refreshing the page or contact support.
          </motion.p>
        )}
      </motion.div>
    </div>
  );

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;

  // Enhanced tab content renderers with animations
  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{fontSize:'1.5rem',fontWeight:700,margin:'2.5rem 0 1.5rem 0',color:'#1a202c',textAlign:'left'}}
      >
        Overview
      </motion.h2>
      <div className={styles.cardsGrid}>
        {/* Add your organization */}
        <motion.div 
          className={styles.card} 
          onClick={() => navigate('/signup-organization')} 
          style={{cursor:'pointer'}}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Building2 size={48} className={styles.cardIcon} style={{ color: '#2563eb' }} />
          </motion.div>
          <h3 className={styles.cardTitle}>Add your organization</h3>
          <p className={styles.cardText}>Are you a founder, a VC, or otherwise active in the ecosystem? Gain visibility, unlock more features, and help the database become more complete by adding your organization for free.</p>
          <motion.div 
            style={{marginTop:'auto', textAlign:'center'}}
            whileHover={{ x: 3 }}
          >
            <span style={{color:'#2563eb',fontSize:'0.875rem',fontWeight:600}}>Create an account <ArrowRight size={12} style={{display:'inline',marginLeft:4}} /></span>
          </motion.div>
        </motion.div>

        {/* Becoming a partner */}
        <motion.div 
          className={styles.card} 
          onClick={() => navigate('/contact')} 
          style={{cursor:'pointer'}}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Users size={48} className={styles.cardIcon} style={{ color: '#10b981' }} />
          </motion.div>
          <h3 className={styles.cardTitle}>Becoming a partner</h3>
          <p className={styles.cardText}>Our partners help make this platform what it is through data sharing, collaboration, and support.</p>
          <div style={{marginTop:'auto', textAlign:'center'}}>
            <span style={{display:'block',color:'#2563eb',fontWeight:600,fontSize:'0.875rem',marginBottom:6}}>Interested in partnering?</span>
            <motion.span 
              style={{display:'inline-block',background:'#2563eb',color:'#fff',padding:'0.375rem 1rem',borderRadius:6,fontWeight:600,textDecoration:'none',boxShadow:'0 1px 4px 0 rgba(16,30,54,0.08)',transition:'background 0.2s',cursor:'pointer',fontSize:'0.8rem'}}
              whileHover={{ scale: 1.05, backgroundColor: '#1746a2' }}
              whileTap={{ scale: 0.95 }}
            >
              Contact us
            </motion.span>
          </div>
        </motion.div>

        {/* Where the data comes from */}
        <motion.div 
          className={styles.card}
          whileHover={{ y: -4, scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BarChart3 size={48} className={styles.cardIcon} style={{ color: '#f59e0b' }} />
          </motion.div>
          <h3 className={styles.cardTitle}>Where the data comes from</h3>
          <p className={styles.cardText}>This platform is powered by Dealroom. We combine machine learning and data engineering with user-submitted data with robust verification processes and a strong network of ecosystems.</p>
          <motion.div 
            style={{marginTop:'auto', textAlign:'center'}}
            whileHover={{ x: 3 }}
          >
            <span style={{color:'#2563eb',fontSize:'0.875rem',fontWeight:600}}>See more <ExternalLink size={12} style={{display:'inline',marginLeft:4}} /></span>
          </motion.div>
        </motion.div>

        {/* Glossary & definitions */}
        <motion.div 
          className={styles.card}
          whileHover={{ y: -4, scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen size={48} className={styles.cardIcon} style={{ color: '#8b5cf6' }} />
          </motion.div>
          <h3 className={styles.cardTitle}>Glossary & definitions</h3>
          <p className={styles.cardText}>What is a startup, scaleup or service provider? B2B or B2C? Take a look at our methodology and list of Dealroom definitions.</p>
          <motion.div 
            style={{marginTop:'auto', textAlign:'center'}}
            whileHover={{ x: 3 }}
          >
            <span style={{color:'#2563eb',fontSize:'0.875rem',fontWeight:600}}>See more <ExternalLink size={12} style={{display:'inline',marginLeft:4}} /></span>
          </motion.div>
        </motion.div>

        {/* Ministry of Innovation and Technology (MinT) card */}
        <motion.div 
          className={styles.card} 
          onClick={() => navigate('/companies/ministry_of_innovation_and_technology')} 
          style={{cursor:'pointer',border:'1px solid #e0e7ef',overflow:'hidden',position:'relative'}}
          whileHover={{ y: -4, scale: 1.01, borderColor: '#2563eb' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.img 
            src="https://storage.googleapis.com/dealroom-images-production/29/MTAwOjEwMDpjb21wYW55QHMzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2RlYWxyb29tLWltYWdlcy8yMDI0LzAyLzIwLzUwZGYyOTY0YTg5ZDU4ZDc2NTAzNDJjNThhYzQ4MzA1.png" 
            alt="Ministry of Innovation and Technology" 
            className={styles.cardIcon} 
            style={{borderRadius:8,background:'#fff',padding:4,width:'48px',height:'48px',objectFit:'contain'}}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h3 className={styles.cardTitle}>Collaborators</h3>
          <h4 style={{fontSize:'1rem',fontWeight:600,color:'#1a202c',marginBottom:'0.5rem',textAlign:'center'}}>Ministry of Innovation and Technology</h4>
          <p className={styles.cardText}>The Ministry of Innovation and Technology (MinT) is an Ethiopian government department working on building a country that is conducive for job and wealth creation through technology and innovation.</p>
          <motion.div
            style={{ position: 'absolute', top: 12, right: 12 }}
            whileHover={{ scale: 1.2 }}
          >
            <ExternalLink size={14} style={{ color: '#2563eb' }} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderCuratedContent = () => (
    <motion.div 
      style={{padding:'2rem 0',textAlign:'center'}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        style={{fontSize:'1.5rem',fontWeight:700,marginBottom:'1.5rem',color:'#1a202c'}}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Curated Content
      </motion.h2>
      <motion.p 
        style={{color:'#64748b',marginBottom:'1.5rem'}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Discover essential reports, guides, and insights about Ethiopia's startup ecosystem.
      </motion.p>
      <motion.button 
        className={styles.heroCta} 
        onClick={() => navigate('/curated-content')}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Browse Resources <ArrowRight size={18} style={{marginLeft:8}} />
      </motion.button>
    </motion.div>
  );

  const renderTutorial = () => (
    <motion.div 
      style={{padding:'2rem 0',textAlign:'center'}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        style={{fontSize:'1.5rem',fontWeight:700,marginBottom:'1.5rem',color:'#1a202c'}}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Getting Started
      </motion.h2>
      <motion.p 
        style={{color:'#64748b',marginBottom:'1.5rem'}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Learn how to use the platform and get the most out of Dealroom Ethiopia.
      </motion.p>
      <motion.button 
        className={styles.heroCta} 
        onClick={() => navigate('/dashboard')}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        View Dashboard <Play size={18} style={{marginLeft:8}} />
      </motion.button>
    </motion.div>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/companies?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className={styles.homeBg}>
      {/* Enhanced Hero Section */}
      <motion.div 
        className={styles.heroSection}
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className={styles.heroTextBlock} 
          style={{zIndex:2, maxWidth: '520px'}}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Explore the Ethiopian ecosystem
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            This is an open-access database provided by Dealroom.co for the benefit of the Ethiopian Ecosystem. We aim to provide data transparency, with a 360-degree view of the innovation and startup ecosystem, mapping startups/scaleups, investors, rounds, hubs, and much more.
          </motion.p>
          <motion.div 
            style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button 
              className={styles.heroCta} 
              onClick={() => navigate('/signup-organization')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign up
            </motion.button>
            <motion.button 
              className={styles.addCompanyBtn} 
              onClick={() => navigate('/companies/add')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Company
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.heroStatsBlock}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className={styles.heroStatsCard}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span 
              className={styles.heroStatsNumber}
              key={animatedStats.total_companies}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {animatedStats.total_companies}
            </motion.span>
            <span className={styles.heroStatsLabel}>Companies</span>
            <motion.span 
              className={styles.heroStatsNumber}
              key={animatedStats.total_rounds}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              {animatedStats.total_rounds}
            </motion.span>
            <span className={styles.heroStatsLabel}>Rounds</span>
            <motion.span 
              className={styles.heroStatsLabel} 
              style={{fontSize:'0.95rem',marginTop:8,color:'#64748b'}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Ethiopia Skyline
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Search Bar */}
      <div className={styles.container}>
        <motion.form 
          className={`${styles.homeSearchBar} ${isSearchFocused ? 'focused' : ''}`}
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          style={{
            transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isSearchFocused ? '0 8px 32px 0 rgba(37,99,235,0.15)' : '0 2px 12px 0 rgba(16, 30, 54, 0.08)',
            borderColor: isSearchFocused ? '#2563eb' : '#e5e7eb'
          }}
        >
          <motion.div
            animate={{ rotate: isSearchFocused ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Search className={styles.homeSearchIcon} />
          </motion.div>
          <input
            className={styles.homeSearchInput}
            type="text"
            placeholder="Search for companies, investors, people, lists & innovations"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{ background: 'transparent' }}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <ArrowRight size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Enhanced Tabs Section */}
        <motion.div 
          className={styles.tabsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[
            { key: 'overview', label: 'OVERVIEW' },
            { key: 'curated', label: 'CURATED CONTENT' },
            { key: 'tutorial', label: 'GETTING STARTED (TUTORIAL)' }
          ].map((tab, index) => (
            <motion.button 
              key={tab.key}
              className={activeTab === tab.key ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Tab Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'curated' && renderCuratedContent()}
            {activeTab === 'tutorial' && renderTutorial()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;