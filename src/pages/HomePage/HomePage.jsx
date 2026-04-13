import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Share2, Gamepad2, Music, Cpu, Trophy, TrendingUp, Telescope, Zap, Eye } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import { events } from '../../data';
import './HomePage.css';

const CATEGORIES = [
  { label: 'All',      icon: Zap,       filter: null },
  { label: 'Gaming',   icon: Gamepad2,  filter: 'Gaming' },
  { label: 'Music',    icon: Music,     filter: 'Music' },
  { label: 'Tech',     icon: Cpu,       filter: 'Tech' },
  { label: 'Sports',   icon: Trophy,    filter: 'Sports' },
  { label: 'Science',  icon: Telescope, filter: 'Science' },
  { label: 'Trending', icon: TrendingUp,filter: 'Trending' },
];

const HERO = events[1]; 

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchQuery(e.detail.toLowerCase());
    window.addEventListener('searchUpdate', handler);
    return () => window.removeEventListener('searchUpdate', handler);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCategory = activeCategory ? ev.category === activeCategory : true;
      const matchSearch = searchQuery
        ? ev.title.toLowerCase().includes(searchQuery) ||
          ev.category.toLowerCase().includes(searchQuery) ||
          ev.description.toLowerCase().includes(searchQuery)
        : true;
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalViews = events.reduce((s, e) => s + e.views, 0);

  return (
    <main className="page-wrapper home">
      <section className="home__hero" aria-label="Featured event">
        <img
          src={HERO.thumbnail}
          alt={HERO.title}
          className="home__hero-bg"
          loading="eager"
        />
        <div className="home__hero-overlay" aria-hidden="true" />
        <div className="home__hero-content">
          <span className="home__hero-category">
            <span className="home__hero-dot" aria-hidden="true" />
            {HERO.category} · Live Now
          </span>
          <h1 className="home__hero-title">{HERO.title}</h1>
          <p className="home__hero-description">{HERO.description}</p>
          <div className="home__hero-actions">
            <button
              className="home__hero-cta home__hero-cta--primary"
              onClick={() => navigate(`/event/${HERO.id}`)}
              id="hero-watch-btn"
              aria-label={`Watch ${HERO.title}`}
            >
              <Play size={16} fill="currentColor" />
              Watch Now
            </button>
            <button
              className="home__hero-cta home__hero-cta--secondary"
              onClick={() => navigator.share?.({ title: HERO.title, url: window.location.href })}
              id="hero-share-btn"
              aria-label="Share featured event"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </section>

      <div className="home__stats-bar" aria-label="Platform statistics">
        <div className="home__stat">
          <span className="home__stat-value">{events.length}</span>
          <span className="home__stat-label">Live Events</span>
        </div>
        <div className="home__stat">
          <span className="home__stat-value">{formatViews(totalViews)}</span>
          <span className="home__stat-label">Total Viewers</span>
        </div>
        <div className="home__stat">
          <span className="home__stat-value">7</span>
          <span className="home__stat-label">Categories</span>
        </div>
        <div className="home__stat">
          <span className="home__stat-value">HD</span>
          <span className="home__stat-label">Stream Quality</span>
        </div>
        <div className="home__stat">
          <span className="home__stat-value">Free</span>
          <span className="home__stat-label">Forever</span>
        </div>
      </div>

      <nav className="home__filter-section" aria-label="Event category filters">
        <span className="home__filter-label">Filter:</span>
        <div className="home__filter-pills" role="group">
          {CATEGORIES.map(({ label, icon: Icon, filter }) => {
            const count = filter
              ? events.filter((e) => e.category === filter).length
              : events.length;
            const isActive = activeCategory === filter;
            return (
              <button
                key={label}
                className={`home__filter-pill${isActive ? ' active' : ''}`}
                onClick={() => setActiveCategory(isActive ? null : filter)}
                aria-pressed={isActive}
                id={`filter-pill-${label.toLowerCase()}`}
              >
                <Icon size={13} />
                {label}
                <span className="home__filter-pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <section className="home__events-section" aria-label="Events listing">
        <div className="home__section-header">
          <h2 className="home__section-title">
            {activeCategory
              ? <><span className="home__section-title-accent">{activeCategory}</span> Events</>
              : <>All <span className="home__section-title-accent">Live</span> Events</>}
          </h2>
          <span className="home__results-count">
            {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </span>
        </div>

        <div className="home__grid" role="list">
          {filteredEvents.length === 0 ? (
            <div className="home__empty" role="status">
              <div className="home__empty-icon">🔍</div>
              <p className="home__empty-text">No events found</p>
              <p className="home__empty-sub">Try a different search or category filter</p>
            </div>
          ) : (
            filteredEvents.map((event, i) => (
              <div key={event.id} role="listitem" style={{ '--stagger': i }}>
                <EventCard
                  event={event}
                  style={{ animationDelay: `${i * 0.045}s` }}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
