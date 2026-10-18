import React, { useState } from 'react';
import * as Icons from './Icons';
import { INITIAL_COMMUNITIES } from '../mockData';

export default function Communities({ currentUser }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null); // { type: 'dept' | 'club', data: Object }
  const [joinedStates, setJoinedStates] = useState(() => {
    // Preset some pre-joined ones for realistic presentation
    return {
      cse: true,
      csit: false,
      aiml: false,
      sports: true,
      music: false,
      dance: false,
      drama: false,
      language: false
    };
  });
  
  const [customDiscussions, setCustomDiscussions] = useState({}); // { [communityId]: Array of posts }
  const [newPostText, setNewPostText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('announcements');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'departments' | 'clubs'

  const handleToggleJoin = (id, e) => {
    if (e) e.stopPropagation();
    setJoinedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleBackToExplore = () => {
    setSelectedCommunity(null);
  };

  const handlePostSubmit = (e, communityId) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newDiscussionPost = {
      id: `custom_post_${Date.now()}`,
      author: currentUser?.name || 'Student',
      content: newPostText,
      replies: 0,
      date: 'Just now'
    };

    setCustomDiscussions(prev => ({
      ...prev,
      [communityId]: [newDiscussionPost, ...(prev[communityId] || [])]
    }));
    setNewPostText('');
  };

  // Combine initial discussion data and user generated discussions
  const getDiscussions = (community) => {
    const defaultPosts = community.discussions || [];
    const customPosts = customDiscussions[community.id] || [];
    return [...customPosts, ...defaultPosts];
  };

  if (selectedCommunity) {
    const community = selectedCommunity.data;
    const isJoined = joinedStates[community.id];
    const discussions = getDiscussions(community);

    return (
      <div className="community-detail-view card animate-slide-in">
        {/* Header Back Bar */}
        <div className="detail-header-bar flex align-center justify-between">
          <button onClick={handleBackToExplore} className="btn-back flex align-center gap-8">
            <Icons.ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
            <span>Back to Communities</span>
          </button>
          <span className="community-type-badge">
            {selectedCommunity.type === 'dept' ? 'DEPARTMENT' : 'CLUB & SOCIETY'}
          </span>
        </div>

        {/* Jumbotron Banner */}
        <div className="community-jumbotron flex align-center justify-between gap-16">
          <div className="jumbo-meta">
            <h2>{community.name}</h2>
            <p className="jumbo-desc">{community.description}</p>
            <div className="jumbo-stats flex gap-16">
              <span>👥 <strong>{community.members + (isJoined ? 1 : 0)}</strong> members</span>
              <span>⚡ Active Community</span>
            </div>
          </div>
          <button 
            onClick={(e) => handleToggleJoin(community.id, e)} 
            className={`btn-join-jumbo ${isJoined ? 'joined' : ''}`}
          >
            {isJoined ? 'Joined' : 'Join Community'}
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="community-sub-tabs flex gap-8">
          <button 
            className={`sub-tab-btn ${activeSubTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('announcements')}
          >
            📢 Announcements
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('discussions')}
          >
            💬 Discussions
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('events')}
          >
            📅 Events
          </button>
          <button 
            className={`sub-tab-btn ${activeSubTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('achievements')}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Tabs Content */}
        <div className="sub-tab-content">
          {activeSubTab === 'announcements' && (
            <div className="announcements-tab animate-slide-in">
              <h3>Pinned Announcements</h3>
              {(!community.announcements || community.announcements.length === 0) ? (
                <div className="empty-state">
                  <Icons.Megaphone size={36} className="muted-icon" />
                  <p>No recent official announcements from this community.</p>
                </div>
              ) : (
                <div className="announcements-list">
                  {community.announcements.map((ann) => (
                    <div key={ann.id} className="announcement-item card">
                      <div className="announcement-header justify-between flex">
                        <span className="ann-author">📢 {ann.author}</span>
                        <span className="ann-date">{ann.date}</span>
                      </div>
                      <h4>{ann.title}</h4>
                      <p>{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'discussions' && (
            <div className="discussions-tab animate-slide-in">
              <h3>Community Discussions</h3>

              {isJoined ? (
                <form onSubmit={(e) => handlePostSubmit(e, community.id)} className="discussion-post-form card">
                  <textarea
                    placeholder={`Ask a question or post an update in ${community.code || community.name}...`}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    rows={3}
                    required
                    className="discussion-textarea"
                  />
                  <div className="form-footer flex justify-end">
                    <button type="submit" className="post-submit-btn">
                      Post to Community
                    </button>
                  </div>
                </form>
              ) : (
                <div className="join-alert-box flex align-center gap-12 card">
                  <Icons.AlertTriangle size={20} className="accent-icon" />
                  <p>You must be a member of this community to participate in discussions. Click <strong>Join Community</strong> above to participate!</p>
                </div>
              )}

              {discussions.length === 0 ? (
                <div className="empty-state">
                  <Icons.MessageSquare size={36} className="muted-icon" />
                  <p>No discussions yet. Be the first to ask a question!</p>
                </div>
              ) : (
                <div className="discussions-list">
                  {discussions.map((disc) => (
                    <div key={disc.id} className="discussion-item-card card">
                      <div className="disc-header justify-between flex">
                        <span className="disc-author">👤 {disc.author}</span>
                        <span className="disc-date">{disc.date}</span>
                      </div>
                      <p className="disc-content">{disc.content}</p>
                      <div className="disc-footer flex gap-12 align-center">
                        <button className="disc-reply-btn flex align-center gap-6">
                          <Icons.MessageSquare size={14} />
                          <span>{disc.replies} Replies</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'events' && (
            <div className="events-tab animate-slide-in">
              <h3>Upcoming Activities</h3>
              {(!community.events || community.events.length === 0) ? (
                <div className="empty-state">
                  <Icons.Calendar size={36} className="muted-icon" />
                  <p>No events scheduled for this community at the moment.</p>
                </div>
              ) : (
                <div className="events-list">
                  {community.events.map((evt) => (
                    <div key={evt.id} className="community-event-card card flex gap-16 align-center">
                      <div className="event-icon-badge">
                        <Icons.Calendar size={24} className="primary-icon" />
                      </div>
                      <div className="event-info flex-1">
                        <h4>{evt.title}</h4>
                        <p className="event-schedule">
                          📅 {evt.date} • 🕒 {evt.time} • 📍 {evt.location}
                        </p>
                        {evt.desc && <p className="event-desc-text">{evt.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'achievements' && (
            <div className="achievements-tab animate-slide-in">
              <h3>Community Spotlight & Achievements</h3>
              {(!community.achievements || community.achievements.length === 0) ? (
                <div className="empty-state">
                  <Icons.Trophy size={36} className="muted-icon" />
                  <p>No achievements documented for this community yet.</p>
                </div>
              ) : (
                <div className="achievements-list">
                  {community.achievements.map((ach) => (
                    <div key={ach.id} className="achievement-item card flex gap-16 align-center">
                      <div className="achievement-icon-badge">
                        <Icons.Award size={24} className="accent-icon" />
                      </div>
                      <div>
                        <h4>{ach.title}</h4>
                        <p>{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`
          .community-detail-view {
            padding: 24px;
          }
          .detail-header-bar {
            border-bottom: 1px solid var(--border);
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .btn-back {
            color: var(--text-main);
            font-size: 13.5px;
            font-weight: 600;
          }
          .btn-back:hover {
            color: var(--primary);
          }
          .community-type-badge {
            font-size: 10px;
            font-weight: 700;
            color: var(--primary);
            background-color: var(--primary-light);
            padding: 4px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
          }
          .community-jumbotron {
            background-color: var(--bg-app);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 24px;
            margin-bottom: 24px;
          }
          .jumbo-meta h2 {
            font-size: 22px;
            font-weight: 700;
            color: var(--text-heading);
            margin-bottom: 8px;
          }
          .jumbo-desc {
            font-size: 14.5px;
            color: var(--text-main);
            margin-bottom: 12px;
            max-width: 650px;
            line-height: 1.5;
          }
          .jumbo-stats {
            font-size: 13px;
            color: var(--text-muted);
          }
          .btn-join-jumbo {
            background-color: var(--primary);
            color: white;
            padding: 10px 20px;
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
          }
          .btn-join-jumbo:hover {
            background-color: var(--primary-hover);
          }
          .btn-join-jumbo.joined {
            background-color: transparent;
            color: var(--text-main);
            border: 1.5px solid var(--border);
          }
          .btn-join-jumbo.joined:hover {
            background-color: var(--urgent-bg);
            color: var(--urgent);
            border-color: var(--urgent);
          }
          
          .community-sub-tabs {
            border-bottom: 1px solid var(--border);
            margin-bottom: 20px;
            overflow-x: auto;
          }
          .sub-tab-btn {
            font-size: 13.5px;
            font-weight: 600;
            padding: 8px 16px;
            border-bottom: 2px solid transparent;
            color: var(--text-main);
            white-space: nowrap;
          }
          .sub-tab-btn:hover {
            color: var(--primary);
          }
          .sub-tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
          }
          
          .sub-tab-content h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            color: var(--text-heading);
          }
          .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--text-muted);
          }
          .muted-icon {
            color: var(--text-muted);
            margin-bottom: 8px;
          }
          
          /* Announcements Sub-tab */
          .announcements-list, .discussions-list, .events-list, .achievements-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .announcement-item {
            padding: 16px;
            background-color: var(--bg-card);
            border-left: 4px solid var(--primary);
          }
          .announcement-item h4 {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-heading);
            margin: 8px 0;
          }
          .announcement-item p {
            font-size: 13.5px;
            color: var(--text-main);
            line-height: 1.5;
          }
          .ann-author {
            font-weight: 600;
            font-size: 11.5px;
            color: var(--primary);
          }
          .ann-date {
            font-size: 11.5px;
            color: var(--text-muted);
          }
          
          /* Discussions Sub-tab */
          .discussion-post-form {
            padding: 16px;
            background-color: var(--bg-app);
          }
          .discussion-textarea {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 10px;
            background-color: var(--bg-card);
            color: var(--text-heading);
            resize: none;
            font-size: 14px;
          }
          .discussion-textarea:focus {
            border-color: var(--primary);
          }
          .post-submit-btn {
            background-color: var(--primary);
            color: white;
            font-size: 13px;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 4px;
            margin-top: 8px;
          }
          .post-submit-btn:hover {
            background-color: var(--primary-hover);
          }
          
          .join-alert-box {
            background-color: var(--accent-light);
            border: 1px solid var(--border);
            padding: 16px;
            color: var(--text-heading);
          }
          
          .discussion-item-card {
            padding: 16px;
          }
          .disc-author {
            font-weight: 600;
            font-size: 12px;
            color: var(--text-heading);
          }
          .disc-date {
            font-size: 11.5px;
            color: var(--text-muted);
          }
          .disc-content {
            font-size: 14px;
            color: var(--text-main);
            margin: 10px 0;
            line-height: 1.5;
          }
          .disc-reply-btn {
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 500;
          }
          .disc-reply-btn:hover {
            color: var(--primary);
          }
          
          /* Events Sub-tab */
          .community-event-card {
            padding: 16px;
          }
          .event-icon-badge {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            background-color: var(--primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .community-event-card h4 {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-heading);
          }
          .event-schedule {
            font-size: 12px;
            color: var(--primary);
            font-weight: 600;
            margin: 4px 0;
          }
          .event-desc-text {
            font-size: 13px;
            color: var(--text-main);
            margin-top: 6px;
            line-height: 1.45;
          }
          
          /* Achievements Sub-tab */
          .achievement-item {
            padding: 16px;
          }
          .achievement-icon-badge {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            background-color: var(--accent-light);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent);
          }
          .achievement-item h4 {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-heading);
            margin-bottom: 4px;
          }
          .achievement-item p {
            font-size: 13px;
            color: var(--text-main);
            line-height: 1.4;
          }
        `}</style>
      </div>
    );
  }

  // Explore Communities Main View
  return (
    <div className="explore-communities animate-slide-in">
      <div className="explore-jumbotron text-center card">
        <Icons.Users size={48} className="primary-icon jumbo-users-icon" />
        <h2>Explore Campus Communities</h2>
        <p>Connect with your academic department, participate in cultural clubs, and collaborate on student-led forums.</p>
        
        {/* Explore Sub Filter Menu */}
        <div className="filter-menu flex justify-center gap-8">
          <button 
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Communities
          </button>
          <button 
            className={`filter-btn ${filterType === 'departments' ? 'active' : ''}`}
            onClick={() => setFilterType('departments')}
          >
            🏫 Departments
          </button>
          <button 
            className={`filter-btn ${filterType === 'clubs' ? 'active' : ''}`}
            onClick={() => setFilterType('clubs')}
          >
            🎭 Clubs & Societies
          </button>
        </div>
      </div>

      {/* SECTION 1: DEPARTMENTS */}
      {(filterType === 'all' || filterType === 'departments') && (
        <section className="communities-section">
          <div className="section-title-wrap flex align-center gap-8">
            <Icons.GraduationCap size={22} className="primary-icon" />
            <h3>Academic Departments</h3>
          </div>
          
          <div className="communities-cards-grid">
            {INITIAL_COMMUNITIES.departments.map((dept) => {
              const isJoined = joinedStates[dept.id];
              return (
                <div key={dept.id} className="comm-card card" onClick={() => handleViewCommunity('dept', dept)}>
                  <div className="comm-card-header justify-between flex">
                    <span className="comm-code-badge">{dept.code}</span>
                    <span className="comm-activity-indicator">🟢 {dept.recentActivity}</span>
                  </div>
                  <h4 className="comm-title">{dept.name}</h4>
                  <p className="comm-members">👥 <strong>{dept.members + (isJoined ? 1 : 0)}</strong> members</p>
                  
                  <div className="comm-card-footer flex justify-between gap-12">
                    <button 
                      onClick={(e) => handleToggleJoin(dept.id, e)} 
                      className={`btn-join-action ${isJoined ? 'joined' : ''}`}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </button>
                    <button className="btn-view-action">
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: CLUBS & SOCIETIES */}
      {(filterType === 'all' || filterType === 'clubs') && (
        <section className="communities-section" style={{ marginTop: '32px' }}>
          <div className="section-title-wrap flex align-center gap-8">
            <Icons.Trophy size={22} className="accent-icon" />
            <h3>Clubs & Societies</h3>
          </div>
          
          <div className="communities-cards-grid">
            {INITIAL_COMMUNITIES.clubs.map((club) => {
              const isJoined = joinedStates[club.id];
              return (
                <div key={club.id} className={`comm-card card ${club.isUpcoming ? 'upcoming-card' : ''}`} onClick={!club.isUpcoming ? () => handleViewCommunity('club', club) : undefined}>
                  <div className="comm-card-header justify-between flex">
                    <span className="comm-code-badge club-badge">{club.isUpcoming ? 'LAUNCHING' : 'CLUB'}</span>
                    <span className="comm-activity-indicator">
                      {club.isUpcoming ? '⏳ Coming Soon' : `🟢 ${club.recentActivity}`}
                    </span>
                  </div>
                  <h4 className="comm-title">{club.name}</h4>
                  <p className="comm-desc-snippet">{club.description}</p>
                  <p className="comm-members">👥 <strong>{club.members + (isJoined ? 1 : 0)}</strong> members</p>
                  
                  <div className="comm-card-footer flex justify-between gap-12">
                    {!club.isUpcoming ? (
                      <>
                        <button 
                          onClick={(e) => handleToggleJoin(club.id, e)} 
                          className={`btn-join-action ${isJoined ? 'joined' : ''}`}
                        >
                          {isJoined ? 'Joined' : 'Join'}
                        </button>
                        <button className="btn-view-action">
                          View
                        </button>
                      </>
                    ) : (
                      <span className="upcoming-tag">Optional Future Club</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .explore-communities {
          width: 100%;
        }
        .explore-jumbotron {
          background-color: var(--primary-light);
          padding: 40px 20px;
          border-radius: var(--radius-lg);
          margin-bottom: 32px;
          text-align: center;
        }
        .jumbo-users-icon {
          margin-bottom: 12px;
        }
        .explore-jumbotron h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .explore-jumbotron p {
          font-size: 14.5px;
          color: var(--text-main);
          max-width: 600px;
          margin: 8px auto 20px;
        }
        
        .filter-menu {
          margin-top: 16px;
        }
        .filter-btn {
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 30px;
          color: var(--text-main);
          border: 1px solid var(--border);
          background-color: var(--bg-card);
        }
        .filter-btn:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .filter-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .communities-section {
          margin-bottom: 24px;
        }
        .section-title-wrap {
          margin-bottom: 16px;
        }
        .section-title-wrap h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .communities-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        .comm-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          min-height: 190px;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .comm-card:not(.upcoming-card):hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .upcoming-card {
          cursor: default;
          opacity: 0.75;
          border-style: dashed;
        }
        
        .comm-card-header {
          margin-bottom: 12px;
          align-items: center;
        }
        .comm-code-badge {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .comm-code-badge.club-badge {
          color: var(--accent);
          background-color: var(--accent-light);
        }
        .comm-activity-indicator {
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .comm-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 6px;
          line-height: 1.35;
          flex-grow: 0;
        }
        
        .comm-desc-snippet {
          font-size: 12px;
          color: var(--text-main);
          line-height: 1.45;
          margin-bottom: 10px;
          flex-grow: 1;
        }
        
        .comm-members {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 14px;
        }
        
        .comm-card-footer {
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding-top: 12px;
          align-items: center;
        }
        
        .btn-join-action {
          flex: 1;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 4px;
          text-align: center;
          background-color: var(--primary-light);
          color: var(--primary);
          border: 1px solid transparent;
        }
        .btn-join-action:hover {
          background-color: var(--primary);
          color: white;
        }
        .btn-join-action.joined {
          background-color: transparent;
          color: var(--text-main);
          border-color: var(--border);
        }
        .btn-join-action.joined:hover {
          background-color: var(--urgent-bg);
          color: var(--urgent);
          border-color: var(--urgent);
        }
        
        .btn-view-action {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-main);
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid var(--border);
          text-align: center;
        }
        .btn-view-action:hover {
          background-color: var(--bg-app);
          color: var(--text-heading);
        }
        
        .upcoming-tag {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        
        @media (max-width: 1024px) {
          .communities-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .communities-cards-grid {
            grid-template-columns: 1fr;
          }
          .filter-menu {
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
