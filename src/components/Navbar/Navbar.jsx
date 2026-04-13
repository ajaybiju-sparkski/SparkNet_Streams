import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

function SparkNetLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sn-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="sn-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="sn-grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      {/* Back petal — darkest / most purple */}
      <path
        d="M50 85 C20 85 10 60 18 35 C26 15 42 10 50 10 C50 10 30 30 34 58 C36 72 44 80 50 85Z"
        fill="url(#sn-grad3)"
        opacity="0.75"
      />
      {/* Middle petal */}
      <path
        d="M50 85 C28 78 18 58 22 38 C27 18 42 10 55 12 C55 12 36 32 42 60 C45 73 48 80 50 85Z"
        fill="url(#sn-grad2)"
        opacity="0.88"
      />
      {/* Front petal — brightest cyan */}
      <path
        d="M50 85 C35 76 26 60 30 42 C34 22 46 12 60 14 C60 14 42 35 50 62 C53 74 52 81 50 85Z"
        fill="url(#sn-grad1)"
      />
    </svg>
  );
}

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
          <SparkNetLogo />
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
