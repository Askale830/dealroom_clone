import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Building2, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { companyAPI, investorAPI, personAPI } from '../../services/api';
import styles from './Header.module.css';

const Header = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState({
    companies: [],
    investors: [],
    people: []
  });
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Real search functionality using API
  useEffect(() => {
    const searchData = async () => {
      if (search.length < 1) {
        setSearchResults({ companies: [], investors: [], people: [] });
        return;
      }

      setLoading(true);
      
      try {
        console.log('Searching for:', search);
        
        // Make API requests
        const [companiesRes, investorsRes, peopleRes] = await Promise.all([
          companyAPI.getAll({ search, page_size: 3 }),
          investorAPI.getAll({ search, page_size: 3 }),
          personAPI.getAll({ search, page_size: 3 })
        ]);
        
        console.log('API responses:', { companiesRes, investorsRes, peopleRes });
        
        // Extract and process results
        const companies = companiesRes?.data || [];
        const investors = investorsRes?.data || [];
        const people = peopleRes?.data || [];
        
        console.log('Processed results:', { companies, investors, people });
        
        setSearchResults({
          companies: Array.isArray(companies) ? companies : [],
          investors: Array.isArray(investors) ? investors : [],
          people: Array.isArray(people) ? people : []
        });
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ companies: [], investors: [], people: [] });
      } finally {
        setLoading(false);
      }
    };

    // Immediately show results when focused and search is not empty
    if (isSearchFocused && search.length > 0) {
      searchData();
    } else if (!isSearchFocused) {
      // Clear results when not focused
      setSearchResults({ companies: [], investors: [], people: [] });
    }

    const debounceTimer = setTimeout(() => {
      if (isSearchFocused && search.length > 0) {
        searchData();
      }
    }, 300); // Debounce time for API requests

    return () => clearTimeout(debounceTimer);
  }, [search, isSearchFocused]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
    setIsSearchFocused(false);
    setSearch('');
  };

  const totalResults = searchResults.companies.length + searchResults.investors.length + searchResults.people.length;

  return (
    <header className={styles.header}>
      {/* Sidebar Toggle (Hamburger) */}
      <button className={styles.menuBtn} onClick={onSidebarToggle} aria-label="Toggle sidebar">
        <Menu size={28} />
      </button>
      
      {/* Search Bar */}
      <div ref={searchContainerRef} className={`${styles.searchBar} ${isSearchFocused ? styles.searchBarFocused : ''}`}>
        <Search className={styles.searchIcon} />
        <input
          ref={searchInputRef}
          className={styles.searchInput}
          type="text"
          placeholder="Search for companies, investors, people, lists & innovations"
          value={search}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
        />
        {search && (
          <button className={styles.clearButton} onClick={handleClearSearch}>
            <X size={16} />
          </button>
        )}
        
        {/* Search Results Dropdown */}
        {isSearchFocused && (
          <div className={styles.searchResults}>
            {loading && <div className={styles.searchLoading}>Searching...</div>}
            
            {!loading && search.length > 0 && totalResults === 0 && (
              <div className={styles.noResults}>
                <p>No results found for "{search}"</p>
              </div>
            )}
            
            {!loading && totalResults > 0 && (
              <div className={styles.resultsContainer}>
                {/* Companies */}
                {searchResults.companies.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>Companies</h3>
                    <div className={styles.resultsList}>
                      {searchResults.companies.map((company) => (
                        <div 
                          key={company.id || Math.random()} 
                          className={styles.resultItem}
                          onClick={() => handleItemClick(`/companies/${company.slug || ''}`)}
                        >
                          {company.logo ? (
                            <img src={company.logo} alt={company.name || 'Company'} className={styles.resultItemImage} />
                          ) : (
                            <div className={styles.resultItemImagePlaceholder}>
                              <Building2 size={16} />
                            </div>
                          )}
                          <div className={styles.resultItemContent}>
                            <p className={styles.resultItemTitle}>{company.name || 'Unnamed Company'}</p>
                            {company.short_description && (
                              <p className={styles.resultItemDescription}>{company.short_description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Investors */}
                {searchResults.investors.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>Investors</h3>
                    <div className={styles.resultsList}>
                      {searchResults.investors.map((investor) => (
                        <div 
                          key={investor.id || Math.random()} 
                          className={styles.resultItem}
                          onClick={() => handleItemClick(`/investors/${investor.slug || ''}`)}
                        >
                          {investor.logo ? (
                            <img src={investor.logo} alt={investor.name || 'Investor'} className={styles.resultItemImage} />
                          ) : (
                            <div className={styles.resultItemImagePlaceholder}>
                              <TrendingUp size={16} />
                            </div>
                          )}
                          <div className={styles.resultItemContent}>
                            <p className={styles.resultItemTitle}>{investor.name || 'Unnamed Investor'}</p>
                            <p className={styles.resultItemDescription}>
                              {investor.investor_type === 'VC' ? 'Venture Capital' : (investor.investor_type || 'Investor')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* People */}
                {searchResults.people.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>People</h3>
                    <div className={styles.resultsList}>
                      {searchResults.people.map((person) => (
                        <div 
                          key={person.id || Math.random()} 
                          className={styles.resultItem}
                          onClick={() => handleItemClick(`/people/${person.slug || ''}`)}
                        >
                          {person.profile_picture ? (
                            <img src={person.profile_picture} alt={person.full_name || 'Person'} className={styles.resultItemImage} />
                          ) : (
                            <div className={styles.resultItemImagePlaceholder}>
                              <Users size={16} />
                            </div>
                          )}
                          <div className={styles.resultItemContent}>
                            <p className={styles.resultItemTitle}>{person.full_name || 'Unnamed Person'}</p>
                            {person.bio && (
                              <p className={styles.resultItemDescription}>{person.bio}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* View All Results Link */}
                <div className={styles.viewAllResults}>
                  <Link to={`/search?q=${encodeURIComponent(search)}`} onClick={() => setIsSearchFocused(false)}>
                    View all results
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Auth Buttons */}
      <div className={styles.authBtns}>
        {user ? (
          <>
            <span className={styles.userEmail}>{user.email || user.username}</span>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
            <Link to="/register" className={styles.signupBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;