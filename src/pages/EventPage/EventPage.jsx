import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Eye, Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Chat from '../../components/Chat/Chat';
import EventCard from '../../components/EventCard/EventCard';
import { events } from '../../data';
import './EventPage.css';

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const playerRef = useRef(null);

  const event = events.find((e) => e.id === id);


  useEffect(() => {

    const onPlayerReady = (e) => {
      e.target.setVolume(100);
      e.target.unMute();
      e.target.playVideo();
    };


    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(`video-player-${id}`, {
        events: {
          'onReady': onPlayerReady,
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      if (window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }
    }
  }, [id]);

  if (!event) {
    return (
      <div className="page-wrapper event-page__not-found" role="main">
        <div className="event-page__not-found-icon">📺</div>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist or has ended.</p>
        <button
          className="event-page__back-btn"
          onClick={() => navigate('/')}
          id="not-found-back-btn"
        >
          <ArrowLeft size={16} />
          Back to Events
        </button>
      </div>
    );
  }

  const related = events.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 3);
  const fallbackRelated = events.filter((e) => e.id !== event.id).slice(0, 3 - related.length);
  const moreEvents = [...related, ...fallbackRelated].slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="page-wrapper event-page">
      <div style={{
        padding: '0.6rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-secondary)', fontSize: '0.8rem',
            cursor: 'pointer', transition: 'color 0.2s ease',
            background: 'none', border: 'none'
          }}
          id="breadcrumb-back-btn"
        >
          <ArrowLeft size={14} />
          All Events
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
          {event.category}
        </span>
      </div>

      <div className="event-page__layout">
        <div className="event-page__main">
          <div className="event-page__video-wrapper" role="region">
            <iframe
              id={`video-player-${event.id}`}
              src={`https://www.youtube.com/embed/${event.youtubeId}?autoplay=1&mute=0&controls=1&rel=0&enablejsapi=1`}
              title={event.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="event-page__video-brand">
              <span className="event-page__live-dot" />
              LIVE
            </div>
          </div>

          <section className="event-page__details">
            <div className="event-page__details-top">
              <h1 className="event-page__title">{event.title}</h1>
              <div className="event-page__action-group">
                <button
                  className={`event-page__btn event-page__btn--like${liked ? ' liked' : ''}`}
                  onClick={() => setLiked((l) => !l)}
                >
                  <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  {liked ? 'Liked' : 'Like'}
                </button>
                <button className="event-page__btn event-page__btn--share" onClick={handleShare}>
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>

            <div className="event-page__meta-row">
              <span className="event-page__category-pill"><Tag size={10} />{event.category}</span>
              <span className="event-page__meta-item"><Eye size={14} />{formatViews(event.views)} viewers</span>
              <span className="event-page__meta-item"><Calendar size={14} />{event.date}</span>
              <span className="event-page__meta-item"><Clock size={14} />{event.time}</span>
            </div>
          </section>

          <section className="event-page__description-section">
            <p className="event-page__description-label">About This Event</p>
            <p className="event-page__description-text">{event.description}</p>
          </section>

          {moreEvents.length > 0 && (
            <section className="event-page__more-section">
              <h2 className="event-page__more-title">
                More <span className="event-page__more-title-accent">{event.category}</span> Events
              </h2>
              <div className="event-page__more-grid">
                {moreEvents.map((ev, i) => (
                  <EventCard key={ev.id} event={ev} style={{ animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="event-page__chat-col">
          <Chat viewCount={formatViews(event.views)} />
        </div>
      </div>
    </div>
  );
}