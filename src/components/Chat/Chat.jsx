import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Eye } from 'lucide-react';
import { mockMessages } from '../../data';
import './Chat.css';

const MY_USERNAME = 'You';
const MY_COLOR = '#22d3ee';

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

let msgIdCounter = mockMessages.length + 1;

export default function Chat({ viewCount = '248K' }) {
  const [messages, setMessages] = useState(() =>
    mockMessages.map((m) => ({ ...m, timestamp: '—' }))
  );
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    const simulatedUsers = [
      { user: 'ZenithX', color: '#60a5fa' },
      { user: 'CryptoVibes', color: '#34d399' },
      { user: 'PurpleDragon', color: '#c084fc' },
      { user: 'FastFingers', color: '#fb923c' },
      { user: 'StarGazer99', color: '#f472b6' },
    ];
    const simulatedTexts = [
      'LET\'S GOOO!! 🔥',
      'This stream is 🔥🔥🔥',
      'Wow what a moment!!',
      'Incredible performance tonight',
      'PogChamp PogChamp',
      'This is the best one yet 🎉',
      'Who else is watching from Europe?',
      'Chat is moving so fast lol',
      'OMEGALUL the crowd is HYPED',
      '10/10 production value',
    ];

    const interval = setInterval(() => {
      const u = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
      const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
      setMessages((prev) => [
        ...prev,
        { id: msgIdCounter++, user: u.user, text, color: u.color, timestamp: getTimestamp() },
      ]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: msgIdCounter++,
        user: MY_USERNAME,
        text: trimmed,
        color: MY_COLOR,
        timestamp: getTimestamp(),
        own: true,
      },
    ]);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="chat" aria-label="Live Chat">

      <div className="chat__header">
        <div className="chat__header-title">
          <span className="chat__live-indicator" aria-hidden="true" />
          Live Chat
        </div>
        <div className="chat__viewer-count" aria-label={`${viewCount} viewers`}>
          <Eye size={12} />
          {viewCount}
        </div>
      </div>


      <div
        ref={messagesContainerRef}
        className="chat__messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat__message${msg.own ? ' chat__message--own' : ''}`}
          >
            <div className="chat__message-row">
              <span
                className="chat__username"
                style={{ color: msg.color }}
                aria-label={`Username: ${msg.user}`}
              >
                {msg.user}:
              </span>
              <span className="chat__message-text">{msg.text}</span>
              {msg.timestamp && (
                <span className="chat__timestamp" aria-hidden="true">
                  {msg.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="chat__input-area">
        <div className="chat__input-row">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat__input"
            placeholder="Send a message…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={300}
            aria-label="Chat message input"
          />
          <button
            className="chat__send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
            id="chat-send-btn"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="chat__hint">Press Enter to send</p>
      </div>
    </aside>
  );
}
