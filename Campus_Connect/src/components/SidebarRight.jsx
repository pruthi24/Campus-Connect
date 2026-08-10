import React, { useState, useEffect } from 'react';
import * as Icons from './Icons';
import { MOCK_USERS } from '../mockData';

export default function SidebarRight({ events, currentUser, showCalendarModal, setShowCalendarModal }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [animateBars, setAnimateBars] = useState(false);

  // Trigger progress bar animations on load
  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock Calendar Dates for the modal
  const renderCalendarDays = () => {
    const days = [];
    // Render 31 days for October
    for (let i = 1; i <= 31; i++) {
      const hasEvent = i === 24 || i === 27;
      days.push(
        <div
          key={i}
          className={`cal-day-cell ${hasEvent ? 'has-event' : ''}`}
          title={i === 24 ? 'Annual Sports Meet' : i === 27 ? 'Tech Talk: AI Trends' : ''}
        >
          <span className="cal-day-num">{i}</span>
          {hasEvent && <span className="cal-day-dot" />}
        </div>
      );
    }
    return days;
  };


  return (
    <aside className="right-sidebar">
      {/* Upcoming Events Card */}
      <div className="events-card card animate-slide-in">
        <div className="card-header-flex flex align-center gap-12">
          <Icons.Calendar className="primary-icon" size={20} />
          <h3>Upcoming Events</h3>
        </div>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-row flex gap-12 align-center">
              <div className="event-date-badge">
                <span className="event-month">{event.month}</span>
                <span className="event-day">{event.day}</span>
              </div>
              <div className="event-info flex-1">
                <h4 className="event-title">{event.title}</h4>
                <p className="event-meta">
                  {event.location} • {event.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(event)}
                className="view-details-btn"
                title="View detailed event description"
              >
                Details
              </button>
            </div>
          ))}
        </div>
        <button className="view-calendar-btn" onClick={() => setShowCalendarModal(true)}>
          View Calendar
        </button>
      </div>

      {/* Recent Achievement Card (Burgundy styling matches screenshot) */}
      <div className="achievement-badge-card card-burgundy animate-slide-in">
        <div className="burgundy-card-header justify-between flex">
          <span className="badge-card-title flex align-center gap-8">
            <Icons.Trophy size={16} />
            <span>Recent Achievement</span>
          </span>
        </div>
        <div className="burgundy-card-body flex align-center gap-16">
          <div className="badge-trophy-gold">
            <Icons.Trophy size={32} className="gold-trophy-icon" />
          </div>
          <div>
            <span className="badge-subtitle">NEW BADGE!</span>
            <h4 className="badge-name">{currentUser.badge || 'Contributor'}</h4>
            <p className="badge-description">
              {currentUser.badgeDesc || 'Earned by contributing to the campus portal.'}
            </p>
          </div>
        </div>
      </div>


      {/* Calendar Overlay Modal */}
      {showCalendarModal && (
        <div className="modal-backdrop" onClick={() => setShowCalendarModal(false)}>
          <div className="modal-content calendar-modal animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCalendarModal(false)}>
              <Icons.Close size={20} />
            </button>
            <div className="modal-header-calendar flex align-center gap-12">
              <Icons.Calendar size={22} className="primary-icon" />
              <h2>Academic Calendar</h2>
            </div>
            <div className="calendar-month-picker justify-between align-center flex">
              <span className="current-month-label">October 2026</span>
            </div>
            
            {/* Calendar Grid */}
            <div className="calendar-grid-header">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="calendar-days-grid">{renderCalendarDays()}</div>

            <div className="calendar-legend-box flex gap-16">
              <div className="legend-item flex align-center gap-8">
                <span className="legend-dot event-dot-color" />
                <span>Campus Event</span>
              </div>
              <div className="legend-item flex align-center gap-8">
                <span className="legend-dot holiday-dot-color" />
                <span>National Holiday</span>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setShowCalendarModal(false)}>
              Close Calendar
            </button>
          </div>
        </div>
      )}

      {/* Event Details Overlay Modal */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content event-details-modal animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              <Icons.Close size={20} />
            </button>
            <div className="modal-header-event flex align-center gap-12" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <Icons.Calendar size={22} className="primary-icon" />
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Event Details</h2>
            </div>
            
            <div className="event-detail-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex gap-16 align-center">
                <div className="event-date-badge" style={{ width: '56px', height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="event-month" style={{ fontSize: '10px' }}>{selectedEvent.month}</span>
                  <span className="event-day" style={{ fontSize: '18px' }}>{selectedEvent.day}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)', margin: 0 }}>{selectedEvent.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                    {selectedEvent.location} • {selectedEvent.time}
                  </p>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px', margin: 0 }}>About the Event</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0, marginTop: '4px' }}>{selectedEvent.description}</p>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', marginTop: '20px', padding: '10px', fontWeight: '600' }} onClick={() => setSelectedEvent(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}

      <style>{`
        .right-sidebar {
          grid-column: 2;
          width: 320px;
        }
        .card-header-flex {
          margin-bottom: 16px;
        }
        .card-header-flex h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .accent-icon {
          color: var(--accent);
        }
        
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }
        .event-row {
          align-items: center;
        }
        .event-date-badge {
          background-color: var(--primary-light);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          width: 48px;
          height: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .event-month {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.5px;
        }
        .event-day {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
          line-height: 1.1;
        }
        .event-info {
          display: flex;
          flex-direction: column;
        }
        .event-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-heading);
          line-height: 1.3;
        }
        .event-meta {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .view-details-btn {
          font-size: 10px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--border);
          color: var(--primary);
          background-color: var(--primary-light);
          white-space: nowrap;
        }
        .view-details-btn:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .view-calendar-btn {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-main);
          font-size: 13px;
          font-weight: 600;
          padding: 8px;
          text-align: center;
        }
        .view-calendar-btn:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
          border-color: var(--border-focus);
        }
        
        /* Leaderboard Styles */
        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .leaderboard-row {
          align-items: center;
        }
        .rank-number {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          width: 16px;
          text-align: center;
        }
        .leaderboard-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border);
        }
        .leader-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .leader-details {
          font-size: 13px;
        }
        .leader-name {
          font-weight: 600;
          color: var(--text-heading);
        }
        .leader-pts {
          font-size: 11px;
          color: var(--text-muted);
        }
        .progress-track {
          height: 4px;
          background-color: var(--bg-app);
          border-radius: 2px;
          width: 100%;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Burgundy Recent Achievement Card */
        .achievement-badge-card {
          background-color: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-md);
          margin-bottom: 20px;
          border: 1px solid var(--primary-hover);
        }
        .card-burgundy {
          background-color: #631218; /* Solid deep burgundy matches screenshot */
          color: white;
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 20px;
        }
        .burgundy-card-header {
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 8px;
        }
        .badge-card-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
        }
        .burgundy-card-body {
          align-items: center;
        }
        .badge-trophy-gold {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-sm);
          background-color: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gold-trophy-icon {
          color: #FBBF24; /* Amber Gold */
        }
        .badge-subtitle {
          font-size: 10px;
          font-weight: 700;
          color: #FBBF24;
          letter-spacing: 0.8px;
          display: block;
        }
        .badge-name {
          font-size: 15px;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-top: 2px;
        }
        .badge-description {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.35;
          margin-top: 4px;
        }
        
        /* Calendar Modal Details */
        .calendar-modal {
          max-width: 420px;
        }
        .modal-header-calendar {
          margin-bottom: 16px;
        }
        .calendar-month-picker {
          margin-bottom: 12px;
          padding: 8px 12px;
          background-color: var(--bg-app);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .current-month-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .calendar-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .calendar-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .cal-day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid var(--border);
          position: relative;
          cursor: pointer;
        }
        .cal-day-cell:hover {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }
        .cal-day-num {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-heading);
        }
        .cal-day-cell.has-event {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }
        .cal-day-cell.has-event .cal-day-num {
          color: var(--primary);
          font-weight: 700;
        }
        .cal-day-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--primary);
          position: absolute;
          bottom: 4px;
        }
        .calendar-legend-box {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .legend-item {
          font-size: 11px;
          color: var(--text-main);
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .event-dot-color { background-color: var(--primary); }
        .holiday-dot-color { background-color: var(--accent); }


      `}</style>
    </aside>
  );
}
