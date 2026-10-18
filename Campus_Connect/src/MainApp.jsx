import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import NoticeBoard from './components/NoticeBoard';
import Feed from './components/Feed';

import SidebarRight from './components/SidebarRight';
import Complaints from './components/Complaints';
import Resources from './components/Resources';
import Communities from './components/Communities';
import * as Icons from './components/Icons';
import ProfileDashboard from './components/ProfileDashboard';
import {
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_POSTS,
  INITIAL_COMPLAINTS,
  INITIAL_RESOURCES
} from './mockData';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser: authUser, updateUserProfile } = useAuth();

  // Single source of truth: fallback if auth is still hydrating
  const currentUser = authUser || {
    id: 'user_arnav',
    uid: 'user_arnav',
    name: 'Arnav Dutta',
    displayName: 'Arnav Dutta',
    username: '@arnavdutta',
    email: 'arnav.dutta@gita.edu',
    avatar: 'https://ui-avatars.com/api/?name=Arnav+Dutta&background=7A1A22&color=fff&bold=true',
    branch: 'Computer Science & Engineering',
    rollNumber: 'GITA/CSE/2023/042',
    year: '3rd Year',
    details: '3rd Year, CSE',
    role: 'student',
    badge: 'Elite Contributor',
    badgeDesc: 'Active member of GITA Campus Connect',
    bio: 'Pre-final year student at GITA Autonomous College passionate about full-stack systems and cloud computing.',
    tagline: 'Student at GITA Autonomous College'
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState('overview');

  // Database States with fallbacks
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [events] = useState(INITIAL_EVENTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);

  // Real-time complaints sync from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
      const unsubComplaints = onSnapshot(q, (snapshot) => {
        const compList = [];
        snapshot.forEach(docSnap => {
          compList.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (compList.length > 0) {
          setComplaints(compList);
        }
      }, (err) => {
        console.warn('Complaints Firestore sync (using initial):', err);
      });
      return () => unsubComplaints();
    } catch(e) {
      console.warn('Could not setup complaints subscription:', e);
    }
  }, []);
  const [resources] = useState(INITIAL_RESOURCES);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      if (postsArray.length > 0) {
        setPosts(postsArray);
      }
    }, (error) => {
      console.error("Error fetching posts: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Filter States
  const [selectedTag, setSelectedTag] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  // Notification State
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Mid-Term schedule updated recently.', type: 'urgent', time: '1h ago' },
    { id: '2', text: 'Hackathon registrations close this Friday.', type: 'important', time: '4h ago' }
  ]);

  // Sync theme changes with document attribute and localStorage
  useEffect(() => {
    let activeTheme = theme;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      activeTheme = systemTheme;
    }
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Notification helper
  const addNotification = (text, type = 'general') => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      text,
      type,
      time: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Increase view count for notice
  const viewNotice = (id) => {
    setNotices((prevNotices) =>
      prevNotices.map((n) => {
        if (n.id === id) {
          const updatedNotice = { ...n, views: n.views + 1 };
          addNotification(`Viewed notice: "${n.title}"`, 'general');
          return updatedNotice;
        }
        return n;
      })
    );
  };

  // Render Page Content based on selected Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Notice Board Banner */}
            <NoticeBoard
              notices={notices}
              viewNotice={viewNotice}
              onViewAll={() => setActiveTab('notices')}
            />
            {/* Grid Layout containing feed and right columns */}
            <div className="main-grid-layout">
              <Feed
                posts={posts}
                setPosts={setPosts}
                currentUser={currentUser}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
              />
              <SidebarRight
                events={events}
                currentUser={currentUser}
                showCalendarModal={showCalendarModal}
                setShowCalendarModal={setShowCalendarModal}
              />
            </div>
          </>
        );

      case 'notices':
        return (
          <div className="tab-notices-view card animate-slide-in">
            <div className="tab-header justify-between flex">
              <div className="flex align-center gap-12">
                <Icons.Megaphone size={28} className="primary-icon" />
                <h2>Official Campus Notices</h2>
              </div>
              <span className="results-count">Showing {notices.length} notices</span>
            </div>

            <div className="notices-details-list">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="notice-item-expanded"
                  style={{ borderLeftColor: notice.color }}
                >
                  <div className="notice-item-header justify-between flex">
                    <span
                      className="notice-item-badge"
                      style={{ color: notice.color, backgroundColor: notice.color + '10' }}
                    >
                      {notice.type}
                    </span>
                    <span className="notice-item-time">{notice.time}</span>
                  </div>
                  <h3>{notice.title}</h3>
                  <p>{notice.content}</p>
                  {notice.attachment && (
                    <div className="notice-item-download flex justify-between align-center">
                      <span className="attachment-file">{notice.attachment}</span>
                      <button
                        onClick={() => {
                          viewNotice(notice.id);
                          try {
                            const docText = `GITA AUTONOMOUS COLLEGE, BHUBANESWAR\nOfficial Campus Notice Attachment\n\nTitle: ${notice.title}\nCategory: ${notice.type}\nPublished: ${notice.time}\n\n${notice.content}\n\nAuthorized by: Academic & Administrative Directorate, GITA Autonomous College`;
                            const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = notice.attachment;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch (err) {
                            console.warn('Download error:', err);
                          }
                        }}
                        className="btn-download-subtle"
                      >
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'feed':
        return (
          <div className="main-grid-layout feed-only-layout">
            <Feed
              posts={posts}
              setPosts={setPosts}
              currentUser={currentUser}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          </div>
        );

      case 'communities':
        return (
          <div className="full-tab-content-width">
            <Communities currentUser={currentUser} />
          </div>
        );

      case 'achievements':
        return (
          <div className="achievements-showcase-view animate-slide-in">
            <div className="achievements-jumbotron text-center">
              <Icons.Trophy size={48} className="gold-trophy" />
              <h2>Campus Achievements & Recognition</h2>
              <p>Celebrating academic excellence, placements, hackathon wins, and technical societies at GITA Autonomous College.</p>
            </div>

            <div className="achievements-split-grid">
              {/* Badges Grid */}
              <div className="badges-showcase">
                <h3>Campus Recognition Badges</h3>
                <div className="badges-flex-list">
                  <div className="badge-rowcard card">
                    <img src={currentUser.avatar} alt={currentUser.name} className="badge-user-avatar" />
                    <div className="badge-info-meta">
                      <span className="badge-user-name">{currentUser.name} (You)</span>
                      <h4 className="badge-title-txt">{currentUser.badge || 'Elite Contributor'}</h4>
                      <p className="badge-desc-txt">{currentUser.badgeDesc || 'Active contributor on GITA Campus Connect'}</p>
                    </div>
                    <Icons.Award size={28} className="badge-award-icon" />
                  </div>
                  <div className="badge-rowcard card">
                    <img src="https://ui-avatars.com/api/?name=Developers+Guild&background=1E293B&color=fff&bold=true" alt="GITA Developers Guild" className="badge-user-avatar" />
                    <div className="badge-info-meta">
                      <span className="badge-user-name">GITA Developers Guild</span>
                      <h4 className="badge-title-txt">Tech Society Champion</h4>
                      <p className="badge-desc-txt">Official technical society spearheading open source and hackathons at GITA.</p>
                    </div>
                    <Icons.Award size={28} className="badge-award-icon" />
                  </div>
                  <div className="badge-rowcard card">
                    <img src="https://ui-avatars.com/api/?name=Placement+Cell&background=7A1A22&color=fff&bold=true" alt="Training & Placement Cell" className="badge-user-avatar" />
                    <div className="badge-info-meta">
                      <span className="badge-user-name">GITA Training & Placement Cell</span>
                      <h4 className="badge-title-txt">Placement Directorate</h4>
                      <p className="badge-desc-txt">Connecting GITA students with top-tier product and consulting firms.</p>
                    </div>
                    <Icons.Award size={28} className="badge-award-icon" />
                  </div>
                </div>
              </div>

              {/* Student Spotlight Wall of Fame */}
              <div className="leaderboard-full card">
                <h3>Academic & Placement Spotlight</h3>
                <div className="leaderboard-ranks">
                  <div className="leaderboard-detail-row flex align-center gap-12" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', marginBottom: '8px' }}>
                    <Icons.Award size={24} className="accent-icon" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-heading)' }}>Smart India Hackathon (SIH) 2025 Finalists</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GITA Autonomous student teams ranked in the Top 5 nationally for AI-driven Smart City Solutions.</span>
                    </div>
                  </div>
                  <div className="leaderboard-detail-row flex align-center gap-12" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', marginBottom: '8px' }}>
                    <Icons.Briefcase size={24} className="primary-icon" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-heading)' }}>TCS Digital & HighRadius Premium Selections</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Over 140+ pre-final & final year engineering students secured premium developer roles in 2025-26.</span>
                    </div>
                  </div>
                  <div className="leaderboard-detail-row flex align-center gap-12" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', marginBottom: '8px' }}>
                    <Icons.GraduationCap size={24} className="primary-icon" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-heading)' }}>IEEE Student Branch Research Publications</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Autonomous student research papers on Cloud Resource Scheduling & IoT published in IEEE Access.</span>
                    </div>
                  </div>
                  <div className="leaderboard-detail-row flex align-center gap-12" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)' }}>
                    <Icons.Trophy size={24} className="accent-icon" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-heading)' }}>State-Level Autonomous Robotics Championship</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GITA Robotics Guild won Gold Medal in the Inter-College Autonomous Drone and Rover Obstacle Challenge.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complaints':
        return (
          <div className="complaints-tab-width">
            <Complaints complaints={complaints} setComplaints={setComplaints} currentUser={currentUser} />
          </div>
        );

      case 'resources':
        return (
          <div className="full-tab-content-width">
            <Resources
              resources={resources}
              searchQuery={searchQuery}
              resourceFilter={resourceFilter}
              setResourceFilter={setResourceFilter}
            />
          </div>
        );

      case 'profile':
        return (
          <div className="full-tab-content-width">
            <ProfileDashboard
              currentUser={currentUser}
              updateUserProfile={updateUserProfile}
              theme={theme}
              setTheme={setTheme}
              addNotification={addNotification}
              posts={posts}
              complaints={complaints}
              activeSection={activeProfileSection}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Universal Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResourceFilter={setResourceFilter}
        currentUser={currentUser}
        
        
        theme={theme}
        notifications={notifications}
        clearNotifications={clearNotifications}
        setActiveProfileSection={setActiveProfileSection}
      />

      {/* Main Body */}
      <main className={`main-content ${(activeTab === 'home' || activeTab === 'feed' || activeTab === 'complaints') ? '' : 'full-layout'}`}>
        {renderTabContent()}
      </main>

      {/* Footer (Matches layout footer in mock screen) */}
      <footer className="site-footer">
        <div className="footer-inner justify-between align-center flex">
          <div className="footer-brand font-serif">GITA Connect</div>
          <div className="footer-copy">
            Â© 2024 GITA Autonomous College. All rights reserved.
          </div>
          <div className="footer-links flex gap-16">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      {/* Embedded CSS style overrides for layout container */}
      <style>{`
        .main-grid-layout {
          display: grid;
          grid-template-columns: minmax(850px, 1fr) 320px;
          gap: 32px;
          align-items: flex-start;
          width: 100%;
        }
        
        .main-grid-layout.feed-only-layout {
          grid-template-columns: 1fr;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feed-column {
          grid-column: 1;
          width: 100%;
        }

        .right-sidebar {
          grid-column: 2;
          width: 320px;
        }
        
        .full-tab-content-width {
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
        }
        
        .complaints-tab-width {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        /* Footer Styles */
        .site-footer {
          border-top: 1px solid var(--border);
          background-color: var(--bg-card);
          padding: 24px 16px;
          margin-top: 48px;
          transition: background-color var(--transition-normal);
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          font-size: 13px;
          color: var(--text-muted);
        }
        .footer-brand {
          font-weight: 700;
          color: var(--primary);
        }
        .footer-links a {
          color: var(--text-muted);
        }
        .footer-links a:hover {
          color: var(--primary);
        }
        
        /* Notices Tab Layout */
        .tab-notices-view {
          padding: 24px;
        }
        .tab-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .tab-header h2 {
          font-size: 22px;
          font-weight: 700;
        }
        .results-count {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .notices-details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .notice-item-expanded {
          background-color: var(--bg-app);
          border: 1px solid var(--border);
          border-left: 4px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 20px;
        }
        .notice-item-header {
          margin-bottom: 12px;
        }
        .notice-item-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .notice-item-time {
          font-size: 12px;
          color: var(--text-muted);
        }
        .notice-item-expanded h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 10px;
        }
        .notice-item-expanded p {
          font-size: 14.5px;
          color: var(--text-main);
          line-height: 1.6;
        }
        .notice-item-download {
          margin-top: 16px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px 12px;
        }
        .attachment-file {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
        }
        .btn-download-subtle {
          color: var(--primary);
          font-size: 12px;
          font-weight: 600;
        }
        .btn-download-subtle:hover {
          text-decoration: underline;
        }
        
        /* Achievements Tab Layout */
        .achievements-jumbotron {
          background-color: var(--primary-light);
          padding: 40px 20px;
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
          border: 1px solid var(--border);
          text-align: center;
        }
        .gold-trophy {
          color: #FBBF24;
          margin-bottom: 12px;
        }
        .achievements-jumbotron h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .achievements-jumbotron p {
          font-size: 14.5px;
          color: var(--text-main);
          max-width: 600px;
          margin: 8px auto 0;
        }
        .achievements-split-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        .badges-showcase h3, .leaderboard-full h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 16px;
        }
        .badges-flex-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .badge-rowcard {
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }
        .badge-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--primary);
        }
        .badge-info-meta {
          flex: 1;
        }
        .badge-user-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          display: block;
        }
        .badge-title-txt {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
          margin-top: 2px;
        }
        .badge-desc-txt {
          font-size: 12px;
          color: var(--text-main);
          margin-top: 4px;
        }
        .badge-award-icon {
          color: #FBBF24;
        }
        
        .leaderboard-ranks {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .leaderboard-detail-row {
          padding: 10px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
          border: 1px solid var(--border);
        }
        .rank-place {
          font-size: 12px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--border);
          color: var(--text-main);
        }
        .rank-place.rank-1 { background-color: #FBBF24; color: #1E293B; }
        .rank-place.rank-2 { background-color: #94A3B8; color: #1E293B; }
        .rank-place.rank-3 { background-color: #D97706; color: white; }
        
        .rank-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .rank-name-detail {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
          display: block;
        }
        .rank-branch {
          font-size: 10.5px;
          color: var(--text-muted);
          display: block;
        }
        .rank-pts-badge {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
        }

        @media (max-width: 1200px) {
          .main-grid-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .feed-column {
            grid-column: 1;
          }
          .right-sidebar {
            grid-column: 1;
            width: 100% !important;
          }
          .achievements-split-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .main-grid-layout, .main-grid-layout.feed-only-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .feed-column, .right-sidebar {
            grid-column: auto !important;
            grid-row: auto !important;
            width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}




