import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Play, Eye, Clock, Calendar } from 'lucide-react';
import './EventCard.css';

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

export default function EventCard({ event, style }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimerRef = useRef(null);



  const handleMouseEnter = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      setShowVideo(true);

    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimerRef.current);
    setShowVideo(false);

  }, []);

  const handleCardClick = (e) => {
    if (e.target.closest('.event-card__actions')) return;
    navigate(`/event/${event.id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((l) => !l);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.origin + '/event/' + event.id });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/event/' + event.id);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/event/${event.id}`);
  };

  const categoryClass = `event-card__category event-card__category--${event.category.replace(/\s+/g, '')}`;

  return (
    <article
      className="event-card"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View event: ${event.title}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/event/${event.id}`)}
      id={`event-card-${event.id}`}
    >

      <div className="event-card__media">
        <img
          src={event.thumbnail}
          alt={event.title}
          className={`event-card__thumbnail${showVideo ? ' hidden' : ''}`}
          loading="lazy"
        />

        <img
          src={event.previewVideo}
          alt="Event Preview"

          className={`event-card__video${showVideo ? ' visible' : ''}`}
          aria-hidden="true"
        />

        <div className="event-card__gradient" aria-hidden="true" />


        <span className={categoryClass}>{event.category}</span>
        <span className="event-card__live-chip" aria-label="Live event">
          <span className="event-card__live-dot" aria-hidden="true" />
          LIVE
        </span>
        <div className="event-card__views-overlay" aria-label={`${formatViews(event.views)} viewers`}>
          <Eye size={11} />
          {formatViews(event.views)}
        </div>
      </div>


      <div className="event-card__body">
        <h3 className="event-card__title">{event.title}</h3>
        <div className="event-card__meta">
          <span className="event-card__date">
            <Calendar size={11} />
            {event.date}
          </span>
          <span className="event-card__dot" aria-hidden="true" />
          <span className="event-card__time">
            <Clock size={11} />
            {event.time}
          </span>
        </div>


        <div className="event-card__actions">
          <button
            className={`event-card__action-btn${liked ? ' liked' : ''}`}
            onClick={handleLike}
            aria-label={liked ? 'Unlike event' : 'Like event'}
            aria-pressed={liked}
            id={`like-btn-${event.id}`}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            className="event-card__action-btn"
            onClick={handleShare}
            aria-label="Share event"
            id={`share-btn-${event.id}`}
          >
            <Share2 size={15} />
          </button>
          <button
            className="event-card__play-btn"
            onClick={handlePlay}
            aria-label="Watch event"
            id={`play-btn-${event.id}`}
          >
            <Play size={13} fill="currentColor" />
            Watch
          </button>
        </div>
      </div>
    </article>
  );
}
