import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);

    window.dispatchEvent(new CustomEvent('searchUpdate', { detail: e.target.value }));
  };

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} role="banner">

      <Link to="/" className="navbar__logo" aria-label="SparkNet Home">
        <div className="navbar__logo-icon">
          <Play size={18} fill="white" color="white" />
        </div>
        <span className="navbar__logo-text">SparkNet</span>
        <span className="navbar__logo-live-badge">LIVE</span>
      </Link>


      <div className="navbar__search">
        <Search className="navbar__search-icon" size={16} />
        <input
          id="navbar-search"
          type="search"
          className="navbar__search-input"
          placeholder="Search events, artists, games…"
          value={query}
          onChange={handleSearchChange}
          autoComplete="off"
          aria-label="Search events"
        />
      </div>


      <button
        className="navbar__menu-btn"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
        id="navbar-menu-toggle"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
