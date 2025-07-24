import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Sample property data
const sampleProperties = [
  { id: 1, name: 'Luxury Villa', location: 'Mumbai', type: 'Villa' },
  { id: 2, name: 'Modern Apartment', location: 'Delhi', type: 'Apartment' },
  { id: 3, name: 'Beach House', location: 'Goa', type: 'House' },
  { id: 4, name: 'Mountain View', location: 'Shimla', type: 'Cottage' },
  { id: 5, name: 'City Loft', location: 'Bangalore', type: 'Apartment' },
];

function Dashboard() {
  const videoRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Filter properties based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      const results = sampleProperties.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePropertySelect = (location) => {
    navigate(`/properties?search=${encodeURIComponent(location)}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    // Ensure video plays and is properly sized
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }

    // Set document styles
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Cleanup
      document.documentElement.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        <h1 className="main-heading">Find Your Dream Property</h1>
        
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by location (e.g., Mumbai, Delhi, Goa)..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="search-input"
            />
          </div>
          
          {searchResults.length > 0 && isSearchFocused && (
            <div className="search-results">
              {searchResults.map(property => (
                <div 
                  key={property.id} 
                  className="property-item"
                  onClick={() => handlePropertySelect(property.location)}
                >
                  <div className="property-name">{property.name}</div>
                  <div className="property-details">
                    <span className="property-location">{property.location}</span>
                    <span className="property-type">{property.type}</span>
                  </div>
                </div>
              ))}
              {searchTerm.trim() && (
                <div 
                  className="property-item view-all"
                  onClick={() => handlePropertySelect(searchTerm.trim())}
                >
                  <div className="property-name">Search for "{searchTerm.trim()}"</div>
                  <div className="property-details">View all matching properties</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="video-background">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          id="bg-video"
          preload="auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            transform: 'none',
            zIndex: -1,
            objectFit: 'cover'
          }}
          src="https://res.cloudinary.com/drazyyxbr/video/upload/v1753329214/rotatevideo_txpdnr.mp4"
        />
      </div>
    </div>
  );
}

export default Dashboard;
