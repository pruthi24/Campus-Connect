import React from 'react';
import * as Icons from './Icons';

export default function CampusInsights({
  selectedTag,
  setSelectedTag,
  setActiveTab,
  setSearchQuery,
  setResourceFilter
}) {
  const trendingTags = ['SmartIndia', 'FestVibes', 'ExamPrep', 'PlacementDrive'];

  const quickLinks = [
    {
      id: 'library',
      name: 'Library Portal',
      icon: <Icons.BookOpen className="link-icon" size={18} />,
      action: () => {
        setActiveTab('resources');
        setResourceFilter('Academic Link');
      }
    },
    {
      id: 'attendance',
      name: 'My Attendance',
      icon: <Icons.CheckSquare className="link-icon" size={18} />,
      action: () => {
        setActiveTab('resources');
        setResourceFilter('attendance');
      }
    },
    {
      id: 'syllabus',
      name: 'Syllabus Hub',
      icon: <Icons.GraduationCap className="link-icon" size={18} />,
      action: () => {
        setActiveTab('resources');
        setResourceFilter('Academic File');
      }
    },
    {
      id: 'payment',
      name: 'Fee Payment',
      icon: <Icons.CreditCard className="link-icon" size={18} />,
      action: () => {
        setActiveTab('resources');
        setResourceFilter('Student Service');
      }
    }
  ];

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      // Toggle off
      setSelectedTag('');
      setSearchQuery('');
    } else {
      setSelectedTag(tag);
      setActiveTab('feed'); // ensure feed tab is active when filtering by tag
      setSearchQuery(`#${tag}`); // Filter the feed
    }
  };

  return (
    <aside className="left-sidebar">
      <div className="insights-card card">
        <div className="insights-header flex align-center gap-12">
          <div className="compass-icon-wrapper flex align-center justify-between">
            <Icons.Compass className="primary-icon" size={20} />
          </div>
          <div>
            <h3 className="insights-title">Campus Insights</h3>
            <span className="insights-subtitle">Latest activity</span>
          </div>
        </div>

        <div className="insights-divider" />

        <div className="tags-section">
          <span className="section-label">TRENDING TAGS</span>
          <div className="tags-container">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="insights-divider" />

        <div className="links-section">
          <span className="section-label">QUICK LINKS</span>
          <div className="quick-links-list">
            {quickLinks.map((link) => (
              <button key={link.id} onClick={link.action} className="quick-link-row">
                <span className="link-icon-container">{link.icon}</span>
                <span className="link-name">{link.name}</span>
                <Icons.ArrowRight size={14} className="arrow-right-subtle" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .left-sidebar {
          grid-column: 1;
        }
        .insights-card {
          position: sticky;
          top: 88px;
        }
        .compass-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .insights-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          line-height: 1.2;
        }
        .insights-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }
        .insights-divider {
          height: 1px;
          background-color: var(--border);
          margin: 16px 0;
        }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.8px;
          display: block;
          margin-bottom: 12px;
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-pill {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .tag-pill:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .tag-pill.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        
        .quick-links-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .quick-link-row {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          text-align: left;
          color: var(--text-main);
        }
        .quick-link-row:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .link-icon-container {
          margin-right: 12px;
          display: flex;
          align-items: center;
          color: var(--text-muted);
        }
        .quick-link-row:hover .link-icon-container {
          color: var(--primary);
        }
        .link-name {
          font-size: 13.5px;
          font-weight: 500;
          flex: 1;
        }
        .arrow-right-subtle {
          color: var(--text-muted);
          opacity: 0;
          transform: translateX(-5px);
          transition: all var(--transition-fast);
        }
        .quick-link-row:hover .arrow-right-subtle {
          opacity: 1;
          transform: translateX(0);
          color: var(--primary);
        }
      `}</style>
    </aside>
  );
}
